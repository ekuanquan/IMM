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
            getGetCameraListUrl: '/IntegratedMM/GetCameraListByUid.do',
        }
    };

    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },

        userPojo: {
            ownerId: "",
        },

        selectedData: '',
        userMonitorPojo:{
            roleId:'',
            devId:'',
            devMonitorId:'',
            userMonitorId:''
        }
    }

    function _init() {
        _initData();
    }

    function _initData() {
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userPojo.ownerId = rowJson.userId;
        _getGetCameraList();
    }

    function _clearTable() {
        $("#table_content").text('');
    }
    
    function _addRow(row_json) {
        $div_row = $("<tr></tr>");
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

        $div_row
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
        $userMonitorId.addClass('table_item_7').text(row_json.ownerMonitorId).attr("title", row_json.ownerMonitorId);

        $devMonitorId.addClass('table_item_5').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
        $devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $cameraName.addClass('table_item_5').text(row_json.cameraName).attr("title", row_json.cameraName);
        $cameraAddr.addClass('table_item_5').text(row_json.atPos).attr("title", row_json.atPos);
        $channelNum.addClass('table_item_3').text(row_json.devChannelId).attr("title", row_json.devChannelId);

        if(row_json.almTypeName == "" || row_json.almTypeName == null){row_json.almTypeName = row_json.almType};
        $policeType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        $instTime.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        if(row_json.wantDoName == ""|| row_json.wantDoName == ""){row_json.wantDoName = row_json.wantDo};
        $wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        $cameraType.addClass('table_item_5').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        var cameraModelId = "";
        if(row_json.cameraModelName) {
            cameraModelId = row_json.cameraModelName;
        }
        $cameraModel.addClass('table_item_5').text(row_json.cameraModelName).attr("title", cameraModelId);
        $fMemo.addClass('table_item_5').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
    }

    function _getGetCameraListParams() {
        var params = {
            ownerId: _global.userPojo.ownerId
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

    function _refleshData() {
        _getGetCameraList();
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
})(window, jQuery, undefined);