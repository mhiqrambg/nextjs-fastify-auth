import { Tabs, Tab } from "@heroui/react";

interface CustomTabsProps {
  tabs: {
    key: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }[];
}

export default function CustomTabs(props: CustomTabsProps) {
  const tabs = props.tabs;

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
        color="primary"
        variant="underlined"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.title}</span>
              </div>
            }
          >
            {tab.content}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
