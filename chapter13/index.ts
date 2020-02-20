
abstract class AbstractDataStorageMnager {
    data;
    constructor(path) {
        this.data = require('fs').readFileSync(path).toString();
        this.data = this.data.replace(/[\W_|]+/gi, " ");
    }
    words(): string[] {
        return this.data.split(" ");
    };
}

abstract class AbstractStopWordsManager {
    stopWords: string[];
    constructor(path: string) {
        this.stopWords = require('fs').readFileSync(path).toString().split(",");
    }
    isStop(w: string) {
        return this.stopWords.includes(w)
    }
}

abstract class AbstractFrequancyManager {
    word_count: [string, number][];

    constructor() {
        this.word_count = []
    }

    count(w: string) {
        let found = false;
        for (let index = 0; index < this.word_count.length; index++)
            if (w == this.word_count[index][0]) {
                this.word_count[index][1] += 1;
                found = true
            }
        if (!found) this.word_count.push([w, 1]);
    }

    sort() {
        return this.word_count.sort((a, b) => {
            return b[1] - a[1];
        });
    }

}

class DataStorageManager extends AbstractDataStorageMnager {
    constructor(v) {
        super(v);
    }
}
class StopWordsManager extends AbstractStopWordsManager {
    constructor(v) {
        super(v);
    }
}
class FrequancyManager extends AbstractFrequancyManager {
    constructor() {
        super();
    }
}


class WordFrequancyController {
    storageManager;
    stopWordsManager;
    frequencyManager;

    constructor() {

        this.storageManager = new DataStorageManager("../data\\dummy_data.txt");
        this.stopWordsManager = new StopWordsManager("../data\\stop_words.txt");
        this.frequencyManager = new FrequancyManager();
    }

    run() {
        var words = this.storageManager.words();
        for (let word in words) {
            if (!this.stopWordsManager.isStop(words[word])) {
                this.frequencyManager.count(words[word])
            }
        }
        console.log(this.frequencyManager.sort().slice(0, 25))
    }
}

new WordFrequancyController().run();