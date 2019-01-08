$(document).ready(function() {
	init();
});
;(function(window,$){
    window.init = _init;

    var _config = {
        ajaxUrl:{
            alterOwnerUserInfoUrl:'../../../../../alterContactInfo.do'
        }
    };

    var _global = {

    };


    function _init() {
        _initLayout();
        _initEvent();
    }
    function _initLayout() {
        var popusName = 'addContact';
        var editjson = "";
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function' ){
            editjson = parent.getPopupsRowJson();
        }

       if(popusName == 'addContact'){
            $("#title_left").text("添加联系人");
       }if(popusName == 'editContact'){
           $("#title_left").text("修改联系人");
           $("#contId_input").val(editjson.contId);
           $("#cName_input").val(editjson.cName);
           $("#contPwd_input").val(editjson.contPwd);
           $("#cphone1_input").val(editjson.cphone1);
           $("#cphone2_input").val(editjson.cphone2);
           $("#hmPhone_input").val(editjson.hmPhone);
           $("#hdPhone_input").val(editjson.hdPhone);
           $("#fMemo_input").val(editjson.fMemo);

           $("#contId_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"gray"
           });
           $("#confirmButton").text("确定");
       }else{

       }
    }
    function _initEvent() {
        $("#title_close").bind("click",function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click",function () {
            parent._closePopus();
        });
        $("#confirmButton").bind('click',function () {
            _submitContact();
        });
    }
    function _getContactParams() {
        var params = {};
        var popusName = 'addContact';
        params.operation = '';
        params.contactPojo = {};
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(popusName =='addContact'){
        	params.operation = 'add';
        }if(popusName =='editContact'){
        	params.operation = 'alter';
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.contactPojo.userId = rowJson.userId;
        if($("#contId_input").val()==''||$("#contId_input").val()==null){
            alert("联系人编号不能为空");
            return;
        }
        params.contactPojo.contId = $("#contId_input").val();
        params.contactPojo.cName =  $("#cName_input").val();
        params.contactPojo.contPwd = $("#contPwd_input").val();
        params.contactPojo.cphone1 = $("#cphone1_input").val();
        params.contactPojo.cphone2 = $("#cphone2_input").val();
        params.contactPojo.hmPhone = $("#hmPhone_input").val();
        params.contactPojo.hdPhone =  $("#hdPhone_input").val();
        params.contactPojo.fMemo =  $("#fMemo_input").val();
        return params;
    }
    
    function _submitContact() {
        var params = _getContactParams();
        post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl, _callback_submitContact);
    }

    function _callback_submitContact(data) {
        var result = data.result;
        if (result.code == '0') {
        	parent.refreshContacts();
            alert("提交成功");
            parent._closePopus();
        } else {
            alert("提交失败");
        }
    }
})(window,jQuery);