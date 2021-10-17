interface DBerrors {
    errors: {
    __typename?: "DbError" | undefined;
    field: string;
    message: string;
}[]
}

export const getDbErrors = ({errors}: DBerrors) => {
    const mappedErrors: Record<string,string> = {};
    errors.forEach(({field,message}) => {
        mappedErrors[field] = message;
    });
    return mappedErrors;
}