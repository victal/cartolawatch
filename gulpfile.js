var gulp = require('gulp'),
    connect = require('gulp-connect'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    del = require('del');

gulp.task('server', function () {
    connect.server({
        port: 8000,
        livereload: true
    });
});


gulp.task('clean', function () {
    del.sync('dist/**', '!dist');
});

gulp.task('build', ['clean'], function () {
    return gulp.src('./*.html')
        .pipe(usemin({
            css: [rev()],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);
