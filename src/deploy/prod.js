var rename = require('gulp-rename');
var awspublish = require('gulp-awspublish');
var parallelize = require('concurrent-transform');

module.exports = function (gulp, options) {

  // Deploy to S3
  gulp.task('publish', function() {

    // create a new publisher using S3 options
    var publisher = awspublish.create({
      params: {
        Bucket: 'www.lehack40.fr'
      },
      accessKeyId: process.env.AWS_STATIC_HOST_KEY,
      secretAccessKey: process.env.AWS_STATIC_HOST_SECRET,
      region: 'eu-central-1'
    });

    // define custom header s
    var headers = {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0'
    }; // No cache for index.html
    var headersStatics = {
      'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    options.htmlPages.forEach(function (page) {
      return gulp.src(page)
        .pipe(rename(function (path) {
          if (page.split('/')[1] !== 'index.html') {
            path.dirname = page.split('/')[1];
          }
        }))
        .pipe(awspublish.gzip({ ext: '.gz' }))
        .pipe(publisher.publish(headers, {
          // Always update index.html
          force: true
        }))
        .pipe(awspublish.reporter());
    });

    gulp.src('./fonts/**')
      .pipe(rename(function (path) {
        path.dirname = 'fonts/' + path.dirname;
      }))
      .pipe(awspublish.gzip())
      .pipe(parallelize(publisher.publish(headersStatics), 50))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());

    // Favicon upload
    gulp.src(['./*.png', './manifest.json', './*.ico'])
      .pipe(awspublish.gzip())
      .pipe(parallelize(publisher.publish(headersStatics), 50))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());

    return gulp.src('./build/**')
      .pipe(rename(function (path) {
        path.dirname = 'build/' + path.dirname;
      }))
      .pipe(awspublish.gzip())
      .pipe(parallelize(publisher.publish(headersStatics), 50))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
  });

}
