import {CategoriesService} from "../../services/categories-service";
import {NewRoute} from "../../types/newRoute.type";
import {ReturnObject} from "../../types/responce.type";
import {CategoryType} from "../../types/category.type";

export class Expenses {
    readonly openNewRoute: NewRoute;

    constructor(openNewRoute: NewRoute) {

        this.openNewRoute = openNewRoute;
        this.getExpenses().then();
    };

    private async getExpenses() {
        const response: ReturnObject = await CategoriesService.getAllCategories('expense');
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showExpenses(response.categories as CategoryType[]);
    };

    private showExpenses(categories: CategoryType[]): void {
        const listExpenses: HTMLElement | null = document.getElementById('listExpenses');

        if (!listExpenses) {
            console.error('Контейнер #listExpenses не найден.');
            return;
        }

        listExpenses.innerHTML = '';
        categories.forEach((element: CategoryType): void => {
            listExpenses.insertAdjacentHTML('beforeend', `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <div class="actions d-flex gap-2">
                            <a href="/expenses/edit" onclick="sessionStorage.setItem('id', '${element.id}')" class="btn btn-primary w-134">Редактировать</a>
                            <a href="javascript:void(0)" onclick="sessionStorage.setItem('id', '${element.id}')" class="btn btn-danger w-88" data-bs-toggle="modal"
                               data-bs-target="#exampleModal">Удалить</a>
                        </div>
                    </div>
                </div>
            </div>
            `);
        });
        this.addNewExpenseBlock(listExpenses);
    };

    private addNewExpenseBlock(container: HTMLElement): void {
        container.insertAdjacentHTML('beforeend', `
            <div class="col">
                <div class="card h-100">
                    <a href="/expenses/create" class="card-body d-flex align-items-center justify-content-center">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"
                                  fill="currentColor"/>
                        </svg>
                    </a>
                </div>
            </div>
        `);
    }
}