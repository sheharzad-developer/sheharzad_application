import Navbar from "@/components/shared/navbar/Navbar";
import LeftSideBar from "@/components/shared/LeftSidebar";
import React from "react";
import RightSidebar from "@/components/shared/RightSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar />
        <section className="ma-md:pb-14 flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 sm:px-14">
          <div className="max-w-5x1 mx-auto w-full">{children}</div>
        </section>
        <RightSidebar />
      </div>
    </main>
  );
};

export default Layout;
