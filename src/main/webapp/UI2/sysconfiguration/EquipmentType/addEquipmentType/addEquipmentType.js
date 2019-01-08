/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            adddevTypeUrl:"/IntegratedMM/devmodel/add.do",
            devTypelistUrl:"/IntegratedMM/devtype/list.do"
        }
    };
    _global = {
        plugins: {
            page: null
        },
        rowdata:'',
        devModelPojo: {
        "devModelId":"", // 设备型号编号, int
        "devModelName":"", // 设备型号名称, 32个字符
        "devType":"", //  设备类型编号, int
        "zoneNum":"", // 防区个数, int
        "prog_type":"", // 编程类型, 32个字符
        //"ChannelNum":"", // 通道数, int
        "ZoneNumEx":"", // 扩展防区数, int
        "CodeWayId_42":"", // 2位编码方案, int
        "CodeWayId_FSK":"", // 4位编码方案, int
       //"CodeWayId_CID":"" // 字段解释未知,int
        }

    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
    }
    function _initData() {
        //获取设备类型下拉项
        _getdevtype();
    }
    function _initEven() {
        /*********************************************************************
         关闭窗口点击事件
         *********************************************************************/
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
        /*********************************************************************
         保存点击事件
         *********************************************************************/
        $("#sure").click(function () {
            getAmendsyscodeInfo();
        });
    }
    /************************************************
     获取设备类型
     ************************************************/
    function _getdevtype() {
        post_async(null,_config.ajaxUrl.devTypelistUrl,_callback_devtype);
    }
    /************************************************
     获取设备类型下拉数据222
     ************************************************/
    function _callback_devtype(data) {
        //先清空下拉项
        $("#devType").empty();
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#devType"));
        if(data.code == "200"){
            for (var i = 0;i<data.result.length;i++){
                var $option = $("<option></option>");
                    $option.attr('value',data.result[i].devType);
                    $option.text(data.result[i].devTypeName);
                    $option.appendTo($("#devType"));

            }
        }

    }
    /************************************************
     获取页面数据222
     ************************************************/
    function getAmendsyscodeInfo() {
        var params = {};
        var zoneNum = $("#zoneNum").val();
        var ZoneNumEx = $("#ZoneNumEx").val();
        if($("#zoneNum").value == null || $("#zoneNum").value == ""){
            zoneNum = 0;
        }
        if($("#ZoneNumEx").value == null || $("#ZoneNumEx").value == ""){
            ZoneNumEx = 0;
        }
        params = _global.devModelPojo;
        params.devModelId=$("#devModelId").val();
        params.devModelName=$("#devModelName").val();
        params.devType=$("#devType").val();
        params.zoneNum=zoneNum;
        params.prog_type=$("#prog_type").val();
        params.ZoneNumEx=ZoneNumEx;
        params.CodeWayId_42=$("#CodeWayId_42").val();
        params.CodeWayId_FSK=$("#CodeWayId_FSK").val();
        post_async(params,_config.ajaxUrl.adddevTypeUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.code == '200'){
            parent.parent.alertTip("添加成功",2000,_devModellist);
        }
        else {
            parent.parent.alertTip("添加失败",2000,null);
        }
    }
    /******************************************
     刷新系统码列表
     *******************************************/
    function _devModellist() {
        parent.parent.adddevModellist();
        parent.parent.closePopus();
    }

}(window, jQuery))
