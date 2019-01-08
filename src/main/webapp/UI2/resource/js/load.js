;
(function(window, $, undefined) {
	/*var _global = {
		div: null
	};*/
	$.fn.loading = function() {
		return this.each(function() {
			var _element = $(this);
            var $divOrg = _element.data('loading');
            if($divOrg != undefined){
                $divOrg.remove();
			}
			var $div = $('<div></div>');
            $div.css({
				'background-image': "url('/IntegratedMM/UI/resource/images/wait2.gif')",
				'background-position': '50% 50%',
				'background-repeat': 'no-repeat',
				'background-size': '100px',
				'width': '100%',
				'height': '100%',
				'position': 'absolute',
				'cursor': 'wait',
				'z-index': '10000',
				'float': 'none',
				'top':'0px',
				'left':'0px'
			});
			_element.append($div);
            _element.data('loading',$div);

			//init(_element);
		});
	};
    $.fn.removeLoading = function() {
        return this.each(function() {
            var _element = $(this);

            var $div = _element.data('loading');
            $div.remove();
            //init(_element);
        });
    };
	/*$.extend({
		removeLoading: function() {
			_global.div.remove();
		}
	});*/
})(window, jQuery);

/*$('body').loading();
$.removeLoading();*/
