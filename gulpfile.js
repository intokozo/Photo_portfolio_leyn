"use strict"; /* Строгий режим разработки */

const {src, dest} = require("gulp"); /* Создание переменных для чтения(src) и запись(dest) файлов */
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const del = require("del");
const cssbeautify = require("gulp-cssbeautify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass");
const removeComments = require("gulp-strip-css-comments");
const uglify = require("gulp-uglify");


var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/images/"
    },
    src: {
        html: "src/**/*.pug",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/style.sass",
        images: "src/assets/images/**/*.{jpg,png,svg,gif,ico}"
    },
    watch: {
        html: "src/**/*.pug",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.sass",
        images: "src/assets/images/**/*.{jpg,png,svg,gif,ico}"
    },
    clean: "./dist"
}

/* Tasks */
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browsersync.reload({stream:true});
}


function html() {
    return src([path.src.html, '!src/includes/**/*.pug'], { base: "src/" })
        .pipe(pug({pretty:true}))
        .pipe(rigger())
        .pipe(plumber())
        .pipe(dest(path.build.html))
        .pipe(browsersync.reload({stream:true}));
}

function css() {
    return src(path.src.css, { base: "src/assets/sass/" })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.reload({stream:true}));
}

function js() {
    return src(path.src.js, { base: "./src/assets/js/" })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.reload({stream:true}));
}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;


