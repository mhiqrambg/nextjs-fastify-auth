import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

const Dashboard = () => {
  const list = [
    { id: 1, title: "My Class", body: "You have 12 classes", total: 12 },
    { id: 2, title: "My Exam", body: "You have 10 classes", total: 10 },
    { id: 3, title: "Exam Done", body: "You have 10 exams", total: 10 },
  ];

  const profile = {
    name: "Unknownmeee",
    image: "/images/user/user.svg",
    email: "unknownmeee@gmail.com",
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid sm:grid-cols-4">
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Card className="h-20 justify-center sm:h-auto" isPressable>
              <CardHeader className="items-center justify-center gap-4">
                <Avatar
                  src={profile.image}
                  name={profile.name}
                  className="border-quiz-navy ca border p-0.5"
                />
                <div className="min-w-0 items-start">
                  <h1 className="truncate text-left font-bold">
                    {profile.name}
                  </h1>
                  <p className="text-foreground/60 truncate text-sm">
                    {profile.email}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant="faded">
            {list.map((item) => (
              <DropdownItem
                key={item.id}
                isReadOnly
                description={`${item.total} items`}
              >
                {item.title}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {list.map((item) => (
          <Card
            key={item.id}
            className="hidden h-auto overflow-hidden sm:block"
          >
            <CardBody className="flex items-center justify-between">
              <div>
                <h2>{item.title}</h2>
              </div>
              <span className="text-quiz-navy text-3xl font-bold">
                {item.total}
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
