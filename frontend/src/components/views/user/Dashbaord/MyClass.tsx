import React from "react";
import { Card, CardFooter, CardBody, Image, Progress } from "@heroui/react";
import PaginationControls from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/ui/usePagination";

const MyClass = () => {
  const list = [
    {
      id: 1,
      title: "Class 1",
      description: "Description 1",
      image: "https://picsum.photos/600",
      start: 100,
      end: 60,
    },
    {
      id: 2,
      title: "Class 2",
      description: "Description 2",
      image: "https://picsum.photos/400/500",
      start: 100,
      end: 80,
    },
    {
      id: 3,
      title: "Class 3",
      description: "Description 3",
      image: "https://picsum.photos/700/200",
      start: 100,
      end: 77,
    },
    {
      id: 4,
      title: "Class 4",
      description: "Description 4",
      image: "https://picsum.photos/400/400",
      start: 100,
      end: 90,
    },
    {
      id: 5,
      title: "Class 5",
      description: "Description 5",
      image: "https://picsum.photos/400/320",
      start: 100,
      end: 60,
    },
    {
      id: 6,
      title: "Class 6",
      description: "Description 6",
      image: "https://picsum.photos/400/200",
      start: 100,
      end: 60,
    },

    {
      id: 7,
      title: "Class 7",
      description: "Description 7",
      image: "https://picsum.photos/600/200",
      start: 100,
      end: 60,
    },
    {
      id: 8,
      title: "Class 8",
      description: "Description 8",
      image: "https://picsum.photos/340/320",
      start: 100,
      end: 60,
    },
    {
      id: 9,
      title: "Class 9",
      description: "Description 9",
      image: "https://picsum.photos/300/200",
      start: 100,
      end: 60,
    },
    {
      id: 10,
      title: "Class 10",
      description: "Description 10",
      image: "https://picsum.photos/400/420",
      start: 100,
      end: 60,
    },
    {
      id: 11,
      title: "Class 11",
      description: "Description 11",
      image: "https://picsum.photos/260/600",
      start: 100,
      end: 60,
    },
    {
      id: 12,
      title: "Class 12",
      description: "Description 12",
      image: "https://picsum.photos/300/600",
      start: 100,
      end: 60,
    },
    // Lanjutan ID 13 sampai 40 dengan ukuran gambar acak/berbeda
    {
      id: 13,
      title: "Class 13",
      description: "Description 13",
      image: "https://picsum.photos/350/250", // W:350, H:250
      start: 100,
      end: 65,
    },
    {
      id: 14,
      title: "Class 14",
      description: "Description 14",
      image: "https://picsum.photos/550/350", // W:550, H:350
      start: 100,
      end: 70,
    },
    {
      id: 15,
      title: "Class 15",
      description: "Description 15",
      image: "https://picsum.photos/280/480", // W:280, H:480
      start: 100,
      end: 75,
    },
    {
      id: 16,
      title: "Class 16",
      description: "Description 16",
      image: "https://picsum.photos/600/500", // W:600, H:500
      start: 100,
      end: 80,
    },
    {
      id: 17,
      title: "Class 17",
      description: "Description 17",
      image: "https://picsum.photos/330/330", // Persegi W:330, H:330
      start: 100,
      end: 85,
    },
    {
      id: 18,
      title: "Class 18",
      description: "Description 18",
      image: "https://picsum.photos/520/260", // Rasio 2:1
      start: 100,
      end: 60,
    },
    {
      id: 19,
      title: "Class 19",
      description: "Description 19",
      image: "https://picsum.photos/200/500", // Vertikal tinggi
      start: 100,
      end: 60,
    },
    {
      id: 20,
      title: "Class 20",
      description: "Description 20",
      image: "https://picsum.photos/700/300", // Horizontal lebar
      start: 100,
      end: 70,
    },
    {
      id: 21,
      title: "Class 21",
      description: "Description 21",
      image: "https://picsum.photos/310/210",
      start: 100,
      end: 72,
    },
    {
      id: 22,
      title: "Class 22",
      description: "Description 22",
      image: "https://picsum.photos/410/510",
      start: 100,
      end: 88,
    },
    {
      id: 23,
      title: "Class 23",
      description: "Description 23",
      image: "https://picsum.photos/510/310",
      start: 100,
      end: 90,
    },
    {
      id: 24,
      title: "Class 24",
      description: "Description 24",
      image: "https://picsum.photos/380/380",
      start: 100,
      end: 60,
    },
    {
      id: 25,
      title: "Class 25",
      description: "Description 25",
      image: "https://picsum.photos/420/220",
      start: 100,
      end: 65,
    },
    {
      id: 26,
      title: "Class 26",
      description: "Description 26",
      image: "https://picsum.photos/220/420",
      start: 100,
      end: 70,
    },
    {
      id: 27,
      title: "Class 27",
      description: "Description 27",
      image: "https://picsum.photos/580/300",
      start: 100,
      end: 75,
    },
    {
      id: 28,
      title: "Class 28",
      description: "Description 28",
      image: "https://picsum.photos/300/580",
      start: 100,
      end: 80,
    },
    {
      id: 29,
      title: "Class 29",
      description: "Description 29",
      image: "https://picsum.photos/440/440",
      start: 100,
      end: 85,
    },
    {
      id: 30,
      title: "Class 30",
      description: "Description 30",
      image: "https://picsum.photos/650/350",
      start: 100,
      end: 60,
    },
    {
      id: 31,
      title: "Class 31",
      description: "Description 31",
      image: "https://picsum.photos/350/650",
      start: 100,
      end: 60,
    },
    {
      id: 32,
      title: "Class 32",
      description: "Description 32",
      image: "https://picsum.photos/500/150",
      start: 100,
      end: 60,
    },
    {
      id: 33,
      title: "Class 33",
      description: "Description 33",
      image: "https://picsum.photos/150/500",
      start: 100,
      end: 60,
    },
    {
      id: 34,
      title: "Class 34",
      description: "Description 34",
      image: "https://picsum.photos/470/370",
      start: 100,
      end: 60,
    },
    {
      id: 35,
      title: "Class 35",
      description: "Description 35",
      image: "https://picsum.photos/370/470",
      start: 100,
      end: 60,
    },
    {
      id: 36,
      title: "Class 36",
      description: "Description 36",
      image: "https://picsum.photos/620/280",
      start: 100,
      end: 60,
    },
    {
      id: 37,
      title: "Class 37",
      description: "Description 37",
      image: "https://picsum.photos/280/620",
      start: 100,
      end: 60,
    },
    {
      id: 38,
      title: "Class 38",
      description: "Description 38",
      image: "https://picsum.photos/550/450",
      start: 100,
      end: 60,
    },
    {
      id: 39,
      title: "Class 39",
      description: "Description 39",
      image: "https://picsum.photos/450/550",
      start: 100,
      end: 60,
    },
    {
      id: 40,
      title: "Class 40",
      description: "Description 40",
      image: "https://picsum.photos/490/390",
      start: 100,
      end: 60,
    },
  ];

  const { slice } = usePagination({
    pageSize: 4,
    totalItems: list.length,
  });

  const visible = slice(list);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-xl font-bold">My Class</h1>
        <p className="text-primary">View all</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {visible.map((item) => (
          <Card
            key={item.id}
            isPressable
            onPress={() => console.log("card pressed", item.id)}
            className="overflow-hidden"
          >
            <CardBody className="p-0">
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={200}
                className="h-40 w-full object-cover"
                radius="none"
              />
            </CardBody>

            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-foreground/60 text-sm">{item.description}</p>
              <Progress
                aria-label="Progress"
                value={item.end}
                maxValue={item.start}
                color="success"
                showValueLabel
                radius="sm"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyClass;
