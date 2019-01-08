$(document).ready(function() {
	resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function(window,$){
    window.deleteNVRList = deleteNVRList;
	window.init = _init;
	window.resizeDocment = _resizeDocment;
	window.addTableRow = _addTableRow;
	window.NVRno = _showAlarmMainframe;
	window.NVR_RefreshData = _NVR_RefreshData;


	var _config={
		ajaxUrl:{
			getAlarmMainframeUrl:'../../../UpdateDdviceCtrl/queryNVRno.do'
		}
	};
    var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getAlarmMainframeParams: {
            queryTond: {
                areaId: '',
                queryId:'',
                isowner:'have'
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'devId|DESC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        deviceId:""
    };

	function _resizeDocment(){

	}


	function _init(){
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
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl,_callback_getAlarmMainframes);
    }

	function _initEvent(){
		
		$(".row").bind('dblclick', function(event) {
			/* Act on the event */
			_global.top.devicePopusManager('editDevice');
		});

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
	}

	function _addTableRow(row_json, i) {
        var devState = row_json.devState;
        if(devState == '0'){
            devState = "不在线";
        }else if(devState == '1'){
            devState = "在线";
        }else if(devState == '2'){
            devState = "未知";
        }

        $div_row = $("<div></div>");
        $div_sort = $("<div></div>");
        $div_devId = $("<div></div>");
    	$div_devName = $("<div></div>");
    	$div_pnlActID = $("<div></div>");
        $div_areaName = $("<div></div>");
        $div_devTypeName = $("<div></div>");
        $div_devModelName = $("<div></div>");
    	$div_devLoginName = $("<div></div>");
    	$div_devLoginPwd = $("<div></div>");
    	$div_devTUTKID = $("<div></div>");
        $div_videoServer = $("<div></div>");
    	$div_devLng = $("<div></div>");
    	$div_devlat = $("<div></div>");
        $div_pnlAddr = $("<div></div>");
        $div_devState = $("<div></div>");
        $div_ChannelNum = $("<div></div>");
        $div_instMan = $("<div></div>");
        $div_instUnit = $("<div></div>");
        $div_devInstDate = $("<div></div>");
    	$div_fMemo = $("<div></div>");


        $div_row
            .append($div_sort )
            .append($div_devId )
            .append($div_devName )
            .append($div_pnlActID )
            .append($div_areaName )
            .append($div_devTypeName )
            .append($div_devModelName )
            .append($div_devLoginName )
            .append($div_devLoginPwd )
            .append($div_devTUTKID )
            .append($div_videoServer )
            .append($div_devLng )
            .append($div_devlat )
            .append($div_pnlAddr )
            .append($div_devState )
            .append($div_ChannelNum )
            .append($div_instMan )
            .append($div_instUnit )
            .append($div_devInstDate )
            .append($div_fMemo )
            .addClass('row')
            .attr('id', row_json.devId);
        $div_sort.addClass('table_item_2').text(i).attr("title", i);
        $div_devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
    	$div_devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
    	$div_pnlActID.addClass('table_item_6').text(row_json.pnlActID).attr("title", row_json.pnlActID);
    	$div_areaName.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
   	 	$div_devTypeName.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
    	$div_devModelName.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_devLoginName.addClass('table_item_7').text(row_json.devLoginName).attr("title", row_json.devLoginName);
        $div_devLoginPwd.addClass('table_item_6').text(row_json.devLoginPwd).attr("title", row_json.devLoginPwd);
        $div_devTUTKID.addClass('table_item_3').text(row_json.devTUTKID).attr("title", row_json.devTUTKID);
        $div_videoServer.addClass('table_item_7').text(row_json.videoServer).attr("title", row_json.videoServer);
        $div_devLng.addClass('table_item_2').text(row_json.devLng).attr("title", row_json.devLng);
        $div_devlat.addClass('table_item_2').text(row_json.devlat).attr("title", row_json.devlat);
        $div_pnlAddr.addClass('table_item_4').text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_devState.addClass('table_item_4').text(devState).attr("title", devState);
        $div_ChannelNum.addClass('table_item_5').text(row_json.ChannelNum).attr("title", row_json.ChannelNum);
        $div_instMan.addClass('table_item_3').text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.addClass('table_item_4').text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_devInstDate.addClass('table_item_4').text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
            _global.top.devicePopusManager('editNVR');
            _global.top.setPopupsRowJson(row_json);
        });
        $div_row.bind('click', function (e) {

                var i=$("#table_content div").index($(this));
                var $ActiveTabs = $('.rowshow');
                if($ActiveTabs.length>0){
                    $("#table_content div").removeClass('rowshow');
                }
                $("#table_content div").eq(i).addClass('rowshow');

            _global.deviceId = row_json.devId;
        });
    }

    function deleteNVRList(){
        if(_global.deviceId !=""){
            if(_global.platformId!=mainPojo.platform_id) {
                _global.top.alertTip("不能删除非本平台数据！",0,null);
            }
            parent.parent.comfireFloat("确认要删除设备" + _global.deviceId +"?",delNVRList,cancel);
        }
        else {
            _global.top.alertTip("请先选择你所要删除的设备！",0,null);
        }
    }
    function delNVRList() {
        var json = {
            "devId":_global.deviceId
        };
        var Netnvrdata = post_sync(json, "../../../DelNetnvr.do");
        if(Netnvrdata.code == "1000"){
            _global.top.alertTip("删除成功",2000,null);
            _global.deviceId = "";
        }
        else {
            _global.top.alertTip("删除失败",2000,null);
        }
    }
    function cancel() {
        _global.deviceId = "";
    }

    function _showAlarmMainframe(areaId,nameOrdevId){
    	_global.getAlarmMainframeParams.queryTond.areaId = areaId;
        _global.getAlarmMainframeParams.queryTond.queryId = nameOrdevId;
    	//_global.getAlarmMainframeParams.pageInfoPojo.currentPage = '1';
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
    function _getAlarmMainframes(){
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
            if(totalNum == 0) totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                _addTableRow(json[i],i+1);
            }

        } else {
            _clearRow();
        }
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
        var i = 1;
        $(".row").each(function () {
            var $this = $(this);
            setTimeout(function () {
                $this.remove();
            }, i * 1);
            i++;
        });
    }
})(window,jQuery);