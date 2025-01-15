export type Route = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string | boolean,
    load?(): void,
    scripts?: [string],
}