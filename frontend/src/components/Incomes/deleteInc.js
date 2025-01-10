import {CategoriesService} from "../../services/categories-service";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.id = sessionStorage.getItem('id');

        this.deleteCategory(this.id).then();
    };

    async deleteCategory(id) {
        const response = await CategoriesService.deleteCategory('income', id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        sessionStorage.clear();
        return this.openNewRoute(`/incomes`);
    }
}