'use strict';

// Require
var gulp        = require('gulp'),
    connect     = require('gulp-connect-php'),
    bowerFiles  = require('main-bower-files'),
    autoprefixer = require('gulp-autoprefixer'),
    less        = require('gulp-less'),
    sass        = require('gulp-sass'),
    minify      = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    plumber     = require('gulp-plumber'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin');

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
    return gulp.src([paths.dev.less+'*.{css,less}','!'+paths.dev.less+'helpers.less'])
    .pipe(plumber())
    .pipe(less())
    .pipe( autoprefixer(
        'last 2 version',
        '> 1%',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4' ) )
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
    return gulp.src(bowerFiles('**/*.js'))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.production.js));
});

gulp.task('vendor-css', function(){
    gutil.log(bowerFiles("**/*.{css,less}"));

    return gulp.src(bowerFiles('**/*.{css,less}'))
    .pipe(less())
    .pipe(concat('vendor.min.css'))
    .pipe(minify({keepSpecialComments:0}))
    .pipe(gulp.dest(paths.production.css));
});

gulp.task('vendor-sass', function(){
    return gulp.src(bowerFiles('**/*.scss'))
    .pipe(sass())
    .pipe(concat('bootstrap.min.css'))
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

//default task that runs task browser-sync ones and then watches php files to change. If they change browserSync is reloaded
gulp.task('default', ['css','js','vendor-css','vendor-js','fonts','images'], function () {
    gulp.watch('src/less/*.less', ['css']);
    gulp.watch('src/js/author.js', ['js']);
});
