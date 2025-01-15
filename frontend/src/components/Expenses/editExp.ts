import {CategoriesService} from "../../services/categories-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";
import {ReturnObject} from "../../types/responce.type";

export class ExpenseEdit {
    readonly openNewRoute: NewRoute;
    readonly validations: ValidationType[] = [];
    readonly id: string | null = null;
    private expenseTypeElement: HTMLInputElement | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        const expEditElement: HTMLElement | null = document.getElementById('expenseEdit');
        if (expEditElement) {
            expEditElement.addEventListener('click', this.editExpense.bind(this));
        }

        this.id = sessionStorage.getItem('id');

        this.findElements();

        this.validations = [
            {element: this.expenseTypeElement,},
        ];

        if (this.id) {
            this.showExpense(this.id).then();
        } else {
            console.log('ID не найден')
        }
    };

    private findElements(): void {
        this.expenseTypeElement = document.getElementById('expenseInput') as HTMLInputElement | null;
    }

    private async showExpense(id: string) {
        const response: ReturnObject = await CategoriesService.getCategory('expense', id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (this.expenseTypeElement && response.category) {
            this.expenseTypeElement.value = response.category.title;
        }
    };

    async editExpense(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.expenseTypeElement) {
            const changedData = {
                title: this.expenseTypeElement.value,
            };

            if (!changedData) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }

            if (this.id) {
                const response: ReturnObject = await CategoriesService.editCategory('expense', this.id, changedData);
                if (response.error) {
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                sessionStorage.clear();
                return this.openNewRoute(`/expenses`);
            }
        }
    };
}