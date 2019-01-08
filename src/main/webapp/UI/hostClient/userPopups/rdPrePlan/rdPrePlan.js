//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	window.rdPlam = _rdPlam;
	var _config ={
		ajaxUrl:{
            delUrl:"/IntegratedMM/dealway/del.do"
		}
	};
	var _global = {
		top:parent.parent,
		dow:{
            div_row:'',
			row:''
		},
        selectedData:[],
        rowJson:""
	};
	function _init(){
		_initData();
		_initEvent()
	}
	
	function _initData(){

        _rdPlam();
	}
	function _initEvent() {
		//点击添加
		$("#title_add").click(function () {
			parent.PopusManage("addrdPlan");
        });
		//点击删除
        $("#title_del").click(function () {
        	/*if(_global.dow.row == 1){
                parent.parent.comfireFloat("确认要删除处警预案" + _global.dow.div_row.dealWayId,del,null);
			}
			else {
        		parent.parent.alertTip("请先选择所需要删除的处警预案",null,null);
			}*/
            _global.selectedData = [];
            var all_row = $('.isChecked', '#table_content');
            if(all_row.length>0){//打钩的批量删除的
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    _global.selectedData.push(UserEvtId);
                }
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认删除选中的处警预案吗？",del,null);
            }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                $(".selected").each(function(a,b){
                    _global.selectedData.push($(".selected").attr("id"));
                });
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认删除处警预案" + _global.selectedData[0] +"?",del,null);
            }else {
                parent.parent.alertWarn("请先选择您所要删除的处警预案！",null,null);
            }
        });
        //选择联系人
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
    }
    //查询处警预案列表
	function _rdPlam(){
        _global.dow.row = 0;//重置
         _global.rowJson = parent.parent.getPopupsRowJson();
        var userId =  _global.rowJson.userId;
        post_async({"userId": userId},"/IntegratedMM/QueryDealwayListByUid.do",_rdPlan_callback);
    }
    //删除处警预案
	function del() {
		var params = {};
		var dalrdpreplan ={};
		dalrdpreplan.ownerId = _global.rowJson.userId;
        dalrdpreplan.dealWayId = _global.selectedData;
        params = dalrdpreplan;
        //console.log(JSON.stringify(params));
        post_async(params,_config.ajaxUrl.delUrl,callbackdel);
    }
	//删除处警预案的回调
	function callbackdel(data) {
        var result = data.result;
        if(result.code == "1000"){
            parent.parent.alertTip("删除成功！",2000,null);
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
            _rdPlam();	//刷新列表
        }else if(result.code == "1005"){
            parent.parent.alertTip("记录不存在，删除失败",null,null);
        }
		/*parent.parent.alertTip(data.result.message,2000,null);
        _rdPlam();//刷新列表*/
    }

	function _rdPlan_callback(data){
        dalList();//重置列表
		var rowDatas = data.List;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
        /*$("#table").colResizableY({
            liveDrag:true,
            gripInnerHtml:"<div></div>",
            draggingClass:"dragging",
            onResize:null,
            minWidth:25
        });*/
        setColSize();
	}
	function _addRow(row_json){
        $div_row = $("<tr></tr>");
        $div_noChecked = $("<div></div>");
        $div_Checked = $("<td></td>");
        $dealWayId = $("<td></td>");
    	$fdata = $("<td></td>");
    	$fMemo = $("<td></td>");
        $div_Checked.append($div_noChecked);
        $div_row
            .append($div_Checked)
            .append($dealWayId)
            .append($fdata)
            .append($fMemo)
            .addClass('row row_noChecked table_row')
    		.attr('id', row_json.dealWayId);
        $div_noChecked.addClass("noChecked").attr('id', row_json.dealWayId);
        $dealWayId.text(row_json.dealWayId).attr("title", row_json.dealWayId);
        $fdata.text(row_json.fdata).attr("title", row_json.fdata);
        $fMemo.text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
        	 parent.PopusManage('alterrdPrePlan',row_json);
        }).bind('click', function () {
            //_global.dow.row = 1;
            //_global.dow.div_row=row_json;
            //row_checked($(this),row_json);
            $("#table_content tr").removeClass("selected");
            $("#"+row_json.dealWayId).addClass("selected");
        });
        /*****************************************
         * 复选框点击事件
         ******************************************/
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
    //选择列表信息
   /* function row_checked($row,jsonData) {
        if ($row.hasClass('row_noChecked')) {
            $row.removeClass('row_noChecked').addClass('row_checked').data('jsonData',jsonData);
            $row.siblings().removeClass('row_checked').addClass('row_noChecked');
        } else {
            $row.removeClass('row_checked').addClass('row_noChecked');
            //_global.dow.row = 0;
        }
    }*/
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
    //重置列表
	function dalList() {
		$("#table_content").text("");
    }
})(window,jQuery,undefined);