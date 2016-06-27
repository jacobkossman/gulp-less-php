'use strict';

// Require
var gulp        = require('gulp'),
    connect     = require('gulp-connect-php'),
    bower       = require('main-bower-files'),
    less        = require('gulp-less'),
    minify      = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    plumber     = require('gulp-plumber'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin'),
    browserSync = require('browser-sync');

// Paths
var paths = {
    'dev': {
        'less'   : './src/less/',
        'js'     : './src/js/',
        'vendor' : './src/vendor/',
        'images' : './src/img/',
        'fonts'  : './src/fonts/'
    },
    'production': {
        'css'    : './dist/assets/css/',
        'js'     : './dist/assets/js/',
        'fonts'  : './dist/assets/fonts/',
        'images' : './dist/assets/img/'
    }
};

gulp.task('css', function() {
    return gulp.src(paths.dev.less+'author.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(concat('author.min.css'))
    .pipe(gulp.dest(paths.production.css))
    .pipe(notify("CSS compilation successful!"));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
        'bower_components/font-awesome/fonts/fontawesome-webfont.*'
    ])
    .pipe(gulp.dest(paths.production.fonts));
});

// JS
gulp.task('js', function(){  
    return gulp.src(paths.dev.js+'author.js')
    .pipe(concat('author.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.production.js))
    .pipe(notify("JS compilation successful!"));
});

// Tasks
gulp.task('vendor-js', function(){
    return gulp.src(bower('**/*.js'))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.production.js));
});

gulp.task('vendor-css', function(){
    return gulp.src(bower('**/*.{css,less}'))
    .pipe(less())
    .pipe(concat('vendor.min.css'))
    .pipe(minify({keepSpecialComments:0}))
    .pipe(gulp.dest(paths.production.css));
});

gulp.task('images', function() {
    return gulp.src(paths.dev.images+'**/*.{png,jpg,gif}')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(paths.production.images))
    .pipe( notify( { message: 'Images task complete', onLast: true } ) );
});

gulp.task('fonts', function() {
    return gulp.src(paths.dev.fonts+'**/*.{woff,woff2}')
    .pipe(gulp.dest(paths.production.fonts))
    .pipe( notify('Fonts task complete') );
});

//task that fires up php server at port 8001
gulp.task('connect', function(callback) {
  connect.server({
    port: 8001,
    base: 'dist'
  }, callback);
});

//task that fires up browserSync proxy after connect server has started
gulp.task('browser-sync',['connect'], function() {
    browserSync({
      injectChanges: true,
      reloadDelay: 2000,
      proxy: '127.0.0.1:8001',
      port: 8910
  });
});

//default task that runs task browser-sync ones and then watches php files to change. If they change browserSync is reloaded
gulp.task('default', ['css','js','vendor-css','vendor-js','fonts','images','browser-sync'], function () {
    gulp.watch(['**/*.php'], browserSync.reload);
    gulp.watch('src/less/*.less', ['css']).on('change', browserSync.reload);

});