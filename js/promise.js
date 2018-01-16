$(window).ready(function () {
    $('#start-worker').click(function (ev) {
        var message = $('#message').val();
        var promise = processMessage(message);
        promise.done(function (data) {
            $('#result').append('<li> ' + data + '</li>');
        });

        promise.fail(function (err) {
            console.log(err);
            alert(err);
        });
    });
})