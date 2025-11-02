import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ClientDeviceService } from '../services/client-device.service';
export declare class ClientDeviceGuard implements CanActivate {
    private readonly clientDeviceService;
    constructor(clientDeviceService: ClientDeviceService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
