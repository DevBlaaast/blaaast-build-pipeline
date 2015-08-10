var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');
var revReplace = require('gulp-rev-replace');

// De-caching for Data files
function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

module.exports = function (gulp, options) {

  gulp.task('html-deploy', ['compress-resources'], function() {

    var manifest = gulp.src('./build/rev-manifest.json');
    var webpages = options.webpages;
    var partials = options.partials;
    var dataPath = options.dataPath;

    return gulp.src(webpages)
      .pipe(data(function(file) {
        return requireUncached(dataPath);
      }))
      .pipe(handlebars({}, {
        batch: partials
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
