import { FC, SVGProps } from "react";

type SVGIconProps = FC<SVGProps<SVGSVGElement>>;

const GoogleIcon: SVGIconProps = (props) => {
  const { width, className } = props;
  return (
    <svg
      width={width}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_61_10398"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="12"
        y="10"
        width="8"
        height="8"
      >
        <path
          d="M19.6584 12.1756C19.6584 11.6282 19.609 11.1022 19.5161 10.5977H12.1562V13.5814H16.3616C16.1803 14.546 15.6301 15.3624 14.8022 15.9098V17.8449H17.3275C18.8054 16.5017 19.6576 14.5246 19.6576 12.1748L19.6584 12.1756Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_61_10398)">
        <path
          d="M23.9999 6.31177H7.81445V22.1307H23.9999V6.31177Z"
          fill="#3E82F1"
        />
      </g>
      <mask
        id="mask1_61_10398"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="13"
        width="13"
        height="7"
      >
        <path
          d="M12.1561 19.7143C14.2657 19.7143 16.0352 19.0238 17.3282 17.845L14.8029 15.9099C14.1034 16.3724 13.2079 16.6466 12.1569 16.6466C10.1219 16.6466 8.39848 15.2896 7.78407 13.4658H5.17285V15.4644C6.45894 17.9855 9.1014 19.7143 12.1561 19.7143Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask1_61_10398)">
        <path
          d="M21.6696 9.17993H0.831055V24H21.6696V9.17993Z"
          fill="#32A753"
        />
      </g>
      <mask
        id="mask2_61_10398"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="8"
        width="4"
        height="8"
      >
        <path
          d="M7.7834 13.4657C7.6272 13.0031 7.53868 12.5088 7.53868 12C7.53868 11.4911 7.6272 10.9968 7.7834 10.5342V8.53564H5.17218C4.64282 9.57734 4.34082 10.7552 4.34082 12C4.34082 13.2447 4.64282 14.4226 5.17218 15.4643L7.7834 13.4657Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask2_61_10398)">
        <path d="M12.125 4.24976H0V19.75H12.125V4.24976Z" fill="#F9BB00" />
      </g>
      <mask
        id="mask3_61_10398"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="4"
        width="13"
        height="7"
      >
        <path
          d="M12.1561 7.35356C13.3033 7.35356 14.3334 7.74248 15.1431 8.50748L17.3846 6.29474C16.0308 5.05002 14.2622 4.28589 12.1561 4.28589C9.1014 4.28589 6.45807 6.01462 5.17285 8.53575L7.78407 10.5343C8.39848 8.71136 10.1211 7.35356 12.1569 7.35356H12.1561Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask3_61_10398)">
        <path d="M21.7261 0H0.831055V14.8201H21.7261V0Z" fill="#E74133" />
      </g>
    </svg>
  );
};

export default GoogleIcon;
