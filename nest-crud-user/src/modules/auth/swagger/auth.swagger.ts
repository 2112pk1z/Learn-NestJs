import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
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
    ApiCreatedResponse({ description: 'User registered successfully' }),
    ApiConflictResponse({ description: 'Email already exists' }),
  );
}

export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user profile',
      description: 'API endpoint to retrieve the authenticated user profile',
    }),
    ApiOkResponse({ description: 'Returns the user profile' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized access' }),
  );
}
