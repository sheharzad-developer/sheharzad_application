// "use server";

// import Question from "@/database/question.model";
// import Tag from "@/database/tag.model";
// import { connectToDatabase } from "./mongoose";
// import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
// import User from "@/database/user.model";
// import { revalidatePath } from "next/cache";

// export async function getQuestions(params: GetQuestionsParams) {
//   try {
//     connectToDatabase();

//     const questions = await Question.find({})
//       .populate({ path: "tags", model: Tag })
//       .populate({ path: "author", model: User })
//       .sort({ createdAt: -1 });

//     return { questions };
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// export async function createQuestion(params: CreateQuestionParams) {
//   try {
//     connectToDatabase();

//     const { title, content, tags, author, path } = params;

//     // Create the question
//     const question = await Question.create({
//       title,
//       content,
//       tags,
//       author, // author should be a string (e.g., MongoDB ObjectId as string)
//       path,
//     });

//     const tagDocuments = [];

//     // Create the tags or get them if they already exist
//     for (const tag of tags) {
//       const existingTag = await Tag.findOneAndUpdate(
//         { name: { $regex: new RegExp(`^${tag}$`, "i") } },
//         { $setOnInsert: { name: tag }, $push: { question: question._id } },
//         { upsert: true, new: true }
//       );

//       tagDocuments.push(existingTag._id);
//     }

//     await Question.findByIdAndUpdate(question._id, {
//       $push: { tags: { $each: tagDocuments } },
//     });

//     // Create an interaction record for the user's ask_question action

//     // Increment author's reputation by +5 for creating a question

//     revalidatePath(path);
//   } catch (error) {}
// }
"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import { GetQuestionsParams, CreateQuestionParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// Function to fetch questions
export async function getQuestions(params: GetQuestionsParams) {
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
      tags: question.tags.map((tag) => tag.toString()), // Ensure tags are strings
      author: question.author.toString(), // Convert author ID to string
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
      // tags,
      author, // author should be a string (e.g., MongoDB ObjectId as string)
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
