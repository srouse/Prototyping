//==========================================================
//==========================GlobalVars========================
//==========================================================
function _GlobalVars () 
{
	this.is_iOS = false,
    p = navigator.platform;

	if( p === 'iPad' || p === 'iPhone' || p === 'iPod' ){
		this.is_iOS = true;
	}
}
_GlobalVars.prototype.constructor = _GlobalVars;

_GlobalVars.prototype.rootURL = "/";
_GlobalVars.prototype.version = "v01_00_00";

_GlobalVars.prototype.env = "ENV_PROD";

var GlobalVars = new _GlobalVars();
GlobalVars.ENV_DEV = "ENV_DEV";
GlobalVars.ENV_PROD = "ENV_PROD";