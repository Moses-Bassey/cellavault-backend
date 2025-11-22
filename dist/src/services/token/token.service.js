"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const date_fns_1 = require("date-fns");
const token_repository_1 = require("./repositories/token.repository");
const randomstring = __importStar(require("randomstring"));
const token_enum_1 = require("../../enums/token.enum");
let TokenService = class TokenService {
    jwtService;
    tokenRepository;
    configService;
    constructor(jwtService, tokenRepository, configService) {
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.configService = configService;
    }
    async validateOtp(input) {
        const { token, email, phoneNo, subject: subject } = input;
        let userToken = null;
        switch (subject) {
            case token_enum_1.TokenSubject.SIGN_UP_EMAIL:
                userToken = await this.tokenRepository.findByEmailToken(token, email || "");
                break;
            case token_enum_1.TokenSubject.SIGN_UP_PHONE:
                userToken = await this.tokenRepository.findByPhoneToken(token, phoneNo || "");
                break;
            default:
                throw new common_1.BadRequestException('Invalid OTP Subject');
        }
        if (!userToken)
            throw new common_1.BadRequestException('Invalid OTP');
        const isExpired = (0, date_fns_1.isAfter)(new Date(), userToken.expiry);
        if (isExpired) {
            await this.deleteOTPtoken(userToken.id);
            throw new common_1.BadRequestException('Invalid or expired Token');
        }
        return { token: userToken.token };
    }
    async validatePasswordResetOtp(input) {
        const { token, email, subject } = input;
        let userToken = null;
        userToken = await this.tokenRepository.findByEmailToken(token, email || "");
        if (!userToken)
            throw new common_1.BadRequestException('Invalid Password Reset OTP');
        const isExpired = (0, date_fns_1.isAfter)(new Date(), userToken.expiry);
        if (isExpired) {
            await this.deleteOTPtoken(userToken.id);
            throw new common_1.BadRequestException('Invalid or expired Token');
        }
        return { token: userToken.token };
    }
    async verifyOTP(input) {
        console.log(input);
        const { token, email, subject: subject } = input;
        let userToken = await this.tokenRepository.findByTokenEmailAndSubject(token, email || "", subject || token_enum_1.TokenSubject.FORGOT_PASSWORD);
        if (!userToken) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const isExpired = (0, date_fns_1.isAfter)(new Date(), userToken.expiry);
        if (isExpired) {
            await this.deleteOTPtoken(userToken.id);
            throw new common_1.BadRequestException('Invalid or expired Token');
        }
        await this.deleteOTPtoken(userToken.id);
        return userToken;
    }
    async verifySignUpOTP(dto) {
        const { token, email, phoneNo, subject: otpSubject } = dto;
        let userToken = null;
        switch (otpSubject) {
            case token_enum_1.TokenSubject.SIGN_UP_EMAIL:
                userToken = await this.tokenRepository.findByEmailToken(token, email || "");
                break;
            case token_enum_1.TokenSubject.SIGN_UP_PHONE:
                userToken = await this.tokenRepository.findByPhoneToken(token, phoneNo || "");
                break;
            case token_enum_1.TokenSubject.SIGN_UP_PHONE:
                userToken = await this.tokenRepository.findByPhoneToken(token, phoneNo || "");
                break;
            default:
                throw new common_1.BadRequestException('Invalid OTP Subject');
        }
        if (!userToken)
            throw new common_1.BadRequestException('Invalid OTP');
        await this.deleteOTPtoken(userToken.id);
        return { token: userToken.token };
    }
    async generateOTPtoken(payload) {
        const token = randomstring.generate({
            length: 6,
            charset: 'numeric',
        });
        const created = await this.tokenRepository.create({
            ...payload,
            token: token,
            tokenType: token_enum_1.TokenType.OTP,
        });
        return {
            ...created,
            token: token,
        };
    }
    async generateJWTtoken(payload) {
        return await this.jwtService.signAsync(payload);
    }
    async verifyJWTtoken(token) {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch (error) {
            throw new common_1.BadRequestException('Unable To Verify Token');
        }
    }
    async deleteOTPtoken(id) {
        await this.tokenRepository.delete(id);
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        token_repository_1.TokenRepository,
        config_1.ConfigService])
], TokenService);
//# sourceMappingURL=token.service.js.map