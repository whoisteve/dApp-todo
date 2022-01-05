export enum taskState {unfinished="unfinished", finished="finished"}

/// Task to be saved in DB
export class _Task {
    public key: string;
    constructor(
        public input: string, 
        public state: taskState,
        public parentKey: string
    ) {}

    init(){
        this.key = Math.random().
        toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15);
    }
}

export class Task {
    public key: string;
    constructor(
        public input: string, 
        public state: taskState,
        public parentKey: string,
        key?: string
    ) {
        if (key != undefined) {
            this.key = key
        } else {
           this.init();
        }
    }
    init(){
        this.key = Math.random().
        toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15);
    }

    /// Update Ticked / Unticked State of Task
    public updateState(tagged: boolean) {
        if (tagged == true) { this.state = taskState.finished; }
        else { this.state = taskState.unfinished; }
    }
}
