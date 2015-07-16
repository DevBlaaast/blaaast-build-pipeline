module.exports = function(gulp, options) {

  require('./css/base')(gulp, options);
  require('./css/minify')(gulp, options);

  require('./js/base')(gulp, options);
  require('./js/uglify')(gulp, options);

  require('./html/base')(gulp, options);
  require('./html/build')(gulp, options);

  require('./images/base')(gulp, options);

  require('./deploy/beta')(gulp, options);
  require('./deploy/prod')(gulp, options);

}
