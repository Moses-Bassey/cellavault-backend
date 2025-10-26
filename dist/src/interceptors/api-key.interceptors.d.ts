import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
export declare class ApiKeyInterceptor implements NestInterceptor {
    private readonly configService;
    constructor(configService: ConfigService);
    validateAPIKey(apikey: string): Promise<boolean>;
    resolveAPIKey(request: Request): Promise<boolean>;
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
