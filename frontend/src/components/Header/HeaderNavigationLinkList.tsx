import React from "react";
import HeaderNavigationLink from "./HeaderNavigationLink";
import HEADER_NAVIGATION_LINKS from "./navigation";
import { HeaderNavigationLinks } from "./types";

type HeaderNavigationLinkListProps = {
  links?: HeaderNavigationLinks;
  onLinkClick?: () => void;
};

const HeaderNavigationLinkList: React.FC<HeaderNavigationLinkListProps> = ({
  links = HEADER_NAVIGATION_LINKS,
  onLinkClick,
}) => {
  const [activeLink, setActiveLink] = React.useState<string | null>(null);

  return (
    <ul className="flex h-full flex-col gap-12 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
      {links.map((link) => (
        <HeaderNavigationLink
          key={"header-navigation-link-" + link.to}
          onClick={onLinkClick}
          to={link.to}
          active={link.active}
        >
          {link.title}
        </HeaderNavigationLink>
      ))}
    </ul>
  );
};

export default HeaderNavigationLinkList;
