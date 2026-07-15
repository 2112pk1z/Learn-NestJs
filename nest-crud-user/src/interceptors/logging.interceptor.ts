import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.originalUrl || request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const duration = Date.now() - now;

        this.logger.log(`${method} ${url} ${statusCode} ${duration}ms`);
      }),

      catchError((error) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const duration = Date.now() - now;

        if (statusCode >= 500) {
          this.logger.error(
            `${method} ${url} ${statusCode} ${duration}ms`,
            error instanceof Error ? error.stack : undefined,
          );
        } else {
          this.logger.warn(`${method} ${url} ${statusCode} ${duration}ms`);
        }

        return throwError(() => error);
      }),
    );
  }
}
