var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getContactByUserIdParams:{
            userPojo:{
                userId:""
            }
        },
        selectedData:''
    }
/******************
 * 添加、修改后刷新页面信息
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
            getContactByUserIdUrl:'../../../../getContactByUserId.do',
            deleteContactUrl:'../../../../deleteContact.do'
        }
    };

    function _init(){
        _initEvent();
        _initData();
    }

    function _initData(){
        _getContact();
    }

    function _initEvent() {
        $("#title_add").bind("click",function () {
            parent.PopusManage('addContact');
        });
        /*********
         * 删除按钮事件
         */
        $("#title_del").bind("click",function () {
        	if(_global.selectedData !=''){
        		alert("您确定要删除选中的数据么？");
                _deleteContact();
        	}if(_global.selectedData ==''){
        		
        	}
        });
    }

    function _getContactByUserIdParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getContactByUserIdParams.userPojo;
        return params;
    }
    function _getContact(){
    	/*var rowJson = parent.parent.getPopupsRowJson();
        _global.getContactByUserIdParams.userPojo.userId = rowJson.userId;*/
        var rowJson =parent.parent.getRelatedUserId();
        _global.getContactByUserIdParams.userPojo.userId = rowJson;
        var params  = _getContactByUserIdParams();
        post_async(params, _config.ajaxUrl.getContactByUserIdUrl, _callback_getContact);
    }
    function _callback_getContact(data){
        var result = data.result;

        if (result.code == '0') {
            var contactPojo = data.contactPojo;
            for(var i = 0 ;i< contactPojo.length;i++){
                _addRow(contactPojo[i]);
            }
        }

    }
    function _addRow(row_json){
        $div_row = $("<div></div>");
        $contId = $("<div></div>");
        $cName = $("<div></div>");
        //$contPwd = $("<div></div>");
        $cphone1 = $("<div></div>");
        $cphone2 = $("<div></div>");
        $hmPhone = $("<div></div>");
        $hdPhone = $("<div></div>");
        $contPwd = $("<div></div>");
        $fMemo = $("<div></div>");

        $div_row
            .append($contId)
            .append($cName)
            //.append($contPwd)
            .append($cphone1)
            .append($cphone2)
            .append($hdPhone)
            .append($hmPhone)
            .append($contPwd)
            .append($fMemo)
            .addClass('row')
            .attr('id', row_json.contId);
        $contId.addClass('table_item_5').text(row_json.contId).attr("title", row_json.contId);
        $cName.addClass('table_item_5').text(row_json.cName).attr("title", row_json.cName);
        //$contPwd.addClass('table_item_5').text(row_json.contPwd).attr("title", row_json.contPwd);
        $cphone1.addClass('table_item_5_5').text(row_json.cphone1).attr("title", row_json.cphone1);
        $cphone2.addClass('table_item_5_5').text(row_json.cphone2).attr("title", row_json.cphone2);
        $hdPhone.addClass('table_item_4').text(row_json.hdPhone).attr("title", row_json.hdPhone);
        $hmPhone.addClass('table_item_4').text(row_json.hmPhone).attr("title", row_json.hmPhone);
        $contPwd.addClass('table_item_2').text(row_json.contPwd).attr("title", row_json.contPwd);
        $fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        
        /*********************
         * 单击一条数据加载样式，并把联系人编号存到全局变量
         */
        $div_row.bind('click', function (e) {
        	$("#table_content div.selected").removeClass("selected");
        	$("#"+row_json.contId).addClass("selected");
        	_global.selectedData = '';
        	_global.selectedData = row_json.contId;
        });
        /*********
         * 双击一条数据，弹出修改弹窗
         */
        $div_row.bind('dblclick', function (e) {
        	/*parent.PopusManage('editContact',row_json);*/
        });
    }
    /***********
     * 调用后台删除联系人的接口
     */
    function _deleteContact(){
        		var rowJson = parent.parent.getPopupsRowJson();
            	var userId = rowJson.userId;
            	post_async(
            		  {
            		     "userId":userId,
            		     "contId":_global.selectedData
            	      }, 
            	      _config.ajaxUrl.deleteContactUrl, 
            	      _callback_deleteContact
            	 );
            	_global.selectedData = '';
    }
    function _callback_deleteContact(data){
    	if(data.result.code == "200"){
    		alert("删除成功。");
    		refreshData.refresh();
    	}else{
    		alert("删除失败。");
    	}
    }
})(window,jQuery,undefined);