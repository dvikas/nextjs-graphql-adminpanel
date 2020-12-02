import { getIn, FormikTouched, FormikErrors } from 'formik';

export type FormError = string | { [key: string]: string } | undefined;

export const getError = <FormSchema>({
    touched,
    errors,
}: {
    touched: FormikTouched<FormSchema>;
    errors: FormikErrors<FormSchema>;
}) => (name: string): FormError => {
    return getIn(touched, name) ? getIn(errors, name) : undefined;
};
