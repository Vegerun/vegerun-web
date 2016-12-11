export class ActionNamesHelper {

    constructor(private baseName: string) { }

    getName(action: string) {
        return `[${this.baseName}] ${action}`;
    }

    getChildName(parentActionName: string, childAction: string) {
        return `${parentActionName} - ${childAction}`;
    }

    getStartedName(parentActionName: string) {
        return this.getChildName(parentActionName, 'Started');
    }

    getCompletedName(parentActionName: string) {
        return this.getChildName(parentActionName, 'Completed');
    }

    getFailedName(parentActionName: string) {
        return this.getChildName(parentActionName, 'Failed');
    }
}