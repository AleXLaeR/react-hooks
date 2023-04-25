import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

type ValidationRule<T> = (value: T) => T | null;
type ValidationSchema<T> = Record<string, ValidationRule<T>[]>;
type ValidationResult<T> = Record<string, T | null>;

interface UseFormValidationProps<T> {
  initialValues: Record<string, T>;
  validationSchema: ValidationSchema<T>;
}

interface UseFormValidationResult<T> {
  values: Record<string, T>;
  errors: ValidationResult<T>;
  isSubmitting: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function useFormValidation<T = string>({
  initialValues,
  validationSchema,
}: UseFormValidationProps<T>): UseFormValidationResult<T> {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationResult<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) return;

    const validationErrors: ValidationResult<T> = {};

    for (const fieldName in validationSchema) {
      if (fieldName in validationSchema) {
        const rules = validationSchema[fieldName];

        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const errorMessage = rule(values[fieldName]);

          if (errorMessage) {
            validationErrors[fieldName] = errorMessage;
            break;
          }
        }
      }
    }

    setErrors(validationErrors);
    setIsSubmitting(false);
  }, [isSubmitting, validationSchema, values]);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setValues((prevValues) => ({ ...prevValues, [name]: value as T }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
  };

  return { values, errors, isSubmitting, handleChange, handleSubmit };
}
