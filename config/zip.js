const file_system = require('fs');
const archiver = require('archiver');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist/eclipse-ui');
const TO_PATH = path.resolve(__dirname, '../../AMS.Eclipse.Server/apps/UI.zip');

const output = file_system.createWriteStream(TO_PATH);
const archive = archiver('zip');

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes written to ' + TO_PATH);
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);
archive.directory(BUILD_PATH, false);

archive.finalize();
