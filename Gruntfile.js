/**
 * Created with IntelliJ IDEA.
 * User: a.protasov
 * Date: 13.08.13
 * Time: 12:39
 * To change this template use File | Settings | File Templates.
 */
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			release: [
				'dist'
			]
		},

		copy: {
			release: {
				files: [
					{
						expand: true,
						src: [
							'index.html',
							'assets/clouds.mp4',
							'assets/x_logo.png',
							'assets/clouds.webm',
						],
						dest: 'dist/'
					}
				]
			}
		},
		usemin: {
			html: [ 'dist/index.html' ]
		},
		uglify: {
			release: {
				options: {
					compress: true,
					report: 'gzip',
					mangle: true
				},
				files: {
					'dist/scripts/app.min.js': [
						'scripts/app.js'
					],
					'dist/scripts/libraries.min.js': [
						'bower_components/glitch-canvas/dist/glitch-canvas.min.js',
						'bower_components/moment/min/moment.min.js',
						'bower_components/angular/angular.min.js'
					]
				}
			}
		},
		cssmin: {
			release: {
				expand: true,
				cwd: '.',
				files: {
					'dist/styles/style.min.css': [
						'styles/style.css'
					]
				}
			}
		},
		rev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			files: {
				src: [
					'dist/scripts/*.min.js',
					'dist/styles/*.min.css'
				]
			}
		},
		jshint: {
			files: 'scripts/*.js'
		},
		compress: {
			main: {
				options: {
					archive: 'dist.zip'
				},
				files: [
					{ src: [ 'dist/**' ], dest: '' }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-rev');

	grunt.registerTask('validate', [ 'jshint' ]);
	grunt.registerTask('default', [ 'clean', 'cssmin', 'uglify', 'copy', 'rev', 'usemin' ]);
};