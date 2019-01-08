$(document).ready(function() {
	init();
});
;(function(window,$){
    window.init = _init;
    var _global={
        popusName:''
    };
    var _config = {
            ajaxUrl:{
            	addRoleZoneUrl:'../../../../../addUserZone.do',
                getDevIdUrl:'../../../../../DropDown/getAlarmDevIdDropByRoleId.do',
                getDevZoneUrl:'../../../../../getZoneByRoleId.do',
                getDevZoneInfoUrl:'../../../../../QueryAlarmhostZoneInfo.do'
            }
    };
    
    function _init() {
        _initLayout();
        _initEvent();
    }
    function _initLayout() {
        _global.popusName = parent.getPopupsName();
    	getDevIdDropdown();
        var popusName = 'addUserZone';
        var editjson = "";
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function' ){
            editjson = parent.getPopupsRowJson();
        }
       if(popusName == 'addUserZone'){
            $("#title_left").text("添加用户防区");
       }else{

       }
    }
    function _initEvent() {
        $("#form").Validform({
            tiptype:2,
            btnSubmitId:"confirmButton",
            callback:_sure
        });
        $("#title_close").bind("click",function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click",function () {
            parent._closePopus();
        });
        $("#devId_input").bind('change',function () {
            var selectId = $("#devId_input").val();
            getDevZoneId(selectId,'change');
        });
        $("#devZoneId_input").bind('change',function () {
            _getDevZoneInfo();
        });
    }
    function _submitDevice(){

        if(_global.popusName =='addUserZone'){
            getRoleZoneInfo()
        }else if(_global.popusName =='editUserZone'){
            parent.parent.comfireFloat("确定修改用户防区信息？",getRoleZoneInfo,null);
        }
    }
    function getRoleZoneInfo() {
        var params = _getRoleZoneParams();
        post_async(params, _config.ajaxUrl.addRoleZoneUrl, _callback_submitContact);
    }
    function _callback_submitContact(data){
        var result = data.result;
        if (result.code == '0') {
        	parent.refreshUserZone();
            //alert("提交成功");
            parent.parent.alertSuccess("用户防区信息保存成功",null,null);
            parent._closePopus();
        } else if(result.code == '2'){
            //alert(result.message);
            parent.parent.alertFail(result.message,null,null);
        }else {
            //alert("提交失败");
            parent.parent.alertFail("用户防区信息保存失败",null,null);
        }
    
    }
    function _getRoleZoneParams() {
        var params = {};
        params.operation = '';
        params.roleZonePojo = {};
        if(_global.popusName =='addUserZone'){
        	params.operation = 'add';
        }if(_global.popusName =='editUserZone'){
        	params.operation = 'alter';
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.roleZonePojo.ownerId = rowJson.userId;
        params.roleZonePojo.ownerZoneName = $("#ownerZoneName_input").val();
        params.roleZonePojo.devId =  $("#devId_input option:selected").val();
        params.roleZonePojo.devZoneId = $("#devZoneId_input option:selected").val();
        params.roleZonePojo.x = 0;
        params.roleZonePojo.y = 0;
        return params;
    }
    function getDevIdDropdown(){
    	 var rowJson = parent.parent.getPopupsRowJson();
         var ownerId = rowJson.userId;
         post_async(
	    			{
	    			  "ownerId":ownerId
	    			},
	    			_config.ajaxUrl.getDevIdUrl,
	    			devIdDrop_callback);
    }
    function devIdDrop_callback(data){
    	for (var i = 0;i<data.dropDownPojo.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.dropDownPojo[i].devId);
            $option.text(data.dropDownPojo[i].devId);
            $option.appendTo($("#devId_input"));
        }
        var popusName = 'addUserZone';
        var editjson = "";
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function' ){
            editjson = parent.getPopupsRowJson();
        }
        if(popusName == 'editUserZone'){
            $("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
        }
    	var selectId = $("#devId_input option:selected").val();
    	getDevZoneId(selectId);
    }
    function getDevZoneId(devId,strChange){
    	post_async(
    			{
    			  "devId":devId
    			},
    			_config.ajaxUrl.getDevZoneUrl,
    			devZone_callback,strChange);
    }
    function devZone_callback(data,strChange){
        $("#devZoneId_input").text('');
    	for (var i = 0;i<data.dropDownPojo.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.dropDownPojo[i].devZoneId);
            $option.text(data.dropDownPojo[i].devZoneId);
            $option.appendTo($("#devZoneId_input"));
        }
    	var popusName = 'addUserZone';
        var editjson = "";
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function' ){
            editjson = parent.getPopupsRowJson();
        }
    	if(popusName == 'editUserZone'){
            $("#title_left").text("修改用户防区");

            if(strChange != 'change'){
                $("#ownerZoneName_input").val(editjson.ownerZoneName);
                //$("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
                $("#devZoneId_input option[value='"+ editjson.devZoneId +"']").attr("selected",true);
            }
            $("#ownerZoneName_input").css({
                "pointer-events": "none",
                "opacity": "0.5",
                "background-color":"gray"
            });
            $("#confirmButton").text("确定");
        }
        _getDevZoneInfo();
    }
    function _getDevZoneInfoParams() {
        var params = {
            devId:$("#devId_input").val(),
            devZoneId:$("#devZoneId_input").val()
        };
        return params;
    }

    function _getDevZoneInfo() {
        var params = _getDevZoneInfoParams();
        post_async(params,_config.ajaxUrl.getDevZoneInfoUrl,_callback_getDevZoneInfo);
    }
    function _callback_getDevZoneInfo(data) {
        var result = data.result;
        if(data.code == '1000'){
            _showDevZoneInfo(result);
        }
    }
    function _showDevZoneInfo(json) {
        _clearDevZoneInfo();
        if(json.snModelName==null){
            json.snModelName='';
        }
        $("#snModeId_input").text(json.snModelName);
        $("#atPos_input").text(json.atPos);
        $("#instDate_input").text(json.instDate);
        $("#wantDo_input").text(json.wantDoName);
        $("#almType_input").text(json.almTypeName);
        $("#snNum_input").text(json.snNum);
        $("#snType_input").text(json.snTypeName);
        $("#fMemo_input").text(json.fMemo);

    }
    function _clearDevZoneInfo() {

        $("#snModeId_input").text("");
        $("#atPos_input").text("");
        $("#instDate_input").text("");
        $("#wantDo_input").text("");
        $("#almType_input").text("");
        $("#snNum_input").text("");
        $("#snType_input").text("");
        $("#fMemo_input").text("");
    }

    function _sure(flag) {
        if(flag){
            _submitDevice();
        }else{
            parent.parent.alertTip("请填写完整正确的信息！",2000,null);

        }
    }
})(window,jQuery);