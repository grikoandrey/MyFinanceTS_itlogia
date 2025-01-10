import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class LogIn {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
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

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    };

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember');
    }

    setEmailFromSession() {
        const email = sessionStorage.getItem('email');
        if (email) {
            this.emailElement.value = email; // Подставляем email в поле
            //очищаем sessionStorage после подстановки, чтобы не оставить email
            sessionStorage.removeItem('email');
        }
    }

    async login() {
        if (ValidationUtils.validateForm(this.validations)) {
            //отправляем запрос
            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });
            if (loginResult) {
                //обрабатываем ответ
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName,
                });
                return this.openNewRoute('/');
            }
        }
    };
}