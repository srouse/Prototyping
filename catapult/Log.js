



//usage: log('inside coolFunc',this,arguments);
//http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
/*
window.log = function(){
	//log.history = log.history || [];   // store logs to an array for reference
	//log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};
*/


/*
window.slog = function() {
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
	alert("slog");
}*/


//fuck that shit...
if(this.console){
	window.log = this.console.log;
	window.errorout = this.console.log;
}else{
	window.log = function() {};//don't you wish you had a console?
	window.errorout = function() {};//don't you wish you had a console?
}
