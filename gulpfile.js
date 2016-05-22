var gulp = require('gulp'),
    connect = require('gulp-connect'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    del = require('del'),
    ngTemplates = require('gulp-ng-templates');

gulp.task('server', ['templates'], function () {
    connect.server({
        port: 8000,
        livereload: true
    });
});

gulp.task('clean', function () {
    del.sync('dist/**', '!dist');
});

gulp.task('templates', function(){
    return gulp.src('app/fragments/*.html')
        .pipe(ngTemplates({
            file: 'templates.js',
            module: 'CartolaWatcher.templates',
            standalone: true,
            path: function (path, base) {
                return path.replace(base, 'app/fragments/');
            }
        }))
        .pipe(gulp.dest('app/'));
});


gulp.task('build', ['clean', 'templates'], function () {
    return gulp.src('./*.html')
        .pipe(usemin({
            css: [rev()],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);
