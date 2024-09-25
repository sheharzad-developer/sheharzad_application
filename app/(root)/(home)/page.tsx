"use client";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import Filter from "@/components/shared/Filter";
import Link from "next/link";
import HomeFilters from "@/components/home/HomeFilters";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "/path/to/johndoe.jpg",
    },
    upvotes: 1500000,
    views: 500000,
    answers: [
      { text: "Use the `cascade` option in your relationship definition." },
      { text: "Ensure foreign keys are set correctly." },
    ],
    createdAt: new Date("2021-09-01T12:00:00Z"), // Renamed to `createdAt` for consistency
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "css" },
      { _id: "2", name: "html" },
    ],
    author: {
      _id: "2",
      name: "Jane Doe",
      picture: "/path/to/janedoe.jpg",
    },
    upvotes: 10,
    views: 100,
    answers: [
      { text: "Use `margin: auto` on the div." },
      {
        text: "Set `display: flex; justify-content: center;` on the container.",
      },
    ],
    createdAt: new Date("2021-09-01T12:00:00Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
