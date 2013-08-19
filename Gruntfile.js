module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		dirs: {  
			src: 'js/nojs.module',  
		    dest: 'dist' 
		},  
        transport: {
        	options : {
		        //alias: '<%= pkg.spm.alias %>',
		    },
            dialog: {
            	options : {
            		paths : ['js']
		        },
                files : [
                    {	
                    	expand: true,
                    	cwd: 'js/',
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
        			'dest/nojs/noJS.js' : ['js/nojs/noJS.js','js/conf.js']
        		}
        	},
            dist: {
            	options : {
            		paths : ['js'],
            		include : 'all'
		        },
		        files : [
		        	{
		        		expand: true,
		        		cwd: '.build/',
		        		src : '**/*.js',
		        		dest : 'dest'
		        	}
		        ]
            },
        	global : {
        		options : {
        			noncmd : true
        		},
        		files : {
        			'dest/nojs/jquery.js':['.build/nojs/jquery.js','.build/nojs/ui.js']
        		}
        	}
        },
        concat123: {
            dist: {
            	options : {
            		paths : [''],
    				//include : 'relative',
    				noncmd: true
		        },
		       
		        files : {
		        	'dist/jquery,nojs.ui-core.js' : 
		        	['js/jquery.js','js/nojs.ui/core.js'],
		        	
		        	'dist/nojs.module-tree,nojs.ui-codelight,.-project-config.js' : 
		        	['js/nojs.module/tree.js','js/nojs.ui/codelight.js','project/config.js']
		        }
            }
        },
        uglify : {
        	options: {
        		banner: '/*12*/',
		    	mangle: {
		        	except: ['require']
		    	}
		    },
        	main : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'dist/',
	                	src : "*.js",
	                	dest : 'dist/',
	                	ext: ''
	                }
                ]
			}
        },
		clean : {
			build : ['.build','dest/**/*-debug.js'] //清除
		},
		watch: {			
			another: {
				files: ['js/**/*.js'],
				tasks: ['transport','concat','clean'],
				options: {
			    	// Start another live reload server on port 1337
			        livereload: 1337,
				},
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
	
    grunt.registerTask('default',['watch']);
};