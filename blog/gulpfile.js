/**
 * Created by johnnycage on 15/12/4.
 */
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var markdown = require('gulp-markdown');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var inline = require('./node/gulp-inline/inline.js');
var createServer = require('./node/smart-http-server/index.js');
var highlight = require('gulp-highlight');

gulp.task('default', ['html', 'markdown', 'watch', 'copy', 'http-server']);

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(inline({
            base: 'src/',
            js: [jshint, uglify],
            css: [less, minifyCss],
            disabledTypes: [],
            ignore: []
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('markdown', function () {
    return gulp.src('src/md/*.md')
        .pipe(markdown())
        .pipe(rename({extname: '.md'}))
        .pipe(highlight())
        .pipe(gulp.dest('md'));
});

gulp.task('copy', ['copy-images']);

gulp.task('copy-images', function () {
    return gulp.src('src/images/*.*')
        .pipe(gulp.dest('images'));
});

gulp.task('http-server', function () {
    createServer();
});

gulp.task('watch', function () {
    gulp.watch(['src/css/*.*', 'src/js/*.*', 'src/*.html'], function (file) {
        return gulp.src('src/*.html')
            .pipe(inline({
                base: 'src/',
                js: [jshint, uglify],
                css: [less, minifyCss],
                disabledTypes: [],
                ignore: []
            }))
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest('./'));
    });

    gulp.watch(["src/md/*.md"], function (file) {
        return gulp.src('src/md/*.md')
            .pipe(markdown())
            .pipe(rename({extname: '.md'}))
            .pipe(gulp.dest('md'));
    });

    gulp.watch(["src/images/*.*"], function (file) {
        return gulp.src(file.path)
            .pipe(gulp.dest('images'));
    });
});