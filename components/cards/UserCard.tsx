"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

// Define Tag type
interface Tag {
  _id: string;
  name: string;
}

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = ({ user }: Props) => {
  const [interactedTags, setInteractedTags] = useState<Tag[]>([]); // State to store tags

  // Fetch the top interacted tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTopInteractedTags({ userId: user._id });
        setInteractedTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error); // Handle fetch error
      }
    };

    fetchTags();
  }, [user._id]);

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        {/* User picture */}
        <Image
          src="/assets/images/Abstract.png" // Fallback to placeholder image
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        {/* User name and username */}
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        {/* Render tags */}
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
