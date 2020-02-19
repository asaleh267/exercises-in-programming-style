import { WordFrequancyController } from "./WordFrequancyController.class";

// The main function
let wordFrequencyObject = new WordFrequancyController();
// Exercises 1
wordFrequencyObject.run();


// Exercises 2
wordFrequencyObject.run2();
/*
Output:
DataStorageManager: My major data structure is a DataStorageManager 
StopWordsManager: My major data structure is a StopWordsManager
FrequancyManager: My major data structure is a FrequancyManager
 [
  [ 'Lorem', 4 ],       [ 'Ipsum', 4 ],
  [ 'dummy', 2 ],       [ 'text', 2 ],
  [ 'typesetting', 2 ], [ 'industry', 2 ],
  [ 'type', 2 ],        [ 'It', 2 ],
  [ 'simply', 1 ],      [ 'printing', 1 ],
  [ 'standard', 1 ],    [ 'ever', 1 ],
  [ 'since', 1 ],       [ '1500s', 1 ],
  [ 'unknown', 1 ],     [ 'printer', 1 ],
  [ 'took', 1 ],        [ 'galley', 1 ],
  [ 'scrambled', 1 ],   [ 'make', 1 ],
  [ 'specimen', 1 ],    [ 'book', 1 ],
  [ 'survived', 1 ],    [ 'five', 1 ],
  [ 'centuries', 1 ]
]
*/