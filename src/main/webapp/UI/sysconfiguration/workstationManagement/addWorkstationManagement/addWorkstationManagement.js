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
            adddevTypeUrl:"/IntegratedMM/Workstation/saveWorkstation.do"
        }
    };
    _global = {
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
        //获取时间订阅配树
        _getTree();
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
    function _filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i=0, l=childNodes.length; i<l; i++) {
            childNodes[i].open = true;
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }
    function _onAsyncSuccess(event, treeId, treeNode, msg) {
       //加载完成后啥都不做
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

    /************************************************
     获取页面数据222
     ************************************************/
    function getAmendsyscodeInfo() {
        var params = {};
        params = _global.devModelPojo;
        params.stationName=$("#stationName").val();
        params.stationHost=$("#stationHost").val();
        params.stationNum=$("#stationNum").val();
        params.stationPort= parseInt($("#stationPort").val());
        params.sysCode=_getTreeChecked();
        params.id=parseInt($("#stationNum").val());
        params.fMemo="";
        post_async(params,_config.ajaxUrl.adddevTypeUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.result.code == '200'){
            parent.parent.alertTip("添加成功",2000,_devModellist);
        }
        else if(data.result.code == '500'){
            parent.parent.alertWarn("工作站编号已存在！",2000,null);
        }
        else {
            parent.parent.alertWarn("添加失败",2000,null);
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

}(window, jQuery))
