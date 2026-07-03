import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiGetUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users',
      description: 'API endpoint for retrieving all users',
    }),
    ApiOkResponse({ description: 'Users retrieved successfully' }),
    ApiNotFoundResponse({ description: 'No users found' }),
  );
}

export function ApiGetUserById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a user by ID',
      description: 'API endpoint for retrieving a user by ID',
    }),
    ApiOkResponse({ description: 'User retrieved successfully' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a user',
      description: 'API endpoint for updating a user by ID',
    }),
    ApiOkResponse({ description: 'User updated successfully' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user',
      description: 'API endpoint for deleting a user by ID',
    }),
    ApiOkResponse({ description: 'User deleted successfully' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}
