/* jshint node: true */

module.exports = function(config) {

    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/rfc6570/rfc6570.js',
            'bower_components/jquery-mockjax/dist/jquery.mockjax.js',
            'jquery-hal.js',
            'test/**.js'
        ],


        reporters: ['dots', 'coverage'],
        preprocessors: {
            'jquery-hal.js': 'coverage'
        },

        coverageReporter: {
            reporters: [{
                type: 'html',
                dir: 'coverage/'
            }, {
                type: 'text-summary'
            }]
        },

        proxies: {
            '/local/': 'http://localhost:8080/'
        },

        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS','Firefox']
    });

};
