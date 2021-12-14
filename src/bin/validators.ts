import type { BetterFormValidator } from "../index";

export const minLengthValidator =
  (minLength: number, errorMessage: string): BetterFormValidator<string> =>
  (val) =>
    val.length < minLength && errorMessage;

export const maxLengthValidator =
  (maxLength: number, errorMessage: string): BetterFormValidator<string> =>
  (val) =>
    val.length > maxLength && errorMessage;

export const requiredValidator =
  (errorMessage: string): BetterFormValidator<string | number | null> =>
  (val) =>
    (!val || (typeof val === "string" && val.length === 0)) && errorMessage;

export const emailValidator =
  (errorMessage: string): BetterFormValidator<string> =>
  (val) =>
    !_emailRegex.test(val) && errorMessage && errorMessage;

// From https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const _emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
