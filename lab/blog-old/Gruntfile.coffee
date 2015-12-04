module.exports = (grunt) ->

    # Project configuration
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            compile: 
                files: 
                    'apps/js/blog.js': ['apps/**/*.coffee']
        uglify:
            options:
                stripBanners: true
                banner: '/*! <%= pkg.name %>-<%= pkg.version %>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            build:
                src: 'apps/js/blog3.js'
                dest: 'apps/js/<%= pkg.name %>.min.js'

        concat:
            options: 
                separator: ';'
            dist: 
                src: ['public/js/*.js']
                dest: 'public/js/third-part.all.js'

        watch:
            build:
                files: ['apps/src/*.coffee']
                tasks: ['coffee', 'uglify']
                options:
                    spawn: false

    # Dependencies
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    grunt.registerTask 'default', [
        'coffee'
        'uglify'
        'watch'
    ]