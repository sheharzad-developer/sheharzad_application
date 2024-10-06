"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import {
  GetQuestionsParams,
  CreateQuestionParams,
  EditQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// Function to fetch questions
export async function getQuestions(params: GetQuestionsParams) {
  await connectToDatabase();

  try {
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
        select: "name username", // Make sure you select the fields you want
      })
      .sort({ createdAt: -1 });

    // Serialize questions to ensure only plain objects are returned
    const serializedQuestions = questions.map((question) => ({
      _id: question._id.toString(), // Convert ObjectId to string
      title: question.title,
      content: question.content,
      tags: question.tags.map((tag) => tag.toString()), // Ensure tags are strings
      author: {
        _id: question.author._id.toString(), // Convert author's ObjectId to string
        name: question.author.name, // Add the author's name
        username: question.author.username, // Add the author's username if needed
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
export async function createQuestion(params: CreateQuestionParams) {
  await connectToDatabase();

  try {
    const { title, content, tags, author, path } = params;

    // Create a new question
    const question = await Question.create({
      title,
      content,
      author,
      // tags,
      // author should be a string (e.g., MongoDB ObjectId as string)
      // path,
    });

    const tagDocuments = [];

    // Process tags
    for (const tag of tags) {
      if (typeof tag !== "string") {
        throw new Error("Each tag should be a string");
      }

      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      // if (existingTag && existingTag._id) {
      tagDocuments.push(existingTag._id); // Convert to string
      // }
    }

    // Update the question with the tag references
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Revalidate the path for any cached data
    revalidatePath(path);
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Could not create question"); // More descriptive error
  }
}
export async function editQuestion(params: EditQuestionParams) {}
