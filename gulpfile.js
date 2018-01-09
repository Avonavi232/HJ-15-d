'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    browserSync = require("browser-sync"),
    babel = require("gulp-babel"),
    reload = browserSync.reload;

var path = {
    build: {
        js: 'public/js/',
        css: 'public/css/'
    },
    src: {
        js: 'src/js/*.js',
        css: 'src/sass/*.sass'
    },
    watch: {
        html: '*.html',
        js: 'src/js/*.js',
        css: 'src/sass/*.sass'
    }
};

var config = {
    server: {
        baseDir: "."
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "Local Server"
};

gulp.task('html:build', function(){
    gulp.src(path.watch.html)
        .pipe(reload({stream:true}));
});


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        //.pipe(rigger())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});


gulp.task('style:build', function () {
    gulp.src(path.src.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('build', [
    'js:build',
    'style:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        console.log('1');
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('style:build');
        console.log('2');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
        console.log('3');
    });
});


gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', ['build', 'webserver', 'watch']);
// gulp.task('default', ['build' , 'watch']);