import { FC, SVGProps } from "react";

type SVGIconProps = FC<SVGProps<SVGSVGElement>>;

const XIcon: SVGIconProps = (props) => {
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
        d="M6 18L18 6M6 6L18 18"
        stroke="#21272A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default XIcon;
