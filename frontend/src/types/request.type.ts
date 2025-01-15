export type RequestType = {
    error: boolean;
    response: any;
    redirect: string | null;
}

export type RequestParams = {
    method: string;
    headers: Record<string, string>;
    body?: string;
}