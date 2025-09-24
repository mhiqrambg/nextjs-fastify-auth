import React from "react";

export function usePasswordVisibility(initialKeys: string[] = ["password"]) {
  const initialState = initialKeys.reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {},
  );

  const [visibility, setVisibility] =
    React.useState<Record<string, boolean>>(initialState);

  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return { visibility, toggleVisibility };
}
