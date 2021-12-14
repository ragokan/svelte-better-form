import { betterStore, betterWritable } from "svelte-better-store";

export type BetterFormValidator<T> = (value: T) => string | void;

export type BetterFormError<Values> = { [key in keyof Values]: string | null };

export interface BetterFormOptions<Values> {
  validators?: {
    [key in keyof Partial<Values>]:
      | BetterFormValidator<Values[key]>
      | Array<BetterFormValidator<Values[key]>>;
  };

  onSubmit?: (values: Values) => Promise<void>;
}

export const createBetterForm = <Values extends object>(
  initialValue: Values,
  options: BetterFormOptions<Values> = {}
) => {
  const values = betterStore(initialValue);
  const errors = betterWritable({} as BetterFormError<Values>);
  const loading = betterWritable(false);

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
        Array<BetterFormValidator<typeof key>> | BetterFormValidator<typeof key>
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
    errors.set(validationErrors as BetterFormError<Values>);
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
