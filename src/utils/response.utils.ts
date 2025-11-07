import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  status: 'success' | 'error'; // success or error
  message: string;
  data?: T | null;
  error?: string | string[];
  statusCode?: number;
}

export class ResponseUtil {
  static success<T>(
    data: T | null,
    message = 'Request successful',
    statusCode: number,
  ): ApiResponse<T> {
    return {
      status: 'success',
      statusCode,
      message,
      data,
    };
  }

  static error(
    message: string,
    error: string | string[] = '',
    statusCode?: number,
  ): ApiResponse<null> {
    return {
      status: 'error',
      message,
      error,
      statusCode,
    };
  }

  static errorFromException(
    error: unknown,
    defaultMessage = 'An error occurred',
    defaultStatusCode = 500,
  ): ApiResponse<null> {
    const message = error instanceof Error ? error.message : defaultMessage;
    const statusCode =
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof error.status === 'number'
        ? error.status
        : defaultStatusCode;

    return {
      status: 'error',
      message,
      statusCode,
    };
  }

  static handleResponse<T>(
    data: T | null,
    message: string,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      status: 'success',
      statusCode,
      message,
      data,
    };
  }
}
