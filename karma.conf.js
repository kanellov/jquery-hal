/* jshint node: true */
module.exports = function(config) {
  "use strict";

/**
 * add --debug flag to cmd to prevent coverage from
 * uglifying the js files
 *
 * add --single-run=false flag to cmd
 * to prevent browser fron auto closing
 */
    var sourcePreprocessors = 'coverage';
    function isDebug(argument) {
        return argument === '--debug';
    }
    if (process.argv.some(isDebug)) {
        sourcePreprocessors = [];
    }

    config.set({
        basePath: ".",
        frameworks: ["qunit"],
        files: [
            "bower_components/jquery/dist/jquery.js",
            "bower_components/rfc6570/rfc6570.js",
            "bower_components/jquery-mockjax/dist/jquery.mockjax.js",
            "jquery-hal.js",
            "test/**.js"
        ],

        reporters: ["dots", "coverage"],
        preprocessors: {
            "jquery-hal_new.js": sourcePreprocessors
        },

        coverageReporter: {
            reporters: [{
                type: "html",
                dir: "coverage/"
            }, {
                type: "text-summary"
            }]
        },

        proxies: {
            "/local/": "http://localhost:8080/"
        },

        autoWatch: false,
        singleRun: true,
        browsers: ["PhantomJS"] //, "Chrome", "Firefox", "IE", "ChromeCanary", "Safari", "Opera"]
    });
};
