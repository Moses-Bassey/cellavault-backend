import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { ResponseUtil } from 'src/utils/response.utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'An unexpected error occurred';

    // 1. Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
      }
    } 
    // 2. Handle Sequelize Unique Constraint Errors (e.g. duplicate category name)
    else if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors?.[0]?.message || 'Record already exists';
    } 
    // 3. Handle Other Sequelize Database Validation Errors
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors?.[0]?.message || 'Validation error';
    } 
    // 4. Handle Generic Errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    // Explicitly send "error" status for non-2xx responses
    response.status(status).json({
      status: 'error',
      statusCode: status,
      message: message,
      data: null,
    });
  }
}