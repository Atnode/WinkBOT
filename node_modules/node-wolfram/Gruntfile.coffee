module.exports = (grunt) ->

    grunt.task.loadNpmTasks 'grunt-mocha-test'
    grunt.task.loadNpmTasks 'grunt-contrib-coffee'

    grunt.initConfig
        pkg: 
            grunt.file.readJSON('package.json')

        coffee:
            dist:
                files:
                    'dist/index.js': 'src/index.coffee'

        coffeelint:
            dev:
                files:
                    src: ['src/**/*.coffee']
            options:
                no_tabs: # using tabs!
                    level: 'ignore'
                indentation: # using tabs screws this right up
                    level: 'ignore'
                max_line_length: # I trust you
                    level: 'ignore'

        mochaTest:
            dist:
                options:
                    ui: 'bdd'
                    reporter: 'nyan'
                src:
                    'test/**/*.coffee'

    grunt.event.on 'coffee.error', (msg) ->
        grunt.log.write msg

    grunt.registerTask 'build', ['coffee:dist']
    grunt.registerTask 'test', ['build', 'mochaTest']
    grunt.registerTask 'default', ['build']
