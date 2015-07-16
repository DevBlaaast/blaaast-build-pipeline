var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');

module.exports = function (gulp) {

  gulp.task('css', function() {
    return gulp.src('./scss/main.scss')
      .pipe( sourcemaps.init())
      .pipe( sass({
        errLogToConsole: true
      }) )
      .pipe(autoprefixer({
        browsers: ['> 1%'],
        cascade: false
      }))
      .pipe( sourcemaps.write() )
      .pipe( gulp.dest('./build/css') )
      .pipe( connect.reload() )
  });

}
