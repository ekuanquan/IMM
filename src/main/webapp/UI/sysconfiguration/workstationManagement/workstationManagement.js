
charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ( window,$) {
    window.init = _init;
    window.goback =_goback;
    window.RefreshdevType = _RefreshdevType;//刷新页面
    window.getJsonData = _getJsonData;
    var _config = {
        ajaxUrl: {
            listUrl: '/IntegratedMM/Workstation/getWorkstationList.do',
            deleteUrl:"/IntegratedMM/Workstation/deleteWorkstationById.do"
        }
    };
    var _global = {
        top:parent.parent,
        jsonData:'',
        flag:0,          //用于判断是否有数据被选中
        devModelId:"",
        devModeldata:""     //用于存储选择的数据信息
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();

    }
    /*********************************************
     数据初始化
     *********************************************/
    function _initData() {
        //获取列表显示数据
        _goback();
    }
    //请求
    function _goback() {

        post_async({}, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }
    /*********************************************
     事件初始化
     *********************************************/
    function _initEven() {
        //添加
        $("#add").bind("click",function () {
            _global.top.systemCode('addWorkstationManagement');
        });
        $("#uDTransmission").bind("click",function () {
            if(_global.flag == 0){
                _global.top.alertTip("请先选择要传送的工作站！",2000,null);
            }
            else{
                _global.top.systemCode('uDTransModelType');
            }

        });
        //删除
        $("#close").bind("click",function () {
            if(_global.flag == 0){
                _global.top.alertTip("请先选择要删除的工作站！",2000,null);
            }
            else{
                _global.top.comfireFloat("是否确认删除工作站" +_global.devModeldata.stationNum+"?",deletedata,null);
            }
        });

    }

    function _getJsonData(){
        return _global.devModeldata;
    }
    /***************************************************
     删除
     ****************************************************/
    function deletedata() {
        post_async({"stationNum":_global.devModeldata.stationNum},_config.ajaxUrl.deleteUrl,callbackdel)
    }
    function callbackdel(data) {
        if(data.result.code == "200"){
            _global.top.alertTip("删除成功",2000,_devModellist);
        }
        else {
            _global.top.alertTip("删除失败",2000,null);
        }
    }
    /******************************************************
        刷新列表（不清空模糊搜索）
     *****************************************************/
    function _devModellist() {
        var params = {};
        post_async(params, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }
    /***************************************************
     获取列表的回调函数
     ****************************************************/
        function _callback_getequipmentTypeInfos(data) {
            var result = data.result;
            if (result.code == "200") {
                _clearRow();
                var workstationList = data.workstationList;
                for (var i = 0; i < workstationList.length; i++) {
                    addTableRow(workstationList[i]);
                }
            }
            else{
                _clearRow();
            }
            $("#table").colResizableY({
                liveDrag:true,
                gripInnerHtml:"<div></div>",
                draggingClass:"dragging",
                onResize:null,
                minWidth:25
            });
        }
    /***************************************************
     构建列表
     ****************************************************/
        function addTableRow(jsonData) {
            _global.jsonData = jsonData;
            $div_row = $("<tr></tr>");

            $div_devModelId=$("<td></td>");
            $div_devModelName=$("<td></td>");
            $div_devType=$("<td></td>");
            $div_zoneNum=$("<td></td>");

            $div_row
                .append($div_devModelId)
                .append($div_devModelName)
                .append($div_devType)
                .append($div_zoneNum)
                .attr('id', jsonData.stationNum);
            $div_devModelId.addClass("eventNum_title").text(jsonData.stationNum).attr("title", jsonData.stationNum);
            $div_devModelName.addClass("eventNum_title").text(jsonData.stationName).attr("title", jsonData.stationName);
            $div_devType.addClass("eventNum_title").text(jsonData.stationHost).attr("title", jsonData.stationHost);
            $div_zoneNum.addClass("eventNum_title6").text(jsonData.stationPort).attr("title", jsonData.stationPort);
            $div_row.addClass("tbody_tr").appendTo("#table_content");
            //双击弹窗
            $div_row.bind('dblclick', function(e) {
                var $this = $(this);
                _global.top.systemCode('alterWorkstationManagement');
                //传递数据
                _global.top.setdevModelTypeJson(jsonData);
            });
            //单击改变样式
            $div_row.bind('click', function(e) {
                var $this = $(this);
                console.log($this.attr('id'));
                if($this.hasClass('row_isChecked')) {
                    $this.removeClass('row_isChecked');
                    _global.flag = 0;
                } else {
                    $this.addClass('row_isChecked');
                    $this.siblings().removeClass('row_isChecked');
                    _global.flag = 1;
                    _global.devModeldata = jsonData;
                }

            });

        }
    /***********************************
    清空列表
    *********************************/
    function _clearRow() {
        $("#table_content").text('');
    }
    /***********************************
     刷新
     *********************************/
    function _RefreshdevType() {
        var pararms ={};
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }

}(window,jQuery));

