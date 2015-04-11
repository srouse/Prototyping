


//IM A SINGLETON!!!! USE Cache!!!!!
var CacheBase = function( ) {
	this.clearEntireCache();
};


CacheBase.prototype.toCache = function ( bucket , id , object , do_update ) 
{
	if ( !this.cache[bucket]  ) {
		this.cache[bucket] = {};
	}
		
	this.cache[bucket]["id_"+ id ] = object;

	/*
	 * Now go back into the templates and simply
	 * rerender them based on cached data. 
	 * */
	if ( do_update !== false ) {
		var lookupStr = "cache_" + bucket + "_" + id;
		var eles = $( "." + lookupStr );
		if ( eles.length > 0 ) {
			var me = this;
			eles.each( function () {
				var ele = $(this);
				ele.cacheInject( 
					ele.attr("data-template"), 
					JSON.parse( ele.attr("data-cache") )
				)
				
				ViewComp.clickaction( ele , "template_updated" ,  ele.attr("data-template") );
			});
		}
	}
	
}
CacheBase.prototype.set = CacheBase.prototype.toCache;

CacheBase.prototype.fromCache = function ( bucket , id , alt_object ) 
{
	if ( !this.cache[bucket]  ) {
		return alt_object;
	}
	if ( !this.cache[bucket]["id_"+id]  ) {
		return alt_object;
	}
	
	return this.cache[bucket]["id_"+id] ;
}
CacheBase.prototype.get = CacheBase.prototype.fromCache;

CacheBase.prototype.clearFromCache = function ( bucket , id , do_update ) 
{
	if ( !this.cache[bucket]  ) {
		return;
	}
	if ( !this.cache[bucket]["id_"+id]  ) {
		return;
	}
	delete this.cache[bucket]["id_"+id];
	
	/*
	 * Now go back into the templates and simply
	 * delete their content...we'll see how that goes. 
	 * */
	if ( do_update !== false ) {
		var lookupStr = "cache_" + bucket + "_" + id;
		var eles = $( "." + lookupStr );
		if ( eles.length > 0 ) {
			var me = this;
			eles.each( function () {
				var ele = $(this);
				
				ele.removeClass( "cache_*" );//get rid of zombie DOM
				ele.removeAttr("data-template");
				ele.removeAttr("data-cache");
				ele.html("");
			});
		}
	}
}
CacheBase.prototype.clearCacheBucket = function ( bucket , do_update ) 
{
	this.cache[bucket] = {};
	
	/*
	 * Now go back into the templates and simply
	 * delete their content...we'll see how that goes. 
	 * */
	if ( do_update !== false ) {
		var lookupStr = "cache_bucket_" + bucket;
		var eles = $( "." + lookupStr );
		if ( eles.length > 0 ) {
			var me = this;
			eles.each( function () {
				var ele = $(this);
				
				ele.removeClass( "cache_*" );//get rid of zombie DOM
				ele.removeAttr("data-template");
				ele.removeAttr("data-cache");
				ele.html("");
			});
		}
	}
}
CacheBase.prototype.clearEntireCache = function () 
{
	this.cache = {};
}


CacheBase.prototype.inject = function ( target , tmplt_url , cacheObjs ) 
{
	dataObj = {};
	
	var cacheObj,data_cls;
	data_cls = [];
	for ( var key in cacheObjs ) {
		dataObj[key] = Cache.fromCache( key , cacheObjs[key] );
		data_cls.push( "cache_" + key + "_" + cacheObjs[key] );
		data_cls.push( "cache_bucket_" + key );
	}

	var target = $(target);
	target.html(
		Loader.getTemplateHTML(
			 tmplt_url
			,dataObj
		)
	);
	
	target.attr("data-template", tmplt_url );
	target.addClass( data_cls.join(" ") );
	target.attr("data-cache" ,  JSON.stringify( cacheObjs ) );
}

CacheBase.prototype.templateHTML = function ( tmplt_url , cacheObjs , cacheAlts ) 
{
	dataObj = {};
	if ( !cacheAlts ) {
		cacheAlts = {};
	}
	
	var cacheObj,data_cls;
	data_cls = [];
	for ( var key in cacheObjs ) {
		dataObj[key] = Cache.fromCache( key , cacheObjs[key] , cacheAlts[key] );
		data_cls.push( "cache_" + key + "_" + cacheObjs[key] );
		data_cls.push( "cache_bucket_" + key );
	}

	var target = $("<div class='template_container'></div>");
	target.first().html(
		Loader.getTemplateHTML(
				tmplt_url
			,dataObj
		)
	);
	
	target.attr("data-template", tmplt_url );
	target.addClass( data_cls.join(" ") );
	target.attr("data-cache" ,  JSON.stringify( cacheObjs ) );
	
	var html = $('<div>').append( target ).html();
	return html;
}


var Cache = new CacheBase();

