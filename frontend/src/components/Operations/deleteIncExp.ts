import {OperationsService} from "../../services/operations-service";
import {NewRoute} from "../../types/newRoute.type";
import {ReturnObject} from "../../types/responce.type";

export class OperationDelete {
    readonly openNewRoute: NewRoute;

    readonly id: string | null = null;

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        this.id = sessionStorage.getItem('id');

        if (this.id) {
            this.deleteOperation(this.id).then();
        }
    };

    private async deleteOperation(id: string) {
        const response: ReturnObject = await OperationsService.deleteOperation(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        sessionStorage.clear();
        return this.openNewRoute(`/operations`);
    }
}