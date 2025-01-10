import {HttpUtils} from "../utils/http-utils.js";

export class CategoriesService {
    static async getAllCategories(type) {
        const returnObject = {
            error: false,
            redirect: null,
            categories: []
        };

        const result = await HttpUtils.request(`/categories/${type}`);

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

    static async getCategory(type, id) {
        const returnObject = {
            error: false,
            redirect: null,
            category: null
        };

        const result = await HttpUtils.request(`/categories/${type}/${id}`);

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

    static async createCategory(type, data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request(`/categories/${type}`, 'POST', true, data);

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

    static async editCategory(type, id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/categories/${type}/${id}`, 'PUT', true, data);

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

    static async deleteCategory(type, id) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/categories/${type}/${id}`, 'DELETE', true);

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