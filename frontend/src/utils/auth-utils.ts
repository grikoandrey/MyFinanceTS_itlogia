import config from "../config/config";

export class AuthUtils {

    static accessTokenKey: string = 'accessToken';
    static refreshTokenKey: string = 'refreshToken';
    static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: object | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    };

    static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    };

    public static getAuthInfo(key: string | null): string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return null;
            // {
            //     [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
            //     [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
            //     [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            // }
        }
    };
    static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(`${config.api}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });
            if (response && response.status === 200) {
                const data = await response.json();
                const tokens = data.tokens;
                if (tokens && !tokens.error) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                    result = true;
                }
            }
        }
        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}