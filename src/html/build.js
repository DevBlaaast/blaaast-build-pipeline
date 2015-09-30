const rename = require('gulp-rename');
const handlebars = require('gulp-compile-handlebars');
const data = require('gulp-data');
const revReplace = require('gulp-rev-replace');
const path = require('path');

const i18nUtils = require('./i18n');

// De-caching for Data files
function requireUncached( requiredModule ) {
  delete require.cache[require.resolve( requiredModule )];
  return require( requiredModule );
}

module.exports = function (gulp, options) {

  /**
    To be extended to accept options.hbsHelpers
  */
  const helpers = {
    json : function(context){
      return JSON.stringify(context);
    }
  };

  // HTML reload on changes
  gulp.task('html-deploy', ['compress-resources'], function() {

    const manifest = gulp.src('./build/rev-manifest.json');
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
          .pipe( gulp.dest('./'))
          .pipe( revReplace({ manifest: manifest }) )
          .pipe( gulp.dest('./'));

      });
    };

    return gulp.src(webpages, { base: process.cwd() })
      .pipe( handlebars(mergedUncachedData, { batch, helpers }) )
      .pipe( rename(i18nUtils.getDestDir) )
      .pipe( gulp.dest('./'))
      .pipe( revReplace({ manifest: manifest }) )
      .pipe( gulp.dest('./'));
  });

  gulp.task('html-deploy-cms', function() {

    var manifest = gulp.src('./build/rev-manifest.json');
    var webpages = options.webpages;
    var partials = options.partials;
    var dataPath = options.dataPath;

    return gulp.src(webpages)
      .pipe(data(function(file) {
        return requireUncached(dataPath);
      }))
      .pipe(handlebars({}, {
        batch: partials,
        helpers : hbsHelpers
      }))
      // .pipe( rename('index.html'))
      .pipe(rename(function (path) {
        var s;
        if (path.basename !== 'index' && path.basename.indexOf('-index') > -1) {
          s = path.basename.substring(0, path.basename.indexOf('-index'))
          path.dirname += '/' + s;
          path.basename = 'index';
        }
        path.extname = '.html';
      }))
      .pipe( gulp.dest('./'))
      .pipe( revReplace({ manifest: manifest }) )
      .pipe( gulp.dest('./'));
  });

}
