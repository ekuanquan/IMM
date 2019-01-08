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
        selectedData:[], //存储用户防区编号
};
 /********
  * 添加、修改后页面刷新数据
  */
var refreshData ={
        refresh:function(){
        	_global.selectedData =[];
        	$("#table_content").html("");
        	//init();
            getZone();
        }
}
$(document).ready(function() {
    init();
});
;(function(window,$,undefined){
    window.init = _init;
    window.getZone = _getZone;


    var _config={
        ajaxUrl:{
            getZoneByUserIdUrl:'../../../../getZoneByOwnerId.do',
            deleteUserZoneUrl:'../../../../deleteUserZone.do',
            deleteUserZoneBatchUrl:'/IntegratedMM/deleteUserZoneBatch.do'
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
            _global.selectedData = [];
            var all_row = $('.isChecked', '#table_content');
            if(all_row.length>0){//打钩的批量删除的
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    _global.selectedData.push(UserEvtId);
                }
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认删除选中的用户防区吗？",deleteUserZone,null);
            }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                $(".selected").each(function(a,b){
                    _global.selectedData.push($(".selected").attr("id"));
                });
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认删除用户防区" + _global.selectedData[0] +"?",deleteUserZone,null);
            }else {
                parent.parent.alertWarn("请先选择您所要删除的防区！",null,null);
            }


        });
        //选择设备
        $('#allCheck').bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                $this.removeClass('isChecked').addClass('noChecked');
                $('.isChecked').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                $('.noChecked').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
            }
            _Checked();
        });
        //刷新
        $("#title_refresh").bind("click",function () {
            _getZone();
        })
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
        $("#table_content").text("");
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
        $div_noChecked = $("<div></div>");
        $div_Checked = $("<td></td>");

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

        $div_Checked.append($div_noChecked);
        $div_row
            .append($div_Checked)
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
        $div_noChecked.addClass("noChecked").attr('id', row_json.ownerZoneName);
        $ownerZoneName.addClass('table_item_6').text(row_json.ownerZoneName).attr("title", row_json.ownerZoneName);
        $devId.addClass('devId_item').text(row_json.devId).attr("title", row_json.devId);
        $devZoneId.addClass('table_item_6').text(row_json.devZoneId).attr("title", row_json.devZoneId);
        var snModelName = row_json.snModelName;
        if(row_json.snModelName == ""||row_json.snModelName==null){snModelName = row_json.snModel};
        $snModeId.addClass('table_item_4').text(snModelName).attr("title",snModelName);
        $atPos.addClass('table_item_4_2').text(row_json.atPos).attr("title", row_json.atPos);
        var wantDoName = row_json.wantDoName;
        if(row_json.wantDoName == ""||row_json.wantDoName==null){wantDoName = row_json.wantDo};
        $wantDo.addClass('table_item_4').text(wantDoName).attr("title", wantDoName);
        //$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        var almTypeName = row_json.almTypeName;
        if(row_json.almTypeName == ""||row_json.almTypeName==null){almTypeName = row_json.almType};
        $almType.addClass('table_item_4').text(almTypeName).attr("title", almTypeName);
        $snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
        var snTypeName = row_json.snTypeName;
        if(row_json.snTypeName == ""||row_json.snTypeName==null){snTypeName = row_json.snType};
        $snType.addClass('table_item_4').text(snTypeName).attr("title", snTypeName);
        $instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);

        $div_row.appendTo($("#table_content"));
        
        /********
         * 单击一条数据，加载样式并把用户防区存入全局变量
         */
        $div_row.bind('click', function (e) {
        	$("#table_content tr").removeClass("selected");
        	$("#"+row_json.ownerZoneName).addClass("selected");
        	//_global.selectedData = row_json.ownerZoneName;
        });
        /************
         * 双击一条数据，弹出修改用户防区的页面
         */
        $div_row.bind('dblclick', function (e) {
        	parent.PopusManage('editUserZone',row_json);
        });
        $div_noChecked.bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                if($('#allCheck').hasClass('isChecked')) {
                    $('#allCheck').removeClass('isChecked').addClass('noChecked');
                }
                $this.removeClass('isChecked').addClass('noChecked');
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                var all_row = $('.row', '#table_content');
                var all_isChecked = $('.isChecked', '#table_content');
                if(all_row.length == all_isChecked.length){
                    $('#allCheck').removeClass('noChecked').addClass('isChecked');
                }
            }
            _Checked();
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
    	      _config.ajaxUrl.deleteUserZoneBatchUrl,
    	      _callback_deleteUserZone
    	 );
    	_global.selectedData =[];
    }
    function _callback_deleteUserZone(data){
    	if(data.result.code == "200"){
    		//alert("删除成功。");
            parent.parent.alertSuccess("删除成功。",null,null);
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
    		refreshData.refresh();
    	}else{
    		//alert("删除失败。");
            parent.parent.alertFail("删除失败。",null,null);
    	}
    
    }
    //判断是否有打钩
     function _Checked(){
         var all_row = $('.isChecked', '#table_content');
         if(all_row.length>0){
             $("#title_del_text").text("批量删除");
         }else {
             $("#title_del_text").text("删除");
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
             firstColDrag:false,//第一行不拖动
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