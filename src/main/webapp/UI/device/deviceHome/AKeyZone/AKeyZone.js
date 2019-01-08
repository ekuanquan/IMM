$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	window.reflaceDeviceZone = _reflaceAKeyZone;
	window.init = _init;

    var _global={
        spayId:"",
        devZoneId:[]
    };
	function _init(){
		_initEvent();
		_initData();

		$("#title_del").click(function(){
			/*if(devZoneId!=undefined&&devZoneId!=''){
            	parent.parent.comfireFloat("确认要删除此防区"+devZoneId +"?",deletSpay,cancelCallback);
			}else{
				parent.parent.alertTip('请先选择防区',2000,null);
			}*/
            _global.devZoneId = [];
            var all_row = $('.isChecked', '#table_content');
            if(all_row.length>0){//打钩的批量删除的
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    _global.devZoneId.push(UserEvtId);
                }
                console.log(JSON.stringify(_global.devZoneId));
                parent.parent.comfireFloat("确认删除选中防区吗？",deletSpay,cancelCallback);
            }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                $(".selected").each(function(a,b){
                    _global.devZoneId.push($(".selected").attr("id"));
                });
                console.log(JSON.stringify(_global.devZoneId));
                parent.parent.comfireFloat("确认要删除此防区" + _global.devZoneId[0] +"?",deletSpay,cancelCallback);
            }else {
                parent.parent.alertWarn("请先选择所要删除的防区！",null,null);
            }
		});
	}
	
	function _initData(){
		 var deviceData = parent.parent.parent.parent.getPopupsRowJson();
         _global.spayId = deviceData.devId;
		 var params = {
             condition:{
                 devId:deviceData.devId
             }
		 };
		 post_async(params,"/IntegratedMM/queryDevZoneForOneClickDev.do",_devzone_callback);
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addAKeyZone');
        });
		var right_div2 = document.getElementById("table_content");
		right_div2.onscroll = function(){
			var right_div2_left = this.scrollLeft;
			document.getElementById("table_title").scrollLeft = right_div2_left;
		}
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
    }
	function _devzone_callback(data){
		var rowDatas = data.result;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
        setColSize();
	}
	function _addRow(row_json){
        $div_row = $("<tr></tr>");
        $div_Checked = $("<td></td>");
        $div_noChecked = $("<div></div>");
		$devZoneId = $("<td></td>");
		$snType = $("<td></td>");
		$atPos = $("<td></td>");
    	$wantDo = $("<td></td>");
    	$almType = $("<td></td>");
    	$snNum = $("<td></td>");
    	$snModelId = $("<td></td>");
		$instDate = $("<td></td>");
		$fMemo = $("<td></td>");
        $div_Checked.append($div_noChecked);
        $div_row
			.append($div_Checked)
            .append($devZoneId)
            .append($snType)
            .append($atPos)
            .append($wantDo)
            .append($almType)
            .append($snNum)
			.append($snModelId)
			.append($instDate)
			.append($fMemo)
            .addClass('row')
			.attr('id', row_json.devZoneId);
        $div_noChecked.addClass("noChecked").attr('id', row_json.devZoneId);
        $devZoneId.addClass('table_item_4').text(row_json.devZoneId).attr("title", row_json.devZoneId);
        if(row_json.snTypeName == ""||row_json.snTypeName==null){row_json.snTypeName = row_json.snType};
		$snType.addClass('table_item_4').text(row_json.snTypeName).attr("title", row_json.snTypeName);
		$atPos.addClass('table_item_4_2').text(row_json.atPos).attr("title", row_json.atPos);
        if(row_json.wantDoName == ""||row_json.wantDoName==null){row_json.wantDoName = row_json.wantDo};
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.almTypeName == ""||row_json.almTypeName==null){row_json.almTypeName = row_json.almType};
		$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
		var snNum = row_json.snNum;
		if(snNum==""||snNum=="undefind"||snNum==undefined){snNum=0;}
		$snNum.addClass('table_item_4').text(snNum).attr("title", snNum);
		var snModelName=row_json.snModelName;
        if(row_json.snModelName == ""||row_json.snModelName==null){
			snModelName = row_json.snModelId;
			row_json.snModelName="未知";
		};
		$snModelId.addClass('table_item_4').text(row_json.snModelName).attr("title", snModelName);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editAKeyZone',row_json);
        });
		$div_row.bind('click', function (e) {
			$("#table_content tr").removeClass("selected");
			$("#"+row_json.devZoneId).addClass("selected");
			//devZoneId =  row_json.devZoneId ;
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

	function deletSpay(){

		var json = {
                "devId":_global.spayId,
                "devZoneIds":_global.devZoneId
		};
		post_async(json, "/IntegratedMM/deleteBatchDevZoneForOneClickDev.do",callback_deleoneClickDev);
	}
    function callback_deleoneClickDev(data) {
        if(data.result.code == "200"){
            //alert("删除成功。");
            parent.parent.alertTip(data.result.message,2000,null);
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
            _reflaceAKeyZone();
        }else {
            parent.parent.alertTip(data.result.message,null,null);
        }
    }
	function _reflaceAKeyZone(){		//ˢ��ҳ��
		location.reload();
	}
    function cancelCallback() {

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