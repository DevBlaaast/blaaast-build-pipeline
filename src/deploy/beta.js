var rename = require('gulp-rename');
var awspublish = require('gulp-awspublish');
var parallelize = require('concurrent-transform');

module.exports = function (gulp) {

  // Deploy to beta
  gulp.task('publish-beta', function() {

    // create a new publisher using S3 options
    var publisher = awspublish.create({
      params: {
        Bucket: 'lehack40-beta'
      },
      accessKeyId: process.env.AWS_STATIC_HOST_KEY,
      secretAccessKey: process.env.AWS_STATIC_HOST_SECRET,
      region: 'eu-central-1'
    });

    // define custom headers
    var headers = {
      'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0'
    };
    var headersStatics = {
      'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    gulp.src(htmlPages)
      .pipe(awspublish.gzip({ ext: '.gz' }))
      .pipe(publisher.publish(headers, {
        // Always update index.html
        force: true
      }))
      .pipe(awspublish.reporter());

    gulp.src('./fonts/**')
      .pipe(rename(function (path) {
        path.dirname = 'fonts/' + path.dirname;
      }))
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
