self.onmessage = function (ev) {
    var startTime = new Date().toTimeString();
    factorial(ev.data.message);
    var output = factorial(ev.data.message) + " at " +startTime;
    self.postMessage({ message: output});
}

function factorial(n) {
    return !( n > 1 ) ? 1 : arguments.callee(n - 1) * n;
}

function sleep(miliseconds) {
    var startingTime = new Date().getTime();
    var stopTime = startingTime + miliseconds;
    while (stopTime >= new Date().getTime() ){}
}