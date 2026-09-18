export interface PaginationOptions {
  search?: string;
  limit: number;
  cursor?: { createdAt: Date; id: string };
  gender?: string | null;
}
