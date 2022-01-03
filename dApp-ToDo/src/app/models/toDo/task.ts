export enum taskState {unfinished="unfinished", finished="finished"}

export class _Task {

    public key: string;

    constructor(
        public input: string, 
        public state: taskState
    ) {
        this.key = Math.random().
        toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15);
    }
}





export class Task {

    constructor(
        public input: string, 
        public state: taskState,
        public key: string
    ) {
    }

    /// Update Tagged / Untagged State of Task
    public updateState(tagged: boolean) {
        if (tagged == true) { this.state = taskState.finished; }
        else { this.state = taskState.unfinished; }
    }
}
