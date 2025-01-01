import {CAR_DETAIL, WHITE_CAR, TYRE, SILVER_CAR, RED_CAR} from '../assets';

export const BOOKINGS = [
  {
    bookingId: 'SM12911234',
    package: 'Everyday Classic',
    detail: '1 steam car wash for 60 SAR',
  },
  {
    bookingId: 'SM24567890',
    package: 'Premium Deluxe',
    detail: '2 full car washes for 120 SAR',
  },
  {
    bookingId: 'SM87654321',
    package: 'Basic Wash',
    detail: '1 exterior car wash for 30 SAR',
  },
  {
    bookingId: 'SM12345678',
    package: 'Gold Member',
    detail: 'Unlimited washes for 300 SAR/month',
  },
  {
    bookingId: 'SM98765432',
    package: 'Quick Shine',
    detail: '1 express wash for 20 SAR',
  },
];

export const SERVICE = [
  {
    service: 'Car Service',
    rating: 4.5,
    reviewsCount: 706,
    certified: true,
    offerings: [
      {
        serviceName: 'Car Detailing',
        price: '20 SAR',
      },
    ],
  },
  {
    service: 'Auto Experts',
    rating: 4.8,
    reviewsCount: 950,
    certified: true,
    offerings: [
      {
        serviceName: 'Full Car Wash',
        price: '25 SAR',
      },
    ],
  },
  {
    service: 'Speedy Repairs',
    rating: 4.2,
    reviewsCount: 550,
    certified: false,
    offerings: [
      {
        serviceName: 'Tire Replacement',
        price: '40 SAR',
      },
    ],
  },
  {
    service: 'Luxury Auto Care',
    rating: 4.9,
    reviewsCount: 1200,
    certified: true,
    offerings: [
      {
        serviceName: 'Interior Cleaning',
        price: '30 SAR',
      },
    ],
  },
  {
    service: 'DriveSafe Mechanics',
    rating: 3.8,
    reviewsCount: 320,
    certified: false,
    offerings: [
      {
        serviceName: 'Engine Oil Change',
        price: '35 SAR',
      },
    ],
  },
];

export const SERVICES = [
  {
    label: 'Car Detailing',
    img: CAR_DETAIL,
  },
  {
    label: 'Tyre Replacement',
    img: TYRE,
  },
  {
    label: 'Oil Change',
    img: CAR_DETAIL,
  },
];
export const VEHICLEDATA = [
  {
    color: '#E1DFA4',
    text: 'Sedan, coupe, sport, mini or similar',
    img: SILVER_CAR,
  },
  {
    color: '#E3ECF1',
    text: 'SUV 5 seater, short pickups or similar',
    img: WHITE_CAR,
  },
  {
    color: '#F4E3E5',
    text: 'SUV 7 seater, long pickups or similar',
    img: RED_CAR,
  },
];
export const PACKAGE_DATA = [
  {
    id: '1',
    title: 'Mr Silver',
    description: 'Monthly Package - SAR 90',
  },
  {
    id: '2',
    title: 'Mr Gold',
    description: 'Monthly Package - SAR 120',
  },
  {
    id: '3',
    title: 'Mr Platinum',
    description: 'Monthly Package - SAR 150',
  },
  {
    id: '4',
    title: 'Mr Platinum',
    description: 'Monthly Package - SAR 150',
  },
  {
    id: '5',
    title: 'Mr Platinum',
    description: 'Monthly Package - SAR 150',
  },
];

export const ACCESS_TOKEN = 'access_token';

export const REFRESH_TOKEN = 'refresh_token';

export const USER_INFO = 'data';
