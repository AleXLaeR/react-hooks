import { useState, useCallback, ChangeEvent } from 'react';

type ChangeEventElement = HTMLInputElement | HTMLTextAreaElement;
type FormFieldValue = string | number | boolean;

type UseFormFieldProps = {
  initialValue?: FormFieldValue;
  validator?: (value: FormFieldValue) => boolean;
};

type UseFormFieldReturnType = {
  value: FormFieldValue;
  touched: boolean;
  error?: string;
  handleChange: (e: ChangeEvent<ChangeEventElement>) => void;
  reset: () => void;
};

const defaultValidator = () => true;

export default function useFormField({
  initialValue = '',
  validator = defaultValidator,
}: UseFormFieldProps): UseFormFieldReturnType {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string>();

  const handleChange = useCallback(
    ({ target }: ChangeEvent<ChangeEventElement>) => {
      setValue(target.value);
      setTouched(true);
      setError(!validator(target.value) ? 'Invalid value' : '');
    },
    [validator],
  );

  const reset = useCallback(() => {
    setValue(initialValue);
    setTouched(false);
    setError('');
  }, [initialValue]);

  return {
    value,
    touched,
    error,
    handleChange,
    reset,
  };
};
