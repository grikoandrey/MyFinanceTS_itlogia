export type ValidationType = {
        element: HTMLInputElement | HTMLSelectElement | null,
        options?: ValidationOptions,
}
export type ValidationOptions = {
    pattern?: RegExp,
    compareTo?: string,
}