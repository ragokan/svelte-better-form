import { betterWritable } from "svelte-better-store";
import { betterFormError, betterFormOptions } from "./types";
import { __validateForm } from "./modules/validateForm";
import { noop, onDestroy, onMount } from "svelte/internal";

export const betterForm = <Values extends object>(
  initialValue: Values,
  options: betterFormOptions<Values> = { validateOnChange: true }
) => {
  const values = betterWritable(initialValue);
  const errors = betterWritable({} as betterFormError<Values>);
  const loading = betterWritable(false);

  let _isValidated = false;

  const getValue = <Key extends keyof Values>(key: Key): Values[Key] => values.get()[key];
  const setValue = <Key extends keyof Values>(key: Key, value: Values[Key]) =>
    values.update((store) => ({ ...store, [key]: value }));

  const _validate = () => {
    const status = __validateForm(values, options.validators, errors);
    if (!_isValidated && !status) {
      _isValidated = true;
    }
    return status;
  };

  if (options.validateOnChange) {
    let unsub = noop;
    onMount(() => {
      unsub = values.subscribe(() => {
        if (_isValidated) {
          _validate();
        }
      });
    });
    onDestroy(unsub);
  }

  const submit = async () => {
    if (_validate() && options.onSubmit) {
      loading.set(true);
      await options.onSubmit(values.get());
      loading.set(false);
    }
  };

  return { values, errors, loading, getValue, setValue, submit };
};
