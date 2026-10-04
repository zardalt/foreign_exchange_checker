import React, { useContext, useRef, type RefObject } from "react";
import { getColors, TABS, type State } from "../util";
import {
  ConversionLogsContext,
  FavoritedCurrencyPairs,
} from "../contexts/CurrencyContext";

type SelectItemProp = {
  text: string;
  tabValue: TabValue;
  notificationCount: number | false;
  setCurrentTab: State<TabValue>;
  menuPopover: RefObject<HTMLDivElement | null>;
};

const SelectItem: React.FC<SelectItemProp> = ({
  text,
  tabValue,
  notificationCount,
  setCurrentTab,
  menuPopover,
}) => {
  function handleButtonClick() {
    setCurrentTab(tabValue);
    menuPopover.current?.hidePopover();
  }

  return (
    <button
      className="w-full uppercase flex justify-between items-center px-2 py-2.5 rounded-sm border border-transparent hover:border-neutral-500"
      onClick={handleButtonClick}
    >
      <span className="text-preset-3">{text}</span>
      <span
        className="bg-lime-800 rounded-full size-5 flex-center text-preset-6 text-lime-500"
        hidden={notificationCount === false}
      >
        {notificationCount}
      </span>
    </button>
  );
};

const TabButton: React.FC<
  Omit<SelectItemProp, "menuPopover"> & { currentTab: TabValue }
> = ({ text, tabValue, notificationCount, setCurrentTab, currentTab }) => {
  return (
    <button
      className="flex items-center gap-2 px-4 h-10 text-neutral-50 border-b transition-colors"
      onClick={() => {
        setCurrentTab(tabValue);
      }}
      style={{
        borderColor:
          tabValue === currentTab ? getColors("lime-500") : "transparent",
      }}
    >
      <span className="uppercase text-preset-3">{text}</span>
      <span
        className="size-5 rounded-full bg-lime-800 text-preset-6 text-lime-500 flex-center"
        hidden={notificationCount === false}
      >
        {notificationCount}
      </span>
    </button>
  );
};

type TabValue = (typeof TABS)[keyof typeof TABS];

type TabsProp = {
  setCurrentTab: State<TabValue>;
  currentTab: TabValue;
};

const Tabs: React.FC<TabsProp> = ({ setCurrentTab, currentTab }) => {
  const { favorited } = useContext(FavoritedCurrencyPairs);
  const { logs } = useContext(ConversionLogsContext);
  const menuPopover = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        className="sm:hidden px-3 rounded-lg bg-neutral-700 border border-neutral-400"
        style={{
          anchorName: "--menuBtn",
        }}
      >
        <button
          className="flex gap-x-2 items-center h-10 text-left w-full text-neutral-50 after:absolute relative after:bg-[url(/images/angle_down.svg)] after:left-0 after:inset-0 after:bg-no-repeat after:bg-position-[right_center] after:bg-size-[0.625em]"
          popoverTarget="tabsMenu"
        >
          <span className="text-preset-3 uppercase">
            {currentTab === 0
              ? "History"
              : currentTab === 1
                ? "Compare"
                : currentTab === 2
                  ? "Favorites"
                  : "Log"}
          </span>
          <span
            className="bg-lime-800 text-lime-500 text-preset-6 rounded-full size-5 flex-center"
            hidden={currentTab === 0 || currentTab === 1}
          >
            {currentTab === 0
              ? ""
              : currentTab === 1
                ? ""
                : currentTab === 2
                  ? favorited.size
                  : logs.length}
          </span>
        </button>
      </div>
      <div
        className="sm:hidden text-neutral-50 w-[calc(100%_-_2em)] max-w-[unset] p-2 rounded-[0.625em] bg-neutral-700 border border-neutral-600 top-[calc(anchor(bottom)_+_.3em)] transition-transform starting:scale-y-0 origin-top"
        id="tabsMenu"
        popover="auto"
        style={{
          positionAnchor: "--menuBtn",
          positionArea: "end span-all",
        }}
        ref={menuPopover}
      >
        <SelectItem
          text="History"
          tabValue={TABS.HISTORY}
          notificationCount={false}
          setCurrentTab={setCurrentTab}
          menuPopover={menuPopover}
        />
        <SelectItem
          text="Compare"
          tabValue={TABS.COMPARE}
          notificationCount={false}
          setCurrentTab={setCurrentTab}
          menuPopover={menuPopover}
        />
        <SelectItem
          text="Favorites"
          tabValue={TABS.FAVORITES}
          notificationCount={favorited.size}
          setCurrentTab={setCurrentTab}
          menuPopover={menuPopover}
        />
        <SelectItem
          text="Log"
          tabValue={TABS.LOG}
          notificationCount={logs.length}
          setCurrentTab={setCurrentTab}
          menuPopover={menuPopover}
        />
      </div>
      {/** Tablet and Desktop */}
      <div className="hidden sm:flex gap-2 border-b border-b-neutral-600">
        <TabButton
          text={"History"}
          tabValue={TABS.HISTORY}
          notificationCount={false}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
        <TabButton
          text={"Compare"}
          tabValue={TABS.COMPARE}
          notificationCount={false}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
        <TabButton
          text={"Favorites"}
          tabValue={TABS.FAVORITES}
          notificationCount={favorited.size}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
        <TabButton
          text={"Log"}
          tabValue={TABS.LOG}
          notificationCount={logs.length}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
      </div>
    </>
  );
};

export default Tabs;
