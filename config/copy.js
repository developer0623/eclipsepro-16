const path = require('path');
const fse = require('fs-extra');

const ROOT_PATH = path.resolve(__dirname, '../');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist/eclipse-ui');
const COPY_PATH = path.resolve(__dirname, '../../AMS.Eclipse.Server/apps/UI');

console.log('Copying ' + BUILD_PATH + ' to ' + COPY_PATH + '...');

fse.copy(BUILD_PATH, COPY_PATH, function (err) {
  if (err) {
    console.error('error:', err);
  } else {
    console.log('success!');
  }
});
