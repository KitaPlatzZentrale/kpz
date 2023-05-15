import clsx from "clsx";
import { Link } from "react-router-dom";

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
  return (
    <li
      onClick={onClick}
      className={clsx(
        "h-full w-fit cursor-pointer after:relative after:float-left after:mt-[8px] after:h-1 after:w-full after:rounded-full after:transition-opacity active:after:transition-opacity",
        active
          ? `after:bg-primary-dark after:opacity-100`
          : `after:bg-[#966657] after:opacity-0 hover:after:opacity-30 active:after:opacity-100`
      )}
    >
      <Link
        className={clsx(
          "h-full text-4xl sm:text-5xl lg:text-base",
          active
            ? `font-extrabold text-primary-dark`
            : `font-bold text-[#966657]`
        )}
        to={to}
      >
        {children}
      </Link>
    </li>
  );
};

export default HeaderNavigationLink;
