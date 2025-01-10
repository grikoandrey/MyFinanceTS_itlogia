import {ValidationUtils} from "../../utils/validation-utils.js";
import {OperationsService} from "../../services/operations-service.js";
import {CategoriesService} from "../../services/categories-service.js";
import {DateUtils} from "../../utils/date-utils";


export class OperationCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        document.getElementById('operationCreate')
            .addEventListener('click', this.createOperation.bind(this));

        const type = sessionStorage.getItem('operationType');
        if (type) {
            this.operationTypeElement.value = type;
            this.getCategoriesByType(type).then();
        }
        // Обработчик изменения типа операции
        this.operationTypeElement.addEventListener('change', () => {
            const selectedType = this.operationTypeElement.value;
            sessionStorage.setItem('operationType', selectedType); // Обновляем sessionStorage
            this.getCategoriesByType(selectedType).then(); // Обновляем категории
        });

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
    };

    findElements() {
        this.operationTypeElement = document.getElementById('operationType');
        this.operationCategoryElement = document.getElementById('operationCategory');
        this.operationSumElement = document.getElementById('operationSum');
        this.operationDateElement = document.getElementById('operationDate');
        this.operationCommentElement = document.getElementById('operationComment');
    }

    async getCategoriesByType(type) {
        if (!type) return;

        const result = await CategoriesService.getAllCategories(type);
        if (result.error) {
            console.log(result.error);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
        return this.updateCategorySelect(result.categories);
    };

    // Функция для обновления второго селектора
    updateCategorySelect(categories) {
        this.operationCategoryElement.innerHTML = ''; // Очищаем текущие опции

        if (!categories || categories.length === 0) {
            this.operationCategoryElement.setAttribute('disabled', 'true');
            this.operationCategoryElement.innerHTML = '<option value="" selected disabled>Категории не найдены</option>';
            return;
        }
        // Активируем селектор и добавляем новые опции
        this.operationCategoryElement.removeAttribute('disabled');
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            this.operationCategoryElement.appendChild(option);
        });
    }

    async createOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                type: this.operationTypeElement.value,
                category_id: +(this.operationCategoryElement.value),
                amount: this.operationSumElement.value,
                date: DateUtils.formatDateToStorage(this.operationDateElement.value),
                comment: this.operationCommentElement.value,
            };
            const response = await OperationsService.createOperation(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/operations`);
        }
    };
}