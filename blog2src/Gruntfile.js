/**
 * Created by jagua_000 on 2015/11/18.
 */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/* LogWeb v<%= pkg.version %> */\n',

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            build: [
                'gruntfile.js',
                'js/*.js',
                '!js/*.min.js'
            ]
        },

        clean: {
            before: {
                src: ['publish']
            },
            after: {
                src: ['css/*.min.css', 'js/*.min.js']
            }
        },

        'http-server': {
            'dev': {
                root: 'publish',
                port: 8001,
                host: '0.0.0.0',
                showDir: true,
                autoIndex: true,
                ext: 'html',
                // run in parallel with other tasks
                runInBackground: true,
                // specify a logger function. By default the requests are
                // sent to stdout.
                logFn: function (req, res, error) {
                }
            }
        },

        less: {
            dist: {
                options: {
                    banner: '<%= banner %>\n',
                    compress: true
                },
                files: [{
                    expand: true,
                    src: ['css/awesome.less'],
                    dest: 'css/',
                    filter: 'isFile',
                    flatten: true,
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            watch: {
                files: [{
                    'js/index.min.js': ['js/config.js', 'js/index.js']
                }]
            }
        },

        processhtml: {
            dist: {
                options: {
                    process: true
                },
                files: {
                    'publish/index.html': ['index.html']
                }
            }
        },

        htmlmin: {
            file: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '../blog2/index.html': 'publish/index.html',
                    'publish/index.html': 'publish/index.html'
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['md/*.md'],
                        dest: 'publish/',
                        filter: 'isFile'
                    }, {
                        expand: true,
                        src: ['md/*.md'],
                        dest: '../blog2/',
                        filter: 'isFile'
                    }
                ]
            }
        },

        markdown: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: 'md/*.md',
                        dest: 'publish/',
                        ext: '.md'
                    }, {
                        expand: true,
                        src: 'md/*.md',
                        dest: '../blog2/',
                        ext: '.md'
                    }
                ],
                options: {
                    markdownOptions: {
                        gfm: true,
                        highlight: 'manual',
                        codeLines: {
                            before: '<span>',
                            after: '</span>'
                        }
                    }
                }
            }
        },

        watch: {
            styles: {
                files: ['md/*.md', 'css/*.less', 'js/*.js', '*.html', 'Gruntfile.js', '!css/*.min.css', '!js/*.min.js'],
                tasks: ['clean:before', 'jshint', 'less', 'uglify', 'processhtml', 'htmlmin', 'markdown', 'clean:after']
            }
        }
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask('default', ['clean:before', 'jshint', 'uglify', 'less',
        'processhtml', 'htmlmin', 'markdown', 'clean:after', 'http-server', 'watch']);
};