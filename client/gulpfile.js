const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
    css: './src/css/**/*.css',
    js: './src/js/**/*.js',
    dist: './dist'
};

function styles() {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist + '/css'));
}

function scripts() {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist + '/js'));
}

function watchFiles() {
    gulp.watch(paths.css, styles);
    gulp.watch(paths.js, scripts);
}

exports.default = gulp.series(
    gulp.parallel(styles, scripts),
    watchFiles
);

exports.styles = styles;
exports.scripts = scripts;