export enum HttpMessage {
  OK = 'Server Response Success',
  CREATED = 'Resource created successfully',
  BAD_REQUEST = 'Bad request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Resource not found',
  CONFLICT = 'Resource already exists',
  TOO_MANY_REQUESTS = 'Too many requests',
  INTERNAL_SERVER_ERROR = 'Internal server error',
}
