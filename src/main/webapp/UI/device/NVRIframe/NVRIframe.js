$(document).ready(function () {
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;
(function (window, $) {
    window.deleteNVRList = deleteNVRList;
    window.init = _init;
    window.resizeDocment = _resizeDocment;
    window.addTableRow = _addTableRow;
    window.NVRno = _showAlarmMainframe;
    window.NVR_RefreshData = _NVR_RefreshData;

    var  mainPojo = parent.parent.getMain();
    var _config = {
        ajaxUrl: {
            getAlarmMainframeUrl: '../../../UpdateDdviceCtrl/queryNVRno.do'
        }
    };
    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },
        getAlarmMainframeParams: {
            queryTond: {
                areaId: '',
                queryId: '',
                isowner: 'have'
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'devId|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        deviceId: "",
        platformId:"",
    };

    function _resizeDocment() {

    }


    function _init() {
        //_initData();
        _initEvent();
    }

    function _initData() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond.areaId = "DEFAULTDIR";
        params.queryTond.queryId = '';
        params.queryTond.isowner = 'have';
        params.pageInfoPojo.currentPage = _global.getAlarmMainframeParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getAlarmMainframeParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getAlarmMainframeParams.pageInfoPojo.pageSize;
        $('body').loading();
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
    }

    function _initEvent() {

        $(".row").bind('dblclick', function (event) {
            /* Act on the event */
            _global.top.devicePopusManager('editDevice');
        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
    }

    function _addTableRow(row_json, i) {
        var devState = row_json.devState;
        if (devState == '0') {
            devState = "离线";
        } else if (devState == '1') {
            devState = "在线";
        } else if (devState == '2') {
            devState = "未知";
        }

        $div_row = $("<tr></tr>");
        $div_sort = $("<td></td>");
        $div_devId = $("<td></td>");
        $div_devName = $("<td></td>");
        $div_pnlActID = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_devTypeName = $("<td></td>");
        $div_devModelName = $("<td></td>");
        $div_devLoginName = $("<td></td>");
        $div_devLoginPwd = $("<td></td>");
        $div_devTUTKID = $("<td></td>");
        $div_videoServer = $("<td></td>");
        $div_devLng = $("<td></td>");
        $div_devlat = $("<td></td>");
        $div_pnlAddr = $("<td></td>");
        $div_devState = $("<td></td>");
        $div_ChannelNum = $("<td></td>");
        $div_instMan = $("<td></td>");
        $div_instUnit = $("<td></td>");
        $div_devInstDate = $("<td></td>");
        $div_fMemo = $("<td></td>");


        $div_row
            .append($div_sort)
            .append($div_devId)
            .append($div_devName)
            .append($div_pnlActID)
            .append($div_areaName)
            .append($div_devTypeName)
            .append($div_devModelName)
            .append($div_devLoginName)
            .append($div_devLoginPwd)
            .append($div_devTUTKID)
            .append($div_videoServer)
            .append($div_devLng)
            .append($div_devlat)
            .append($div_pnlAddr)
            .append($div_devState)
            .append($div_ChannelNum)
            .append($div_instMan)
            .append($div_instUnit)
            .append($div_devInstDate)
            .append($div_fMemo)
            .addClass('row')
            .attr('id', row_json.devId);
        $div_sort.text(i).attr("title", i);
        $div_devId.text(row_json.devId).attr("title", row_json.devId);
        $div_devName.text(row_json.devName).attr("title", row_json.devName);
        $div_pnlActID.text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_areaName.text(row_json.areaName).attr("title", row_json.areaName);
        $div_devTypeName.text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devModelName.text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_devLoginName.text(row_json.devLoginName).attr("title", row_json.devLoginName);
        $div_devLoginPwd.text(row_json.devLoginPwd).attr("title", row_json.devLoginPwd);
        $div_devTUTKID.text(row_json.devTUTKID).attr("title", row_json.devTUTKID);
        $div_videoServer.text(row_json.videoServer).attr("title", row_json.videoServer);
        $div_devLng.text(row_json.devLng).attr("title", row_json.devLng);
        $div_devlat.text(row_json.devlat).attr("title", row_json.devlat);
        $div_pnlAddr.text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_devState.text(devState).attr("title", devState);
        var ChannelNum = row_json.ChannelNum;
        if(ChannelNum == null || ChannelNum == "undefined"){
            ChannelNum = "";
        }
        $div_ChannelNum.text(ChannelNum).attr("title", ChannelNum);
        $div_instMan.text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_devInstDate.text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_fMemo.text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
            if (row_json.platformId == mainPojo.platform_id) {
                _global.top.devicePopusManager('editNVR');
                _global.top.setPopupsRowJson(row_json);
            } else {

                _global.top.setPopupsRowJson(row_json);
                _global.top.popusStaManager('editNVRWire');
            }
        });
        $div_row.bind('click', function (e) {

            var i = $("#table_content tr").index($(this));
            var $ActiveTabs = $('.rowshow');
            if ($ActiveTabs.length > 0) {
                $("#table_content tr").removeClass('rowshow');
            }
            $("#table_content tr").eq(i).addClass('rowshow');

            _global.deviceId = row_json.devId;
            _global.platformId = row_json.platformId;
        });
    }

    function deleteNVRList() {
        if ($("#table_content tr").hasClass("rowshow")) {
            if(_global.platformId!=mainPojo.platform_id) {
                _global.top.alertTip("不能删除非本平台数据！",0,null);
            }
            else {
                parent.parent.comfireFloat("确认要删除设备" + _global.deviceId + "?", delNVRList, cancel);
            }
        }
        else {
            _global.top.alertTip("请先选择你所要删除的设备！", 0, null);
        }
    }

    function delNVRList() {
        var json = {
            "devId": _global.deviceId
        };
        var Netnvrdata = post_sync(json, "../../../DelNetnvr.do");
        if (Netnvrdata.code == "1000") {
            parent.deleDevCallback();
            _global.top.alertTip("删除成功", 2000, null);
            _global.deviceId = "";
        }
        else {
            _global.top.alertTip("删除失败", 2000, null);
        }
    }

    function cancel() {
        //_global.deviceId = "";
    }

    function _showAlarmMainframe(areaId, nameOrdevId) {
        _global.getAlarmMainframeParams.queryTond.areaId = areaId;
        _global.getAlarmMainframeParams.queryTond.queryId = nameOrdevId;
        _global.getAlarmMainframeParams.pageInfoPojo.currentPage = '1';
        _getAlarmMainframes();
    }

    function _getAlarmMainframesParams() {

        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getAlarmMainframeParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getAlarmMainframeParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getAlarmMainframeParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getAlarmMainframeParams.pageInfoPojo.pageSize;
        return params;
    }

    function _getAlarmMainframes() {
        $(parent.document.body).loading();
        var params = _getAlarmMainframesParams();
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
    }

    function _callback_getAlarmMainframes(data) {
        var result = data.result;
        $(parent.document.body).removeLoading();
        if (result.code == 0) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getAlarmMainframeParams.pageInfoPojo.currentPage = currentPage;
            _global.getAlarmMainframeParams.pageInfoPojo.totalNum = totalNum;
            _global.getAlarmMainframeParams.pageInfoPojo.totalPage = totalPage;
            if (totalNum == 0) totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                _addTableRow(json[i], i + 1);
            }

        } else {
            _clearRow();
        }
        setColSize();
    }

    function _queryData_page(page) {
        _global.getAlarmMainframeParams.pageInfoPojo.currentPage = page;
        var params = _getAlarmMainframesParams();
        //$('body').loading();
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
    }

    function _NVR_RefreshData(onClickNode) {
        _global.getAlarmMainframeParams.pageInfoPojo.currentPage = "1";
        _global.getAlarmMainframeParams.queryTond.queryId = "";
        _global.getAlarmMainframeParams.queryTond.areaId = onClickNode;
        var params = _getAlarmMainframesParams();

        //$('body').loading();_global.getAlarmMainframeParams.queryTond
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
    }

    function _clearRow() {
        $(".row").each(function () {
            var $this = $(this);
                $this.remove();
        });
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
})(window, jQuery);