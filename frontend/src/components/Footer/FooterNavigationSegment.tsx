import React from "react";
import FooterNavigationSegmentSection from "./FooterNavigationSegmentSection";
import { FooterNavigationSection } from "./types";

type FooterNavigationSegmentProps = {
  sections: FooterNavigationSection[];
};

const FooterNavigationSegment: React.FC<FooterNavigationSegmentProps> = ({
  sections,
}) => {
  return (
    <div className="flex flex-col gap-8 sm:flex-row-reverse sm:gap-12 lg:flex-col lg:gap-5">
      {sections.map((section) => (
        <FooterNavigationSegmentSection
          title={section.title}
          links={section.links}
        />
      ))}
    </div>
  );
};

export default FooterNavigationSegment;
