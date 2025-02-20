import { FC, SVGProps, useEffect, useState } from "react";

type SVGIconProps = FC<SVGProps<SVGSVGElement>>;

const Bell: SVGIconProps = (props) => {
  const { height, className } = props;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <svg
          height={height}
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_514_2066)">
            <path
              d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
              fill="#FF0062"
            />
            <path
              d="M16.8998 8.70002C16.8998 7.40002 16.1998 6.20002 15.3998 5.30002C14.4998 4.40002 13.1998 3.90002 11.9998 3.90002C10.7998 3.90002 9.4998 4.50002 8.5998 5.30002C7.6998 6.10002 7.1998 7.50002 7.1998 8.70002C7.1998 14.4 4.7998 16.1 4.7998 16.1H19.4998C19.4998 16.1 17.0998 14.4 17.0998 8.70002H16.8998Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.3 19.4C13.2 19.6 13 19.8 12.7 20C12.4 20.2 12.1 20.2 11.9 20.2C11.7 20.2 11.3 20.2 11.1 20C10.9 19.9 10.7 19.7 10.5 19.4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_514_2066">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          height={height}
          className={className}
          viewBox="0 0 30 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_513_2060)">
            <path
              d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
              fill="#FF0062"
            />
            <path
              d="M16.8998 8.70002C16.8998 7.40002 16.1998 6.20002 15.3998 5.30002C14.4998 4.40002 13.1998 3.90002 11.9998 3.90002C10.7998 3.90002 9.4998 4.50002 8.5998 5.30002C7.6998 6.10002 7.1998 7.50002 7.1998 8.70002C7.1998 14.4 4.7998 16.1 4.7998 16.1H19.4998C19.4998 16.1 17.0998 14.4 17.0998 8.70002H16.8998Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.3 19.4C13.2 19.6 13 19.8 12.7 20C12.4 20.2 12.1 20.2 11.9 20.2C11.7 20.2 11.3 20.2 11.1 20C10.9 19.9 10.7 19.7 10.5 19.4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28.9002 10.7L22.2002 7.09998V16.8L28.9002 13.2C29.9002 12.7 29.9002 11.2 28.9002 10.7Z"
              fill="#FF0062"
            />
          </g>
          <defs>
            <clipPath id="clip0_513_2060">
              <rect width="30" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  );
};

export default Bell;
