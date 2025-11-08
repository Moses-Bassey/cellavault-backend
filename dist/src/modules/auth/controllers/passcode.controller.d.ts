import type { Request as ExpressRequest } from 'express';
import { PasscodeService } from '../services/passcode.service';
import { CreatePasscodeDto, VerifyPasscodeDto, ResetPasscodeDto, ChangePasscodeDto } from '../dto/passcode.dto';
import { JwtAuthPayload } from '../auth.interface';
export declare class PasscodeController {
    private readonly passcodeService;
    constructor(passcodeService: PasscodeService);
    createPasscode(input: CreatePasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
    changePasscode(input: ChangePasscodeDto, req: ExpressRequest & {
        user: JwtAuthPayload;
    }): Promise<import("src/utils/response.utils").ApiResponse<{}>>;
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
