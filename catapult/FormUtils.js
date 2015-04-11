//==========================================================
//==========================FORM============================
//==========================================================
var FormUtils = function () {}

FormUtils.onsubmit = function ( event )
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

FormUtils.getFormData = function ( form ) {
	var rawData = $(form).serializeArray();

	for ( var i=0; i<rawData.length; i++ ) {
		var data = rawData[i];
		data.id = data.name;
		data.name = null;
	}
	return rawData;
}

FormUtils.getAssocFormData = function ( form ) {
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