import {CategoriesService} from "../../services/categories-service";
import {NewRoute} from "../../types/newRoute.type";
import {ReturnObject} from "../../types/responce.type";

export class IncomeDelete {

    readonly openNewRoute: NewRoute
    readonly id: string | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        this.id = sessionStorage.getItem('id');

        if (this.id) {
            this.deleteCategory(this.id).then();
        }
    };

    private async deleteCategory(id: string) {
        const response: ReturnObject = await CategoriesService.deleteCategory('income', id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        sessionStorage.clear();
        return this.openNewRoute(`/incomes`);
    }
}