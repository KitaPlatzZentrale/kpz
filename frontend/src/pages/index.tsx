import React from "react";
import Layout from "./layout";

type IndexPageProps = {};

const IndexPage: React.FC<IndexPageProps> = ({}) => {
  return (
    <Layout>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Welcome to my app!</h1>
        <p className="text-2xl font-medium">This is the home page</p>
      </div>
    </Layout>
  );
};

export default IndexPage;
