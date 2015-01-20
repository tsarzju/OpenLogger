module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dynamic_mappings : {
        files: [
      	  {
            expand: true,     // Enable dynamic expansion.
            cwd: 'script/',      // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
            dest: 'build/',   // Destination path prefix.
            ext: '.js',   // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
          }
        ]
      }
    },
    jshint: {
      files: ['gruntfile.js', 'script/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch:{
      css: {
        files: ['scss/*.scss'],
        tasks: ['compass']
      },
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: 'css'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');


  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint','uglify', 'compass']);
};
