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
        var popusName = 'addrdPrePlan';
        var editjson = "";
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function' ){
            editjson = parent.getPopupsRowJson();
        }

       if(popusName == 'addrdPrePlan'){
            $("#title_left").text("添加监控点");
       }if(popusName == 'editMonitorSite'){
           $("#title_left").text("修改监控点");
           $("#cameraName_input").val(editjson.cameraName);
           $("#cameraAddr_input").val(editjson.cameraAddr);
           $("#channelNum_input").val(editjson.channelNum);
           $("#policeType_input").val(editjson.policeType);
           $("#instTime_input").val(editjson.instTime);
           $("#wantDo_input").val(editjson.wantDo);
           $("#cameraType_input").val(editjson.cameraType);
           $("#cameraModel_input").val(editjson.cameraModel);
           $("#fMemo_input").val(editjson.fMemo);
           
           $("#contId_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"gray"
           });
           $("#confirmButton").text("确定");
       }
       else{

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
        $('#instTime_input').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
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