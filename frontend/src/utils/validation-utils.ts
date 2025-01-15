import {ValidationOptions, ValidationType} from "../types/validation.type";

export class ValidationUtils {

    public static validateForm(validations: ValidationType[]): boolean {
        let isValid: boolean = true;

        for (let i = 0; i < validations.length; i++) {
            const validation: ValidationType = validations[i];
            if (validation.options) {
                if (!ValidationUtils.validateFields(validation.element as HTMLInputElement, validation.options)) {
                    isValid = false;
                }
            }
        }
        return isValid;
    };

    private static validateFields(element: HTMLInputElement, options: ValidationOptions): boolean {
        let condition: any = element.value;
        if (options) {
            if (options.pattern) {
                condition = element.value && element.value.match(options.pattern);
            } else if (options.compareTo) {
                condition = element.value && element.value === options.compareTo;
            }
        }
        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        } else {
            element.classList.add('is-invalid');
            return false;
        }
    };
}