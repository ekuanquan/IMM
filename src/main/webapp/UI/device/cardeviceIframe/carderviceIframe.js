/**
 * Created by 123 on 2017/8/19.
 */
$(document).ready(function() {
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function(window,$){
    window.deleteCardeviceList = _deleteCardeviceList;
    window.init = _init;
    window.resizeDocment = _resizeDocment;
    window.addTableRow = _addTableRow;
    window.showCardevice = _showCardevice;
    window.showCardevice_RefreshData = _showCardevice_RefreshData;


    var _config={
        ajaxUrl:{
            getCardeviceUrl:'/IntegratedMM/CarloadCtrl/QueryCarloadList.do'
        }
    };
    var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getCardeviceParams: {
            queryTond: {
                areaId: '',
                queryId:'',
                isowner:'have'
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'devId|DESC',
                pageSize: '25'
            }
        },
        deviceId:"",
        platformId:"",
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
        params.pageInfoPojo.currentPage = _global.getCardeviceParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getCardeviceParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getCardeviceParams.pageInfoPojo.pageSize;
        $('body').loading();
        post_async(params, _config.ajaxUrl.getCardeviceUrl,_callback_getCardevice);
    }

    function _initEvent(){

        $(".row").bind('dblclick', function(event) {
            _global.top.devicePopusManager('editCardevice');
        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
    }

    function _addTableRow(row_json, i) {

        $div_row = $("<div></div>");
        $div_devId = $("<div></div>");
        $div_devName = $("<div></div>");
        $div_sim = $("<div></div>");
        $div_carno = $("<div></div>");
        $div_terGroupId = $("<div></div>");
        $div_plateColor = $("<div></div>");
        $div_devInstDate = $("<div></div>");
        $div_etime = $("<div></div>");

        $div_row
            .append($div_devId)
            .append($div_devName)
            .append($div_sim)
            .append($div_carno)
            .append($div_terGroupId)
            .append($div_plateColor)
            .append($div_devInstDate)
            .append($div_etime)
            .addClass('row')
            .attr('id', row_json.devId);
        $div_devId.addClass('table_item_6').text(row_json.devId).attr("title", row_json.devId);
        $div_devName.addClass('table_item_5').text(row_json.devName).attr("title", row_json.devName);
        $div_sim.addClass('table_item_5').text(row_json.sim).attr("title", row_json.sim);
        $div_carno.addClass('table_item_6').text(row_json.carno).attr("title", row_json.carno);
        $div_terGroupId.addClass('table_item_5').text(row_json.terGroupName).attr("title", row_json.terGroupName);
        $div_plateColor.addClass('table_item_5').text(row_json.plateColorName).attr("title", row_json.plateColorName);
        $div_devInstDate.addClass('table_item_6').text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_etime.addClass('table_item_7').text(row_json.etime).attr("title", row_json.etime);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('dblclick', function (e) {
            _global.top.setPopupsRowJson(row_json);
            _global.top.devicePopusManager('editCardevice');
        });
        $div_row.bind('click', function (e) {

            var i=$("#table_content div").index($(this));
            var $ActiveTabs = $('.rowshow');
            if($ActiveTabs.length>0){
                $("#table_content div").removeClass('rowshow');
            }
            $("#table_content div").eq(i).addClass('rowshow');

            _global.deviceId = row_json.devId
            _global.platformId = row_json.platformId
        });
    }

    function _deleteCardeviceList(){   //删除车载设备
        if(_global.platformId!=mainPojo.platform_id) {
            _global.top.alertTip("不能删除非本平台数据！",0,null);
        }
        else if(_global.deviceId !=""){
            parent.parent.comfireFloat("确认要删除设备" + _global.deviceId +"?",delCardeviceList,cancel);
        }
        else {
            _global.top.alertTip("请先选择你所要删除的设备！",0,null);
        }

    }
    function delCardeviceList() {
        var json = {
            "devId":_global.deviceId
        };
        var Cardevice = post_sync(json, "/IntegratedMM/CarloadCtrl/DeelCarloadInfo.do");
        if(Cardevice.code == "1000"){
            _global.top.alertTip("删除成功",2000,null);
            _global.deviceId ="";
        }
        else {
            _global.top.alertTip("删除失败",2000,null);
        }
    }
    function cancel() {
        _global.deviceId = "";
    }

    function _showCardevice(areaId ,nameOrdevId){     //选择区域查询
        _global.getCardeviceParams.queryTond.areaId = areaId;
        _global.getCardeviceParams.queryTond.queryId = nameOrdevId;
        //_global.getCardeviceParams.pageInfoPojo.currentPage = '1';
        _getCardevice();
    }

    function _getCardeviceParams() {

        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getCardeviceParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getCardeviceParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getCardeviceParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getCardeviceParams.pageInfoPojo.pageSize;
        return params;
    }
    function _getCardevice(){    //获取列表数据
        $(parent.document.body).loading();
        var params = _getCardeviceParams();
        post_async(params, _config.ajaxUrl.getCardeviceUrl, _callback_getCardevice);
    }

    function _callback_getCardevice(data) {   //显示列表数据
        var result = data.result;
        $(parent.document.body).removeLoading();
        if (result.code == 0) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getCardeviceParams.pageInfoPojo.currentPage = currentPage;
            _global.getCardeviceParams.pageInfoPojo.totalNum = totalNum;
            _global.getCardeviceParams.pageInfoPojo.totalPage = totalPage;
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
    function _queryData_page(page) {   //页码跳转查询
        _global.getCardeviceParams.pageInfoPojo.currentPage = page;
        var params = _getCardeviceParams();
        //$('body').loading();
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getCardeviceUrl, _callback_getCardevice);
    }
    function _showCardevice_RefreshData(onClickNode) {
        _global.getCardeviceParams.pageInfoPojo.currentPage = "1";
        _global.getCardeviceParams.queryTond.queryId = "";
        _global.getCardeviceParams.queryTond.areaId = onClickNode;
        var params = _getCardeviceParams();
        //$('body').loading();
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getCardeviceUrl, _callback_getCardevice);
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