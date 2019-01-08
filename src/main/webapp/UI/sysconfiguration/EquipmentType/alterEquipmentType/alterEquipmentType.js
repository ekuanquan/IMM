/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";

$(document).ready(function () {
    $("#form").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    init();
});
;(function(window, $) {
    window.init =_init;
    window.sure = _sure;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            updateUrl:"/IntegratedMM/devmodel/update.do",
            findByKeyUrl:"/IntegratedMM/devmodel /findByKey.do",
            devTypelistUrl:"/IntegratedMM/devtype/list.do"
        }
    };
    _global = {
        plugins: {
            page: null
        },
        rowdata:'',         //从界面获取的数据
        devModelIdPojo: {
            "newDevModelId":"", // 设备型号编号, int 新的设备型号编号
            "oldDevModelId":"", // 设备型号编号, int 旧的设备型号编号
            "devModelName":"", // 设备型号名称, 32个字符
            "devType":"", //  设备类型编号, int
            "zoneNum":"", // 防区个数, int
            //"prog_type":"", // 编程类型, 32个字符
            //"ChannelNum":"", // 通道数, int
            "ZoneNumEx":"", // 扩展防区数, int
            //"CodeWayId_42":"", // 2位编码方案, int
            //"CodeWayId_FSK":"", // 4位编码方案, int
            //"CodeWayId_CID":"" // 字段解释未知,int
        }
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
        getsysCodeInfo();
    }
    function _initData() {
        _global.rowdata = parent.parent.getdevModelTypeJson();//从系统配置的设备型号列表获取数据
        //_getdevtype()//获取设备类型下拉
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
        /*$("#sure").click(function () {
            getAmendsyscodeInfo();
        });*/
    }
    /*********************************************************************
     根据设备型号编号获取该数据（修改用）
     *********************************************************************/
    function getsysCodeInfo() {
        var params =  _global.rowdata.devModelId;
        var para = {"devModelId":params};
        post_async(para,_config.ajaxUrl.findByKeyUrl,_callback_devModelIdId);
    }
    /*********************************************************************
     根据设备型号编号获取数据的回调（修改用）
     *********************************************************************/
    function _callback_devModelIdId(data) {
        var result=data.result;
        if(result.code == "200"){
            $("#devModelId").val(data.devModel[0].devModelId);
            $("#devModelName").val(data.devModel[0].devModelName);
            //$("#devType").val(data.devModel[0].devType);
            $("#devType").append('<option value="'+ data.devModel[0].devType +'">' + data.devModel[0].devTypeName + '</option>');
            $("#zoneNum").val(data.devModel[0].zoneNum);
            /*$("#prog_type").val(data.devModel[0].prog_type);*/
            $("#ZoneNumEx").val(data.devModel[0].ZoneNumEx);
            $("#ChannelNum").val(data.devModel[0].ChannelNum);
            /*$("#CodeWayId_42").val(data.devModel[0].CodeWayId_42);
            $("#CodeWayId_FSK").val(data.devModel[0].CodeWayId_FSK);*/
        }

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
        /*var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#devType"));*/
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
        if(zoneNum == null || zoneNum == ""){
            zoneNum = 0;
        }
        if(ZoneNumEx == null || ZoneNumEx == ""){
            ZoneNumEx = 0;
        }
        params = _global.devModelIdPojo;
        params.oldDevModelId=_global.rowdata.devModelId+"";
        params.newDevModelId=$("#devModelId").val();
        params.devModelName=$("#devModelName").val();
        params.devType=$("#devType").val();
        params.zoneNum=zoneNum;
        /*params.prog_type=$("#prog_type").val();*/
        params.ZoneNumEx=ZoneNumEx;
        var ChannelNum = $("#ChannelNum").val();
        if(ChannelNum ==""|| ChannelNum == null){
            ChannelNum = 0;
        }
        params.ChannelNum = ChannelNum;
        /*params.CodeWayId_42=$("#CodeWayId_42").val();
        params.CodeWayId_FSK=$("#CodeWayId_FSK").val();*/

        post_async(params,_config.ajaxUrl.updateUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.code == '200'){
            //alert("保存成功");
            parent.parent.alertTip("保存成功",2000,alterdevModellist);
        }
        else {
            parent.parent.alertTip("保存失败",2000,null);
        }
    }
    /******************************************
     刷新列表
     *******************************************/
    function alterdevModellist() {
        parent.adddevModellist();
        parent.parent.closePopus();
    }
    /******************************************
     点击保存验证
     *******************************************/
    function _sure(flag){
        if(flag){
            getAmendsyscodeInfo();
        }else{
            //alert("验证不通过");
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
    }

}(window, jQuery))
