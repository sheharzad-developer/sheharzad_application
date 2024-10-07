"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetQuestionsParams,
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// Function to fetch questions
export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
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
