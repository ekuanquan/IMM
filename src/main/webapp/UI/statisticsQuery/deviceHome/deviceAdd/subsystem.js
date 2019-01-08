/**
 * Created by 007 on 2017/12/15.
 */
$(document).ready(function() {
    init();
});
;(function(window,$,undefined){

    window.reflaceSubSystem = _reflaceSubSystem;
    window.init = _init;
    var _global={
        selectedData:[],
        devId:""
    };
    function _init(){
        _initData();
    }

    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        _global.devId = deviceData.devId;
        post_async({"devId": deviceData.devId},"../../../../immSubSysOf/getSubSysListByDevId.do",_devzone_callback);
    }

    function _devzone_callback(data){
        var code= data.result.code;

        if(code==201){
            parent.parent.alertTip('系统出错请重试！',2000,null);
            return;
        }
        var rowDatas = data.subSysList||[];
        for(var i = 0 ;i< rowDatas.length;i++){
            _addRow(rowDatas[i]);
        }
        setColSize();
    }
    function _addRow(row_json){
        $div_row = $("<tr></tr>");
        $devZoneId = $("<td></td>");
        $snType = $("<td></td>");
        $bcf = $("<td></td>");
        $fMemo = $("<td></td>");

        $div_row
            .append($devZoneId)
            .append($snType)
            .append($bcf)
            .append($fMemo)
            .addClass('row')
            .attr('id', row_json.subSysId);
        $devZoneId.addClass('table_item_2').text(row_json.subSysId).attr("title", row_json.subSysId);
        $snType.addClass('table_item_2').text(row_json.subRange).attr("title", row_json.subRange);
        $bcf.addClass('table_item_2').text(row_json.bf?"布防":"撤防").attr("title", row_json.bf?"布防":"撤防");
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
    }
    function _reflaceSubSystem(){		//??????
        location.reload();
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