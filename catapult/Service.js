/**
 * Base class for AJAX commands. This class should not be called directly, but extended.
 * The extending class should define the url.
 * 
 * Example usage:
 * var cmd = new mg_shell_cmd_LoginService();
 * cmd.execute( { username : 'test', password : 'test' }, successFunk , errorFunk , true );
 * 
 */
function Service()
{
}

/**
 * @var string A string containing the URL to which the request is sent.
 */
Service.prototype.url = '';

/**
 * @var object Data to be sent to the server. It will be converted to a query string.
 */
Service.prototype.data = {};

Service.prototype.dataType = 'json';

Service.prototype.jsonpCallback = false;

Service.prototype.timeout = false;

Service.prototype.ajaxCall;

Service.prototype.is_loading;

/**
 * @var string Request type (eg. GET, POST)
 */
Service.prototype.type = 'POST';

/**
 * @var object The object that called this command.
 */
Service.prototype.scope = '';
Service.prototype.successFunk = '';
Service.prototype.errorFunk = '';


/**
 * Triggers ajax request
 * @param object Data to be sent to the server.
 * @param object scope
 * @param boolean encodeArgs. If true, data is wrapped into a single parameter that is JSON formated 
 */
Service.prototype.execute = function( data , successFunk , errorFunk , encodeArgs )
{
	if ( encodeArgs === true )
		data =  {params:JSON.stringify( data ).replace( "'" , "&apos;" )};//RIA.serializeJSData(data)};
	
	
	if ( $.isPlainObject( data ) || $.isArray( data ) ) {
		data = $.param( data );
	}
	this.data = data;
	//this.scope = scope;
	this.successFunk = successFunk;
	this.errorFunk = errorFunk;
	var me = this; 
	
    if( this.url == '' ) { 
    	log( 'No url set in command' );//this.me );
    	return; 
    }
    
    this.is_loading = true;
    
    if ( this.ajaxCall && this.ajaxCall.abort ) {
    	this.ajaxCall.abort();
    }
    
	if ( this.dataType == 'jsonp' ) {
		var args = {
			 type: "GET"
			,url: this.url
			,dataType : 'jsonp'
			,data: data
			,jsonp: 'callback'
			,timeout : 10000			
			,success: function( data, textStatus, XMLHttpRequest ) {
	    		me.validateJson( data, textStatus );
			}
			,error: function( XMLHttpRequest, textStatus, errorThrown ) {
				me.failure( textStatus, errorThrown );
			}
		};
		
		if ( this.jsonpCallback != false ) {
			args.jsonpCallback = this.jsonpCallback;
		}
		if ( this.timeout != false ) {
			args.timeout = this.timeout;
		}
		
		this.ajaxCall = $.ajax(args);
	}else{
		this.ajaxCall = $.ajax({
			 type: this.type
			,url: this.url
			,dataType : 'json'
			,data: data
			,success: function( data, textStatus, XMLHttpRequest ) {
				me.validateJson( data, textStatus );
			}
			,error: function( XMLHttpRequest, textStatus, errorThrown ) {
				try {
					var errorObj = RIA.decode(XMLHttpRequest.responseText);
					me.validateJson( errorObj , textStatus );
					return;
				}catch(e) {
					me.failure( textStatus, errorThrown );
				}
				me.failure( textStatus, errorThrown );
				
			}
		});	
	}
}

/*function Service_jsonp_callback ( data ) {
	self.validateJson( data );
}*/
 

/**
 * Validates format of json response. There must be a 'success' property.
 * Triggers the success or failure functions.
 * Example:
 * 	{"success":"true"
 *	,"name":"home/login" 
 *	,"result":{userid:'3',username:'joe',name:'billy bob'}
 *	,"error":{"id":"ERROR_NONE","details":""}
 * 	}
 * @param object parsed from JSON results
 * @param string describing the status  
 */
Service.prototype.validateJson = function( results, status )
{
	var self = this;
	this.jsonresults = results;
	this.is_loading = false;
	try {
		var successFound = false;
		$.each( results, function(name, value) {
			if( name == 'success') {
		    	if( value == "false" || value == false ){
		    		self.failure( 'SERVER_ERROR' , results.body );
		    		successFound = true;
		    		return;
		    	}else{
		    		self.success( results, status );
		    		successFound = true;
		    		return;
		    	}
		    }
		    //jam in "status" for wordpress api
		    if ( name == "status" ) {
		    	if( value == "error" ){
		    		self.failure( 'SERVER_ERROR' , results.body );
		    		successFound = true;
		    		return;
		    	}else{
		    		self.success( results, status );
		    		successFound = true;
		    		return;
		    	}
		    }
		});
		
		//results object didn't have success property!
		if(!successFound) {
			//log(results);
			self.failure( 'ERROR_JSON_PARSE', {} );
		}
	}catch ( err ) {;
		self.failure( 'ERROR_TRY' , err );
	}	
}

/**
 * @param object parsed from JSON results
 * @param string describing the status  
 */
Service.prototype.success = function( results, status )
{
	this.is_loading = false;
	this.successFunk( results , status );
}

/**
 * Handle errors appropriately, needs to be fleshed out!
 * @param string describing the status, some possible values (besides null) are "timeout", "error", "notmodified" and "parsererror"
 * @param object exception object, if one occurred
 */
Service.prototype.failure = function( status , errorThrown )
{
	this.is_loading = false;
	switch( status ) {
		case 'ERROR_TRY':
		case 'ERROR_NONE':
		case 'ERROR_JSON_PARSE':
		case 'timeout':
		case 'error':
		case 'notmodified':
		case 'parsererror':
		default :
			//log( "Service Error: (next line) status:" + status );
			//log( errorThrown );
			//log( errorThrown );//"An error occurred:" + errorThrown.message );
			break;
	}
	
	this.errorFunk( status , errorThrown );
	
}
