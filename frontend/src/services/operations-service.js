import {HttpUtils} from "../utils/http-utils.js";

export class OperationsService {
    static async getOperations(period) {
        const returnObject = {
            error: false,
            response: null,
            redirect: null
        };

        const result = await HttpUtils.request(`/operations?period=${period}`);

        if (result.redirect) {
            returnObject.redirect = result.redirect;
            returnObject.error = 'Требуется переадресация';
            return returnObject;
        }

        if (result.error || !result.response) {
            returnObject.error = 'Ошибка при получении списка данных. Обратитесь в поддержку.';
            return returnObject;
        }
        if (!Array.isArray(result.response)) {
            returnObject.error = 'Некорректный формат ответа сервера. Ожидался массив';
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    };

    static async getOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            operation: null
        };

        const result = await HttpUtils.request(`/operations/${id}`);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Ошибка при получении статьи баланса. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        returnObject.operation = result.response;
        return returnObject;
    };

    static async createOperation(data) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/operations`, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка при создании статьи баланса. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };

    static async editOperation(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/operations/${id}`, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка при изменении статьи баланса. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };

    static async deleteOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response &&
            result.response.error)) {
            returnObject.error = 'Ошибка при удалении статьи баланса. Обратитесь в поддержку.';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
                return returnObject;
            }
            return returnObject;
        }
        return returnObject;
    };
}