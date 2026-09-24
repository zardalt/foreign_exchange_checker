import React from "react";

const Tabs: React.FC = () => {
  return (
    <div className="px-3 rounded-lg bg-neutral-700 border border-neutral-400">
      <button className="h-10 text-left w-full text-neutral-50 after:absolute relative after:bg-[url(/images/angle_down.svg)] after:left-0 after:inset-0 after:bg-no-repeat after:bg-position-[right_center] after:bg-size-[0.625em]">
        <span className="text-preset-3 uppercase">History</span>
        <span></span>
      </button>
    </div>
  );
};

export default Tabs;
