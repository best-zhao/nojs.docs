define(function(require,$,ui){
    var data = {};
    
    data.onHashChange = [];
	function setUrl(key, value){
	    //@value: null清空参数undefined获取参数值 否则设置参数值
		var hash = location.hash.replace(/^#/,'').split('&'),
            i, m, _hash = {};
		
		
		key = key || 'id';
	
		for( i=0; i<hash.length; i++ ){
		    if( !hash[i] ){
		        continue;
		    }
		    m = hash[i].split('=');		    
		    _hash[m[0]] = m[1];
		}
		
		if( value==_hash[key] ){
			return _hash[key];
		}
		
		if( value===null ){
		    delete _hash[key];
		}else if( value===undefined ){
            return _hash[key];
        }else{
		    _hash[key] = value;
		}
		
		hash = [];	
		for( i in _hash ){
		    hash.push(i+'='+_hash[i]);
		}
		data.setUrl.call && data.setUrl.call();
		location.hash = hash.join('&');
	}
	data.setUrl = setUrl;
	function getChange(e){
	    var newHash = getChange.hash(e.newURL),
            oldHash = getChange.hash(e.oldURL);
            
        if( newHash.source ){
            return 'source';
        }else if( newHash.demo ){
            return 'demo';
        }else{
            return 'id';
        }
	}
	getChange.hash = function(url){
        var hash = url.split('#')[1], rect = {}, i = 0, m;
        if( hash ){
            hash = hash.split('&');
        }else{
            hash = [];
        }
        for( ; i<hash.length; i++ ){
            m = hash[i].split('=');
            rect[m[0]] = m[1];
        }
        return rect;
    }
    data.getChange = getChange;
    
	if( typeof onhashchange!='undefined' ){
        var i, n, _data, event = data.onHashChange;
        
        window.onhashchange = function(e){
            n = event.length;
            _data = {};
            _data.id = setUrl();
            _data.key = getChange(e);
            
            for( i=0; i<n; i++ ){
                event[i](e, _data);
            }
        }
    }
	return data;
});