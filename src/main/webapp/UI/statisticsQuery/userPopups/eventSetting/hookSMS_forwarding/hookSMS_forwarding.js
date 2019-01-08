$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	var _global = {
		ajaxUrl:{
			getContactByUserId:'/IntegratedMM/getContactByUserId.do',
			ListEditEvtCantList:'/IntegratedMM/eventSetting/ListEditEvtCantList.do'
		}
		
	}

	function _init() {
		console.log('进入勾选后的短信转发！');
		_initEvent();
		_initData();
	}

	function _initData() {
		showContact();
	}

	function _initEvent() {
		$('#cancel,#close').bind('click', function(e) {
			parent.parent.closeMapPopus();
		});
		
		$('#save').bind('click',function(e){
			_ListEditEvtCantList();
		});

	}
	
	function _ListEditEvtCantList(){
		var UserEvtIdList = parent.parent.getUserEvtIdList();
		console.log(UserEvtIdList);
		var contList = '';
		var $check = $('.row_row > .row_cName > .isChecked');
		for(var i = 0; i < $check.length; i++) {
			var $this = $check[i];
			var contId = $this.id;
			if (contList=='') {
				contList = contId;
			}else{
				contList = contList+';'+contId;
			}
		}
		console.log(contList);
		
		var param = {};
		param.UserEvtIdList = UserEvtIdList;
		param.contList= contList;
		post_async(param,_global.ajaxUrl.ListEditEvtCantList,_ListEditEvtCantListCallBack);
	}
	
	function _ListEditEvtCantListCallBack(data){
		console.log(JSON.stringify(data));
		if (data.result.code==200) {
			parent.parent.setUserEvtIdList('');
			parent.mainDivIframe.eventSettingIframe.clearCheck();
			parent.parent.closeMapPopus();
		}
	}
	
	function showContact(){
		var UserEvtData = parent.parent.getPopupsRowJson();
		var userId = UserEvtData.userId;
		var param = {};
		param.userPojo = {};
		param.userPojo.userId = userId;
		post_async(param,_global.ajaxUrl.getContactByUserId,showContactCallBack);
	}
	
	function showContactCallBack(data){
		console.log(JSON.stringify(data));
		if (data.result.code==0) {
			clearRow_main();
			var json = data.contactPojo;
			for (var i = 0;i<json.length;i++) {
				showContactData(json[i]);
			}
		}
	}
	
	function clearRow_main(){
		$('.row_main').empty();
	}
	
	function showContactData(row_json){
		var $row_row = $('<div></div>');
		var $row_cName = $('<div></div>');
		var $noChecked = $('<div></div>');
		var $div = $('<div></div>');
		var $row_cphone1 = $('<div></div>');
		
		$noChecked.addClass('noChecked').attr('id',row_json.contId).appendTo($row_cName);
		$div.text(row_json.cName).appendTo($row_cName);
		$row_cName.addClass('row_cName').appendTo($row_row);
		$row_cphone1.addClass('row_cphone1').text(row_json.cphone1).appendTo($row_row);
		$row_row.addClass('row_row').appendTo('.row_main');
		
		$noChecked.bind('click',function(e){
			var $this = $(this);
			var check = $this.hasClass('isChecked');
			if(check) {
				$this.removeClass('isChecked').addClass('noChecked');
			} else {
				$this.removeClass('noChecked').addClass('isChecked');
			}
		})
	}

})(window, jQuery, undefined);