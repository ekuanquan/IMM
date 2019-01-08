$(document).ready(function () {
    var row_json = {
        "cameraName": "555545",
        "cameraAddr": "555545",
        "channelNum": "555545",
        "policeType": "555545",
        "instTime": "555545",
        "wantDo": "555545",
        "cameraType": "555545",
        "cameraModel": "555545",
        "fMemo": "555545"
    }
    init();
    addRow(row_json);
});
;(function (window, $, undefined) {
    window.init = _init;
    window.addRow = _addRow;
    window.refleshData = _refleshData;
    var _config = {
        ajaxUrl: {
            getContactByUserIdUrl: '../../../../getContactByUserId.do',
            getGetCameraListUrl: '../../../../GetCameraListByUid.do',
            delUserMonitorInfoUrl:'../../../../delUserMonitorInfo.do',
            delUserMonitorInfoBatchUrl:"/IntegratedMM/delUserMonitorInfoBatch.do"
        }
    };

    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },

        userPojo: {
            userId:""
        },

        selectedData: [],
        userMonitorPojo:{
            ownerId:'',
            devId:'',
            devMonitorId:'',
            ownerMonitorId:''
        }
    }

    function _init() {
        _initEvent();
        _initData();
    }

    function _initData() {
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userPojo.userId = rowJson.userId;
        _getGetCameraList();
    }

    function _initEvent() {
        $("#title_add").bind("click", function () {
            parent.PopusManage('addMonitorSite');
        });
        /*********
         * 删除按钮单击事件
         */
        $("#title_del").bind("click",function () {

           /* if(_global.selectedData !=''){
               /!* _global.userMonitorPojo.devId = _global.selectedData.devId;
                _global.userMonitorPojo.devMonitorId = _global.selectedData.devMonitorId;
                _global.userMonitorPojo.ownerId = _global.selectedData.ownerId;
                _global.userMonitorPojo.ownerMonitorId = _global.selectedData.ownerMonitorId;*!/

                //alert("您确定要删除选中的数据么？");
                //_deleteUserMonitor();
                parent.parent.comfireFloat("确认要删除用户监控点"+ _global.selectedData.devId +"?",_deleteUserMonitor,null);
            }if(_global.selectedData ==''){
                parent.parent.alertWarn("请先选择您所要删除的用户监控点！！",null,null);
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
                parent.parent.comfireFloat("确认删除选中的用户监控点吗？",_deleteUserMonitor,null);
            }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                $(".selected").each(function(a,b){
                    _global.selectedData.push($(".selected").attr("id"));
                });
                console.log(JSON.stringify(_global.selectedData));
                parent.parent.comfireFloat("确认要删除用户监控点" + _global.selectedData[0] +"?",_deleteUserMonitor,null);
            }else {
                parent.parent.alertWarn("请先选择您所要删除的用户监控点！",null,null);
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
            _getGetCameraList();
        })
    }

    function _devzone_callback(data) {
        var rowDatas = data.EquipmentList;
        _clearTable();
        for (var i = 0; i < rowDatas.length; i++) {
            _addRow(rowDatas[i]);
        }
        setColSize()
    }

    function _clearTable() {
        $("#table_content").text('');
    }
    
    function _addRow(row_json) {
        $div_row = $("<tr></tr>");
        $div_noChecked = $("<div></div>");
        $div_Checked = $("<td></td>");

        $userMonitorId = $("<td></td>");
        $devMonitorId = $("<td></td>");
        $devId = $("<td></td>");
        $cameraName = $("<td></td>");
        $cameraAddr = $("<td></td>");
        $channelNum = $("<td></td>");
        $policeType = $("<td></td>");
        $instTime = $("<td></td>");
        $wantDo = $("<td></td>");
        $cameraType = $("<td></td>");
        $cameraModel = $("<td></td>");
        $fMemo = $("<td></td>");
        $div_Checked.append($div_noChecked);
        $div_row
            .append($div_Checked)
            .append($userMonitorId)
            .append($devMonitorId)
            .append($devId)
            .append($cameraName)
            .append($cameraAddr)
            .append($channelNum)
            .append($policeType)
            .append($instTime)
            .append($wantDo)
            .append($cameraType)
            .append($cameraModel)
            .append($fMemo)
            .addClass('row')
            .attr('id', row_json.ownerMonitorId);
        $div_noChecked.addClass("noChecked").attr('id', row_json.ownerMonitorId);
        $userMonitorId.addClass('table_item_7').text(row_json.ownerMonitorId).attr("title", row_json.ownerMonitorId);
        $devMonitorId.addClass('table_item_5').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
        $devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $cameraName.addClass('table_item_5').text(row_json.cameraName).attr("title", row_json.cameraName);
        $cameraAddr.addClass('table_item_5').text(row_json.atPos).attr("title", row_json.atPos);
        $channelNum.addClass('table_item_3').text(row_json.devChannelId).attr("title", row_json.devChannelId);
        //$policeType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        if(row_json.almTypeName == "" || row_json.almTypeName == null){row_json.almTypeName = row_json.almType};
        $policeType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        $instTime.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        //$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.wantDoName == "" || row_json.wantDoName == null){row_json.wantDoName = row_json.wantDo};
        $wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.cameraTypeName == "" || row_json.cameraTypeName == null){row_json.cameraTypeName = row_json.cameraType};
        $cameraType.addClass('table_item_5').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        if(row_json.cameraModelName == "" || row_json.cameraModelName == null){row_json.cameraModelName = row_json.cameraModelId};
        $cameraModel.addClass('table_item_5').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
        $fMemo.addClass('table_item_last').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('click', function (e) {
            $("#table_content tr").removeClass("selected");
            $("#" + row_json.ownerMonitorId).addClass("selected");
            //_global.selectedData = row_json;
        });

        $div_row.bind('dblclick', function (e) {
            parent.PopusManage('editMonitorSite', row_json);
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

    function _getGetCameraListParams() {
        var params = {
            ownerId: _global.userPojo.userId
        };

        return params;
    }

    function _getGetCameraList() {
        var params = _getGetCameraListParams();
        post_async(params, _config.ajaxUrl.getGetCameraListUrl, _callback_getGetCameraList);
    }

    function _callback_getGetCameraList(data) {
        _clearTable();
        if(data.code == 1000){
            var jsonPojos = data.result;
            for (var i=0;i<jsonPojos.length;i++){
                _addRow(jsonPojos[i]);
            }
        }
        setColSize();
    }

    function _deleteUserMonitorParams() {
        var params = {};
        params.ownerId = _global.userPojo.userId;
        params.ownerMonitorId = _global.selectedData;
        //params.userMonitorPojo = _global.userMonitorPojo;
        return params;
    }

    function _deleteUserMonitor() {
        var params = _deleteUserMonitorParams();
        post_async(params, _config.ajaxUrl.delUserMonitorInfoBatchUrl, _callback_deleteUserMonitor);
    }
    function _callback_deleteUserMonitor(data) {
        _refleshData();
        var result = data.result;
        if(result.code == '200'){
            //alert("删除成功");
            parent.parent.alertSuccess("删除成功。",2000,null);
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
        }else{
            //alert(result.message);
            parent.parent.alertFail(result.message,null,null);
        }
    }

    function _refleshData() {
        _getGetCameraList();
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
})(window, jQuery, undefined);