
import {TFExercise} from './TFExercise.class';

export class FrequancyManager extends TFExercise {
    wordFreqs: [string, number][];

    constructor() {
        super();
        this.wordFreqs = [];
    }

    incrementCount(word: string) {
        let found = false;

        for (let index = 0; index < this.wordFreqs.length; index++)
            if (word == this.wordFreqs[index][0]) {
                this.wordFreqs[index][1] += 1;
                found = true
            }

        if (!found) {
            this.wordFreqs.push([word, 1]);
        } 
    }

    sorted() {
        return this.wordFreqs.sort((a, b) => {
            return b[1] - a[1];
        });
    }

    info() {
        return super.info() + ": My major data structure is a " + this.constructor.name;
    }
}