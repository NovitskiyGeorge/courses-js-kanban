const { src, task, dest, watch, series, parallel } = require('gulp');
const eslint = require('gulp-eslint');
const gulpStylelint = require('gulp-stylelint');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const reporter = require('postcss-reporter');
const syntax_scss = require('postcss-scss');
const stylelint = require('stylelint');
const autoprefixer = require('gulp-autoprefixer');
const gls = require('gulp-live-server');

/*************  scss  ***********/
task('scss', () => {
  return src('./app/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest('./app/styles'));
});

task('scss:watch', () => {
  watch('./app/styles/**/*.scss',series('scss'));
});
/*************  /scss  ***********/



/*********** linting  **************/
task('eslint', () => {
  return src(['./app/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

task("scss-lint", () => {
  const stylelintConfig = {
    rules: require('./stylelint.json')
  }
  const processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true,
    })
  ];
  return src(['./app/**/*.scss'])
    .pipe(postcss(processors, { syntax: syntax_scss }));
});

exports.lint = series('eslint', 'scss-lint');

task('lint:watch', function () {
  watch('./app/**/*.*',  series('eslint', 'scss-lint'));
});
/*********** /linting  **************/


/************ server ****************/
task('serve', function() {
  var server = gls.static('app', 3000);
  server.start();
});
/************ /server ****************/

exports.start = parallel('scss:watch', 'serve', 'lint:watch');
