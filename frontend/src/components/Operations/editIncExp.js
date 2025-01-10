import {OperationsService} from "../../services/operations-service.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {CategoriesService} from "../../services/categories-service.js";
import {DateUtils} from "../../utils/date-utils.js";

export class OperationEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('operationEdit')
            .addEventListener('click', this.editOperation.bind(this));

        this.id = sessionStorage.getItem('id');

        this.findElements();

        this.validations = [
            {element: this.operationTypeElement,},
            {element: this.operationCategoryElement,},
            {element: this.operationSumElement},
            {element: this.operationCommentElement},
            {
                element: this.operationDateElement,
                options: {pattern: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/}
            },
        ];

        if (this.id) {
            this.showOperation(this.id).then();
        } else {
            console.log('ID не найден')
        }

        this.operationTypeElement.addEventListener('change', () => {
            const selectedType = this.operationTypeElement.value;
            this.getCategoriesByType(selectedType).then(); // Обновляем категории при изменении типа
        });
    };

    findElements() {
        this.operationTypeElement = document.getElementById('operationType');
        this.operationCategoryElement = document.getElementById('operationCategory');
        this.operationSumElement = document.getElementById('operationSum');
        this.operationDateElement = document.getElementById('operationDate');
        this.operationCommentElement = document.getElementById('operationComment');
    }

    async showOperation(id) {
        const response = await OperationsService.getOperation(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        const operation = response.operation;

        this.operationTypeElement.value = operation.type;
        this.operationCategoryElement.value = operation.category;
        this.operationSumElement.value = operation.amount;
        this.operationDateElement.value = DateUtils.formatDateToDisplay(operation.date);
        this.operationCommentElement.value = operation.comment;

        await this.getCategoriesByType(operation.type);
        this.selectCategoryByName(operation.category);
    };

    async getCategoriesByType(type) {
        if (!type) return;

        const result = await CategoriesService.getAllCategories(type);
        if (result.error) {
            console.log(result.error);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
        return this.updateCategorySelect(result.categories);
    }

    updateCategorySelect(categories) {
        // this.operationCategoryElement.innerHTML = ''; // Очищаем текущие опции

        if (!categories || categories.length === 0) {
            this.operationCategoryElement.setAttribute('disabled', 'true');
            this.operationCategoryElement.innerHTML = '<option value="" selected disabled>Категории не найдены</option>';
            return;
        }

        this.operationCategoryElement.removeAttribute('disabled');
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            this.operationCategoryElement.appendChild(option);
        });
    };

    selectCategoryByName(categoryName) {
        const options = this.operationCategoryElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === categoryName) {
                this.operationCategoryElement.value = options[i].value;
                break;
            }
        }
    };

    async editOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {
                type: this.operationTypeElement.value,
                category_id: +(this.operationCategoryElement.value),
                amount: +(this.operationSumElement.value),
                date: DateUtils.formatDateToStorage(this.operationDateElement.value),
                comment: this.operationCommentElement.value,
            };

            if (!changedData.type || !changedData.amount || !changedData.date || !changedData.comment || !changedData.category_id) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }
            const response = await OperationsService.editOperation(this.id, changedData);
            if (response.error) {
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            sessionStorage.clear();
            return this.openNewRoute(`/operations`);
        }
    };
}