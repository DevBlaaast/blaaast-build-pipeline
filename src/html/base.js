'use strict';

const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const handlebars = require('gulp-compile-handlebars');
const data = require('gulp-data');
const connect = require('gulp-connect');
const path = require('path');
const _ = require('lodash');

// TODO accept options.helpers from project
const helpers = require('./helpers');

const i18nUtils = require('./i18n');

// De-caching for Data files
function requireUncached( requiredModule ) {
  delete require.cache[require.resolve( requiredModule )];
  return require( requiredModule );
}


module.exports = function (gulp, options) {

  // HTML reload on changes
  gulp.task('html', function() {

    const webpages = options.webpages;
    const batch = options.partials;
    const dataPath = options.dataPath;
    const i18n = options.i18n;
    const i18nBase = options.i18nBase;
    const i18nData = {};
    const hasi18n = i18n && i18n.length;

    // Building the i18n powered data.json and .hbs files paths
    if (hasi18n) {
      i18n.forEach(i18n => {
        webpages.forEach(webpage => {
          const tempArray = webpage.split('/');
          tempArray.splice(1, 0, i18n);
          webpages.push(tempArray.join('/'));
        });

        const i18nPath = path.join(options.i18nBaseDataPath, i18n, 'data.json');
        i18nData[i18n] = requireUncached(i18nPath);
      });

      return i18n.map(i18n => {
        return gulp.src(webpages, { base: process.cwd() })
          .pipe( handlebars(i18nData[i18n], { batch, helpers }) )
          .pipe( rename(rawPath => i18nUtils.getDestDir(rawPath, i18n, i18nBase)) )
          .pipe( gulp.dest('./') );

      });
    };

    return gulp.src(webpages, { base: process.cwd() })
      .pipe( handlebars(requireUncached(options.dataPath), { batch, helpers }) )
      .pipe( rename(i18nUtils.getDestDir) )
      .pipe( gulp.dest('./') );
  });

}
