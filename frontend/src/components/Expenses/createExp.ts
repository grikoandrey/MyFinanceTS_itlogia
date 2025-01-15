import {CategoriesService} from "../../services/categories-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ReturnObject} from "../../types/responce.type";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";

export class ExpenseCreate {
    readonly openNewRoute: NewRoute
    readonly expenseTypeElement: HTMLInputElement | null
    readonly validations: ValidationType[] = [];

    constructor(openNewRoute: NewRoute) {

        this.openNewRoute = openNewRoute;

        this.expenseTypeElement = document.getElementById('expenseInput') as HTMLInputElement | null;

        const expCreatElement: HTMLElement | null = document.getElementById('expenseCreate');
        if (expCreatElement) {
            expCreatElement.addEventListener('click', this.createExpense.bind(this));
        }

        this.validations = [
            {element: this.expenseTypeElement},
        ];
    };

    private async createExpense(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.expenseTypeElement) {
            const createData = {
                title: this.expenseTypeElement.value,
            };
            const response: ReturnObject = await CategoriesService.createCategory('expense', createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/expenses`);
        }
    };
}