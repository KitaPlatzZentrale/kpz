import React from "react";
import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

type HeaderNavigationLinkProps = React.PropsWithChildren<{
  to: string;
  active?: boolean;
  onClick?: () => void;
}>;

const HeaderNavigationLink: React.FC<HeaderNavigationLinkProps> = ({
  to,
  active = false,
  onClick,
  children,
}) => {
  const location = useLocation();

  const isActive = React.useMemo(() => {
    return active || location.pathname === to;
  }, [location.pathname, to]);

  return (
    <li
      onClick={onClick}
      className={clsx(
        "h-full w-fit cursor-pointer after:relative after:float-left after:mt-[8px] after:h-1 after:w-full after:rounded-full after:transition-opacity active:after:transition-opacity",
        isActive
          ? `after:bg-primary-dark after:opacity-100`
          : `after:bg-[#966657] after:opacity-0 hover:after:opacity-30 active:after:opacity-100`
      )}
    >
      <NavLink
        className={({ isActive: isActiveProp }) =>
          clsx(
            "h-full text-4xl sm:text-5xl xl:text-base",
            isActive || isActiveProp
              ? `font-extrabold text-primary-dark`
              : `font-bold text-[#966657]`
          )
        }
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
};

export default HeaderNavigationLink;
