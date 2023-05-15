import React from "react";
import HeaderNavigationLink from "./HeaderNavigationLink";

type HeaderNavigationLinkListProps = {
  onLinkClick?: () => void;
};

const HeaderNavigationLinkList: React.FC<HeaderNavigationLinkListProps> = ({
  onLinkClick,
}) => {
  return (
    <ul className="flex h-full flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <HeaderNavigationLink onClick={onLinkClick} to="/" active>
        Startseite
      </HeaderNavigationLink>
      <HeaderNavigationLink onClick={onLinkClick} to="/finder">
        Kita-Karte
      </HeaderNavigationLink>
      <HeaderNavigationLink onClick={onLinkClick} to="/about">
        Über uns
      </HeaderNavigationLink>
    </ul>
  );
};

export default HeaderNavigationLinkList;
