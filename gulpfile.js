var browserify = require('browserify');
var gulp   = require('gulp');
var react = require('gulp-react');
var source = require("vinyl-source-stream");
var babelify = require('babelify');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// gulp.task('lint', function() {
//   return gulp.src('./lib/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
// });

gulp.task('cssjoin', function(done) {
	var theme = gulp.src([
			"node_modules/normalize.css/normalize.css"
		])
		.pipe(concat('vendor.min.css'))
		//still need minification step here
		.pipe(gulp.dest('./public/css'));
	done();
});

// comes from gulp recipe https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
var customOpts = {
  entries: ['./src/js/App.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 
b.transform(babelify);

b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('react', bundle);
function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.build.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    //comment uglify for debugging
    //.pipe(uglify()) 
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/js'));
}

gulp.task('default', ['express', 'watch']);
gulp.task('express', ['cssjoin', 'react'], function(done) {
 	var env = Object.create( process.env );
	server = spawn("node", ['./server.js'], { env: env });
	gutil.log('Server started');
	
	server.stdout.on('data', function (data) {
	  gutil.log(""+data);
	});
	server.stderr.on('data', function (data) {
	  gutil.log('Server error: ' + data);
	});
	server.on('exit', function (code) {
	  gutil.log('Server exited with code ' + code);
	});
	
	done();
});
gulp.task('watch', ['express'], function(done){
	var watcher = gulp.watch(["lib/*.js"], ['default']);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', restarting server...');
	  watcher.end();
	  server.kill('SIGKILL');
	  done();
	});
});