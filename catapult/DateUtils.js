

var DateUtils = function () {}

DateUtils.toPHPTime = function ( dateObj )
{
	if ( dateObj ) {
		return Math.round( dateObj.getTime() * .001 );
	}else{
		return 0;
	}
}

DateUtils.fromPHPTime = function ( php_date )
{
	if ( php_date ) {
		return new Date( php_date*1000 );
	}else{
		return new Date;
	}
}