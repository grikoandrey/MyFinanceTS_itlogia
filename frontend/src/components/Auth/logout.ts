import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {NewRoute} from "../../types/newRoute.type";

export class Logout {
    readonly openNewRoute: NewRoute

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ||
            !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {
        const refreshToken: string | null = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
        if (refreshToken) {
            await AuthService.logOut({ refreshToken });
        }
        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login').then();
    }
}