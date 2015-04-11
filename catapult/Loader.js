//==========================================================
//==========================LOADER==========================
//==========================================================
function _Loader () {}

_Loader.prototype.templateCache = {};

//use in html templates...will stop images from loading during parse.
_Loader.prototype.img = function ( src , cls , style , action , value )
{
	var imgStr = "<img src='" + src + "'";
	if ( cls )
		imgStr += " class='"+cls+"'";
	if ( style )
		imgStr += " style='"+style+"'";
	if ( action )
		imgStr += " data-action='"+action+"'";
	if ( value )
		imgStr += " data-value='"+value+"'";
	
	return imgStr += " />";
}

_Loader.uid = 0;
_Loader.prototype.loadCSS = function ( url ) 
{
	this.loadAndInjectCSS( url );
}

//could funnel this through the tmp loader as well...formalize data replacement
_Loader.prototype.loadAndInjectCSS = function ( cssURL , doneFunk ) 
{
	if ( !cssURL )
		return doneFunk();
	
	var tpl = this.templateCache[cssURL];
	if ( !doneFunk )
		doneFunk = function(){};
	
	if ( window["CSS"] && window["CSS"][cssURL] ) {
		tpl = window["CSS"][cssURL]();
		this.templateCache[cssURL] = tpl;
		tpl.inject();
		doneFunk( tpl );
	}else if ( cssURL && !tpl ) {
		var me = this;
		$.ajax({
             url : GlobalVars.rootURL+cssURL+"?"+GlobalVars.version
            ,dataType: "text"
            ,success : function( cssContent ) {
				var tpl = new MicroCSS( cssContent , cssURL );
				me.templateCache[cssURL] = tpl;
				tpl.inject();
				
				setTimeout(function() {
					doneFunk( tpl );
				},0);
				
			}
        });
	}else{
		setTimeout(function() {
			doneFunk( tpl );
		},0);
	}
}

_Loader.prototype.loadAndRenderTmplt = function ( dom , templateURL , data , doneFunk , cssURL ) 
{
	this.loadTmplt( 
		 templateURL
		,function ( tpl ) {
			 dom.html( tpl.parse( data ) );
			 setTimeout(function() {
				doneFunk();
			 },0);
		 }
		,cssURL
	);
}

_Loader.prototype.loadAndPrependTmplt = function ( dom , templateURL , data , doneFunk , cssURL ) 
{
	this.loadTmplt( 
		 templateURL
		,function ( tpl ) {
			 dom.prepend( tpl.parse( data ) );
			 setTimeout(function() {
				doneFunk();
			 },0);
		 }
		,cssURL
	);
}

_Loader.prototype.loadAndAppendTmplt = function ( dom , templateURL , data , doneFunk , cssURL ) 
{
	this.loadTmplt( 
		 templateURL
		,function ( tpl ) {
			 dom.append( tpl.parse( data ) );
			 setTimeout(function() {
				doneFunk();
			 },0);
		 }
		,cssURL
	);
}

_Loader.prototype.loadAndParseTmplt = function ( templateURL , data , doneFunk , cssURL ) 
{
	this.loadTmplt( 
		 templateURL
		,function ( tpl ) {
			 
			 setTimeout(function() {
				 doneFunk( tpl.parse( data ) );
			 },0);
		 }
		,cssURL
	);
}
_Loader.prototype.loadTmplt = function ( templateURL , doneFunk , cssURL ) 
{
	var me = this;
	this.loadAndInjectCSS( cssURL 
		,function () {
			var tpl = me.getTemplate( templateURL );
			if ( !tpl ) {
				$.ajax({
		             url : GlobalVars.rootURL+templateURL+"?"+GlobalVars.version
		            ,dataType: "text"
		            ,success : function( templateContent ) {
						var tpl = new Microtemplate( templateContent , templateURL );
						me.templateCache[templateURL] = tpl;
						//process internal templates if there are any
						var tplDom = $( "<div>"+ tpl.content +"</div>" );
						tplDom.find("textarea.microtemplate").each(
							function ( index ) {
								var templateURL = $(this).attr("id");
								var templateContent = $(this).val();
								var tpl = new Microtemplate( templateContent , templateURL );
								me.templateCache[templateURL] = tpl;
							}
						);
						//console.log( "loadTmplt", me);
						tpl = me.templateCache[templateURL];//in case there is a textarea within with same url
						setTimeout(function() {
							doneFunk( tpl );
						 },0);
					}
		        });
			}else{
				
				setTimeout(function() {
					doneFunk( tpl );
				 },0);
			}
		}	
	);
}


//look up for already loaded templates...(within other templates for instance)
_Loader.prototype.getTemplate = function ( templateURL ) {
	var tpl = this.templateCache[templateURL];
	
	if ( window["JST"] && window["JST"][templateURL] ) {
		tpl = new JSTTemplate( window["JST"][templateURL] , templateURL );
		this.templateCache[templateURL] = tpl;
	}
	
	return tpl;
}

//assumes template is in system...
_Loader.prototype.getTemplateHTML = function ( templateURL , data ) 
{
	var tpl = this.getTemplate( templateURL );
	if ( !tpl ) {
		return templateURL + " not found";
	}else{
		return tpl.parse( data );
	}
}


_Loader.prototype.getURLParameter = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

_Loader.prototype.loadScripts = function ( scriptURLs , doneFunk , sequential ) 
{
	var url;

	//todo: figure out cache
	var uncachedScriptURLs = [];
	var tpl,script;
	for ( var i=0; i<scriptURLs.length; i++ ) {
		scriptURL = scriptURLs[i];
		tpl = this.templateCache[scriptURL];
		if ( !tpl ) {
			uncachedScriptURLs.push( scriptURL );
			this.templateCache[scriptURL] = true;
		}
	}

	if ( uncachedScriptURLs.length == 0 ) {
		if ( doneFunk )
    		doneFunk();
		return;
	}

	var scriptObj = {
		 loaded:0
		,scriptURLs:uncachedScriptURLs
		,total:uncachedScriptURLs.length
		,doneFunk:doneFunk
	};
	//console.log( scriptObj , "init" );
	
	if ( sequential && sequential == true ) {//doesn't work for variable types yet...
		url = scriptURLs[0];
    	if ( url.indexOf("http") != 0 ) {
    		url = GlobalVars.rootURL+scriptURLs[0]+"?"+GlobalVars.version;
    	}
		var me = this;
		$.getScript( url , function(){ me._loadScriptsWorker(scriptObj); } );
	}else{
		for ( var i=0; i<uncachedScriptURLs.length; i++ ) {
			url = uncachedScriptURLs[i];

			var is_css = url.lastIndexOf( ".css" ) == (url.length - 4);
			var is_js = url.lastIndexOf( ".js" ) == (url.length - 3 );
			
			if ( is_js ) {
				if ( url.indexOf("http") != 0 ) {
		    		url = GlobalVars.rootURL+uncachedScriptURLs[i]+"?"+GlobalVars.version;
		    	}
	    		$.getScript( url )
	    			.done(
	    				function ( script , textStatus ) {
//alert("JS:" + scriptObj.loaded +"|"+scriptObj.total);
	    					scriptObj.loaded++;
	    					if ( scriptObj.loaded >= scriptObj.total ) {
	    				    	if ( doneFunk ) {
	    				    		doneFunk();
	    				    	}	
	    				    }	
	    				}
	    			)
	    			.fail(function(jqxhr, settings, exception) {
	    				alert("JS Load FAIL");
	    				log( jqxhr );
	    				log( settings );
	    				log( exception );
	    			});;
 
			}else if ( is_css ) {
	    		//break the cache...it was set above
	    		this.templateCache[url] = false;
		    	this.loadAndInjectCSS( url ,
		    		function () {
						scriptObj.loaded++;
//alert( "CSS:" + scriptObj.loaded +"|"+scriptObj.total);
					    if ( scriptObj.loaded >= scriptObj.total ) {
					    	if ( doneFunk ) {
					    		doneFunk();
					    	}	
					    }	
					}	
		    	);
	    	}else{//is html template (allows for sloppy extension)
	    		//break the cache...it was set above
	    		this.templateCache[url] = false;
		    	this.loadTmplt( url ,
		    		function () {
						scriptObj.loaded++;
						
//alert("OTHER:" + scriptObj.loaded +"|"+scriptObj.total);
					    if ( scriptObj.loaded >= scriptObj.total ) {
					    	if ( doneFunk ) {
					    		doneFunk();
					    	}	
					    }	
					}	
		    	);
	    	}
		}
	}
}
	_Loader.prototype._loadScriptsWorker = function( scriptObj ) {
		scriptObj.loaded++;
	    if ( scriptObj.loaded >= scriptObj.total ) {
	    	if ( scriptObj.doneFunk )
	    		scriptObj.doneFunk();
	    }else{
	    	url = scriptObj.scriptURLs[scriptObj.loaded];
	    	if ( url.indexOf("http://") != 0 ) {
	    		url = GlobalVars.rootURL+scriptObj.scriptURLs[scriptObj.loaded]+"?"+GlobalVars.version;
	    	}
			var me = this;
			$.getScript( url , function(){ me._loadScriptsWorker(scriptObj); } );
	    }
	}

_Loader.prototype.checkForTemplate = function( template , doneFunk ) {
	var me = this;

	$.each( me.templateCache, function( key , val ){
		if ( key == template ) {
			doneFunk();
			return false
		}
	});
}


var Loader = new _Loader();




