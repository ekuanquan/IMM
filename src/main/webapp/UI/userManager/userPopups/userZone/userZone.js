 var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getZoneByUserIdParams:{
            userPojo:{
                ownerId:""
            }
        },
        selectedData:''
};
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
            getZoneByUserIdUrl:'../../../../getZoneByOwnerId.do',
            deleteUserZoneUrl:'../../../../deleteUserZone.do'
        }
    };
    function _init(){
        _initEvent();
        _initData();
    }

    function _initData(){
        _getZone();
    }

    function _initEvent() {

        $("#title_add").bind("click",function () {
            parent.PopusManage('addUserZone');
        });
        /*********
         * 删除按钮单击事件
         */
        $("#title_del").bind("click",function () {
        	if(_global.selectedData !=''){
        		//alert("您确定要删除选中的数据么？");
                parent.parent.comfireFloat("确认要删用户防区" + _global.selectedData +"?",deleteUserZone,null);
        		//deleteUserZone();
        	}if(_global.selectedData ==''){
                parent.parent.alertWarn("请先选择您所要删除的防区！",null,null);
        	}
        });
    }

    function _getZoneByUserIdParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getZoneByUserIdParams.userPojo;
        return params;
    }
    function _getZone(){
        var rowJson = parent.parent.getPopupsRowJson();
        _global.getZoneByUserIdParams.userPojo.ownerId = rowJson.userId;
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
        $ownerZoneName = $("<div></div>");
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
            .append($ownerZoneName)
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
            .attr('id', row_json.ownerZoneName);
        $ownerZoneName.addClass('table_item_6').text(row_json.ownerZoneName).attr("title", row_json.ownerZoneName);
        $devId.addClass('devId_item').text(row_json.devId).attr("title", row_json.devId);
        $devZoneId.addClass('table_item_6').text(row_json.devZoneId).attr("title", row_json.devZoneId);
        if(row_json.snModelName == ""||row_json.snModelName==null){row_json.snModelName = row_json.snModel};
        $snModeId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
        $atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
        if(row_json.wantDoName == ""||row_json.wantDoName==null){row_json.wantDoName = row_json.wantDo};
        $wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        //$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        if(row_json.almTypeName == ""||row_json.almTypeName==null){row_json.almTypeName = row_json.almType};
        $almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        $snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
        if(row_json.snTypeName == ""||row_json.snTypeName==null){row_json.snTypeName = row_json.snType};
        $snType.addClass('table_item_4').text(row_json.snTypeName).attr("title", row_json.snTypeName);
        $instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        $fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);

        $div_row.appendTo($("#table_content"));
        
        /********
         * 单击一条数据，加载样式并把用户防区存入全局变量
         */
        $div_row.bind('click', function (e) {
        	$("#table_content div.selected").removeClass("selected");
        	$("#"+row_json.ownerZoneName).addClass("selected");
        	_global.selectedData = row_json.ownerZoneName;
        });
        /************
         * 双击一条数据，弹出修改用户防区的页面
         */
        $div_row.bind('dblclick', function (e) {
        	parent.PopusManage('editUserZone',row_json);
        });
    }
    /**********
     * 调用删除用户防区后台接口
     */
    function deleteUserZone(){
		var rowJson = parent.parent.getPopupsRowJson();
    	var ownerId = rowJson.userId;
    	post_async(
    		  {
    		     "ownerId":ownerId,
    		     "ownerZoneName":_global.selectedData
    	      }, 
    	      _config.ajaxUrl.deleteUserZoneUrl, 
    	      _callback_deleteUserZone
    	 );
    	_global.selectedData = '';
    }
    function _callback_deleteUserZone(data){
    	if(data.result.code == "200"){
    		//alert("删除成功。");
            parent.parent.alertSuccess("删除成功。",null,null);
    		refreshData.refresh();
    	}else{
    		//alert("删除失败。");
            parent.parent.alertFail("删除失败。",null,null);
    	}
    
    }
})(window,jQuery,undefined);