const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            // baseDir: "src"  было
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        // .pipe(gulp.dest("src/css"))   было
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    //  задача будет обрабатывать html-код
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

// функционал "html"
gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
});
// преобразлвание файлов в папке js и перемещаем эти файлы в dist/js
gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")  // получаем все файлы из папки js
        .pipe(gulp.dest('dist/js'));
});
// дальнейшие дествия с папками в src будут похожи результат будет помещен в dist
gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('dist/fonts'));
});
gulp.task('icon', function () {
    return gulp.src("src/icon/**/*")
        .pipe(imagemin())     //пробуем преобразовать(оптимизировать) иконки
        .pipe(gulp.dest('dist/icon'));
});
gulp.task('mailer', function () {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest('dist/mailer'));
});
gulp.task('images', function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'html', 'scripts', 'fonts', 'icon', 'mailer', 'images'));

// CSS postprocessing: group media queries.
// Useful for postprocessing preprocessed CSS files.
// var gulp = require('gulp');
// var gcmq = require('gulp-group-css-media-queries');

// gulp.task('default', function () {
//     gulp.src('src/style.css')
//         .pipe(gcmq())
//         .pipe(gulp.dest('dist'));
// });