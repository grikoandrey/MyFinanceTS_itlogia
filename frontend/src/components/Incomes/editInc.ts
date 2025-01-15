import {CategoriesService} from "../../services/categories-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";
import {ReturnObject} from "../../types/responce.type";

export class IncomeEdit {
    readonly openNewRoute: NewRoute;
    readonly validations: ValidationType[] = [];
    readonly id: string | null = null;
    private incomeTypeElement: HTMLInputElement | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        const incEditElement: HTMLElement | null = document.getElementById('incomeEdit');
        if (incEditElement) {
            incEditElement.addEventListener('click', this.editIncome.bind(this));
        }

        this.id = sessionStorage.getItem('id');

        this.findElements();

        this.validations = [
            {element: this.incomeTypeElement,},
        ];

        if (this.id) {
            this.showIncome(this.id).then();
        } else {
            console.log('ID не найден')
        }
    };

    private findElements(): void {
        this.incomeTypeElement = document.getElementById('incomeInput') as HTMLInputElement | null;
    }

    async showIncome(id: string) {
        const response: ReturnObject = await CategoriesService.getCategory('income', id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (this.incomeTypeElement && response.category) {
            this.incomeTypeElement.value = response.category.title;
        }
    };

    async editIncome(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.incomeTypeElement) {
            const changedData = {
                title: this.incomeTypeElement.value,
            };

            if (!changedData) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }
            if (this.id) {
                const response = await CategoriesService.editCategory('income', this.id, changedData);
                if (response.error) {
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                sessionStorage.clear();
                return this.openNewRoute(`/incomes`);
            }
        }
    };
}