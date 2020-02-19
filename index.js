const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

if (process.argv.length == 2) {
    console.log("-i <path> -o <path>");
    process.exit();
}

const inputArgIndex = process.argv.indexOf("-i");
var inputPath = "";
const outputArgIndex = process.argv.indexOf("-o");
var outputBasePath = "";

if (inputArgIndex != -1) {
    inputPath = process.argv[inputArgIndex + 1];
} else {
    console.log("must pass -i <input folder path>");
    process.exit();
}

if (outputArgIndex != -1) {
    outputBasePath = process.argv[outputArgIndex + 1];
} else {
    console.log("must pass -o <output folder path>");
    process.exit();
}

const watcher = chokidar.watch(inputPath);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    watcher.close().then( _ => {
        process.exit();
    });
});

watcher.on('add', filepath => {
    console.log("new file detected: ", filepath);
    const outputFolderPath = createFolderIfNeeded() + "";
    const fileComponents = filepath.split(path.sep);
    const filename = fileComponents[fileComponents.length - 1];
    copyToOutputFolder(filepath, outputFolderPath, filename);
});

function createFolderIfNeeded() {
    const date = new Date();
    const yearFolder = date.getFullYear().toString();
    const monthFolder = numStringWithLeadingZeros(date.getMonth() + 1);
    const outpath = outputBasePath + path.sep + yearFolder + path.sep + monthFolder;
    if(!fs.existsSync(outputBasePath + path.sep + yearFolder)) {
        fs.mkdirSync(outputBasePath + path.sep + yearFolder);
    }
    if(!fs.existsSync(outpath)) {
        fs.mkdirSync(outpath);
    }
    return outpath;
}

function numStringWithLeadingZeros(number) {
    const str = "0" + number.toString();
    return str.substr(str.length - 2);
}

function dateString() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = numStringWithLeadingZeros(date.getMonth() + 1);
    const day = numStringWithLeadingZeros(date.getDate());
    return year + "-" + month + "-" + day
}

function timeString() {
    const date = new Date();
    const hours = numStringWithLeadingZeros(date.getHours());
    const min = numStringWithLeadingZeros(date.getMinutes());
    const sec = numStringWithLeadingZeros(date.getSeconds());
    return hours + "-" + min + "-" + sec
}

function copyToOutputFolder(filePath, destPath, fileName) {
    const filePrefix = dateString() + "_" + timeString() + " ";

    fs.copyFile(filePath, destPath + path.sep + filePrefix + fileName, (err) => {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(filePath, (err2) => {
                if (err2) console.log(err2);
            })
        }
    });
}