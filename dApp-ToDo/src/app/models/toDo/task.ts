export enum taskState {unfinished="unfinished", finished="finished"}

export class Task {

    public key: string;
    public state: taskState;

    constructor(
        public input: string, 
        state?: taskState
    ) {
        if (state === undefined){
            this.state = taskState.unfinished;
        } else {
            this.state = state;
        }
    }

    /// Update Tagged / Untagged State of Task
    public updateState(tagged: boolean) {
        if (tagged == true) { this.state = taskState.finished; }
        else { this.state = taskState.unfinished; }
    }
}
