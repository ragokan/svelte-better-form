import { $Writable } from "svelte-better-store";
import { $FormError, $FormOptions, $FormValidator } from "../types";

export const __validateForm = <Values>(
  values: $Writable<Values>,
  validators: $FormOptions<Values> | undefined,
  errors: $Writable<$FormError<Values>>
) => {
  const validationErrors = {};
  if (!validators) {
    return validationErrors;
  }
  Object.entries(validators || {}).forEach(
    ([key, validate]: [string, Array<$FormValidator<typeof key>> | $FormValidator<typeof key>]) => {
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
  errors.set(validationErrors as $FormError<Values>);
  return Object.keys(validationErrors).length === 0;
};
