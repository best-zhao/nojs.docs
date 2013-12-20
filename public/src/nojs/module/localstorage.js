/*
 * localStorage本地存储
 * nolure@vip.qq.com
 * 2013-11-25
 */
define(function(require){
    
    var localStorage = window.localStorage || (function(){
        //userData
        var o = document.getElementsByTagName("head")[0],
            n = window.location.hostname || "localStorage",
            d = new Date(),
            doc, agent;
            
        if( !o.addBehavior ){
            return {};
        }
        try{ 
            agent = new ActiveXObject('htmlfile');
            agent.open();
            agent.write('<s' + 'cript>document.w=window;</s' + 'cript><iframe src="/favicon.ico"></frame>');
            agent.close();
            doc = agent.w.frames[0].document;
        }catch(e){
            doc = document;
        }
        o = doc.createElement('head');
        doc.appendChild(o);
        d.setDate(d.getDate() + 365);
        o.addBehavior("#default#userData");
        o.expires = d.toUTCString();
        o.load(n);
        
        var root = o.XMLDocument.documentElement,
        attrs = root.attributes,
        prefix = "prefix_____hack__",
        reg1 = /^[-\d]/,
        reg2 = new RegExp("^"+prefix),
        encode = function(key){
            return reg1.test(key) ? prefix + key : key;
        },
        decode = function(key){
            return key.replace(reg2,"");
        };
        
        return {
            length: attrs.length,
            getItem: function(key){
                return (attrs.getNamedItem( encode(key) ) || {nodeValue: null}).nodeValue || root.getAttribute(encode(key)); 
            },
            setItem: function(key, value){
                root.setAttribute( encode(key), value); 
                o.save(n);
                this.length = attrs.length;
            },
            removeItem: function(key){
                root.removeAttribute( encode(key) ); 
                o.save(n);
                this.length = attrs.length;
            },
            clear: function(){
                while(attrs.length){
                    this.removeItem( attrs[0].nodeName );
                }
                this.length = 0;
            },
            key: function(i){
                return attrs[i] ? decode(attrs[i].nodeName) : undefined;
            }
        };
    })();
    
    return {
        length : localStorage.length,
        set : function(key, value){
            //iPhone/iPad 'QUOTA_EXCEEDED_ERR'
            if( this.get(key) !== undefined ){
                this.remove(key);
            }
            localStorage.setItem(key, value);
            this.length = localStorage.length;
        },
        get : function(key){
            var v = localStorage.getItem(key);
            return v === null ? undefined : v;
        },
        remove : function(key){ 
            localStorage.removeItem(key); 
            this.length = localStorage.length;
        },
        clear : function(){
            localStorage.clear();
            this.length = 0;
        },
        key : function(key){
            return localStorage.key(key);
        }
    };
})
