module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
        transport: {        	
            dialog: {
            	options : {
            		paths : ['src']
		        },
                files : [
                    {	
                    	expand: true,
                    	cwd: 'src/',
                        src : '**/*.js',
                        dest : '.build'
                    }
                ]
            }
        },
        concat: {
        	nojs : {
        		options : {
        			noncmd : true
        		},
        		files : {
        			'js/nojs/noJS.js' : ['src/nojs/noJS.js','src/conf.js'],
        			'js/conf.js' : ['src/conf.js']
        		}
        	},
            dist: {
            	options : {
            		paths : ['src'],
            		include : 'all'
		        },
		        files : [
		        	{
		        		expand: true,
		        		cwd: '.build/',
		        		src : '**/*.js',
		        		dest : 'js'
		        	}
		        ]
            },
        	global : {
        		options : {
        			noncmd : true
        		},
        		files : {
        			'js/nojs/jquery.js':['.build/nojs/jquery.js','.build/nojs/ui.js'],
        			'js/m/zepto.js':['.build/m/zepto.js','.build/m/ui.js']
        		}
        	}
        },
        clean : {
			build : ['.build','js/**/*-debug.js'] //清除
		},
        uglify : {
        	options: {
        		banner: '/*<%= pkg.author %>|<%= pkg.docs %>*/',
		    	mangle: {
		        	except: ['require']
		    	}
		    },
        	main : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'js/',
	                	src : "**/*.js",
	                	dest : 'js/',
	                	ext: ''
	                }
                ]
			},
        	min : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'src/',
	                	src : "**/*.js",
	                	dest : 'min/',
	                	ext: ''
	                }
                ]
			}
        },
		watch: {			
			another: {
				files: ['src/**/*.js'],
				tasks: ['transport','concat','clean','uglify'],
				options: {
			        livereload: 1337,
				},
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default',['transport','concat','clean','uglify']);
    grunt.registerTask('min',['uglify:min']);
    
};