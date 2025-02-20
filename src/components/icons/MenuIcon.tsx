import { FC, SVGProps } from "react";

type SVGIconProps = FC<SVGProps<SVGSVGElement>>;

const MenuIcon: SVGIconProps = (props) => {
  const { width, className } = props;
  return (
    <svg
      width={width}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        stroke="#21272A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MenuIcon;
