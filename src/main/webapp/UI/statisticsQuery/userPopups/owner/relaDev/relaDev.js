/**
 * Created by 123 on 2017/11/19.
 */
$(document).ready(function () {
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
    init();
});
;(function (window, $) {
    window.init = _init;
    window.sure = _sure;
    window.setAreaName = _setAreaName;

    var _config ={
        ajaxUrl:{
            getDevModelUrl:'/IntegratedMM/addDevice/getDevModel.do',
            ownerAddAlarmhostUrl:"/IntegratedMM/addDevice/ownerAddAlarmhost.do"
        }
    };
    var _global = {
        top:parent.parent,
        devPojo:{
            "devId": "1000F031A",           //设备编号
            "areaId": "201407121707409090", //区域编号
            "devType": "1",                 //设备类型
            "devModelId": "220",            //设备型号
            "devInstDate": "2017-11-20",    //设备安装时间
            "devLng": "114.47", //设备经度
            "devlat": "36.6", //设备纬度
            "manufacturer": "海康"          // 厂商
        },
        data:"",
        popupsName:""
    };

    function _init() {
        _initData();
        _initEvent();
    }
    function _initData() {
        //获取设备型号下拉列表
        _getdevModellist();
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
    }
    //事件绑定函数
    function _initEvent() {
        $("#title_close,#cancelButton").click(function () {
            //parent.closePopus();
            _closeselectarea();
        });
        $('#areaName').click(function () {
            //parent.open_devArea();
            if (_global.popupsName == 'addOwnerUser') {
                parent.open_devArea();
            } else if (_global.popupsName == 'alterOwnerUser') {
                parent.open_alterdevArea();
            }
        });
    }
    function _getdevModellist() {
        var params = {devType:"0"};
        post_async(params, _config.ajaxUrl.getDevModelUrl, getdevType_callback);
    }
    /************************************************
     获取设备型号下拉数据
     ************************************************/
    function getdevType_callback(data){
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#devModelId"));
        var $option = $("<option></option>");
        for (var i = 0;i<data.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data[i].devModelId);
            $option.text(data[i].devModelName);
            $option.appendTo($("#devModelId"));
        }

        //$('#devType').searchableSelect();
    }
    /************************************************
     获取所属区域
     ************************************************/
    function _setAreaName(area) {
        $("#areaName").val(area.name);
        var areaId = area.id;
        $("#areaName").data('areaId', areaId);
        console.log(area.name+":"+area.id);
        $("#areaName").blur();
    }
    //点击保存
    function _sure(flag){
        if(flag){
            _submitOwnerInfo();
        }else{
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
    }
    //保存添加
    function _submitOwnerInfo() {
        var params = _getdevdata();
        post_async(params,_config.ajaxUrl.ownerAddAlarmhostUrl,callback_keepdev)
    }
    //获取界面信息
    function _getdevdata() {
        var params = _global.devPojo;
        params.devId = $("#devId").val();
        params.devModelId = $("#devModelId").val();
        params.areaId = $("#areaName").data('areaId');
        var nowTime = getNowFormatDate();
        nowTime = nowTime.split(" ")[0];
        params.devInstDate = nowTime;
        return params;
    }
    //保存设备信息的回调
    function callback_keepdev(data) {
        _global.data = data;
        if(data.result.code == "200"){
            _global.top.alertTip("添加成功",2000,_RefreshdevList);

            //parent.closePopus();

        }
        else {
            _global.top.alertTip(data.result.message,2000,null);
        }
    }

    function _closeselectarea() {
        /*alert("1314")*/
        /*parent._closePopus();*/
        if(parent._closeCusPopus) {
            parent._closeCusPopus();
        }
        if(parent._closePopus) {
            parent._closePopus();
        }
        if(parent.closeMapPopus) {
            parent.closeMapPopus();
        }

    }
    function _RefreshdevList() {
        parent.associatedDeviceIframe.addRow(_global.data.json[0]);
        _closeselectarea()
    }


})(window, jQuery);