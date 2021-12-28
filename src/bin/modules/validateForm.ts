import { BetterWritable } from "svelte-better-store";
import { betterFormError, betterFormOptions, betterFormValidator } from "../types";

export const __validateForm = <Values>(
  values: BetterWritable<Values>,
  validators: betterFormOptions<Values> | undefined,
  errors: BetterWritable<betterFormError<Values>>
) => {
  const validationErrors = {};
  if (!validators) {
    return validationErrors;
  }
  Object.entries(validators || {}).forEach(
    ([key, validate]: [
      string,
      Array<betterFormValidator<typeof key>> | betterFormValidator<typeof key>
    ]) => {
      if (Array.isArray(validate)) {
        for (let index = 0; index < validate.length; index++) {
          const element = validate[index];
          const result = element(values.get()[key]);
          if (result) {
            validationErrors[key] = result;
            return;
          }
        }
      } else {
        const result = validate(values.get()[key]);
        if (result) {
          validationErrors[key] = result;
        }
      }
    }
  );
  errors.set(validationErrors as betterFormError<Values>);
  return Object.keys(validationErrors).length === 0;
};
