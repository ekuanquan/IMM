/**
 * Created by Administrator on 2016/10/11.
 * Update by ly on 2017/06/26.
 */

(function($){
	$.fn.imageView = function(imageUrl,callback){
		return this.each(function(){
			var _element = $(this);
			init(_element,imageUrl,callback);
		});
	}
	
	function init(obj,url,callback){
		var _element = $(obj);
		var src = url;
		var element = {
			width: _element.width(),
			height:_element.height()
		};
		var original = {
			width: 0,
			height:0
		};
		var target = {};
		
		var img = new Image();
		img.src = src;
		if(img.complete){
			original.width = img.width;
			original.height= img.height;
			target = getViewSize(original,element);
			_element.css('background-size',(target.width +'px '+ target.height +'px'));
			if(callback != null &&  typeof callback == 'function'){
				callback();
			}
		}
		else {
			img.onload = function(){
				original.width = img.width;
				original.height= img.height;
				target = getViewSize(original,element);
				_element.css('background-size',(target.width +'px '+ target.height +'px'));
				if(callback != null &&  typeof callback == 'function'){
					callback();
				}
			};
		}
	}
	
	function getViewSize(original,element){
		var target = {
			width: 0,
			height:0
		};
		var isH = (original.height < element.height ? true : false);
		var isW = (original.width < element.width ? true : false);
		
		if(isH == true && isW == false){
			/*target.width = (original.height * element.width)/element.height;
			target.height = original.height;*/
			target.width = element.width;
			target.height = (original.height * element.width)/original.width;
		}
		else if(isH == false && isW == true){
			/*target.width = original.width;
			target.height = (element.height * original.width)/element.width;*/
			target.width = (element.height * original.width)/original.height;
			target.height = element.height;

		}
		else if(isH == true && isW == true){
			target.width = original.width;
			target.height = original.height;
		}
		else{
			var ratio_H = element.height/original.height;
			var ratio_W = element.width/original.width;
			if(ratio_H < ratio_W){
				target.width = (element.height * original.width)/original.height;
				target.height = element.height;
			}
			else{
				target.width = element.width;
				target.height = (original.height * element.width)/original.width;
			}
		}
		return target;
	}
})(jQuery)