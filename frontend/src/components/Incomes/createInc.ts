import {CategoriesService} from "../../services/categories-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";

export class IncomeCreate {
    readonly openNewRoute: NewRoute
    readonly incomeTypeElement: HTMLInputElement | null
    readonly validations: ValidationType[] = [];

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        this.incomeTypeElement = document.getElementById('incomeInput') as HTMLInputElement | null;

        const incCreatElement: HTMLElement | null = document.getElementById('expenseCreate');
        if (incCreatElement) {
            incCreatElement.addEventListener('click', this.createIncome.bind(this));
        }
        this.validations = [
            {element: this.incomeTypeElement},
        ];
    };

    async createIncome(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.incomeTypeElement) {
            const createData = {
                title: this.incomeTypeElement.value,
            };
            const response = await CategoriesService.createCategory('income', createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/incomes`);
        }
    };
}