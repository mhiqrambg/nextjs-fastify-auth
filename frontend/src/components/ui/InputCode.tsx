import { cn } from "@/utils/cn";
import type { AlertProps } from "@heroui/react";
import { Alert, Button, Input, Spinner, Form } from "@heroui/react";
import { Plus, X } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const CustomAlert = ({
  children,
  variant,
  color,
  className,
  classNames,
  ...props
}: AlertProps) => {
  return (
    <Alert
      classNames={{
        ...classNames,
        base: cn(
          [
            "bg-default-50 dark:bg-background shadow-sm",
            "border-1 border-default-200 dark:border-default-100",
            "relative before:content-[''] before:absolute before:z-10",
            "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
            "rounded-l-none border-l-0",
            "before:bg-warning",
          ],
          classNames?.base,
          className,
        ),
        mainWrapper: cn("pt-1", classNames?.mainWrapper),
        iconWrapper: cn("dark:bg-transparent", classNames?.iconWrapper),
      }}
      color={color}
      variant={variant}
      {...props}
    >
      {children}
    </Alert>
  );
};

CustomAlert.displayName = "CustomAlert";

const InputCode = ({
  title,
  description,
  buttonText,
  buttonInputText,
  placeholder,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonInputText: string;
  placeholder: string;
}) => {
  const [showInput, setShowInput] = React.useState(false);

  const [classCode, setClassCode] = React.useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(classCode);
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex w-full flex-col gap-y-6">
        <CustomAlert key="warning" color="warning" description={description}>
          <div className="mt-3 flex items-center gap-1">
            {!showInput ? (
              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  variant="solid"
                  className="shadow-small text-sm font-normal"
                  onPress={() => setShowInput(true)}
                  startContent={<Plus size={16} />}
                >
                  {buttonInputText}
                </Button>
              </div>
            ) : (
              <Button
                className=""
                size="sm"
                color="warning"
                onPress={() => setShowInput(false)}
                isIconOnly
              >
                <X size={16} />
              </Button>
            )}
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Form onSubmit={handleSubmit} className="flex flex-row gap-2">
                    <Input
                      placeholder={placeholder}
                      value={classCode}
                      onChange={(e) => {
                        let val = e.target.value.toUpperCase();
                        val = val.replace(/[^A-Z0-9]/g, "");
                        val = val.slice(0, 12);
                        val = val.replace(/(.{4})(?=.)/g, "$1-");
                        setClassCode(val);
                      }}
                      size="sm"
                      variant="faded"
                      maxLength={14}
                    />

                    <Button color="primary" type="submit" size="sm">
                      {buttonText}
                    </Button>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CustomAlert>
      </div>
    </div>
  );
};

export default InputCode;
