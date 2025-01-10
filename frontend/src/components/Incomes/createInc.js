import {CategoriesService} from "../../services/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.incomeTypeElement = document.getElementById('incomeInput');

        document.getElementById('incomeCreate')
            .addEventListener('click', this.createIncome.bind(this));

        this.validations = [
            {element: this.incomeTypeElement},
        ];
    };

    async createIncome(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
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