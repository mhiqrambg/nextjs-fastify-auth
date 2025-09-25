export const handleReset = (reset: any, defaultValues: any) => {
  reset(defaultValues, {
    keepErrors: false,
    keepDirty: false,
    keepTouched: false,
  });
};
