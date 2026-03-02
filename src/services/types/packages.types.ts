export interface packagePayload {
  result: [];
  name: string;
  id: string;
  userId: string;
}

export interface ErrorResponse {
  status?: boolean;
  error: string;
}
