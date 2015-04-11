
//==========================================================
//==========================JSTTemplate===================
//==========================================================


//just needed this to look like the MicroTemplate
//Differences:
// <% raw code %
// <%- escaped code %>
// <%= unescaped code %>


function JSTTemplate ( parseFunk , templateName )
{
	this.parseFunk = parseFunk;
	this.template_name = templateName;
}


JSTTemplate.prototype.parse = function( data ) {
	var result = this.parseFunk( data );
	return result;
};


//backfill missing underscore functions...
//look at Microtemplate for this...
/*if ( !window["_"] ) {
	window["_"] = {};
	window["_"].escape = Microtemplate.escape;	
}*/
	
