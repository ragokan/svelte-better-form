export type betterFormValidator<T> = (value: T) => string | void;

export type betterFormError<Values> = { [key in keyof Values]: string | null };

export interface betterFormOptions<Values> {
  validators?: {
    [key in keyof Partial<Values>]:
      | betterFormValidator<Values[key]>
      | Array<betterFormValidator<Values[key]>>;
  };

  onSubmit?: (values: Values) => void | Promise<void>;
}
