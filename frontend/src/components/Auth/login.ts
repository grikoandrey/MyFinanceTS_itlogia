import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";

interface LoginResult {
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

export class LogIn {
    readonly openNewRoute: NewRoute
    readonly validations: ValidationType[] = [];

    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private rememberMeElement: HTMLInputElement | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.findElements();

        this.validations = [
            {
                element: this.passwordElement,
                options: {pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/}
            },
            {
                element: this.emailElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
            },
        ];
        this.setEmailFromSession();

        const processBtnElement: HTMLElement | null = document.getElementById('process-button');
        if (processBtnElement) {
            processBtnElement.addEventListener('click', this.login.bind(this));
        }

    };

    private findElements(): void {
        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.rememberMeElement = document.getElementById('remember') as HTMLInputElement | null;
    }

    private setEmailFromSession(): void {
        const email: string | null = sessionStorage.getItem('email');
        if (email && this.emailElement) {
            this.emailElement.value = email; // Подставляем email в поле

            sessionStorage.removeItem('email');
        }
    }

    public async login(): Promise<void> {
        if (!this.emailElement || !this.passwordElement || !this.rememberMeElement) {
            console.error("Form elements are not initialized.");
            return;
        }
        if (ValidationUtils.validateForm(this.validations)) {
            //отправляем запрос
            const loginResult: LoginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });
            if (loginResult && loginResult.tokens && loginResult.user) {
                //обрабатываем ответ
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName,
                });
                this.openNewRoute('/').then();
                return;
            }
        }
    };
}