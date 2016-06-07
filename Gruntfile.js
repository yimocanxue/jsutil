/*!
 * jsutil's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	RegExp.quote = function(string) {
		return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			distPath: 'dist/',
			srcPath: 'src/'
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * jsutil v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		clean: {
			all: ['<%= meta.distPath %>**/*.js','<%= meta.distPath %>**/*.map']
		},

		concat: {
			options: {
					banner: '<%= banner %>'
			},
			all: {
				src: [
					'<%= meta.srcPath %>__CK.js',
					'<%= meta.srcPath %>__ST.js',
					'<%= meta.srcPath %>__DT.js',
					'<%= meta.srcPath %>*.js',
				],
				dest: '<%= meta.distPath %>__<%= pkg.name %>.js',
			}
		},


		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {},
				mangle: true,
				preserveComments: false
			},
			all: {
				src: '<%= meta.distPath %>__<%= pkg.name %>.js',
				dest: '<%= meta.distPath %>__<%= pkg.name %>.min.js'
			}
		},

		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			scripts: {
				files: [
					'<%= meta.srcPath %>**/*.js',
				],
				tasks: 'dev'
			}
		},

		jshint: {
			options: {
				jshintrc: 'js/.jshintrc'
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				src: 'js/*.js'
			}
		},

		jscs: {
			options: {
				config: 'js/.jscsrc'
			},
			grunt: {
				src: '<%= jshint.grunt.src %>'
			},
			src: {
				src: '<%= jshint.src.src %>'
			},
			docs: {
				src: '<%= jshint.docs.src %>'
			}
		},

		sed: {
			versionNumber: {
				pattern: (function() {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				})(),
				replacement: grunt.option('newver'),
				recursive: true
			}
		}
	});
	// Load the plugins
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	require('time-grunt')(grunt);

	// Default task(s).
	grunt.registerTask('build', ['clean','concat','uglify']);
	grunt.registerTask('default', ['build']);


	grunt.registerTask('server', ['dev','watch']);



	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};