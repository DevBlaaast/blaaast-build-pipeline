// Exclude gulp-sass or build breaks on the CMS
if (process.env.NODE_ENV !== 'production') {
  var sass = require('gulp-sass');
  var uncss = require('gulp-uncss');
}

var minifyCSS = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

module.exports = function (gulp, options) {

  gulp.task('minify-css', function() {
    var manifest = gulp.src('./build/rev-manifest.json');

    var uncssOpts = [
      /^\.js/,
      /velocity/,
      /(#|\.)fancybox(\-[a-zA-Z]+)?/,
      // Bootstrap selectors added via JS
      /\w\.in/,
      '.modal-open',
      '.modal-backdrop.fade.in',
      '.modal-open .modal',
      '.fade',
      '.fade.in',
      '.collapse',
      '.collapse.in',
      '.collapsing',
      /(#|\.)navbar(\-[a-zA-Z]+)?/,
      /(#|\.)dropdown(\-[a-zA-Z]+)?/,
      /(#|\.)btn(\-[a-zA-Z]+)?/,
      /(#|\.)(open)/,
      // currently only in a IE conditional, so uncss doesn't see it
      '.close',
      '.alert-dismissible',
      // Font awesome
      /^\.fa/
    ].concat(options.uncssOpts);

    return gulp.src('./scss/main.scss')
      .pipe( sass() )
      .pipe( uncss({
        html: options.htmlPages,
        // To make Bootstrap work
        ignore: uncssOpts
      }))
      .pipe(autoprefixer({
        browsers: ['> 1%'],
        cascade: false
      }))
      .pipe( minifyCSS() )
      .pipe( rev() )
      .pipe( gulp.dest('./build/css') )
      .pipe( revReplace({ manifest: manifest }) )
      .pipe( gulp.dest('./build/css') )
      .pipe( rev.manifest({
        path: 'build/rev-manifest.json',
        merge: true,
        base: process.cwd() + '/build'
      }))
      .pipe( gulp.dest('./build') )
      .pipe( plumber() )
  });

}
