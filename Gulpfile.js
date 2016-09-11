var gulp           = require("gulp"),
    concat         = require("gulp-concat"),
    uglify         = require("gulp-uglify"),
    sourcemaps     = require("gulp-sourcemaps"),
    less           = require("gulp-less");

var config = {
    paths: {
        javascript: {
            src:  ["src/js/**/*.js"],
            dest: "public/javascripts"
        },
        less: {
            src: ["src/less/**/*.less"],
            dest: "public/stylesheets"
        }
    }
};

gulp.task("scripts", function(){
    return gulp.src(config.paths.javascript.src)
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.javascript.dest));
});

gulp.task("less", function(){
    return gulp.src(config.paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat("main.min.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.less.dest));
});

gulp.task("build", ["scripts", "less"]);

gulp.task("default", ["build"], function(){
    gulp.watch(config.paths.javascript.src, ["scripts"]);
    gulp.watch(config.paths.less.src, ["less"]);
});