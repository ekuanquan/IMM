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
}
/* /!********
  * 添加、修改后页面刷新数据
  *!/
var refreshData ={
        refresh:function(){
        	_global.selectedData ='';
        	$("#table_content").html("");
        	init();
        }
}*/
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
        		alert("您确定要删除选中的数据么？");
        		deleteUserZone();
        	}if(_global.selectedData ==''){
        		
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
        /*var rowJson = parent.parent.getPopupsRowJson();
        _global.getZoneByUserIdParams.userPojo.userId = rowJson.userId;*/
        var rowJson =parent.parent.getRelatedUserId();
        _global.getZoneByUserIdParams.userPojo.ownerId = rowJson;
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
         setColSize();
     }
     function _addRow(row_json){
         $div_row = $("<tr></tr>");
         $ownerZoneName = $("<td></td>");
         $devId = $("<td></td>");
         $devZoneId = $("<td></td>");

         $snModeId = $("<td></td>");
         $atPos = $("<td></td>");
         $wantDo = $("<td></td>");
         $almType= $("<td></td>");
         $snNum = $("<td></td>");
         $snType = $("<td></td>");
         $instDate = $("<td></td>");
         $fMemo = $("<td></td>");


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

         $snModeId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
         $atPos.addClass('table_item_4_2').text(row_json.atPos).attr("title", row_json.atPos);
         $wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
         //$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
         $almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
         $snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
         $snType.addClass('table_item_4').text(row_json.snTypeName).attr("title", row_json.snTypeName);
         $instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
         $fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);

         $div_row.appendTo($("#table_content"));


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
    function _callback_deleteUserZone(){
    	if(data.result.code == "200"){
    		alert("删除成功。");
    		refreshData.refresh();
    	}else{
    		alert("删除失败。");
    	}
    
    }
     function setColSize(){
         var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
         var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
         $("#listBox1").colResizable({
             minWidth: 20, //最小宽度
             liveDrag:true, //是否实时拖动
             gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
             draggingClass:"dragging", //拖动div样式
             onResize: null, //拖动时调用函数
             followCol:col2,//数据表的列集合
             mainCol:col1,//表头表的列结婚firstColDrag:false
             firstColDrag:true,
         });
         $("#listBox2").colResizableNot({
             minWidth: 20, //最小宽度
             liveDrag:true, //是否实时拖动
             gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
             draggingClass:"dragging", //拖动div样式
             onResize: null //拖动时调用函数
         });
         document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
         var columnsize = col1.length;

         if((col2!=null&&col2.length>0)&&col1!=null){
             //给数据表重新获取宽度
             for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                 col2[i].style.width = col1[i].style.width;//实际应用用这里
             }
         }
         //固定和滚动
         document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
         var right_div2 = document.getElementById("right_div2");
         right_div2.onscroll = function(){
             var right_div2_left = this.scrollLeft;
             document.getElementById("right_div1").scrollLeft = right_div2_left;
         }
     }
})(window,jQuery,undefined);