module.exports = {};

exports.inputDirectoryKey = "inputDirectory";
exports.outputDirectoryKey = "outputDirectory";

exports.parseArgs = function(args) {
    return {
        inputDirectoryKey: args[2],
        outputDirectoryKey: args[3]
    };
}