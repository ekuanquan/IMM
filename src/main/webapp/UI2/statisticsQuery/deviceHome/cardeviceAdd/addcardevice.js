/**
 * Created by 123 on 2017/8/19.
 */
$(document).ready(function() {
    addcardeviceinit();
});

;(function(window,$){

    var areaId ;
    window.addcardeviceinit = _init;
    window.getArea = _getArea;
    window.chooseChannelNum =_chooseChannelNum;

    var _config = {
        ajaxUrl:{
            AddCarloadInfoUrl : '/IntegratedMM/CarloadCtrl/AddCarloadInfo.do',
            QueryTerGroupUrl:'/IntegratedMM/CarloadCtrl/QueryTerGroup.do',
            QueryTertypeUrl:'/IntegratedMM/CarloadCtrl/QueryTertype.do',
            QueryPlateColorUrl:'/IntegratedMM/CarloadCtrl/QueryPlateColor.do'
        }
    };
    
    var _global ={
        devId:"",
        devName:"",
        ter_id:"",
        sim:"",
        channelNum:"",
        cameraNames:"",
        plateColorId:"",
        carno:"",
        color:"",
        pinpai:"",
        devInstDate:"",
        carType:"",
        stime:"",
        etime:"",
        loadNum:"",
        czxm:"",
        terGroupId:"",
        tel:"",
        areaId:""
    };

    function _init(){
        _initDate();
        _initEven();

        $("#sure").click(function () {
            var $isChecked = $(".isChecked");
            var num = $("#channelNum").val();
            if(num==$isChecked.length){
                var params = gercardeviceData();
                post_async(params,_config.ajaxUrl.AddCarloadInfoUrl,AddCarloadInfo_callback);
            }
            else {
                alert("通道参数与选择通道总数不一致！");
            }
        })
    }

    function _initDate() {
            post_async({},_config.ajaxUrl.QueryTerGroupUrl,terGroup_callback);
            post_async({},_config.ajaxUrl.QueryTertypeUrl,ter_id_callback);
            post_async({},_config.ajaxUrl.QueryPlateColorUrl,plateColorId_callback);
    }

    function _initEven() {
        $("#devInstDate").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $("#stime").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $("#etime").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $(".noChecked").attr("readonly","readonly");
        $("#areaId").click(function(){_devicePopusManager('openArea')});
      /*  $(".CH").click(function () {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
            }
            _CHchoose();
        });*/

        $("#close,#cancel").click(function(){parent.closePopus();});
    }

    function gercardeviceData() {
        var params =  _global;
        var loadNum = $("#loadNum").val();
        if(loadNum == ""){
            params.loadNum = 0;
        }else {
            params.loadNum = $("#loadNum").val();
        }
        params.devId = $("#devId").val();
        params.devName = $("#devName").val();
        params.ter_id = $("#ter_id").val();
        params.sim = $("#sim").val();
        params.channelNum = $("#channelNum").val();
        params.plateColorId = $("#plateColorId").val();
        params.carno = $("#carno").val();
        params.color = $("#color").val();
        params.pinpai = $("#pinpai").val();
        params.devInstDate = $("#devInstDate").val();
        params.carType = $("#carType").val();
        params.stime = $("#stime").val();
        params.etime = $("#etime").val();
        params.czxm = $("#czxm").val();
        params.terGroupId = $("#terGroupId").val();
        params.tel = $("#tel").val();
        params.areaId = areaId;
        params.cameraNames = _getcameraName();
        return params;
    }

    function _getcameraName() {
        var params = {};
        var $CH = $(".CH");
        var j=0;
        for(var i=1;i<=$CH.length;i++){
            if($("#CH"+i).hasClass('isChecked')){
                    params[j] = $("#CH"+i).val();
                    j++;
            }
        }
        return params;
    }

    function AddCarloadInfo_callback(data) {
        var result = data.result;
        if (result.code == '200'){
            alert("添加成功");
            parent.closePopus();
        }
        else if (result.code == '201'){
            alert("数据库已经存在该设备编号！");
        }
        else {
            alert("添加失败，请重试");
        }
    }

    function terGroup_callback(data) {
        for(var i=0; i<data.groupList.length; i++){
            $("#terGroupId").append("<option value='"+data.groupList[i].id+"'>"+data.groupList[i].name+"</option>");
        }
    }

    function ter_id_callback(data) {
        for(var i=0; i<data.TertypeList.length; i++){
            $("#ter_id").append("<option value='"+data.TertypeList[i].terTypeId+"'>"+data.TertypeList[i].terTypeName+"</option>");
        }
    }

    function plateColorId_callback(data) {
        for(var i=0; i<data.TertypeList.length; i++){
            $("#plateColorId").append("<option value='"+data.TertypeList[i].id+"'>"+data.TertypeList[i].name+"</option>");
        }
    }

    function _devicePopusManager(popusPage_str) {
        switch (popusPage_str) {
            case 'openArea':
                _open_openArea();
                break;
            default:
                break;
        }
    }

    function _open_openArea() {
        _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    }

    function _getArea(areaname){
        $("#areaId").val(areaname.name);
        areaId = areaname.id;
    }

    function _chooseChannelNum() {
        var $channelNum = $("#channelNum");
        if($channelNum.val()==4){
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
        if($channelNum.val()==8){
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
        if($channelNum.val()==16){
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
    }
    /*function _CHchoose() {
        var $CH = $(".isChecked");
        var params = $CH.length;
        if(params==4){
            $("#channelNum").val(params)
        }
        if(params==8){
            $("#channelNum").val(params)
        }
        if(params==16){
            $("#channelNum").val(params)
        }
    }*/
})(window,jQuery);