import config from "../config/config.js";
import {AuthUtils} from "./auth-utils.js";

export class HttpUtils {
    static async request(url, method = "GET", useAuth = true, body = null) {
        const result = {
            error: false,
            response: null,
            redirect : null,
        }

        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(`${config.api}${url}`, params); // Запрос к серверу
            // Сохраняем JSON-ответ в result.response
            result.response = await response.json();
            // Добавляем проверку статуса HTTP здесь, чтобы использовать response
            if (response.status < 200 || response.status > 299) {
                result.error = true;

                if (useAuth && response.status === 401) {
                    // Обработка токена
                    if (!token) {
                        result.redirect = '/login';
                    } else {
                        const updateTokenResult = await AuthUtils.updateRefreshToken();
                        if (updateTokenResult) {
                            // Повторный запрос с обновленным токеном
                            return this.request(url, method, useAuth, body);
                        } else {
                            result.redirect = '/login';
                        }
                    }
                }
            }
        } catch (error) {
            result.error = true;
            return result;
        }
        return result;
    }
}