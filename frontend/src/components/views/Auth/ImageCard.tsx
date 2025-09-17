import { CardBody, CardFooter, Image, Button } from "@heroui/react";

export default function ImageCard() {
  return (
    <>
      <CardBody className="p-0">
        <Image
          alt="Woman listening to music"
          src="https://heroui.com/images/hero-card.jpeg"
          className="h-full w-full object-cover"
          removeWrapper
        />
      </CardBody>
      <CardFooter className="rounded-large shadow-small absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden border-1 border-white/20 py-1 before:rounded-xl before:bg-white/10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button
          className="text-tiny bg-black/20 text-white"
          color="default"
          radius="lg"
          size="sm"
          variant="flat"
        >
          Notify me
        </Button>
      </CardFooter>
    </>
  );
}
