import {HttpUtils} from "../utils/http-utils.js";

export class AuthService {
    static async logIn(data) {
        try {
            const result = await HttpUtils.request('/login', 'POST', false, data);

            if (result.error || !this.validateResponseLog(result.response)) {
                return false;
            }
            return result.response;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    static async signUp(data) {
        try {
            const result = await HttpUtils.request('/signup', 'POST', false, data);

            if (result.error || !this.validateResponseSign(result.response)) {
                console.log('SignUp error:', result.response?.message);
                alert(result.response?.message)
                return false;
            }
            return result.response;
        } catch (error) {
            console.error('SignUp error:', error);
            return false;
        }
    };

    static async logOut(data) {
        try {
            const result = await HttpUtils.request('/logout', 'POST', false, data);
            console.log(result.response.message);
        } catch (e) {
            console.log(e);
        }
    };

    static validateResponseLog(response) {
        return (
            response &&
            response.tokens?.accessToken &&
            response.tokens?.refreshToken &&
            response.user?.id &&
            response.user?.name &&
            response.user?.lastName
        )
    };

    static validateResponseSign(response) {
        return (
            response &&
            response.user?.id &&
            response.user?.email &&
            response.user?.name &&
            response.user?.lastName
        )
    };
}