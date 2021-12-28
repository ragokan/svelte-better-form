import { $writable } from "svelte-better-store";
import { $FormError, $FormOptions } from "./types";
import { __validateForm } from "./modules/validateForm";

export const $form = <Values extends object>(
  initialValue: Values,
  options: $FormOptions<Values> = {}
) => {
  const values = $writable(initialValue);
  const errors = $writable({} as $FormError<Values>);
  const loading = $writable(false);

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

$form({ name: "rag", age: 25 }).getValue("name");
