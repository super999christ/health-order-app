import { RegisterOptions } from "react-hook-form";

export const orderCreatorPhoneNumberValidatorOptions: RegisterOptions<any, 'orderCreatorPhoneNumber'> = {
};

export const requestedItemValidatorOptions: RegisterOptions<any, 'requestedItem'> = {
  required: {
    value: true,
    message: 'Device name is required'
  }
};