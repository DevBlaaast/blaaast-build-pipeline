const path = require('path');

module.exports = {

  // Read directories and read the right compilation dir
  getDestDir(sourcePath, i18n, i18nBase) {

    sourcePath.dirname = sourcePath.dirname.split('/');
    sourcePath.dirname.shift(); // Removes 'pages' from the target dirname
    sourcePath.dirname = sourcePath.dirname.join('/');

    // If i18n is not the base language put the html files in sub-directories
    if (i18n && i18n !== i18nBase) {
      sourcePath.dirname = path.join(i18n, sourcePath.dirname);
    }

    sourcePath.extname = '.html';
  }

}
