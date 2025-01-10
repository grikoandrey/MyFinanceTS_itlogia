import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.fullNameElement, options: {pattern: /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/}},
            {element: this.rePasswordElement, options: {compareTo: this.passwordElement.value}},

        ];

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    };

    findElements() {
        this.fullNameElement = document.getElementById('user');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rePasswordElement = document.getElementById('rePassword');
    }

    async signup() {
        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.rePasswordElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }
        if (ValidationUtils.validateForm(this.validations)) {
            let fullName = this.fullNameElement.value.trim();
            let nameParts = fullName.split(' ');
            if (nameParts.length === 2) {
                this.nameElement = nameParts[1];
                this.lastNameElement = nameParts[0];
            }
            //запрос
            const signupResult = await AuthService.signUp({
                name: this.nameElement,
                lastName: this.lastNameElement,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordElement.value
            });
            if (signupResult) {
                sessionStorage.setItem('email', signupResult.user.email);
                return this.openNewRoute('/login');
            } else {
                this.clearInputFields();
            }
        }
    };
    clearInputFields() {
        this.fullNameElement.value = '';
        this.emailElement.value = '';
        this.passwordElement.value = '';
        this.rePasswordElement.value = '';
    }
}