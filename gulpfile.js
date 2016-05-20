var gulp = require('gulp'),
    connect = require('gulp-connect');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('server', function(){
  connect.server({
    port: 8000,
    livereload: true
  });
});

gulp.task('build', function() {
  return gulp.src('./*.html')
  .pipe(usemin({
    css: [ rev() ],
    js: [ uglify(), rev() ],
  }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);
