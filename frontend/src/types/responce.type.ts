import {EditIncExpType} from "./editIncExpType";
import {CategoryType} from "./category.type";

export type ReturnObject<T = string | null> = {
    error: boolean | string;
    redirect: string | null;
    response?: T | null;
    categories?: CategoryType[];
    category?: CategoryType | null;
    id?: string | null;
    operation?: EditIncExpType | null;
};