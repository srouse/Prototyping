
//==========================================================
//==========================MicroCSS============================
//==========================================================
function MicroCSS ( css , templateName )
{
	this.css = css.replace( /<#=ROOT_URL#>/g , GlobalVars.rootURL );//need at least ROOT_URL...not much else so hardcoded right now...
	this.css = this.css.replace( /<%- GlobalVars.assetsURL %>/g , GlobalVars.assetsURL );
	this.css = this.css.replace( /<%-GlobalVars.assetsURL%>/g , GlobalVars.assetsURL );
	this.css = this.css.replace( /<%- GlobalVars.rootURL %>/g , GlobalVars.rootURL );
	this.css = this.css.replace( /<%-GlobalVars.rootURL%>/g , GlobalVars.rootURL );
	this.css = this.css.replace( /<%- GlobalVars.version %>/g , GlobalVars.version );
	this.css = this.css.replace( /<%-GlobalVars.version%>/g , GlobalVars.version );

	this.template_name = templateName;
}

MicroCSS.prototype.inject = function() {
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    //l og("MicroCSS");
    if (styleElement.styleSheet) {   // IE
        styleElement.styleSheet.cssText = this.css;
    } else {                // the world
        styleElement.appendChild(document.createTextNode(this.css));
    }
    head.appendChild(styleElement);
 }

