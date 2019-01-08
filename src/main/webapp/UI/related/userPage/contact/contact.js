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
        setColSize();

    }
    function _addRow(row_json){
        $div_row = $("<tr></tr>");
        $contId = $("<td></td>");
        $cName = $("<td></td>");
        //$contPwd = $("<div></div>");
        $cphone1 = $("<td></td>");
        $cphone2 = $("<td></td>");
        $hmPhone = $("<td></td>");
        $hdPhone = $("<td></td>");
        $contPwd = $("<td></td>");
        $fMemo = $("<td></td>");

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
        	$("#table_content tr").removeClass("selected");
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