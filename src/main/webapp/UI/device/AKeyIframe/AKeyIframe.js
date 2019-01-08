$(document).ready(function () {
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;
(function (window, $) {
    window.deleteAKeyList = deleteAKeyList;
    window.init = _init;
    window.resizeDocment = _resizeDocment;
    window.addTableRow = _addTableRow;
    window.AKeyno = _showAlarmMainframe;
    window.AKey_RefreshData = _AKey_RefreshData;

    var mainPojo = parent.parent.getMain();
    var _config = {
        ajaxUrl: {
            getAKeyframeUrl: '/IntegratedMM/UpdateDdviceCtrl/queryOneClickDev.do'
        }
    };
    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },
        getAKeyframeParams: {
            queryTond: {
                areaId: '',
                queryId: 'all',
                isowner: 'all',//have
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
        _initEvent();
    }


    function _initEvent() {

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
    }

    function _addTableRow(row_json, i) {
        var $div_row = $("<tr></tr>");
        var $div_devId = $("<td></td>");
        var $div_devName = $("<td></td>");
        var $div_pnlActID = $("<td></td>");
        var $div_areaId = $("<td></td>");
        var $div_akeyServer=$("<td></td>");
        var $div_PORT=$("<td></td>");
        var $div_manufacturer=$("<td></td>");
        var $div_devType = $("<td></td>");
        var $div_devModelId = $("<td></td>");
        var $div_platformName = $("<td></td>");
        var $div_devLng = $("<td></td>");
        var $div_devlat = $("<td></td>");
        var $div_pnlAddr = $("<td></td>");
        var $div_instMan = $("<td></td>");
        var $div_instUnit = $("<td></td>");
        var $div_devInstDate = $("<td></td>");
        var $div_devSn = $("<td></td>");
        var $div_communicateLine = $("<td></td>");
        var $div_communicateProtocol = $("<td></td>");
        var $div_fMemo = $("<td></td>");
        $div_row
            .append($div_devId)
            .append($div_devName)
            .append($div_pnlActID)
            .append($div_areaId)
            .append($div_akeyServer)
            .append($div_PORT)
            .append($div_manufacturer)
            .append($div_devType)
            .append($div_devModelId)
            .append($div_platformName)
            .append($div_devLng)
            .append($div_devlat)
            .append($div_pnlAddr)
            .append($div_instMan)
            .append($div_instUnit)
            .append($div_devInstDate)
            .append($div_devSn)
            .append($div_communicateLine)
            .append($div_communicateProtocol)
            .append($div_fMemo)
            .addClass('row row_noChecked')
            .attr('id', row_json.userId);
        $div_devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $div_devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
        $div_pnlActID.addClass('table_item_4').text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_areaId.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
        $div_akeyServer.addClass('table_item_4').text(row_json.Ip).attr("title", row_json.Ip);
        $div_PORT.addClass('table_item_4').text(row_json.PORT).attr("title", row_json.PORT);
        $div_manufacturer.addClass('table_item_4').text(getManufacturer(row_json.manufacturer)).attr("title", getManufacturer(row_json.manufacturer));
        $div_devType.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devModelId.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_platformName.addClass('table_item_5').text(row_json.platformName).attr("title", row_json.platformName);
        $div_devLng.addClass('table_item_5').text(row_json.devLng).attr("title", row_json.devLng);
        $div_devlat.addClass('table_item_4').text(row_json.devlat).attr("title", row_json.devlat);
        $div_pnlAddr.addClass('table_item_4').text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_instMan.addClass('table_item_4').text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.addClass('table_item_4').text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_devInstDate.addClass('table_item_4').text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_devSn.addClass('table_item_4').text(row_json.devSn).attr("title", row_json.devSn);
        $div_communicateLine.addClass('table_item_5').text(row_json.communicateLineName).attr("title", row_json.communicateLineName);
        $div_communicateProtocol.addClass('table_item_4').text(row_json.communicateProtocolName).attr("title", row_json.communicateProtocolName);
        $div_fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        //$("#table_content").append($div_row);
        $("#table_content").append($div_row);
        $div_row.bind('dblclick', function (e) {
            if (row_json.platformId ==mainPojo.platform_id) {
                _global.top.setPopupsRowJson(row_json);
                _global.top.devicePopusManager('editAKey');
            } else {
                _global.top.setPopupsRowJson(row_json);
                _global.top.popusStaManager('editAKey');
            }

        });
        $div_row.bind('click', function (e) {
            $("#table_content tr").removeClass('rowshow');
            $(this).addClass('rowshow');
            _global.deviceId = row_json.devId;
            _global.platformId = row_json.platformId;
        });
    }
    function getManufacturer(manufacturer) {
        switch (manufacturer){
            case "HIK":
                return "海康";
                break;
            case "DH":
                return "大华";
                break;
            case "OTHER":
                return "其他";
                break;
            default:
                return manufacturer;
                break;
        }
    }
    function deleteAKeyList() {
        if ($("#table_content tr").hasClass("rowshow")) {
            if(_global.platformId!=mainPojo.platform_id) {
                _global.top.alertTip("不能删除非本平台数据！",0,null);
            }else {
                parent.parent.comfireFloat("确认要删除设备" + _global.deviceId + "?", delAKeyList, cancel);
            }
        }
        else {
            _global.top.alertTip("请先选择你所要删除的设备！", 0, null);
        }
    }
    function delAKeyList() {
        var json = {
            "devId": _global.deviceId
        };
        var AKeydata = post_sync(json, "/IntegratedMM/addDevice/deleteOneClickDev.do");
        if (AKeydata.code == "200") {
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
        _global.getAKeyframeParams.queryTond.areaId = areaId;
        _global.getAKeyframeParams.queryTond.queryId = nameOrdevId;
        _global.getAKeyframeParams.pageInfoPojo.currentPage ="1";
        _getAlarmMainframes();
    }

    function _getAKeyframesParams() {
        var params = {};
        params.fuzzy={
            "fuzzyKey":"all", // 可选 all、devId、devName
                "fuzzyValue":_global.getAKeyframeParams.queryTond.queryId,
        },
        //params.queryTond = {};
        params.pageInfoPojo = {};
        //params.queryTond = _global.getAKeyframeParams.queryTond;
        params.areaId = _global.getAKeyframeParams.queryTond.areaId;
        params.isowner = _global.getAKeyframeParams.queryTond.isowner;
        params.devModelId = "all";//_global.getAKeyframeParams.queryTond.queryId==""?"all":_global.getAKeyframeParams.queryTond.queryId;
        params.devState ="all";
        params.timeStart ="";
        params.timeEnd ="";
        params.pageInfoPojo.currentPage = _global.getAKeyframeParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getAKeyframeParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getAKeyframeParams.pageInfoPojo.pageSize;
        return params;
    }

    function _getAlarmMainframes() {
        $(parent.document.body).loading();
        var params = _getAKeyframesParams();
        post_async(params, _config.ajaxUrl.getAKeyframeUrl, _callback_getAKeyframes);
    }

    function _callback_getAKeyframes(data) {
        var result = data.result;
        $(parent.document.body).removeLoading();
        if (result.code == 0) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getAKeyframeParams.pageInfoPojo.currentPage = currentPage;
            _global.getAKeyframeParams.pageInfoPojo.totalNum = totalNum;
            _global.getAKeyframeParams.pageInfoPojo.totalPage = totalPage;
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
        _global.getAKeyframeParams.pageInfoPojo.currentPage = page;
        var params = _getAKeyframesParams();
        //$('body').loading();
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getAKeyframeUrl, _callback_getAKeyframes);
    }

    function _AKey_RefreshData(onClickNode) {
        _global.getAKeyframeParams.pageInfoPojo.currentPage = "1";
        _global.getAKeyframeParams.queryTond.queryId = "";
        _global.getAKeyframeParams.queryTond.areaId = onClickNode;
        var params = _getAKeyframesParams();
        //$('body').loading();_AKey_RefreshData
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getAKeyframeUrl, _callback_getAKeyframes);
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