jQuery.xyz = function(callback){
	jQuery.foo();
	if(jQuery.bar){
		setTimeout(function(){
			callback();
		},100);
	}
};
