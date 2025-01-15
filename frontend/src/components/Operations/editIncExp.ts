import {OperationsService} from "../../services/operations-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";
import {DateUtils} from "../../utils/date-utils";
import {NewRoute} from "../../types/newRoute.type";
import {ValidationType} from "../../types/validation.type";
import {ReturnObject} from "../../types/responce.type";
import {CreateIncExpType} from "../../types/createIncExpType";
import {EditIncExpType} from "../../types/editIncExpType";
import {CategoryType} from "../../types/category.type";

export class OperationEdit {
    readonly openNewRoute: NewRoute;
    readonly validations: ValidationType[] = [];
    readonly id: string | null = null;

    operationTypeElement: HTMLInputElement | null = null;
    operationCategoryElement: HTMLSelectElement | null = null;
    operationSumElement: HTMLInputElement | null = null;
    operationCommentElement: HTMLInputElement | null = null;
    operationDateElement: HTMLInputElement | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        const operEditElement: HTMLElement | null = document.getElementById('operationEdit');
        if (operEditElement) {
            operEditElement.addEventListener('click', this.editOperation.bind(this));
        }


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

        if (this.operationTypeElement) {
            this.operationTypeElement.addEventListener('change', () => {
                const selectedType = this.operationTypeElement!.value;
                this.getCategoriesByType(selectedType).then(); // Обновляем категории при изменении типа
            });
        }

    };

    private findElements(): void {
        this.operationTypeElement = document.getElementById('operationType') as HTMLInputElement | null;
        this.operationCategoryElement = document.getElementById('operationCategory') as HTMLSelectElement | null;
        this.operationSumElement = document.getElementById('operationSum') as HTMLInputElement | null;
        this.operationDateElement = document.getElementById('operationDate') as HTMLInputElement | null;
        this.operationCommentElement = document.getElementById('operationComment') as HTMLInputElement | null;
    }

    async showOperation(id: string) {
        const response: ReturnObject = await OperationsService.getOperation(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        const operation: EditIncExpType | null | undefined = response.operation;

        if (operation && this.operationTypeElement && this.operationCategoryElement && this.operationSumElement
        && this.operationDateElement && this.operationCommentElement) {
            this.operationTypeElement.value = operation.type;
            this.operationCategoryElement.value = operation.category;
            this.operationSumElement.value = operation.amount;
            this.operationDateElement.value = DateUtils.formatDateToDisplay(operation.date);
            this.operationCommentElement.value = operation.comment;

            await this.getCategoriesByType(operation.type);
            this.selectCategoryByName(operation.category);
        }

    };

    async getCategoriesByType(type: string) {
        if (!type) return;

        const result: ReturnObject = await CategoriesService.getAllCategories(type);
        if (result.error) {
            console.log(result.error);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
        return this.updateCategorySelect(result.categories as CategoryType[]);
    }

    private updateCategorySelect(categories: CategoryType[]): void {
        // this.operationCategoryElement.innerHTML = ''; // Очищаем текущие опции

        if (!categories || categories.length === 0) {
            if (this.operationCategoryElement) {
                this.operationCategoryElement.setAttribute('disabled', 'true');
                this.operationCategoryElement.innerHTML = '<option value="" selected disabled>Категории не найдены</option>';
                return;
            }
        }

        if (this.operationCategoryElement) {
            this.operationCategoryElement.removeAttribute('disabled');
            categories.forEach((category: CategoryType) => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.title;
                this.operationCategoryElement!.appendChild(option);
            });
        }
    };

    private selectCategoryByName(categoryName: string): void {
        if (this.operationCategoryElement) {
            const options = this.operationCategoryElement.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].textContent === categoryName) {
                    this.operationCategoryElement.value = options[i].value;
                    break;
                }
            }
        }
    };

    private async editOperation(e: Event) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations) && this.operationTypeElement &&
            this.operationCategoryElement && this.operationSumElement && this.operationDateElement
        && this.operationCommentElement) {
            const changedData: CreateIncExpType = {
                type: this.operationTypeElement.value,
                category_id: +(this.operationCategoryElement.value),
                amount: this.operationSumElement.value,
                date: DateUtils.formatDateToStorage(this.operationDateElement.value),
                comment: this.operationCommentElement.value,
            };

            if (!changedData.type || !changedData.amount || !changedData.date || !changedData.comment || !changedData.category_id) {
                console.log("Ошибка: отсутствуют обязательные данные");
                return;
            }
            if (this.id) {
                const response: ReturnObject = await OperationsService.editOperation(this.id, changedData);

                if (response.error) {
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                sessionStorage.clear();
                return this.openNewRoute(`/operations`);
            }
        }
    };
}