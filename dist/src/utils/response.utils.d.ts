export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data?: T | null;
    error?: string | string[];
    statusCode?: number;
}
export declare class ResponseUtil {
    static success<T>(data: T | null, message: string | undefined, statusCode: number): ApiResponse<T>;
    static error(message: string, error?: string | string[], statusCode?: number): ApiResponse<null>;
    static errorFromException(error: unknown, defaultMessage?: string, defaultStatusCode?: number): ApiResponse<null>;
}
