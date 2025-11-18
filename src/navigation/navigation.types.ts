export type AuthNavStackParamList = {
  Welcome: undefined;
  SplashScreen: undefined;
  SignUpOnBoarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email?: string } | undefined;
};

export type AppNavStackParamList = {
  SplashScreen: undefined;
  Drawer: undefined;
  Filters: undefined;
  PackageDetails: { packageId: string }; 
  PrePackage:
    | {
        packageIds?: string[];
        name?: string;
        packages?: Array<{ id: string; type?: string; pricing?: number }>; // ← add this
      }
    | undefined;
  Package: { packageIds?: string[]; name?: string } | undefined;
  YourBooking: { packageId: string } | undefined;
  Success: { bookingId: string };
  BookingDetailsPage: { id?: string } | undefined;
  Vehicle: { forceCityModal?: boolean } | undefined;
  CheckOut: undefined;
  BuyPackage: { packageId: string };
};
