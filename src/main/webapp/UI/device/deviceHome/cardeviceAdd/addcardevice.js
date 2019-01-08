/**
 * Created by 123 on 2017/8/19.
 */
$(document).ready(function() {
    $("#signupForm").Validform({  //表单验证
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    addcardeviceinit();
});

;(function(window,$){

    var areaId ;
    window.addcardeviceinit = _init;
    window.getArea = _getArea;
    window.chooseChannelNum =_chooseChannelNum;
    window.sure = _sure;

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

       /* $("#sure").click(function () {
            var params = gercardeviceData();
            post_async(params,_config.ajaxUrl.AddCarloadInfoUrl,AddCarloadInfo_callback);
           /!* var $isChecked = $(".isChecked");
            var num = $("#channelNum").val();
            if(num==$isChecked.length){
                var params = gercardeviceData();
                post_async(params,_config.ajaxUrl.AddCarloadInfoUrl,AddCarloadInfo_callback);
            }
            else {
                alert("通道参数与选择通道总数不一致！");
            }*!/
        })*/
    }

    function _initDate() {
            post_async({},_config.ajaxUrl.QueryTerGroupUrl,terGroup_callback);//获取车辆分组下拉内容
            post_async({},_config.ajaxUrl.QueryTertypeUrl,ter_id_callback);//获取终端类型下拉内容
            post_async({},_config.ajaxUrl.QueryPlateColorUrl,plateColorId_callback);//获取车牌颜色下拉内容
    }

    function _initEven() {
        var newtime = getNowFormatDate();
        newtime = newtime.split(" ")[0];
        $("#devInstDate").val(newtime);
        $("#devInstDate").bind('focus',function () {   //安装日期
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $("#stime").bind('focus',function () {   //服务开始日期
            WdatePicker({
                maxDate: '#F{$dp.$D(\'etime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $("#etime").bind('focus',function () {   //服务结束日期
            WdatePicker({
                minDate: '#F{$dp.$D(\'stime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $(".noChecked").attr("readonly","readonly");//未被使用的通道设置不可修改
        $("#areaId").click(function(){_devicePopusManager('openArea')});//所属区域点击事件
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
        if(loadNum == ""){    //设置核定载人数为空时默认等于0
            params.loadNum = 0;
        }else {
            params.loadNum = $("#loadNum").val();
        }
        params.devId = pad2($("#devId").val());
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
        for(var i=1;i<=$CH.length;i++){    //从界面获取使用的通道的内容
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
            parent.alertSuccess("添加成功",2000,null);
            //alert("添加成功");
            parent.clickdeviceright("cardevice_tab");
            parent.closePopus();
            //点击车载设备显示车载设备列表并刷新

        }
        else if (result.code == '201'){
            parent.alertTip("数据库已经存在该设备编号！",2000,null);
            //alert("数据库已经存在该设备编号！");
        }
        else {
            parent.alertFail("添加失败，请重试",2000,null);
            //alert("添加失败，请重试");
        }
    }

    function terGroup_callback(data) {  //显示车辆分组下拉框内容
        for(var i=0; i<data.groupList.length; i++){
            $("#terGroupId").append("<option value='"+data.groupList[i].id+"'>"+data.groupList[i].name+"</option>");
        }
    }

    function ter_id_callback(data) {   //显示终端类型下拉框内容
        for(var i=0; i<data.TertypeList.length; i++){
            $("#ter_id").append("<option value='"+data.TertypeList[i].terTypeId+"'>"+data.TertypeList[i].terTypeName+"</option>");
        }
    }

    function plateColorId_callback(data) {   //显示车牌颜色下拉框内容
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
        $("#areaId").blur();
    }

    function _chooseChannelNum() {   //通道参数的选择
        var $channelNum = $("#channelNum");
        if($channelNum.val()==4){      //通道参数为4 的时候前4 个的通道显示
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
        if($channelNum.val()==8){      //通道参数为8 的时候前8 个的通道显示
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
        if($channelNum.val()==16){     //通道参数为16 的时候16个的通道显示
            $(".isChecked").removeClass('isChecked').addClass('noChecked');
            for(var i=1;i<=$channelNum.val();i++){
                $("#CH"+i).removeClass('noChecked').addClass('isChecked');
                $(".isChecked").removeAttr("readonly");
            }
            $(".noChecked").attr("readonly","readonly");
        }
    }
    /*function _CHchoose() {     //通过选择通道改变通道参数
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
    function _sure(flag) {
        if(flag){
            var params = gercardeviceData();
            post_async(params,_config.ajaxUrl.AddCarloadInfoUrl,AddCarloadInfo_callback);
        }else {
            parent.alertTip("请填写完整信息",2000,null);
        }
    }
    //设备编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num);
    }
})(window,jQuery);