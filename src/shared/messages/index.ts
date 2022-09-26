export const USER_NOT_FOUND = (value: string | number) =>
    `User ${value} not found`;
export const INVALID_CREDENTIALS = 'Invalid credentials';
export const INVALID_JWT_TOKEN = 'Invalid token';
export const USER_EXISTS = (value: any) => `User ${value} already exists`;
export const INVALID_PASSWORD_CONFIRMATION = 'Passwords do not match';
export const NOT_AUTHORIZED_FOR_LIST = 'You cannot access this list';
export const USERS_NOT_FOUND = (value: string[] | number[]) =>
    `Users ${value} not found`;
