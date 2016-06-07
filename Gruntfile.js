/*!
 * carph-app's Gruntfile
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
			jsSrcPath: 'src/script/',
			jsDistPath: 'dist/script/',
			cssDistPath: 'dist/css/',
			sassPath: 'src/sass/',
			viewsPath: 'views/'
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * Carph-app v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		clean: {
			all: ['<%= meta.jsDistPath %>','<%= meta.cssDistPath %>'],
			dev: ['<%= meta.jsDistPath %>','<%= meta.cssDistPath %>/*.css','!<%= meta.cssDistPath %>carph-app-mui*.css'],
			sourceMap: ['<%= meta.cssDistPath %>/**/*.map']
		},


		sass: {
			options: {
				banner: '<%= banner %>',
				style: 'expanded',
				unixNewlines: true
			},
			dist: {
				files: [
					{
						'<%= meta.cssDistPath %><%= pkg.name %>-mui.css': '<%= meta.sassPath %>mui/mui.scss',
					}
				]
			},
			biz:{
				files:[
					{
						'<%= meta.cssDistPath %><%= pkg.name %>-biz.css': '<%= meta.sassPath %>biz/<%= pkg.name %>-biz.scss',
					}
				]
			}
		},

		copy: {
			fonts: {
				expand: true,
				src: 'fonts/mui*.ttf',
				dest: '<%= meta.distPath %>/'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.distPath %>',
				src: ['**/mui*'],
				dest: '<%= meta.examplesPath %>'
			}
		},

		cssmin: {
			options: {
				banner: '', // set to empty; see bellow
				keepSpecialComments: '*', // set to '*' because we already add the banner in sass
				sourceMap: false
			},
			mui: {
				src: '<%= meta.cssDistPath %><%= pkg.name %>-mui.css',
				dest: '<%= meta.cssDistPath %><%= pkg.name %>-mui.min.css'
			},
			biz: {
				src: '<%= meta.cssDistPath %><%= pkg.name %>-biz.css',
				dest: '<%= meta.cssDistPath %><%= pkg.name %>-biz.min.css'
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {},
				mangle: true,
				preserveComments: false
			},
			mui: {
				src: '<%= concat.mui.dest %>',
				dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
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
					'<%= meta.sassPath %>**/*.scss',
					'<%= meta.jsSrcPath %>**/*.js',
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

		csslint: {
			options: {
				csslintrc: 'sass/.csslintrc'
			},
			src: [
				'<%= meta.distPath %>/css/<%= pkg.name %>.css',
			]
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
	grunt.registerTask('cleanAll', ['clean']);
	grunt.registerTask('dist-css', ['sass', 'cssmin', 'clean:sourceMap']);
	//grunt.registerTask('dist-js', ['concat', 'build-namespace', 'uglify']);
	
	grunt.registerTask('dist', ['clean:all', 'dist-css']);
	grunt.registerTask('build', ['dist']);
	grunt.registerTask('default', ['dist']);

	grunt.registerTask('dev',['clean:dev','sass:biz','cssmin:biz','clean:sourceMap']);


	//grunt.registerTask('build-namespace', generateNamespace);

	grunt.registerTask('server', ['dev','watch']);



	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};