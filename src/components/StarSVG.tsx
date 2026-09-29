import React from "react";
import { getColors } from "../util";

type Props = {
  isFavorited: boolean;
};

const StarSVG: React.FC<Props> = ({ isFavorited }) => {
  return (
    <svg
      className="inline"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z"
        fill={isFavorited ? getColors("lime-500") : "transparent"}
        stroke={getColors(isFavorited ? "lime-500" : "neutral-50")}
      />
    </svg>
  );
};

export default StarSVG;
