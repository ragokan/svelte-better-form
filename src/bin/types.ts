export type $FormValidator<T> = (value: T) => string | void;

export type $FormError<Values> = { [key in keyof Values]: string | null };

export interface $FormOptions<Values> {
  validators?: {
    [key in keyof Partial<Values>]:
      | $FormValidator<Values[key]>
      | Array<$FormValidator<Values[key]>>;
  };

  onSubmit?: (values: Values) => void | Promise<void>;
}
