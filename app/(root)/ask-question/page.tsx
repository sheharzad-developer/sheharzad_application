import Question from "@/components/forms/Question";
import React from "react";

const page = () => {
  const isUserLoggedIn = false;

  if (!isUserLoggedIn) {
  }
  return (
    <div>
      <Question />
    </div>
  );
};

export default page;
