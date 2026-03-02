export interface LoginSignInPayload {
  user: {
    balance: number;
    pts: number;
    bookings: [];
    ratings: [];
    email: string;
    name: string;
    isEmailVerified: boolean;
    id: string;
    role: string;
  };
  tokens: {
    access: {
      token: string;
    };
    refresh: {
      token: string;
    };
  };
}

export interface ErrorResponse {
  status?: boolean;
  error: string;
}
