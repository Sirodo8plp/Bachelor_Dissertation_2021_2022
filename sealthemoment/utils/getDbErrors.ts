interface ErrorsType {
  (
    errors:
      | { __typename?: "DbError" | undefined; field: string; message: string }[]
      | null
      | undefined
  ): Record<string, string>;
}

export const getDbErrors: ErrorsType = (errors): Record<string, string> => {
  const mappedErrors: Record<string, string> = {};
  if (errors) {
    errors.forEach(({ field, message }) => {
      mappedErrors["error"] = message;
    });
  }
  return mappedErrors;
};
