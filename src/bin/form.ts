import { betterWritable } from "svelte-better-store";
import { betterFormError, betterFormOptions } from "./types";
import { __validateForm } from "./modules/validateForm";

export const betterForm = <Values extends object>(
  initialValue: Values,
  options: betterFormOptions<Values> = {}
) => {
  const values = betterWritable(initialValue);
  const errors = betterWritable({} as betterFormError<Values>);
  const loading = betterWritable(false);

  const getValue = <Key extends keyof Values>(key: Key): Values[Key] => values.get()[key];
  const setValue = <Key extends keyof Values>(key: Key, value: Values[Key]) =>
    values.update((store) => ({ ...store, [key]: value }));

  const _validate = () => __validateForm(values, options.validators, errors);

  const submit = async () => {
    if (_validate() && options.onSubmit) {
      loading.set(true);
      await options.onSubmit(values.get());
      loading.set(false);
    }
  };

  return { values, errors, loading, getValue, setValue, submit };
};

betterForm({ name: "rag", age: 25 }).getValue("name");
