var watch = require('gulp-watch');
var connect = require('gulp-connect');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');

module.exports = function (gulp, options) {

  if (!options.httpRoot) {
    throw new Error(`You need to add 'options.httpRoot' in the options object`);
  }

  /**
    Import every tasks

  */
  require('./src')(gulp, options);


  /**
    Increment the version number of the website

    @method inc
    @param {string} importance a semver bump type (patch/minor/major)
    @return {void} void
  */
  function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
      // bump the version number in those files
      .pipe(bump({ type: importance }))
      // save it back to filesystem
      .pipe(gulp.dest('./'))
      // commit the changed version number
      .pipe(git.commit('bumps package version'))
      // read only one file to get the version number
      .pipe(filter('package.json'))
      // **tag it in the repository**
      .pipe(tag_version());
  }


  /**
    Basic http server

  */
  gulp.task('connect', function() {
    return connect.server({
      port: options.port || 3000,
      livereload: options.livereload || true,
      root: options.httpRoot
    });
  });


  /**
    Default task

  */
  gulp.task('default', ['connect', 'watch'], function() {
    gulp.start('html', 'css', 'js', 'img');
  });


  /**
    Compress static resources

  */
  gulp.task('compress-images', ['img-deploy']);
  gulp.task('compress-resources', ['uglify', 'minify-css']);


  /**
    Deploy task

  */
  gulp.task('deploy', ['compress-images'], function() {
    gulp.start('html-deploy');
  });


  /**
    Clean before publish

  */
  gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
      .pipe(clean());
  });


  /**
    Watch task

  */
  gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss', ['css']);
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./**/*.hbs', ['html']);
  });


  /**
    Version control

  */
  gulp.task('patch', function() { return inc('patch'); })
  gulp.task('feature', function() { return inc('minor'); })
  gulp.task('release', function() { return inc('major'); })

}
