var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

module.exports = function (gulp) {

  gulp.task('uglify', function() {
    var manifest = gulp.src('./build/rev-manifest.json');

    return browserify({
      entries: './js/main.js'
    })
    .transform( babelify )
    .transform( babelify.configure({
      sourceMapRelative: path.join(process.pwd + '/js')
    }))
    .bundle()
    .pipe( source('all.js') )
    .pipe( buffer() )
    .pipe( uglify() )
    .pipe( addsrc.prepend('./js/vendor/*.js') )
    .pipe( concat('all.js') )
    .pipe( rev() )
    .pipe( gulp.dest('./build/js') )
    .pipe( revReplace({ manifest: manifest }) )
    .pipe( gulp.dest('./build/js') )
    .pipe( rev.manifest({
      path: 'build/rev-manifest.json',
      merge: true,
      base: process.cwd() + '/build'
    }))
    .pipe( gulp.dest('./build') );
  });

}
