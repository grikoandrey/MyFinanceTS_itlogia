import {HttpUtils} from "../utils/http-utils";
import {RequestType} from "../types/request.type";
import {LoginType, LogoutType, SignType} from "../types/auth-service.type";

interface ValidateResponseLog {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: {
        id: string;
        name: string;
        lastName: string;
    };
}

interface ValidateResponseSign {
    user: {
        id: string;
        email: string;
        name: string;
        lastName: string;
    };
}

export class AuthService {
   public static async logIn(data: LoginType): Promise<any> {
        try {
            const result: RequestType = await HttpUtils.request('/login', 'POST', false, data);

            if (result.error || !this.validateResponseLog(result.response)) {
                return false;
            }
            return result.response;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    static async signUp(data: SignType): Promise<any> {
        try {
            const result: RequestType = await HttpUtils.request('/signup', 'POST', false, data);

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

    static async logOut(data: LogoutType): Promise<void> {
        try {
            const result: RequestType = await HttpUtils.request('/logout', 'POST', false, data);
            console.log(result.response.message);
        } catch (e) {
            console.log(e);
        }
    };

    private static validateResponseLog(response: ValidateResponseLog): boolean {
        return !!(
            response &&
            response.tokens?.accessToken &&
            response.tokens?.refreshToken &&
            response.user?.id &&
            response.user?.name &&
            response.user?.lastName
        )
    };

    private static validateResponseSign(response: ValidateResponseSign): boolean {
        return !!(
            response &&
            response.user?.id &&
            response.user?.email &&
            response.user?.name &&
            response.user?.lastName
        )
    };
}