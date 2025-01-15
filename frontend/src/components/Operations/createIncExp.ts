import {ValidationUtils} from "../../utils/validation-utils";
import {OperationsService} from "../../services/operations-service";
import {CategoriesService} from "../../services/categories-service";
import {DateUtils} from "../../utils/date-utils";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";
import {ReturnObject} from "../../types/responce.type";
import {CreateIncExpType} from "../../types/createIncExpType";
import {CategoryType} from "../../types/category.type";

export class OperationCreate {
    readonly openNewRoute: NewRoute;
    readonly validations: ValidationType[] = [];

    operationTypeElement: HTMLInputElement | null = null;
    operationCategoryElement: HTMLInputElement | null = null;
    operationSumElement: HTMLInputElement | null = null;
    operationCommentElement: HTMLInputElement | null = null;
    operationDateElement: HTMLInputElement | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        const operCreateElement: HTMLElement | null = document.getElementById('operationCreate');

        if (operCreateElement) {
            operCreateElement.addEventListener('click', this.createOperation.bind(this));
        }


        const type: string | null = sessionStorage.getItem('operationType');
        if (type && this.operationTypeElement) {
            this.operationTypeElement.value = type;
            this.getCategoriesByType(type).then();
        }
        // Обработчик изменения типа операции
        if (this.operationTypeElement) {
            this.operationTypeElement.addEventListener('change', () => {
                const selectedType: string = this.operationTypeElement!.value;
                sessionStorage.setItem('operationType', selectedType); // Обновляем sessionStorage
                this.getCategoriesByType(selectedType).then(); // Обновляем категории
            });
        }


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

    private findElements(): void {
        this.operationTypeElement = document.getElementById('operationType') as HTMLInputElement | null;
        this.operationCategoryElement = document.getElementById('operationCategory') as HTMLInputElement | null;
        this.operationSumElement = document.getElementById('operationSum') as HTMLInputElement | null;
        this.operationDateElement = document.getElementById('operationDate') as HTMLInputElement | null;
        this.operationCommentElement = document.getElementById('operationComment') as HTMLInputElement | null;
    }

    async getCategoriesByType(type: string) {
        if (!type) return;

        const result: ReturnObject = await CategoriesService.getAllCategories(type);
        if (result.error) {
            console.log(result.error);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
        return this.updateCategorySelect(result.categories as CategoryType[]);
    };

    // Функция для обновления второго селектора
    updateCategorySelect(categories: CategoryType[]): void {

        if (!this.operationCategoryElement) {
            return;
        }
        this.operationCategoryElement.innerHTML = ''; // Очищаем текущие опции

        if (!categories || categories.length === 0) {
            this.operationCategoryElement.setAttribute('disabled', 'true');
            this.operationCategoryElement.innerHTML = '<option value="" selected disabled>Категории не найдены</option>';
            return;
        }
        // Активируем селектор и добавляем новые опции
        this.operationCategoryElement.removeAttribute('disabled');
        categories.forEach((category: CategoryType): void => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            this.operationCategoryElement!.appendChild(option);
        });
    }

    private async createOperation(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.operationTypeElement && this.operationTypeElement
            && this.operationCategoryElement && this.operationSumElement && this.operationCommentElement
            && this.operationDateElement) {
            const createData: CreateIncExpType = {
                type: this.operationTypeElement.value,
                category_id: +(this.operationCategoryElement.value),
                amount: this.operationSumElement.value,
                date: DateUtils.formatDateToStorage(this.operationDateElement.value),
                comment: this.operationCommentElement.value,
            };
            const response: ReturnObject = await OperationsService.createOperation(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute(`/operations`);
        }
    };
}