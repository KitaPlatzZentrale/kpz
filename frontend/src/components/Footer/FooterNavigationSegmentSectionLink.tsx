import React from "react";
import { Link } from "react-router-dom";
type FooterNavigationSegmentSectionLinkProps = {
  to: string;
  children: React.ReactNode;
};

const FooterNavigationSegmentSectionLink: React.FC<
  FooterNavigationSegmentSectionLinkProps
> = ({ to, children }) => {
  return (
    <Link to={to} className="text-base font-bold text-white">
      {children}
    </Link>
  );
};

export default FooterNavigationSegmentSectionLink;
