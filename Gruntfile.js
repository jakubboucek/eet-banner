module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		base64: {
			binary: {
				files: {
					"dist/eet.svg.b64": "source/eet.svg"
				}
			}
		},
		less: {
			options: {
				compress: true,
			},
			main: {
				files: {
					"dist/style.css": "source/style.less"
				}
			},
		},
		copy: {
			banner: {
				src: 'source/banner.js',
				dest: 'dist/cs.js',
				options: {
					process: function(content, path) {
						grunt.config.set('css', grunt.file.read('dist/style.css'));
						grunt.config.set('icon', grunt.file.read('dist/eet.svg.b64'));
						grunt.config.set('l18n', grunt.file.readJSON('source/l18n.cs.json'));
						grunt.config.set('options', grunt.file.readJSON('source/options.json'));
						return grunt.template.process(content);
					}
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>\n *  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> (<%= pkg.author.url %>) */\n'
			},
			build: {
				files: {
					'build/cs.js': ['dist/cs.js']
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-base64');

	grunt.registerTask('default', ['base64','less','copy','uglify']);
};
