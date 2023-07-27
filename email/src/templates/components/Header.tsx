import React from "react";

import { Head } from "@react-email/components";

type HeaderProps = {
  preview?: string | string[];
};

const Header: React.FC<HeaderProps> = ({ preview }) => {
  return (
    <>
      <Head />
      {/*preview && preview?.length > 0 && <Preview>preview</Preview>*/}
    </>
  );
};

export default Header;
