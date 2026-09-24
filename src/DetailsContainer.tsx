import React from "react";
import Tabs from "./tabs/Tabs";
import StatsContainer from "./StatsContainer";

const DetailsContainer: React.FC = () => {
  return (
    <div className="space-y-4">
      <Tabs />
      <StatsContainer />
    </div>
  );
};

export default DetailsContainer;
