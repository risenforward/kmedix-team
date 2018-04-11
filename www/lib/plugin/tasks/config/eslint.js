module.exports = function(grunt) {
    var lintingTargets = [
        'src/**/*.js'
    ];

    return {
        src: lintingTargets,
        options: {
            reset: true,
            configFile: require.resolve('mobify-code-style/javascript/.eslintrc')
        }
    };
};
