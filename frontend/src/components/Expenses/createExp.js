import {CategoriesService} from "../../services/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.expenseTypeElement = document.getElementById('expenseInput');

        document.getElementById('expenseCreate')
            .addEventListener('click', this.createExpense.bind(this));

        this.validations = [
            {element: this.expenseTypeElement},
        ];
    };

    async createExpense(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                title: this.expenseTypeElement.value,
            };
            const response = await CategoriesService.createCategory('expense', createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/expenses`);
        }
    };
}