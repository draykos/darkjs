module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
         options: {
            separator: ';'
         },
         dist: {
            src: ['src/dark.base.js', 'src/dark.core.js', 'src/dark.launcher.js',],
            dest: 'dist/<%= pkg.name %>.js'
         }
      },
      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n'
         },
         dist: {
            files: {
               'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
         }
      },
      jshint: {
         // define the files to lint
         files: ['Gruntfile.js', 'src/dark*.js'],
         // configure JSHint
         options: {
            // more options here if you want to override JSHint defaults
            globals: {
               jQuery: true,
            }
         }
      },
      watch: {
         files: ['<%= jshint.files %>'],
         tasks: ['jshint']
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-concat');

   //grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
   grunt.registerTask('default', ['concat', 'uglify']);

};