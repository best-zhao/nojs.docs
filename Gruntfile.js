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
        clean : {
			build : ['.build','dest/**/*-debug.js'] //清除
		},
        uglify : {
        	options: {
        		banner: '/*nolure@vip.qq.com http://nolure.github.io/nojs.docs*/',
		    	mangle: {
		        	except: ['require']
		    	}
		    },
        	main : {
                files : [
                	{
	                	expand : true,
	                	cwd: 'dest/',
	                	src : "**/*.js",
	                	dest : 'dest/',
	                	ext: ''
	                }
                ]
			}
        },
		watch: {			
			another: {
				files: ['js/**/*.js'],
				tasks: ['transport','concat','clean','uglify'],
				options: {
			    	// Start another live reload server on port 1337
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
	
	grunt.registerTask('default',['transport','concat','clean']);
    //grunt.registerTask('default',['watch']);
};