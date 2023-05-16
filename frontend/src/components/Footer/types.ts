export type FooterNavigationLink = {
  title: string;
  to: string;
};

export type FooterNavigationSection = {
  title: string;
  links: FooterNavigationLink[];
};

export type FooterNavigationSegment = FooterNavigationSection[];

export type FooterNavigation = FooterNavigationSegment[];
