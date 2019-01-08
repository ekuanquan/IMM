$(document).ready(function() {
	init();
});
;(function(window,$){
    window.init = _init;
    
    var _config = {
            ajaxUrl:{
            	addRoleZoneUrl:'../../../../../addUserZone.do',
                getDevIdUrl:'../../../../..//DropDown/getDevIdDrop.do',
                getDevZoneUrl:'../../../../../getZoneByRoleId.do'
            }
    };
    
    function _init() {
        _initLayout();
        _initEvent();
    }
    function _initLayout() {
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
        $("#title_close").bind("click",function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click",function () {
            parent._closePopus();
        });
        $("#confirmButton").bind('click',function () {
            _submitDevice();
        });
    }
    function _submitDevice(){
        var params = _getRoleZoneParams();
        post_async(params, _config.ajaxUrl.addRoleZoneUrl, _callback_submitContact);
    }
    function _callback_submitContact(data){
        var result = data.result;
        if (result.code == '0') {
        	parent.refreshUserZone();
            alert("提交成功");
            parent._closePopus();
        } else {
            alert("提交失败");
        }
    
    }
    function _getRoleZoneParams() {
        var params = {};
        var popusName = 'addUserZone';
        params.operation = '';
        params.roleZonePojo = {};
        if(parent.getPopupsName && typeof (parent.getPopupsName) == 'function' ){
            popusName = parent.getPopupsName();
        }
        if(popusName =='addUserZone'){
        	params.operation = 'add';
        }if(popusName =='editUserZone'){
        	params.operation = 'alter';
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.roleZonePojo.ownerId = rowJson.ownerId;
        params.roleZonePojo.roleZoneName = $("#roleZoneName_input").val();
        params.roleZonePojo.devId =  $("#devId_input option:selected").val();
        params.roleZonePojo.devZoneId = $("#devZoneId_input option:selected").val();
        params.roleZonePojo.x = 0;
        params.roleZonePojo.y = 0;
        return params;
    }
    function getDevIdDropdown(){
    	 var rowJson = parent.parent.getPopupsRowJson();
         var ownerId = rowJson.ownerId;
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
    	var selectId = $("#devId_input option:selected").val();
    	getDevZoneId(selectId);
    }
    function getDevZoneId(devId){
    	post_async(
    			{
    			  "devId":devId
    			},
    			_config.ajaxUrl.getDevZoneUrl,
    			devZone_callback);
    }
    function devZone_callback(data){
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
            $("#roleZoneName_input").val(editjson.roleZoneName);
            $("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
            $("#devZoneId_input option[value='"+ editjson.devZoneId +"']").attr("selected",true);
            
            $("#roleZoneName_input").css({
                "pointer-events": "none",
                "opacity": "0.5",
                "background-color":"gray"
            });
            $("#confirmButton").text("确定");
        }
    }
    function changeDevZone(){
    	
    }
})(window,jQuery);