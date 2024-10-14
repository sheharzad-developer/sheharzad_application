"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import {
  GetQuestionsParams,
  CreateQuestionParams,
  GetQuestionByIdParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// Function to fetch questions
export async function getQuestions(params) {
  await connectToDatabase();

  try {
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    // Serialize questions to ensure only plain objects are returned
    const serializedQuestions = questions.map((question) => ({
      _id: question._id.toString(), // Convert ObjectId to string
      title: question.title,
      content: question.content,
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name,
      })), // Serialize tag IDs and names
      author: {
        _id: question.author._id.toString(), // Serialize author ID
        name: question.author.name, // Serialize author name
        picture: question.author.picture, // Include author picture if needed
      },
      upvotes: question.upvotes,
      views: question.views,
      answers: question.answers,
      createdAt: question.createdAt.toISOString(), // Ensure createdAt is serialized
    }));

    return { questions: serializedQuestions };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Could not fetch questions"); // More descriptive error
  }
}

// Function to create a question
export async function createQuestion(params) {
  await connectToDatabase();

  try {
    const { title, content, tags, author, path } = params;

    // Create a new question
    const question = await Question.create({
      title,
      content,
      author, // author should be a string (e.g., MongoDB ObjectId as string)
    });

    const tagDocuments = [];

    // Process tags
    for (const tag of tags) {
      if (typeof tag !== "string") {
        throw new Error("Each tag should be a string");
      }

      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $addToSet: { questions: question._id } }, // Use $addToSet to prevent duplicates
        { upsert: true, new: true }
      );

      // Collect the tag IDs to update the question
      tagDocuments.push(existingTag._id);
    }

    // Update the question with the tag references
    await Question.findByIdAndUpdate(question._id, {
      $set: { tags: tagDocuments }, // Set the tags for the question
    });

    // Revalidate the path for any cached data
    if (path) {
      revalidatePath(path);
    }
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Could not create question"); // More descriptive error
  }
}

export async function getQuestionById(params) {
  await connectToDatabase(); // Make sure to await this

  try {
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    if (!question) {
      throw new Error("Question not found");
    }

    // Serialize the question to plain objects
    const serializedQuestion = {
      _id: question._id.toString(),
      title: question.title,
      content: question.content,
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name,
      })),
      author: {
        _id: question.author._id.toString(),
        name: question.author.name,
        picture: question.author.picture,
      },
      createdAt: question.createdAt.toISOString(),
      upvotes: question.upvotes,
      views: question.views,
      answers: question.answers,
    };

    return serializedQuestion;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw new Error("Could not fetch question by ID");
  }
}
