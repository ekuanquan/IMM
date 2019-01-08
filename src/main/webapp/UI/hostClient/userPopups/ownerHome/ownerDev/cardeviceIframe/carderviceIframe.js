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

    var deviceId;
    window.deleteCardeviceList = _deleteCardeviceList;
    window.init = _init;
    window.resizeDocment = _resizeDocment;
    window.addTableRow = _addTableRow;
    window.showCardevice = _showCardevice;


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
                sort: 'eventTime|DESC',
                pageSize: '25',
            }
        }
    };

    function _resizeDocment(){

    }


    function _init(){
        _initEvent();
    }

    function _initEvent(){

        $(".row").bind('dblclick', function(event) {
            _global.top.devicePopusManager('editCardevice');
        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../../../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
    }

    function _addTableRow(row_json, i) {

        $div_row = $("<div></div>");
            $dic_checkbox = $("<div></div>");
        $div_devId = $("<div></div>");
        $div_devName = $("<div></div>");
        $div_sim = $("<div></div>");
        $div_carno = $("<div></div>");
        $div_terGroupId = $("<div></div>");
        $div_plateColor = $("<div></div>");
        $div_devInstDate = $("<div></div>");
        $div_etime = $("<div></div>");

        $div_row
        	.append($dic_checkbox )
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
        
        $dic_checkbox.addClass('noChecked').bind('click', function() {
			var isChecked = $(this).hasClass('isChecked');
			if(isChecked) {
				$(this).removeClass('isChecked').addClass('noChecked');
				parent.parent.associatedApparatusIframe.setDelDevList(row_json);
			} else {
				$(this).removeClass('noChecked').addClass('isChecked');
				parent.parent.associatedApparatusIframe.setAddDevList(row_json);
			}
		});

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

            deviceId = row_json.devId
        });
    }

    function _deleteCardeviceList(){
        var json = {
            "devId":deviceId
        };
        post_sync(json, "/IntegratedMM/CarloadCtrl/DeelCarloadInfo.do");
    }


    function _showCardevice(areaId ,nameOrdevId){
        _global.getCardeviceParams.queryTond.areaId = areaId;
        _global.getCardeviceParams.queryTond.queryId = nameOrdevId;
        _global.getCardeviceParams.pageInfoPojo.currentPage = '1';
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
    function _getCardevice(){
    	$('body').loading();
        var params = _getCardeviceParams();
        post_async(params, _config.ajaxUrl.getCardeviceUrl, _callback_getCardevice);
    }

    function _callback_getCardevice(data) {
        var result = data.result;
		$('body').removeLoading();
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
    function _queryData_page(page) {
        _global.getCardeviceParams.pageInfoPojo.currentPage = page;
        $('body').loading();
        var params = _getCardeviceParams();
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