



jQuery.fn.extend({
	inject: function( tmpltURL , dataObj , doneFunk ) {
		if ( !dataObj ) {
			dataObj = {};
		}
		this.html(
			Loader.getTemplateHTML(
				 tmpltURL
				,dataObj
			)
		);
		
		this.attr("data-template", tmpltURL );
		//get rid of cache zombies...
		this.removeClass( "cache_*" );
		this.removeAttr( "data-cache" );
	},

	cacheInject: function( tmplt_url , cacheObjs ) {
		Cache.inject( this , tmplt_url , cacheObjs );
	}
});