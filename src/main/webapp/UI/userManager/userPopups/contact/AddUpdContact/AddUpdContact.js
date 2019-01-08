$(document).ready(function() {
	init();
});
;(function(window,$){
    window.init = _init;
    window.sure = _sure;
    var _config = {
        ajaxUrl:{
            alterOwnerUserInfoUrl:'../../../../../alterContactInfo.do'
        }
    };

    var _global = {
        popusName:'',
        userPojo:{
            userId:""
        }
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
           _getContact();
       }if(popusName == 'editContact'){
           $("#title_left").text("修改联系人");
           $("#contId_input").val(editjson.contId);
           $("#cName_input").val(editjson.cName);
           /*$("#contPwd_input").val(editjson.contPwd);*/
           $("#cphone1_input").val(editjson.cphone1);
           $("#cphone2_input").val(editjson.cphone2);
           $("#hmPhone_input").val(editjson.hmPhone);
           $("#hdPhone_input").val(editjson.hdPhone);
           $("#contPwd").val(editjson.contPwd);
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

    function _getContactByUserIdParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.userPojo;
        return params;
    }
    function _getContact(){
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userPojo.userId = rowJson.userId;
        var params  = _getContactByUserIdParams();
        post_async(params, '../../../../../getContactByUserId.do', _callback_getContact);
    }

    function _callback_getContact(data){
        if(data.result.code=='0'){
            var  json = data.contactPojo;
            if(json.length>0){
                var  i = json.length-1;
                var  lastPojo = json[i];
                var  ContId = parseInt(lastPojo.contId)+1;
                console.log('lastContId='+ContId);
                $('#contId_input').val(creat_contId(ContId));
            }else{
                $('#contId_input').val('0001');
            }
        }
    }

    function creat_contId(contId){
        if(contId<10000){
            if(contId<10){
                return '000'+contId;
            }else if(contId<100){
                return '00'+contId;
            }else if(contId<1000){
                return '0'+contId;
            }else{
                return ''+contId;
            }
        }else{
            return '0001';
        }
    }

    function _initEvent() {
        $("#form").Validform({
            tiptype:2,
            btnSubmitId:"confirmButton",
            callback:sure
        });
        $("#title_close").bind("click",function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click",function () {
            parent._closePopus();
        });
       /* $("#confirmButton").bind('click',function () {
            _submitContact();
        });*/
    }
    function _getContactParams() {
        var params = {};
        _global.popusName = 'addContact';
        params.operation = '';
        params.contactPojo = {};
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            _global.popusName = parent.getPopupsName();
        }
        if(_global.popusName =='addContact'){
            params.operation = 'add';
        }if(_global.popusName =='editContact'){
            params.operation = 'alter';
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.contactPojo.userId = rowJson.userId;
        if($("#contId_input").val()==''||$("#contId_input").val()==null){
            //alert("联系人编号不能为空");
            parent.parent.alertWarn("请填写完整信息！",2000,null);
            return false;
        }
        params.contactPojo.contId = $("#contId_input").val();
        params.contactPojo.cName =  $("#cName_input").val();
       /* params.contactPojo.contPwd = $("#contPwd_input").val();*/
        params.contactPojo.cphone1 = $("#cphone1_input").val();
        params.contactPojo.cphone2 = $("#cphone2_input").val();
        params.contactPojo.hmPhone = $("#hmPhone_input").val();
        params.contactPojo.hdPhone =  $("#hdPhone_input").val();
        params.contactPojo.contPwd = $("#contPwd").val();
        params.contactPojo.fMemo =  $("#fMemo_input").val();
        return params;
    }
    
    function _submitContact() {
        var params = _getContactParams();
        if(params != false){
            if(_global.popusName =='addContact'){
                getcontactInfo();
            }else if(_global.popusName =='editContact'){
                parent.parent.comfireFloat("确定修改联系人信息？",getcontactInfo,null);
            }

        }
        else {

        }
    }
    function getcontactInfo() {
        var params = _getContactParams();
        post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl, _callback_submitContact);
    }
    function _callback_submitContact(data) {
        var result = data.result;
        parent.parent.alertFail(result.message,null,null);
        if (result.code == '0') {
        	parent.refreshContacts();
            //alert("提交成功");
            //parent.parent.alertSuccess("联系人信息保存成功。",null,null);
            parent._closePopus();
            //alert("提交失败");
            //parent.parent.alertFail("联系人信息保存失败。",null,null);
        }
    }
    function _sure(flag) {
        if(flag){
            _submitContact();
        }else{
            parent.parent.alertTip("请填写完整正确的信息！",2000,null);

        }
    }
})(window,jQuery);