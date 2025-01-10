import {OperationsService} from "../../services/operations-service.js";

export class OperationDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.id = sessionStorage.getItem('id');

        this.deleteOperation(this.id).then();
    };

    async deleteOperation(id) {
        const response = await OperationsService.deleteOperation(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        sessionStorage.clear();
        return this.openNewRoute(`/operations`);
    }
}