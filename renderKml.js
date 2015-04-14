var page = require('webpage').create();

page.onError = function(msg, trace) {
    console.log(msg);
    console.log(trace);
};
page.onResourceError = function(resourceError) {
    console.log(resourceError.errorString);
    console.log(resourceError.url);
};

page.open('http://localhost:1337', function(status) {
    setTimeout(function() {
        page.render('github.png');
        phantom.exit();
    }, 1000);
});
