import React from "react";

type Props = {
  heading: string;
  subHeading: string | React.JSX.Element;
  width: number;
};

const EmptyDefault: React.FC<Props> = ({ heading, subHeading, width }) => {
  return (
    <div className="space-y-4 py-10">
      <p className="text-center text-preset-2 text-neutral-100">{heading}</p>
      <p
        className="text-center text-preset-3 text-neutral-200 text-[0.875rem] leading-6 mx-auto"
        style={{
          maxWidth: width + "px",
        }}
      >
        {subHeading}
      </p>
    </div>
  );
};

export default EmptyDefault;
