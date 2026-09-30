import React, { useState } from "react";
import Tabs from "./tabs/Tabs";
import { TABS } from "./util";
import BoundedHistoryTab from "./tabs/HistoryTab";
import CompareTabWrapped from "./tabs/CompareTab";
import FavoritesTabWrapped from "./tabs/FavoritesTab";
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
        <CompareTabWrapped />
      ) : currentTab === TABS.FAVORITES ? (
        <FavoritesTabWrapped />
      ) : (
        <LogTab />
      )}
    </div>
  );
};

export default DetailsContainer;
