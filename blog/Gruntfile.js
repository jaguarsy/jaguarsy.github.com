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
                'src/js/*.js',
                '!src/js/*.min.js'
            ]
        },

        clean: {
            after: {
                src: ['src/css/*.min.css', 'src/js/*.min.js']
            }
        },

        'http-server': {
            'dev': {
                root: './',
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
                    src: ['src/css/awesome.less'],
                    dest: 'src/css/',
                    filter: 'isFile',
                    flatten: true,
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            watch: {
                files: [{
                    'src/js/index.min.js': ['src/js/config.js', 'src/js/index.js']
                }]
            }
        },

        processhtml: {
            dist: {
                options: {
                    process: true
                },
                files: {
                    'index.html': ['src/index.html']
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
                    'index.html': 'index.html'
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['src/images/*'],
                        dest: './images',
                        flatten: true,
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
                        src: 'src/md/*.md',
                        dest: './md',
                        flatten: true,
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
                files: ['src/md/*.md', 'src/css/*.less', 'src/js/*.js', 'src/*.html',
                            'Gruntfile.js', '!src/css/*.min.css', '!src/js/*.min.js'],
                tasks: ['jshint', 'less', 'uglify', 'processhtml', 'htmlmin', 'markdown', 'clean:after', 'copy']
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

    grunt.registerTask('default', ['jshint', 'uglify', 'less',
        'processhtml', 'htmlmin', 'markdown', 'clean:after', 'copy', 'http-server', 'watch']);
};