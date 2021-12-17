// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// Use dart-sass for @use
//sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
  return src("scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("styles", { sourcemaps: "." }));
}

// Watch Task
function watchTask() {
  watch(["scss/**/*.scss"], series(scssTask));
}

// Default Gulp Task
exports.default = series(scssTask, watchTask);

// // Build Gulp Task
// exports.build = series(scssTask, jsTask);
