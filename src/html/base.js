var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var data = require('gulp-data');
var connect = require('gulp-connect');

// De-caching for Data files
function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

module.exports = function (gulp, options) {

  /**
    To be extended to accept options.hbsHelpers
  */
  var hbsHelpers = {
    json : function(context){
      return JSON.stringify(context);
    }
  };

  // HTML reload on changes
  gulp.task('html', function() {

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
      .pipe( plumber() )
      .pipe( connect.reload() );
  });

}

// docker exec -i -t  bash
