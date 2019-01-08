$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.getProcessingList = _getProcessingList;
	window.setXLWJforwarding = _setTransmitSetRole;
	var _global = {
		top: parent.parent,
		addProcessingList: [],
		delProcessingList: []
	};
	var _config = {
		ajaxUrl:{
			transmitList:'/IntegratedMM/role/transmitList.do',
			transmitSetRole:'/IntegratedMM/role/transmitSetRole.do'
		}
	}

	function _init() {
		_initData();
		_initEvent();
	}
	
	function _initData(){
		XLWJinitData();
	}
	
	function XLWJinitData(){
		var parma = {};
		post_async(parma,_config.ajaxUrl.transmitList,callbackXLWJforwardingBox);
	}
	
	function callbackXLWJforwardingBox(data){
		//console.log(JSON.stringify(data));
		if(data.code==200){
			var $Box =  $('#XLWJforwardingBox');
			for (var i = 0;i<data.result.length;i++) {
				$span = $('<span></sapn>');
				$span.attr('name',data.result[i].typeId);
				$span.text(data.result[i].typeName);
				$span.bind('click',function(e) {
					var $this = $(this);
					var $input = $('#XLWJforwarding');
					$input.data('key', $this.attr('name'));
					$input.val($this.text());
					$('#XLWJforwardingBox').addClass('hide').removeClass('show');
					});
				$span.appendTo($Box);
			}
		}
	}
	
	function _setTransmitSetRole(roleId){
		//console.log(roleId);
		var isC = $('#forwarding').hasClass('isChecked');
		if (isC) {
			var typeId = $('#XLWJforwarding').data('key');
			if(typeId!=undefined&&typeId!=null&&typeId!=''){
			var parma = {};
			parma.roleId = roleId;
			parma.typeId = typeId;
			//console.log(parma);
			post_async(parma,_config.ajaxUrl.transmitSetRole,callbackTransmitSetRole);
			}
		}
	}
	
	function callbackTransmitSetRole(data){
		//console.log(JSON.stringify(data));
	}

	//事件绑定函数
	function _initEvent() {
		$('.top', '#contentRight_title').children('label').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
				setDelProcessingList($(this).parent().attr('id'));
				$('.bottom_row > .bottom_row_right','#'+$(this).parent().attr('id')+'_div').removeClass('isChecked').addClass('noChecked');
			} else {
				$(this).parent().removeClass('noChecked').addClass('isChecked');
				setAddProcessingList($(this).parent().attr('id'));
			}
		});

		$('.top', '#contentRight_title').bind('click', function(e) {
			var $this = $(this);
			var href = $(this).attr('href');
       		$(href).show().siblings().hide();
			//console.log($this.attr('id'));
			if($this.hasClass('row_isChecked')) {
				//$this.removeClass('row_isChecked');
			} else {
				$this.addClass('row_isChecked');
				$this.siblings().removeClass('row_isChecked');
			}
		});
		$('#contentRight_title .top:first-child').click();
		
		$('#XLWJforwarding').bind('click', function(e) {
			var $this = $(this);
			manageDDBox($this, $('#XLWJforwardingBox'));

		});
		
		$('#forwarding').children('span').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
			} else {
				if ($('#snowBrightWJ').hasClass('noChecked')) {
					$('#snowBrightWJ').removeClass('noChecked').addClass('isChecked');
					setAddProcessingList($('#snowBrightWJ').attr('id'));
				}
				$(this).parent().removeClass('noChecked').addClass('isChecked');
			}
		});
		
	}
	
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
	
	function setDelProcessingList(id){
		var addProcessing = _global.addProcessingList;
		var index = null;
		for(var j = 0; j < addProcessing.length; j++) {
			var oJsonProcessing = addProcessing[j];
			if(id == oJsonProcessing) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		//console.log('index:' + index);
		addProcessing.splice(index, 1);
		_global.addProcessingList = addProcessing;
		//console.log(JSON.stringify(_global.addProcessingList));
	}
	function setAddProcessingList(id){
		var addProcessing = _global.addProcessingList;
		if(addProcessing.length > 0) {

			for(var i = 0; i < addProcessing.length; i++) {
				var oJsonProcessing = addProcessing[i];
				if(id == oJsonProcessing) {
					break;
				}
				if(i == addProcessing.length - 1) {
					addProcessing.push(id);
				}
			}

		} else {
			addProcessing.push(id);
		}
		_global.addProcessingList = addProcessing;
		//console.log(JSON.stringify(_global.addProcessingList));
	}
	
	function _getProcessingList(){
		//console.log(JSON.stringify(_global.addProcessingList));
		return _global.addProcessingList;
	}

})(window, jQuery, undefined);