var plumber = require('gulp-plumber');
var rev = require('gulp-rev');

module.exports = function (gulp) {

  // Images tasks
  gulp.task('img', ['img-default']);

  // Responsive images
  gulp.task('img-default', function() {
    return gulp.src('img/**')
      .pipe( plumber() )
      .pipe( gulp.dest('build/img') );
  });

  gulp.task('img-deploy', ['clean'], function() {

    return gulp.src('img/**')
      .pipe( plumber() )
      .pipe( rev() )
      .pipe( gulp.dest('./build/img') )
      .pipe( rev.manifest({
        path: 'build/rev-manifest.json',
        merge: true,
        base: process.cwd() + '/build'
      }) )
      .pipe( gulp.dest('./build') );
  });

}
