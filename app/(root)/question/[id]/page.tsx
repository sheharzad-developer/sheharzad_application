import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params, searchParams }: any) => {
  const result = await getQuestionById({ questionId: params.id });

  // Ensure result is defined before accessing properties
  if (!result) {
    return <p>Question not found.</p>;
  }

  // Fallback to ensure these properties are defined before accessing them
  const answersCount = result.answers ? result.answers.length : 0;
  const viewsCount = result.views ? formatAndDivideNumber(result.views) : "0";
  const contentData = result.content || "<p>No content available</p>";
  const authorName = result.author ? result.author.name : "Unknown Author";
  const authorPicture = result.author
    ? result.author.picture
    : "/assets/images/default-profile.svg";
  const authorClerkId = result.author ? result.author.clerkId : "#";

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${authorClerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src="/assets/images/site-logo.svg"
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {authorName}
            </p>
          </Link>
          <div className="flex justify-end">VOTING</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title || "Untitled Question"}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`asked ${getTimestamp(result.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(answersCount)} // Safely access length
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={viewsCount} // Safely access views count
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={contentData} />

      {/* Safely check if tags exist */}
      {result.tags && result.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {result.tags.map((tag: any) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))}
        </div>
      )}

      {/* <Answer /> */}
    </>
  );
};

export default Page;
