import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage } from 'src/global/globalEnum';

type NestExceptionResponse =
  | string
  | {
      data?: unknown;
      statusCode?: number;
      message?: string | string[];
      error?: string;
    };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json(this.buildResponse(exception, statusCode));
  }

  private buildResponse(
    exception: unknown,
    statusCode: number,
  ): ResponseData<null> {
    if (exception instanceof HttpException) {
      const exceptionResponse =
        exception.getResponse() as NestExceptionResponse;

      if (this.isResponseData(exceptionResponse)) {
        return exceptionResponse as ResponseData<null>;
      }

      return new ResponseData<null>(
        null,
        statusCode,
        this.getHttpExceptionMessage(exceptionResponse, statusCode),
      );
    }

    return new ResponseData<null>(
      null,
      statusCode,
      HttpMessage.INTERNAL_SERVER_ERROR,
    );
  }

  private isResponseData(response: NestExceptionResponse): boolean {
    return (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      'statusCode' in response &&
      'message' in response
    );
  }

  private getHttpExceptionMessage(
    exceptionResponse: NestExceptionResponse,
    statusCode: number,
  ): string {
    if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      return HttpMessage.TOO_MANY_REQUESTS;
    }

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.join(', ');
    }

    return (
      exceptionResponse.message ??
      exceptionResponse.error ??
      this.getDefaultMessage(statusCode)
    );
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return HttpMessage.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return HttpMessage.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return HttpMessage.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return HttpMessage.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return HttpMessage.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return HttpMessage.TOO_MANY_REQUESTS;
      default:
        return HttpMessage.INTERNAL_SERVER_ERROR;
    }
  }
}
