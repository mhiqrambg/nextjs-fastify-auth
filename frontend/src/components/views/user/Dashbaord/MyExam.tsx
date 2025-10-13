import {
  Image,
  Card,
  CardHeader,
  Divider,
  CardFooter,
  Progress,
} from "@heroui/react";

const MyExam = () => {
  const myExam = [
    {
      id: 1,
      title: "JavaScript Fundamentals ",
      description: "Description 1",
      image: "https://picsum.photos/650",
      duration: 30,
      totalQuestions: 10,
      passingScore: 70,
      difficulty: "easy",
      category: "Programming",
      instructor: "Instructor 1",
      studies: "SD",
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 60,
    },
    {
      id: 2,
      title:
        "Exam 2 Kotlin Basic Concepts and Operations services Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      description: "Description 2",
      instructor: "Instructor 2",
      studies: "SD",
      category: "Programming",
      image: "https://picsum.photos/550",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 0,
    },
    {
      id: 3,
      title: "Exam 3",
      description: "Description 3",
      studies: "General",
      instructor: "Instructor 3",
      category: "SMP",
      image: "https://picsum.photos/600",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 12,
    },
    {
      id: 4,
      title: "Exam 4",
      description: "Description 4",
      studies: "SD",
      instructor: "Instructor 4",
      category: "SMP",
      image: "https://picsum.photos/420",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 100,
    },
    {
      id: 5,
      title: "Exam 5",
      description: "Description 5",
      studies: "SMP",
      instructor: "Instructor 5",
      category: "Matematika",
      image: "https://picsum.photos/400",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 92,
    },
    {
      id: 6,
      title: "Exam 6",
      description: "Description 6",
      studies: "SD",
      instructor: "Instructor 6",
      category: "Ilmu Pengetahuan Alam",
      image: "https://picsum.photos/300",
      expiredAt: "2024-01-15T10:00:00Z",
      start: 100,
      end: 20,
    },
  ];

  const resultMyExam = myExam.slice(0, 5);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold">My Exam</h1>
        <p className="text-primary">View all</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {resultMyExam.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="flex gap-2">
              <div className="h-12 w-12 flex-shrink-0">
                <Image
                  alt={item.title}
                  radius="sm"
                  src={item.image}
                  className="h-full w-full object-cover"
                />
              </div>
              <Divider orientation="vertical" />
              <div className="flex flex-col">
                <p className="text-md line-clamp-1">{item.title}</p>
                <p className="text-small text-default-500">{item.studies}</p>
                <p className="text-small text-default-500">{item.instructor}</p>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Progress
                className="max-w-md"
                color="warning"
                label={`${item.end}/${item.start}`}
                maxValue={item.start}
                size="sm"
                value={item.end}
                showValueLabel={true}
              />
              <p className="text-small text-default-500">
                Expired:
                {new Date(item.expiredAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyExam;
