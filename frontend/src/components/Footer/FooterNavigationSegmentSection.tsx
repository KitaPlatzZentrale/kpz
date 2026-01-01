import React from "react";
import FooterNavigationSegmentSectionLink from "./FooterNavigationSegmentSectionLink";
import { FooterNavigationLink } from "./types";

type FooterNavigationSegmentSectionProps = {
  title: string;
  links: FooterNavigationLink[];
};

const FooterNavigationSegmentSection: React.FC<
  FooterNavigationSegmentSectionProps
> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-white text-opacity-90">
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <FooterNavigationSegmentSectionLink key={link.to} to={link.to}>
            {link.title}
          </FooterNavigationSegmentSectionLink>
        ))}
      </div>
    </div>
  );
};

export default FooterNavigationSegmentSection;
