module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		basename : '**',
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
            		paths : ['js'],
		            idleading : ''
		        },
                files : [
                    {	
                    	expand: true,
                        src : 'js/main.js',
                        dest : '.build',
                        rename : function(a){
                        	grunt.log.debug(a);
                        	return 'aa';
                        }
                    }
                ]
            }
        },
        concat: {
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
			build : ['dist'] //清除
		}
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-clean');
	
    grunt.registerTask('default',['uglify']);
};