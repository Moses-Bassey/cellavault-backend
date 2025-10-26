import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
export declare class AxiosService {
    private readonly httpService;
    constructor(httpService: HttpService);
    post(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any>>;
    get(url: string, config?: any): Promise<AxiosResponse<any>>;
    private handleError;
}
