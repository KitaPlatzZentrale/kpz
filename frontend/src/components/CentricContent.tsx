import React from "react";

type CentricContentProps = React.PropsWithChildren<{}>;

const CentricContent: React.FC<CentricContentProps> = ({ children }) => {
  return (
    <div className="page-padding ml-auto mr-auto w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      {children}
    </div>
  );
};

export default CentricContent;
