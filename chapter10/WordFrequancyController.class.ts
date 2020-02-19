import {TFExercise} from './TFExercise.class';
import {DataStorageManager} from './DataStorageManager.class';
import { StopWordsManager } from './StopWordsManager.class';
import { FrequancyManager } from './FrequancyManager.class';

export class WordFrequancyController extends TFExercise {

    storageManager;
    stopWordsManager;
    wordFrequancyManager;

    constructor() {
        super();
        this.storageManager = new DataStorageManager("../data\\dummy_data.txt");
        this.stopWordsManager = new StopWordsManager("../data\\stop_words.txt");
        this.wordFrequancyManager = new FrequancyManager();
    }

    run() {
        var words = this.storageManager.words();
        for (let word in words) {
            if (!this.stopWordsManager.isStopWord(words[word])) {
                this.wordFrequancyManager.incrementCount(words[word]);
            }
        }
        console.log(this.wordFrequancyManager.sorted().slice(0, 25));
    }

    run2() {
        console.log(this.storageManager.info(), '\n',
            this.stopWordsManager.info(), '\n',
            this.wordFrequancyManager.info(), '\n',
            this.wordFrequancyManager.sorted().slice(0, 25));
    }
}