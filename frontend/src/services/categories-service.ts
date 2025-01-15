import {HttpUtils} from "../utils/http-utils";
import {RequestType} from "../types/request.type";
import {ReturnObject} from "../types/responce.type";

export class CategoriesService {
    public static async getAllCategories(type: string): Promise<ReturnObject> {
        const returnObject: ReturnObject = {
            error: false,
            redirect: null,
            categories: [],
        };

        const result: RequestType = await HttpUtils.request(`/categories/${type}`);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка получения всех категорий доходов. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.categories = result.response;
        return returnObject;
    };

    public static async getCategory(type: string, id: string): Promise<ReturnObject> {
        const returnObject: ReturnObject = {
            error: false,
            redirect: null,
            category: null,
        };

        const result: RequestType = await HttpUtils.request(`/categories/${type}/${id}`);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Ошибка получения категории дохода. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.category = result.response;
        return returnObject;
    };

    public static async createCategory(type: string, data: any):Promise<ReturnObject> {
        const returnObject: ReturnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result: RequestType = await HttpUtils.request(`/categories/${type}`, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка создания категории дохода. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    };

    public static async editCategory(type: string, id: string, data: any): Promise<ReturnObject> {
        const returnObject: ReturnObject = {
            error: false,
            redirect: null,
        };

        const result: RequestType = await HttpUtils.request(`/categories/${type}/${id}`, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка обновления категории дохода. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };

    public static async deleteCategory(type: string, id: string): Promise<ReturnObject> {
        const returnObject: ReturnObject = {
            error: false,
            redirect: null,
        };

        const result: RequestType = await HttpUtils.request(`/categories/${type}/${id}`, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка удаления категории дохода. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };
}