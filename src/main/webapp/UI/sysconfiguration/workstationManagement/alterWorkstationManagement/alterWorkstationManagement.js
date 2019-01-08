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
    window.onAsyncSuccess = _onAsyncSuccess;
    window.filter = _filter;
    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            adddevTypeUrl:"/IntegratedMM/Workstation/updateWorkstation.do",
            getWMLUrl:"/IntegratedMM/Workstation/getWorkstationById.do",//
        }
    };
    _global = {
        sysCode:null,
        plugins: {
            page: null
        },
        rowdata:'',
        devModelPojo: {
            "stationNum":"", // 设备型号编号, int
            "stationName":"", // 设备型号名称, 32个字符
            "stationHost":"", //  设备类型编号, int
            "stationPort":"", // 防区个数, int
            "sysCode":[],
        }

    };
    var zTreeObj;
    var setting = {
        async: {
            enable: true,
            url:"/IntegratedMM/syscode/tree.do",
            autoParam:["id"],
            otherParam:{"otherParam":""},
            dataFilter: filter
        },
        view: {
            showIcon: false
        },
        callback: {
            //beforeExpand : areaTreeBeforeExpand,
            onAsyncSuccess: onAsyncSuccess,
            //beforeCheck: zTreeBeforeCheck,
        },
        check: {
            enable: true
        },
        data : {
            simpleData : {
                enable : true,
                idKey : "id",
                pIdKey : "pId",
                rootPId : 0
            }
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
        _getData();
        //获取时间订阅配树
        _getTree();
    }
    function _getData(){
       var _param={
           stationNum:parent.systemSetting.workstationManagement.getJsonData().stationNum
       } ;
        post_async(_param ,_config.ajaxUrl.getWMLUrl,_setDataShow)
    }
    var ws=0;
    function _setDataShow(data){
        var result=data.result;
        if(result.code == "200"){
            $("#stationName").val(data.Workstation.stationName);
            $("#stationNum").val(data.Workstation.stationNum);
            $("#stationHost").val(data.Workstation.stationHost);
            $("#stationPort").val(data.Workstation.stationPort);
            var sysCode = data.Workstation.sysCode ;
           if(sysCode!=null||sysCode!=undefined||sysCode!=""){
               _global.sysCode=sysCode;
              /* setTimeout(function(){
                   _setChecke(sysCode)
               } ,5000);
*/
           }
        }
    }
    function _initEven() {
        /*********************************************************************
         关闭窗口点击事件
         *********************************************************************/
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
    }
    /************************************************
     获取设备类型
     ************************************************/
    function _getTree() {

        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
    }

    function _onAsyncSuccess(event, treeId, treeNode, msg) {
        _setChecke(_global.sysCode);
    }
    function _setChecke(selectSysCode){

        if(selectSysCode==null){
            return;
        }
        var arry=selectSysCode.split(",");
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<arry.length;i++) {
            var node = treeObj.getNodeByParam("id", arry[i]);
            if (node != null) {
                treeObj.checkNode(node, true, true, null);
            }
        }
    }
    function _filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i=0, l=childNodes.length; i<l; i++) {
            childNodes[i].open = true;
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }
    function _getTreeChecked(){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        var nodesId="";
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].id.indexOf("ID") < 0){
                nodesId+=nodes[i].id+',';
            }
        }
        return nodesId;
    }


    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.result.code == '200'){
            parent.parent.alertTip("修改成功",2000,_devModellist);
        }
        else if(data.result.code == '500'){
            parent.parent.alertWarn("工作站编码重复！",2000,null);
        }
        else {
            parent.parent.alertWarn("修改失败",2000,null);
        }
    }
    /******************************************
     刷新列表
     *******************************************/
    function _devModellist() {
        parent.RefreworkstationManagementIframe();
        parent.closePopus();
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
    function getAmendsyscodeInfo() {
        var params = {};
        params = _global.devModelPojo;
        params = _global.devModelPojo;
        params.stationName=$("#stationName").val();
        params.stationHost=$("#stationHost").val();
        params.stationNum=$("#stationNum").val();
        params.stationPort= $("#stationPort").val();
        params.sysCode=_getTreeChecked();
        post_async(params,_config.ajaxUrl.adddevTypeUrl,callbackupdate);

    }

}(window, jQuery))
