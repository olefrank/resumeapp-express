"use strict";

const gulp = require("gulp"),
      concat = require("gulp-concat"),
      uglify = require("gulp-uglify"),
      sourcemaps = require("gulp-sourcemaps"),
      less = require("gulp-less"),
      babelify = require('babelify'),
      browserify = require('browserify'),
      rename = require('gulp-rename'),
      livereload = require('gulp-livereload'),
      gutil = require('gulp-util'),
      chalk = require('chalk'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      watchify = require('watchify'),
      merge = require('utils-merge'),
      duration = require('gulp-duration'),
      stripDebug = require('gulp-strip-debug'),
      changed = require('gulp-changed'),
      imagemin = require('gulp-imagemin');



////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////
const config = {
    paths: {
        javascript: {
            src:  ["src/js/**/*.js"],
            dest: "public/javascripts"
        },
        less: {
            src: ["src/less/**/*.less"],
            dest: "public/stylesheets"
        },
        js: {
            src: './src/js/main.js',
            watch: './src/js/*',
            outputDir: './public/javascripts',
            outputFile: 'build.js'
        }
    }
};

// Error reporting function
const mapError = (err) => {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
};

// Completes the final file outputs
var bundle = function(bundler) {
    var bundleTimer = duration('Javascript bundle time');
    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source(config.paths.js.src)) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename(config.paths.js.outputFile)) // Rename the output file
        .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
        .pipe(concat("app.min.js"))
        //.pipe(stripDebug()) // ofj: only in production
        .pipe(uglify())
        .pipe(sourcemaps.write('.')) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.paths.js.outputDir)) // Set the output folder
        .pipe(bundleTimer)
        .pipe(livereload());
};



////////////////////////////////////////////////
// TASKS
////////////////////////////////////////////////

// Gulp task for build
gulp.task('javascript', function() {
    livereload.listen();
    var args = merge(watchify.args, { debug: true });

    var bundler = browserify(config.paths.js.src, args) // Browserify
        .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']})
        .transform(babelify, {presets: ['es2015']});

    // Run the bundle the first time (required for Watchify to kick in)
    bundle(bundler);

    // Re-run bundle on source updates
    bundler.on('update', function() {
        bundle(bundler);
    });
});


// minify new images
gulp.task('imagemin', function() {
    let src = './src/images/**/*.{jpg,png,gif,svg,ico}';
    let dest = './public/images';

    gulp.src(src)
        .pipe(changed(dest))
        .pipe(imagemin())
        .pipe(gulp.dest(dest));
});

gulp.task("less", function(){
    return gulp.src(config.paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat("main.min.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.less.dest));
});

gulp.task("build", ["javascript", "less", "imagemin"]);

gulp.task("default", ["build"], function(){
    gulp.watch(config.paths.js.watch, ["javascript"]);
    gulp.watch(config.paths.less.src, ["less"]);
});




