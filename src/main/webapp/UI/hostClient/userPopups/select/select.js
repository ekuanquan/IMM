
//inputObj  
//parentObj
//json
function SelectBox(inputObj,parentObj,json) {
		//var inputId = inputId;
		//var boxId = boxId;
		var $b = $('<div></div>');
		$b.addClass('ddBox Box');
		$b.appendTo(parentObj);
		for(var i =0;i<json.length;i++){
			var $span = $('<span></span>');
			$span.data('key',json[i].key);
			$span.text(json[i].value);
			$span.appendTo($b);
		}
		
		inputObj.click(function() {
			var $this = $(this);
			//var $Box = $('#'+boxId);
			manageDDBox($this, $b);

		});

		$b.children('span').click( function() {
			var $this = $(this);
			//var $name = $(this).attr('name');
			var $input =inputObj;
			$input.data('key',$this.data('key'));
			//$devType.attr('name',$name);
			$input.val($this.text());
			
			$b.addClass('hide').removeClass('show');
		});

		function manageDDBox(ObjDiv, ObjDD) {
			var $ObjDiv = $(ObjDiv);
			var $ObjDD = $(ObjDD);
			var isShow = $ObjDD.hasClass('show');
			if(isShow == true) {
				$ObjDD.addClass('hide').removeClass('show');
			} else {
				$('.ddBox').addClass('hide').removeClass('show');
				var left = $ObjDiv.offset().left + 'px';
				var top = $ObjDiv.offset().top + 24 + 1 + 'px';
				$ObjDD.addClass('show').removeClass('hide');
				$ObjDD.css('top', top);
				$ObjDD.css('left', left);
			}
		}
	}

