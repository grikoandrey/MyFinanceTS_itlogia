import {CategoriesService} from "../../services/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils.js";

export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('expenseEdit')
            .addEventListener('click', this.editExpense.bind(this));

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

    findElements() {
        this.expenseTypeElement = document.getElementById('expenseInput');
    }

    async showExpense(id) {
        const response = await CategoriesService.getCategory('expense', id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.expenseTypeElement.value = response.category.title;
    };

    async editExpense(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {
                title: this.expenseTypeElement.value,
            };

            if (!changedData) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }
            const response = await CategoriesService.editCategory('expense', this.id, changedData);
            if (response.error) {
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            sessionStorage.clear();
            return this.openNewRoute(`/expenses`);
        }
    };
}