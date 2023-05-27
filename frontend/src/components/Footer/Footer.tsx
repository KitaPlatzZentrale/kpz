import React from "react";
import FooterNavigationSegment from "./FooterNavigationSegment";
import FOOTER_NAVIGATION_LINKS from "./navigation";
import { FooterNavigation } from "./types";

type FooterProps = {
  navigation?: FooterNavigation;
};

const Footer: React.FC<FooterProps> = ({
  navigation = FOOTER_NAVIGATION_LINKS,
}) => {
  const segments = React.useMemo(
    () =>
      navigation.map((segment, index) => (
        <FooterNavigationSegment
          key={"footer-navigation-segment-" + index}
          sections={segment}
        />
      )),
    [navigation]
  );

  return (
    <div className="page-padding w-full bg-[#4B5A65] pb-12 pt-12 sm:pb-28 sm:pt-20 lg:pb-10 lg:pt-16">
      <div className="flex w-full flex-col justify-between gap-16">
        <div className="flex min-h-[256px] flex-col justify-between gap-16 lg:flex-row">
          <div className="flex flex-col gap-2">
            <div id="logo">
              <span className="text-3xl font-black text-white">
                KitaPlatzZentrale
              </span>
            </div>
            <div className="text-base font-semibold text-white">
              Kita kann so einfach sein.
            </div>
          </div>
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-28">
            {segments}
          </div>
        </div>
        <div className="mt-auto flex flex-row justify-between text-white text-opacity-70">
          ©2023 kitaplatz-zentrale.de
        </div>
      </div>
    </div>
  );
};

export default Footer;
