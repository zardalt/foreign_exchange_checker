import React, { Suspense, useState } from "react";
import Tabs from "./tabs/Tabs";
import HistoryTab, { HistoryTabLoading } from "./tabs/HistoryTab";
import { ErrorBoundary } from "react-error-boundary";
import { TABS } from "./util";

const DetailsContainer: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    (typeof TABS)[keyof typeof TABS]
  >(TABS.HISTORY);

  return (
    <div className="space-y-4">
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === TABS.HISTORY ? (
        <ErrorBoundary fallback={<p>An error occured</p>}>
          <Suspense fallback={<HistoryTabLoading />}>
            <HistoryTab />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <p>Not yet implemented</p>
      )}
    </div>
  );
};

export default DetailsContainer;
