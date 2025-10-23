import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async post(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<any>> {
    try {
      const response = this.httpService.post(url, data, config);
      return await lastValueFrom(response);
    } catch (error) {
      this.handleError(error, 'Error making POST request');
    }
  }

  async get(url: string, config?: any): Promise<AxiosResponse<any>> {
    try {
      const response = this.httpService.get(url, config);
      return await lastValueFrom(response);
    } catch (error) {
      this.handleError(error, 'Error making GET request');
    }
  }

  private handleError(error: unknown, defaultMessage: string): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data || defaultMessage,
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException(defaultMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
