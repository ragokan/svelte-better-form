import { $store, $writable } from "svelte-better-store";
import { $FormError, $FormOptions, $FormValidator } from "..";

export const $form = <Values extends object>(
  initialValue: Values,
  options: $FormOptions<Values> = {}
) => {
  const values = $store(initialValue);
  const errors = $writable({} as $FormError<Values>);
  const loading = $writable(false);

  const getValue = (key: keyof Values) => values.get()[key];
  const setValue = <key extends keyof Values>(key: key, value: Values[key]) =>
    values.update(key, () => value);

  const _validate = () => {
    const validationErrors = {};
    if (!options.validators) {
      return validationErrors;
    }
    Object.entries(options.validators || {}).forEach(
      ([key, validate]: [
        string,
        Array<$FormValidator<typeof key>> | $FormValidator<typeof key>
      ]) => {
        if (Array.isArray(validate)) {
          for (let index = 0; index < validate.length; index++) {
            const element = validate[index];
            const result = element(getValue(key));
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

  const submit = async () => {
    if (_validate() && options.onSubmit) {
      loading.set(true);
      await options.onSubmit(values.get());
      loading.set(false);
    }
  };

  return { values, errors, loading, getValue, setValue, submit };
};
