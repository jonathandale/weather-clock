
module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev: {
        src: '.env'
      }
    },
    concat: {
      options: {},
      dist: {
        src: ['public/packages/bower/jquery/dist/jquery.min.js',
              'public/packages/bower/underscore/underscore.js',
              'public/packages/bower/moment/min/moment-with-locales.min.js',
              'public/packages/two.dev.min.js',
              'public/packages/bower/backbone/backbone.js',
              'public/packages/bower/backbone.marionette/lib/backbone.marionette.js',
              'public/packages/bower/backbone.advice/advice.js',
              'public/packages/bower/tweenjs/src/Tween.js',
              'public/packages/finger.js',
              'public/js/app.js',
              'public/js/mixins.js',
              'public/js/util.js',
              'public/js/nimbus.js',
              'public/js/layout.js',
              'public/js/currently.js',
              'public/js/precipitation.js',
              'public/js/outlook.js',
              'public/js/forecasts.js',
             ],
        dest: 'public/build/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/build/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/build/nimbus.css': ['public/css/nimbus.css', 'public/packages/normalize-css/normalize.css']
        }
      },
      minify: {
        expand: true,
        cwd: 'public/build',
        src: 'nimbus.css',
        dest: 'release',
        ext: '-<%= pkg.version %>.min.css'
      }
    },
    clean: {
      build: ['public/build/*'],
      release: ['release/*']
    },
    copy: {
      assets: {
        expand: true,
        cwd: 'public/assets/',
        src: ['**'],
        dest: 'release/assets',
        flatten: true,
        filter: 'isFile'
      },
      js: {
        expand: true,
        cwd: 'public/build/',
        src: ['<%= pkg.name %>-<%= pkg.version %>.min.js'],
        dest: 'release/',
        flatten: true,
        filter: 'isFile'
      },
      fonts: {
        expand: true,
        cwd: 'public/fonts/',
        src: ['**'],
        dest: 'release/fonts',
        flatten: true,
        filter: 'isFile'
      },
      images: {
        expand: true,
        cwd: 'public/images/',
        src: ['**'],
        dest: 'release/images',
        flatten: true,
        filter: 'isFile'
      }
    },
    jshint: {
      options: {
        browser: true,
        devel: true,
        globals: {
          jQuery: false,
          $: false,
          _: true
        }
      },
      beforeconcat: ['public/js/*.js', 'routes/*.js', 'app.js', 'Gruntfile.js']
    },
    compass: {
      dev: {
        options: {
          sassDir: 'sass',
          cssDir: 'public/css',
          imagesDir: 'public/images',
          relativeAssets: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['public/**/*.js', 'routes/*.js', 'app.js', 'Gruntfile.js'],
        tasks: 'jshint'
      },
      css: {
        files: 'sass/*.scss',
        tasks: 'compass',
        options: {
          livereload: true
        }
      }
    }
  });

  //Load tasks
  grunt.util._.each([
    'contrib-watch',
    'contrib-compass',
    'contrib-jshint',
    'contrib-concat',
    'contrib-uglify',
    'contrib-clean',
    'contrib-copy',
    'contrib-cssmin',
    'env'], function(task){
    grunt.loadNpmTasks('grunt-'+task);
  });

  //Start server
  grunt.registerTask('server', 'Start server', function(){
    var app = require('./app.js'),
        done = this.async();

    app.listen(app.get('port'), function() {
      console.log('\033[32mApp started on port '+app.get('port')+' in '+app.get('env')+' mode. \033[0m');
    }).on('close', done);
  });

  //Development
  grunt.registerTask('default', ['env:dev', 'jshint:beforeconcat', 'compass', 'server']);

  //Build
  //This task will lint, minify & concat files into a release folder, of which the version number will be taken from the package.json file
  grunt.registerTask('build', function(){
    //Need a check to see if version folder exists
    grunt.task.run(
      'jshint:beforeconcat',
      'concat',
      'uglify',
      'clean:release',
      'cssmin:combine',
      'cssmin:minify',
      'copy:js',
      'copy:fonts',
      'copy:images',
      'copy:assets',
      'clean:build'
    );
  });

  //Deploy
  // This task will deploy the version of the app in the release folder
};
