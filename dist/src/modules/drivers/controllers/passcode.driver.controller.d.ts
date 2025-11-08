import type { Request as ExpressRequest } from 'express';
import { PasscodeService } from '../../auth/services/passcode.service';
import { CreatePasscodeDto, VerifyPasscodeDto, ResetPasscodeDto } from '../../auth/dto/passcode.dto';
import { JwtAuthPayload } from '../../auth/auth.interface';
export declare class PasscodeDriverController {
    private readonly passcodeService;
    constructor(passcodeService: PasscodeService);
    createPasscode(input: CreatePasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        id: string;
        userId: string;
        userType: import("../../../enums").UserType;
    }>>;
    updatePasscode(input: CreatePasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        id: any;
        userId: any;
        userType: any;
    }>>;
    getPasscode(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        hasPasscode: boolean;
    }>>;
    verifyPasscode(input: VerifyPasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{
        verified: boolean;
    }>>;
    requestResetPasscode(req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
    resetPasscode(input: ResetPasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
}
