//Yup Validator
import * as yup from 'yup';

//CheckOut Card Details
export const CardDetailsSchema = yup.object().shape({
  holder: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z\s]+$/,
      'Cardholder name must contain only letters and spaces',
    )
    .required('Cardholder name is required'),

  cardNumber: yup
    .number()
    .typeError('Card number must be a numeric value') // Handles non-numeric input
    .test(
      'len',
      'Card number must be exactly 16 digits',
      (value: any) => value && value.toString().length === 16,
    )
    .required('Card number is required'),

  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .required('Expiry date is required'),

  CVV: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .required('CVV is required'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('Required'),
  saveCard: yup.boolean(),
});
