export type AuthNavStackParamList = {
  Welcome: undefined;
  SplashScreen: undefined;
  SignUpOnBoarding: undefined;
  Login: undefined;
};

export type AppNavStackParamList = {
  SplashScreen: undefined;
  Drawer: undefined;
  Filters: undefined;
  Package: { packageIds?: string[]; name?: string } | undefined;
  YourBooking: { packageId: string } | undefined;
  Success: { bookingId: string };
  BookingDetailsPage: { id?: string } | undefined;
  Vehicle: undefined;
  Register: undefined;
  CheckOut: undefined;
};
