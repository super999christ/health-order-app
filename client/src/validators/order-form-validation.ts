import { RegisterOptions } from "react-hook-form";

export const orderCreatorPhoneNumberValidatorOptions: RegisterOptions<any, 'orderCreatorPhoneNumber'> = {
  required: {
    value: true,
    message: 'Phone number is required'
  }
};

export const requestedItemValidatorOptions: RegisterOptions<any, 'requestedItem'> = {
  required: {
    value: true,
    message: 'Device name is required'
  }
};