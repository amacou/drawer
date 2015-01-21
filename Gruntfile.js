 module.exports = function(grunt) {

  "use strict";

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner:
      '/*!\n' +
      ' * <%= pkg.filename %> v<%= pkg.version %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Licensed under <%= pkg.licenses %>\n' +
      ' * Author : <%= pkg.author %>\n' +
      ' * <%= pkg.authorUrl %>\n' +
      ' */\n',
    // ====================================================
    clean: {
      files: [
        '<%= pkg.dist %>',
        '<%= pkg.docs %>/js/*.js',
        '<%= pkg.docs %>/css/*.css',
        '<%= pkg.docs %>/vendor',
        '<%= pkg.assets %>/css/*.css',
        '<%= pkg.public %>'
      ]
    },
    // ====================================================
    less:{
      source: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: ['<%= pkg.filename %>.css.map'],
          sourceMapFilename: '<%= pkg.docs %>/css/<%= pkg.filename %>.css.map'
        },
        files: {
          '<%= pkg.docs %>/css/<%= pkg.filename %>.css': '<%= pkg.source %>/less/<%= pkg.filename %>.less'
        }
      },
      compress: {
        options: {
          compress: true
        },
        files: {
          '<%= pkg.docs %>/css/<%= pkg.filename %>.min.css': '<%= pkg.docs %>/css/<%= pkg.filename %>.css'
        }
      },
      docs: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: ['<%= pkg.filename %>.css.map'],
          sourceMapFilename: '<%= pkg.assets %>/css/docs.css.map'
        },
        files: {
          '<%= pkg.assets %>/css/docs.css': '<%= pkg.assets %>/less/docs.less'
        }
      },
      docsMin: {
        options: {
          cleancss: true
        },
        files: {
          '<%= pkg.assets %>/css/docs.min.css': '<%= pkg.assets %>/css/docs.css'
        }
      }

    },
    // ====================================================
    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      source: {
        options: {
          map: true
        },
        src: '<%= pkg.docs %>/css/<%= pkg.filename %>.css'
      },
      docs: {
        options: {
          map: true
        },
        src: '<%= pkg.assets %>/css/docs.css'
      }
    },
    // ====================================================
    csscomb: {
      options: {
        config: '<%= pkg.source %>/less/.csscomb.json'
      },
      source: {
        expand: true,
        cwd: '<%= pkg.docs %>/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.docs %>/css/'
      },
      docs: {
        expand: true,
        cwd: '<%= pkg.assets %>/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.assets %>/css/'
      }
    },
    // ====================================================
    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      source: {
        src: '<%= pkg.docs %>/css/*.css'
      },
      docs: {
        src: '<%= pkg.assets %>/css/*.css'
      }
    },
    // ====================================================
    csslint: {
      options: {
        csslintrc: '<%= pkg.source %>/less/.csslintrc'
      },
      source: [
        '<%= pkg.docs %>/css/<%= pkg.filename %>.css',
        '<%= pkg.assets %>/css/docs.css'
      ],
      dist: [
        '<%= pkg.dist %>/css/<%= pkg.filename %>.css',
        '<%= pkg.dist %>/css/<%= pkg.filename %>.min.css'
      ]
    },
    // ====================================================
    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      source:{
        options: {
          indentLevel: 2,
          beautify: true,
          mangle: false,
          compress:false
        },
        files :  {
          '<%= pkg.docs %>/js/jquery.<%= pkg.filename %>.js' : [
            '<%= pkg.source %>/js/<%= pkg.filename %>.js'
          ]
        }
      },
      minify:{
        files :  {
          '<%= pkg.docs %>/js/jquery.<%= pkg.filename %>.min.js' : [
            '<%= pkg.docs %>/js/jquery.<%= pkg.filename %>.js'
          ]
        }
      }
    },
    // ====================================================
    jshint: {
      options: {
        jshintrc: '<%= pkg.source %>/js/.jshintrc',
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      source: {
        src: [
          '<%= pkg.docs %>/js/jquery.<%= pkg.filename %>.js',
          '<%= pkg.docs %>/js/jquery.<%= pkg.filename %>.min.js'
        ]
      }
    },
    // ====================================================
    copy: {
      dist: {
        expand: true,
        cwd: './<%= pkg.docs %>',
        src: [
          'js/jquery.<%= pkg.filename %>.js',
          'js/jquery.<%= pkg.filename %>.min.js',
          'css/*.css',
          'css/*.map'
        ],
        dest: './<%= pkg.dist %>'
      },
      vendor: {
        expand: true,
        cwd: './',
        src: [
          'vendor/**'
        ],
        dest: './<%= pkg.docs %>'
      }
    },
    // ====================================================
    connect: {
      server: {
        options: {
          port: 9999,
          hostname: '0.0.0.0',
          base: '<%= pkg.public %>/',
          open: {
            server: {
              path: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>'
            }
          }
        }
      }
    },
    // ====================================================
    notify: {
      options: {
        title: '<%= pkg.filename %> Grunt Notify',
      },
      success:{
        options: {
          message: 'Success!',
        }
      }
    },
    // ====================================================
    bower: {
      install: {
        options: {
          targetDir: './vendor',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },
    // ====================================================
    jekyll: {
      dist: {
        options: {
          config: '_config.yml'
        }
      }
    },
    // ====================================================
    watch: {
      options: {
        spawn: false,
        livereload : true
      },
      grunt: {
        files: ['<%= jshint.grunt.src %>'],
        tasks: [
          'jshint:grunt',
          'notify'
        ]
      },
      js: {
        files: [
          '<%= pkg.source %>/js/*.js'
        ],
        tasks: [
          'uglify',
          'jshint:source',
          'jekyll',
          'notify'
        ]
      },
      html: {
        files: [
          '<%= pkg.docs %>/*.html',
          '<%= pkg.docs %>/_includes/*',
          '<%= pkg.docs %>/_posts/*',
          '<%= pkg.docs %>/_layouts/*'
        ],
        tasks: [
          'build-html',
          'notify'
        ]
      },
      less: {
        files: [
          '<%= pkg.source %>/less/*.less',
          '<%= pkg.source %>/less/**/*.less'
        ],
        tasks: [
          'build-less',
          'csslint',
          'jekyll',
          'notify'
        ]
      },
      docsLess: {
        files: [
          '<%= pkg.assets %>/less/*.less',
          '<%= pkg.assets %>/less/**/*.less'
        ],
        tasks: [
          'build-docsLess',
          'csslint',
          'jekyll',
          'notify'
        ]
      }
    },
    // ====================================================
    buildcontrol: {
      options: {
        dir: '<%= pkg.public %>',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:<%= pkg.repository.user %>/<%= pkg.filename %>.git',
          branch: 'gh-pages'
        }
      }
    }

  });

  // ====================================================
  grunt.registerTask('deploy', [
    'buildcontrol',
    'notify'
  ]);

  // ====================================================
  grunt.registerTask('build-less', [
    'less:source',
    'autoprefixer:source',
    'usebanner:source',
    'csscomb:source',
    'less:compress',
  ]);

  // ====================================================
  grunt.registerTask('build-docsLess', [
    'less:docs',
    'autoprefixer:docs',
    'usebanner:docs',
    'csscomb:docs',
    'less:docsMin',
    'csslint'
  ]);

  // ====================================================
  grunt.registerTask('build-js', [
    'uglify'
  ]);

  // ====================================================
  grunt.registerTask('build-html', [
    'jekyll'
  ]);

  // ====================================================
  grunt.registerTask('test', [
    'jshint',
    'csslint'
  ]);

  // ====================================================
  grunt.registerTask('build', [
    'clean',
    'bower',
    'copy:vendor',
    'build-less',
    'build-docsLess',
    'build-js',
    'build-html',
    'test',
    'copy:dist'
  ]);

  // ====================================================
  grunt.registerTask('travis', [
    'clean',
    'bower',
    'copy:vendor',
    'build-less',
    'build-docsLess',
    'build-js',
    'test',
    'copy:dist'
  ]);

  // ====================================================
  grunt.registerTask('default', function () {
    grunt.log.warn('`grunt` to start a watch.');
    grunt.task.run([
      'connect',
      'watch'
    ]);
  });

};
