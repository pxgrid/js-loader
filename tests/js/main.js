loader
.css('1.css')
.css('2.css', 'all')
.css('3.css', 'print')
.css('css/4.css', 'all', true)
.css('./css/5.css', 'all', true)
.script('jquery-1.5.2.min.js')
.script('1.js')
.script('js/2.js', true)
.script('jq1.js')
.script('jq2.js')
.ready(function(){

	$(function(){
		window.jQuery && $('#out1-1').addClass('ok');
		window.test1 === 'test' && $('#out1-2').addClass('ok');
		window.test2 === 'test' && $('#out1-3').addClass('ok');
		$('#out1-5').addClass('ok')
		if($.isFunction(jQuery.foo)){
			$('#out1-6').addClass('ok');
		}
		$.xyz(function(){
			$('#out1-7').addClass('ok');
		});
	});

});
