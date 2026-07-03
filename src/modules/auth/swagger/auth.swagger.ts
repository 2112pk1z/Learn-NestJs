import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login to the application',
      description: 'API login endpoint for user authentication',
    }),
    ApiOkResponse({ description: 'Login successful, returns Token' }),
    ApiUnauthorizedResponse({ description: 'Incorrect email or password' }),
  );
}

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'API endpoint for user registration',
    }),
    ApiOkResponse({ description: 'User registered successfully' }),
    ApiConflictResponse({ description: 'Email already exists' }),
  );
}
