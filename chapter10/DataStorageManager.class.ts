import {TFExercise} from './TFExercise.class';

export class DataStorageManager extends TFExercise {
    data: string;

    constructor(path: string) {
        super();
        this.data = require('fs').readFileSync(path).toString();
        this.data = this.data.replace(/[\W_|]+/gi, " ");
    }
    // Returns the list words in storage
    words() {
        return this.data.split(" ");
    }

    info() {
        return super.info() + ": My major data structure is a " + this.constructor.name;
    }
}
