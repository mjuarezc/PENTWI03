function processMessage(message) {
    var deferred = $.Deferred();
    var worker = new Worker("js/deferred-worker.js");

    worker.onmessage = function (ev) {
        deferred.resolve(ev.data.message);
    };

    worker.postMessage({message: message});

    return deferred.promise();
}