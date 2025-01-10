import {CategoriesService} from "../../services/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils.js";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('incomeEdit')
            .addEventListener('click', this.editIncome.bind(this));

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

    findElements() {
        this.incomeTypeElement = document.getElementById('incomeInput');
    }

    async showIncome(id) {
        const response = await CategoriesService.getCategory('income', id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.incomeTypeElement.value = response.category.title;
    };

    async editIncome(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {
                title: this.incomeTypeElement.value,
            };

            if (!changedData) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }
            const response = await CategoriesService.editCategory('income', this.id, changedData);
            if (response.error) {
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            sessionStorage.clear();
            return this.openNewRoute(`/incomes`);
        }
    };
}