import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async validateAPIKey(apikey: string) {
    const validApiKey = this.configService.get<string>('app.apiKey');
    if (apikey === validApiKey) {
      return true;
    }
    throw new BadRequestException('Invalid API product key');
  }

  async resolveAPIKey(request: Request) {
    const errorMessage = 'No x-product-key header';
    const productKey = request.headers['x-product-key'] as string;

    if (!productKey) throw new BadRequestException(errorMessage);
    return await this.validateAPIKey(productKey);
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    // Skip API key validation for root path
    if (path !== '/') {
      const errorMessage = 'No x-product-key header';
      const productKey = request.headers['x-product-key'] as string;

      if (!productKey) {
        throw new BadRequestException(errorMessage);
      }

      // Actually validate the API key
      await this.validateAPIKey(productKey);
    }

    return next.handle().pipe();
  }
}
