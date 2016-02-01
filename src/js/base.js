var path = require('path');
var jshint = require('gulp-jshint');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');

module.exports = function (gulp) {

  gulp.task('js', function() {
    return browserify({
      entries: './js/main.js',
      debug: true
    })
    .transform( babelify )
    .transform( babelify.configure({
      sourceMapRelative: path.join(process.pwd + '/js')
    }))
    .bundle()
    .pipe( source('all.js') )
    .pipe( buffer() )
    .pipe( addsrc.prepend('./js/vendor/*.js') )
    .pipe( concat('all.js') )
    .pipe( gulp.dest('./build/js') )
    .pipe( connect.reload() );
  });

}
