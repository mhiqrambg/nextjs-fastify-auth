import Image from "next/image";
import { Button, Form, Input } from "@heroui/react";
import React from "react";
import axios from "axios";

export default function Hero() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = await axios.post("/api/join-class", {
      code: data.code,
    });

    setErrors(result.data.errors);
    setIsLoading(false);
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center text-white md:min-h-[60vh]">
      {/* Background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/illustrations/tech-pattern.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      />

      {/* Overlay gradient */}
      <div className="from-quiz-gold/95 to-quiz-navy/90 absolute inset-0 bg-gradient-to-tr" />

      {/* Konten */}
      <div className="relative z-10 mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-12 px-6 text-center md:grid-cols-2 md:px-20 md:text-left">
        {/* Kiri */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold drop-shadow-lg md:text-5xl">
              Platform <span className="text-quiz-navy">online test</span> &
              <span className="text-quiz-gold"> quiz maker </span>
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-90 md:mt-6">
              Quiz makes it easy for teachers to create secure, modern, and
              flexible online exams, so students can learn and test themselves
              comfortably.
            </p>
          </div>
          <div>
            <Form
              className="flex flex-row justify-center md:justify-start"
              validationErrors={errors}
              onSubmit={onSubmit}
            >
              <Input
                size="sm"
                className="w-1/2 md:w-1/3"
                isRequired
                isDisabled={isLoading}
                labelPlacement="outside"
                name="code"
                placeholder="Enter the exam code"
                errorMessage="Exam code not found"
              />
              <Button
                color="warning"
                isLoading={isLoading}
                type="submit"
                size="sm"
              >
                Start Exam
              </Button>
            </Form>
          </div>
        </div>

        {/* Kanan */}
        <div className="flex justify-center">
          <Image
            src="/images/illustrations/mockup.svg"
            alt="Ilustrasi Quizolah"
            priority
            className="h-auto w-full sm:w-56 md:h-auto md:w-80 lg:w-[500px]"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
}
