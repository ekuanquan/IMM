 var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getZoneByUserIdParams:{
            userPojo:{
                userId:""
            }
        },
        selectedData:''
}
 /********
  * 添加、修改后页面刷新数据
  */
var refreshData ={
        refresh:function(){
        	_global.selectedData ='';
        	$("#table_content").html("");
        	init();
        }
}
$(document).ready(function() {
    init();
});
;(function(window,$,undefined){
    window.init = _init;


    var _config={
        ajaxUrl:{
            getZoneByUserIdUrl:'/IntegratedMM/getZoneByUserId.do',
            deleteUserZoneUrl:'/IntegratedMM/deleteUserZone.do'
        }
    };
    function _init(){
        _initData();
    }

    function _initData(){
        _getZone();
    }

    function _getZoneByUserIdParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getZoneByUserIdParams.userPojo;
        return params;
    }
    function _getZone(){
        var rowJson = parent.parent.getPopupsRowJson();
        _global.getZoneByUserIdParams.userPojo.userId = rowJson.userId;
        var params  = _getZoneByUserIdParams();
        post_async(params, _config.ajaxUrl.getZoneByUserIdUrl, _callback_getZone);
    }
    function _callback_getZone(data){
        var result = data.result;

        if (result.code == '0') {
            var zonePojo = data.zonePojo;
            for(var i = 0 ;i< zonePojo.length;i++){
                _addRow(zonePojo[i]);
            }
        }

    }
    function _addRow(row_json){
        $div_row = $("<div></div>");
        $roleZoneName = $("<div></div>");
        $devId = $("<div></div>");
        $devZoneId = $("<div></div>");

        $snModeId = $("<div></div>");
        $atPos = $("<div></div>");
        $wantDo = $("<div></div>");
        $almType= $("<div></div>");
        $snNum = $("<div></div>");
        $snType = $("<div></div>");
        $instDate = $("<div></div>");
        $fMemo = $("<div></div>");


        $div_row
            .append($roleZoneName)
            .append($devId)
            .append($devZoneId)

            .append($snModeId)
            .append($atPos)
            .append($wantDo)
            .append($almType)
            .append($snNum)
            .append($snType)
            .append($instDate)
            .append($fMemo)

            .addClass('row')
            .attr('id', row_json.roleZoneName);
        $roleZoneName.addClass('table_item_6').text(row_json.roleZoneName).attr("title", row_json.roleZoneName);
        $devId.addClass('devId_item').text(row_json.devId).attr("title", row_json.devId);
        $devZoneId.addClass('table_item_6').text(row_json.devZoneId).attr("title", row_json.devZoneId);

        $snModeId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
        $atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
        $wantDo.addClass('table_item_4').text(row_json.wantDo).attr("title", row_json.wantDo);
        $almType.addClass('table_item_4').text(row_json.almType).attr("title", row_json.almType);
        $snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
        $snType.addClass('table_item_4').text(row_json.snType).attr("title", row_json.snType);
        $instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        $fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);

        $div_row.appendTo($("#table_content"));
        
        /********
         * 单击一条数据，加载样式并把用户防区存入全局变量
         */
        /*$div_row.bind('click', function (e) {
        	$("#table_content div.selected").removeClass("selected");
        	$("#"+row_json.roleZoneName).addClass("selected");
        	_global.selectedData = row_json.roleZoneName;
        });*/
        /************
         * 双击一条数据，弹出修改用户防区的页面
         */
        /*$div_row.bind('dblclick', function (e) {
        	parent.PopusManage('editUserZone',row_json);
        });*/
    }
    /**********
     * 调用删除用户防区后台接口
     */
    function deleteUserZone(){
		var rowJson = parent.parent.getPopupsRowJson();
    	var roleId = rowJson.roleId;
    	post_async(
    		  {
    		     "roleId":roleId,
    		     "roleZoneName":_global.selectedData
    	      }, 
    	      _config.ajaxUrl.deleteUserZoneUrl, 
    	      _callback_deleteUserZone
    	 );
    	_global.selectedData = '';
    }
    function _callback_deleteUserZone(data){
    	if(data.result.code == "200"){
    		alert("删除成功。");
    		refreshData.refresh();
    	}else{
    		alert("删除失败。");
    	}
    
    }
})(window,jQuery,undefined);