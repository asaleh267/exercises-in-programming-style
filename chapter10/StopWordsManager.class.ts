import {TFExercise} from './TFExercise.class';

export class StopWordsManager extends TFExercise {
    stopWords: string[];

    constructor(path: string) {
        super()
        this.stopWords = require('fs').readFileSync(path).toString().split(",");
    }

    isStopWord(w: string) {
        return this.stopWords.includes(w)
    }

    info() {
        return super.info() + ": My major data structure is a " + this.constructor.name;
    }

}