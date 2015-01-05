var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc');

gulp.task('lint', function(){
	return gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('docs', function(){
	gulp.src(["*.js", "README.md"])
	  .pipe(jsdoc('./docs'));
});

gulp.task('watch', function(){
	gulp.watch('*.js', ['lint']);
});

gulp.task('default', ['lint']);