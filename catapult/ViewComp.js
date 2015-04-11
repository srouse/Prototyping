//==========================================================
//==========================VIEWCOMP========================
//==========================================================
function ViewComp (){}

ViewComp.prototype.constructor = ViewComp;

ViewComp.prototype.element;
ViewComp.prototype.orbitElement;
ViewComp.templateCache = {};

ViewComp.prototype.registerElement = function ( element , className ) 
{
	if ( this.element ) {
		this.element.unbind("click");
	}
	
	//console.log( "register " + className );
	
	this.element = $( element );
	var me = this;

	if ( className ) {
		this.element.attr("data-component", className );
	}else{
		this.element.attr("data-component", "UNKNOWN" );
	}
	
	this.element.click(function ( event ) {
		//console.log(event.target);
		//console.log(event);
		me.clickFunk(event);
	});
	this.element.mousedown(function ( event ) {
		var target = $(event.target);
		var double_action = target.attr("data-double-action");
		if ( !double_action ) {
			var closest = target.closest("[data-double-action]");
			double_action = closest.attr("data-double-action");
		}
		
		if ( double_action ) {
			target.removeAttr("data-dblclick");
			setTimeout(function () {
				target.attr("data-dblclick", 1 );
            }, 200);
		}
	});
}

ViewComp.prototype.registerOrbitElement = function ( orbitEle , className ) 
{
	if ( this.orbitElement )
		this.orbitElement.unbind("click");
	
	var me = this;
	
	this.orbitElement = $(orbitEle);
	
	if ( className ) {
		this.orbitElement.attr("data-component", className + " (orbit)");
	}else{
		this.orbitElement.attr("data-component", "UNKNOWN (orbit)" );
	}
	
	this.orbitElement.click(function ( event ) {
		me.clickFunk(event);
	});
}

ViewComp.prototype.clickaction = function ( action , value ) {}
ViewComp.prototype.elementClicked = function ( event ) {}

ViewComp.prototype.clickFunk = function ( event ) {
	var target = $(event.target);
	var action = target.attr("data-action");
	var value = target.attr("data-value");
	
	if ( !action ) {
		var closest = target.closest("[data-action]");
		action = closest.attr("data-action");
		value = closest.attr("data-value");
	}
	
	var double_action = target.attr("data-double-action");
	var double_value = target.attr("data-double-value");
	
	if ( !double_action ) {
		var closest = target.closest("[data-double-action]");
		double_action = closest.attr("data-double-action");
		double_value = closest.attr("data-double-value");
	}

	if ( double_action ) {
		event.stopPropagation();
		
		if ( target.attr("data-dblclick") == null ) {
			target.removeAttr("data-dblclick");
			
			if ( this[action] ) {
				this[action]( value );
			}else{
				this.clickaction( action , value );
			}
			
			
			/*target.attr("data-dblclick", 1 );
			var me = this;
			//l og( Date.now() );
			setTimeout(function () {
				//l og( Date.now() );
                if ( target.attr("data-dblclick") == 1) {
                	me.clickaction( action , value );
                }
                target.removeAttr("data-dblclick");
                //l og( Date.now() );
            }, 200);*/
		}else{
			target.removeAttr("data-dblclick");
			//this.clickaction( double_action , double_value );
			if ( this[double_action] ) {
				this[double_action]( double_value );
			}else{
				this.clickaction( double_action , double_value );
			}
		}
		
	}else if ( action ) {
		if ( action != "block-actions" ) {//make a safe zone
			//event.stopPropagation();
			//this.clickaction( action , value );
			if ( this[action] ) {
				this[action]( value );
			}else{
				this.clickaction( action , value );
			}
			ViewComp.preventDefault( event );
		}
	}else{
		this.elementClicked( event );
	}
}

ViewComp.clickaction = function ( target , clickaction , clickvalue )
{
	var prevClickAction = $(target).attr("data-action");
	var prevClickValue = $(target).attr("data-value");

	$(target).attr("data-action", clickaction );
	$(target).attr("data-value", clickvalue );

   	$(target).trigger('click');
   	
	if ( prevClickAction ) {
		$(target).attr("data-action", prevClickAction );
	}else{
		$(target).removeAttr("data-action" );		
	}

	if ( prevClickValue ) {
		$(target).attr("data-value", prevClickValue );
	}else{
		$(target).removeAttr("data-value" );		
	}
}

ViewComp.prototype.click = function ( clickaction , clickvalue )
{
	ViewComp.clickaction( this.element , clickaction , clickvalue );
}

ViewComp.changeaction = function ( target , clickaction )
{
	var ele = $(target);
	this.clickaction( ele , clickaction , ele.val() );
}




ViewComp.preventDefault = function ( event ) {
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
}

ViewComp.prototype.getURLParameter = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

ViewComp.prototype.loading = function ( status ) 
{
	if ( status == true ) {
		this.$("#loading").show();
	}else{
		this.$("#loading").hide();
	}
}

ViewComp.prototype.html = function ( html ) 
{
	this.element.html( html );
} 


ViewComp.prototype.$ = function ( target ) 
{
	if ( !this.orbitElement ) {
		return this.element.find( target );
	}else{
		var results = this.element.find( target );
		if ( results.length == 0 ) {
			return this.$$( target );
		}else{
			return results;
		}
	}
}

ViewComp.prototype.$$ = function ( target ) 
{
	return this.orbitElement.find( target );
}

ViewComp.prototype.kill = function () 
{
	this.unregisterElement();
	this.unregisterOrbitElement();
}
ViewComp.prototype.unregisterElement = function () 
{
	if ( this.element ) {
		var ele = $( this.element );
		ele.unbind();
		ele.removeAttr("data-template");
		ele.removeAttr("data-component");
		ele.html("");
	}
		
}
ViewComp.prototype.unregisterOrbitElement = function () 
{
	if ( this.orbitElement )
		$( this.orbitElement ).unbind();
}


//==========================================================
//==========================FORM============================
//==========================================================
var Form = function () {}

Form.onsubmit = function ( event )
{
    var target;
   	if ( event.target ) {
		target = event.target;
		$(target).blur();
    }else{
    	target = event.srcElement;//ie doesn't like you or your parents
    }

	ViewComp.preventDefault(event);

    var nodeName = $(target)[0].nodeName;
    if ( nodeName.toLowerCase() != "form" ) {
    	target = $(target).closest("form");    	
    }
    target = $(target);

    target.attr("clickaction","submitform");
    target.attr("clickvalue", target.attr("id") );
   	target.click();
   	target.removeAttr("clickaction");//avoid submits via clicks afterward
   	target.removeAttr("clickvalue");//avoid submits via clicks afterward
    return false;  
}

Form.getFormData = function ( form ) {
	var rawData = $(form).serializeArray();

	for ( var i=0; i<rawData.length; i++ ) {
		var data = rawData[i];
		data.id = data.name;
		data.name = null;
	}
	return rawData;
}

Form.getAssocFormData = function ( form ) {
	var rawData = $(form).serializeArray();
	var assocData = {};
	var namesArr = {};//look for multiselect content....
	for ( var i=0; i<rawData.length; i++ ) {
		var data = rawData[i];
		if ( namesArr[ data.name ] !== true ) {
			assocData[ data.name ] = data.value;
			namesArr[ data.name ] = true;
		}else{
			if ( RIA.typeOf( assocData[ data.name ] ) !== "array" ) {
				assocData[ data.name ] = [assocData[ data.name ]];
			}
			assocData[ data.name ].push( data.value );
		}
	}
	return assocData;
}

//==========================================================
//==========================XML=============================
//==========================================================

var isNull = function ( value ) {	
	if ( value === null ) {
		return true;
	}else if ( typeof( value ) == "undefined" ) {
		return true;
	}else{
		return false;
	}
}

//usage: log('inside coolFunc',this,arguments);
//http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};

//==========================================================
//==========================EVENT=============================
//==========================================================

function Event () {}

Event.endEvent = function ( event ) {
	if ( event.type != "keyup" )
		$(event.target).blur();
	
	Event.preventDefault( event );
	event.stopPropagation();
}

Event.preventDefault = function ( event ) {
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
}

Event.preventDefault = function ( event ) {
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
}

Event.encode = function ( data ) {
	return JSON.stringify( data ).replace( "'" , "&apos;" );
}
Event.decode = function ( data ) {
	return JSON.parse( data );
}



var BOOL = function ( val ) {
	if ( val ) {
		switch ( typeof( val ) ) {
			case "number" :
				switch( val ){
					case 0 : 
						return true;
						break;
					default: 
						return true;
						break;
				}
				break;
			case "string" :
				switch( val.toLowerCase() ){
					case "true": case "yes": case "1": return true;
					break;
					case "false": case "no": case "0": case null: return false;
					break;
					default: return Boolean(val);
					break;
				}
				break;
			case "boolean" :
				return val;
				break;
			default: 
				return Boolean(val);
				break;
		}
	}else{
		return false;
	}	
}
