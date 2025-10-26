export declare class PasswordUtil {
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, hash: string): Promise<boolean>;
}
export declare const generatePassword: (length: number) => string;
