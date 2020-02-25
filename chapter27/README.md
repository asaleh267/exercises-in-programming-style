Coroutine: Procedures that allow multiple entry and exit points for suspending and resuming execution.

Generator: A special kind of coroutine used to control iteration over a sequence of values. A generator always yields control back to the caller, rather than to an arbitrary place of the program.

Iterator: An object that is used to traverse a sequence of values.

Notes: 

I have used function* - defines a generator function, which returns a Generator object. Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.

I have read this documentation in order to solve the issue.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

