export interface vehiclePayload {
  name: string;
  id: string;
  description: string;
  enumType: string;
  displayName: string;
}

export interface ErrorResponse {
  status?: boolean;
  error: string;
}
