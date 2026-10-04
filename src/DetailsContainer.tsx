import React, { useState } from "react";
import Tabs from "./tabs/Tabs";
import { TABS } from "./util";
import BoundedHistoryTab from "./tabs/HistoryTab";
import BoundedCompareTab from "./tabs/CompareTab";
import BoundedFavoritesTab from "./tabs/FavoritesTab";
import LogTab from "./tabs/LogTab";

const DetailsContainer: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    (typeof TABS)[keyof typeof TABS]
  >(TABS.HISTORY);

  return (
    <div className="space-y-4">
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === TABS.HISTORY ? (
        <BoundedHistoryTab />
      ) : currentTab === TABS.COMPARE ? (
        <BoundedCompareTab />
      ) : currentTab === TABS.FAVORITES ? (
        <BoundedFavoritesTab />
      ) : (
        <LogTab />
      )}
    </div>
  );
};

export default DetailsContainer;
