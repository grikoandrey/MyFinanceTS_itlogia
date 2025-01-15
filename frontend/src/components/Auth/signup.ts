import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";

export class SignUp {
    readonly openNewRoute: NewRoute;
    readonly validations: ValidationType[] = [];

    private fullNameElement: HTMLInputElement | null = null;
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private rePasswordElement: HTMLInputElement | null = null;

    private nameElement: string = '';
    private lastNameElement: string = '';

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.findElements();

        if (this.passwordElement) {
            this.validations = [
                {element: this.fullNameElement, options: {pattern: /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/}},
                {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
                {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/}},
                {element: this.rePasswordElement, options: {compareTo: this.passwordElement.value}},
            ];
        }

        const processBtnElement: HTMLElement | null = document.getElementById('process-button');
        if (processBtnElement) {
            processBtnElement.addEventListener('click', this.signup.bind(this));
        }
    };

    private findElements(): void {
        this.fullNameElement = document.getElementById('user') as HTMLInputElement | null;
        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.rePasswordElement = document.getElementById('rePassword') as HTMLInputElement | null;
    }

    public async signup(): Promise<void> {
        for (let i = 0; i < this.validations.length; i++) {
            const valid = this.validations[i];
            if (this.passwordElement && valid.options && (valid.element === this.rePasswordElement)) {
                valid.options.compareTo = this.passwordElement.value;
            }
        }
        if (ValidationUtils.validateForm(this.validations) && this.fullNameElement) {
            let fullName: string = this.fullNameElement.value.trim();
            let nameParts = fullName.split(' ');
            if (nameParts.length === 2) {
                this.nameElement = nameParts[1];
                this.lastNameElement = nameParts[0];
            }
            //запрос
            if (this.emailElement && this.passwordElement) {
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
        }
    };

    private clearInputFields(): void {
        if (this.fullNameElement && this.emailElement &&
            this.passwordElement && this.rePasswordElement) {
            this.fullNameElement.value = '';
            this.emailElement.value = '';
            this.passwordElement.value = '';
            this.rePasswordElement.value = '';
        }
    }
}