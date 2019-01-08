/**
 * Created by 007 on 2017/12/15.
 */
$(document).ready(function() {
    init();
});
;(function(window,$,undefined){

    //var spayId,subSysId;
    window.reflaceSubSystem = _reflaceSubSystem;
    window.init = _init;
    var _global={
        selectedData:[],
        devId:""
    };
    function _init(){
        _initData();
        _initEvent();


        $("#title_del").click(function(){
            /*if(subSysId!=undefined&&subSysId!=''){
                parent.parent.comfireFloat("确认要删除该子系统"+subSysId +"?",deletSpay,cancelCallback);
            }else{
                parent.parent.alertTip('请先选择子系统',2000,null);
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
                parent.parent.comfireFloat("确认删除选中的子系统吗？",deletSpay,null);
            }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                $(".selected").each(function(a,b){
                    _global.selectedData.push($(".selected").attr("id"));
                });
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认删除子系统" + _global.selectedData[0] +"?",deletSpay,null);
            }else {
                parent.parent.alertWarn("请先选择您所要删除的子系统！",null,null);
            }
        });
        //选择子系统
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

    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        _global.devId = deviceData.devId;
        post_async({"devId": deviceData.devId},"../../../../immSubSysOf/getSubSysListByDevId.do",_devzone_callback);
    }

    function _initEvent() {
        $("#title_add").bind("click",function () {
            parent.devicePopusManager('addSubSystem');
        });
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
        $div_noChecked = $("<div></div>");
        $div_Checked = $("<td></td>");
        $devZoneId = $("<td></td>");
        $snType = $("<td></td>");
        $bcf = $("<td></td>");
        $fMemo = $("<td></td>");
        $div_Checked.append($div_noChecked);

        $div_row
            .append($div_Checked)
            .append($devZoneId)
            .append($snType)
            .append($bcf)
            .append($fMemo)
            .addClass('row')
            .attr('id', row_json.subSysId);
        $div_noChecked.addClass('noChecked').attr('id', row_json.subSysId);
        $devZoneId.addClass('table_item_2').text(row_json.subSysId).attr("title", row_json.subSysId);
        $snType.addClass('table_item_2').text(row_json.subRange).attr("title", row_json.subRange);
        $bcf.addClass('table_item_2').text(bcfName(row_json.bf)).attr("title",bcfName(row_json.bf));
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
            parent.devicePopusManager('editSubSystem',row_json);
        });
        $div_row.bind('click', function (e) {
            $(this).addClass('selected').siblings().removeClass('selected');
           // $("#table_content div.selected").removeClass("selected");
            //$("#"+row_json.subSysId).addClass("selected");
            //devId = row_json.devId;
            //$("#table_content .selected").data("devId",devId);
            //subSysId =  row_json.subSysId ;
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

    function bcfName(bcfId){
        switch (bcfId){
            case 1:
                return '布防'
                break;
            case 0:
                return '撤防'
                break;
            case 2:
                return '旁路'
                break;
        }
    }

    function deletSpay(){

        var json = {
            "devId": _global.devId,
            "subSysId":_global.selectedData
        };
        var end = post_sync(json, "../../../../immSubSysOf/deleteSubSysById.do");
        /*alert(end.result.message)*/
        parent.parent.alertTip(end.result.message,2000,null);
        if(end.result.code == "200"){
            //alert("删除成功。");
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
            _reflaceSubSystem();
        }

    }

    function _reflaceSubSystem(){		//??????
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
            firstColDrag:false,
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