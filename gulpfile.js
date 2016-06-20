var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var order = require("gulp-order");
var rename = require('gulp-rename');
var merge = require('merge-stream');
var minify = require('gulp-minify-css');
var sass = require('gulp-sass');


gulp.task('js', function() {
  return gulp.src('javascript/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(order([
      "jquery-2.2.3.min.js",
      "jquery.flexslider.js",
      "angular.min.js",
      "materialize.min.js",
      "angular-materialize.min.js",
      "angular-flexslider.js",
      "app.js"
    ]))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets'));
});

gulp.task('styles', function() {

  return gulp.src('stylesheet/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets'));

});


gulp.task('watch', ['js', 'styles'], function() {
  gulp.watch('javascript/**/*.js', ['js']);
  gulp.watch('stylesheet/**.*', ['styles']);
});



gulp.task('dev:server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['javascript*', 'public/assets*']
  });
});



gulp.task('dev', ['watch', 'dev:server']);
