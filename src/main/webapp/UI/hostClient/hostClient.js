/**
 * Created by ywhl on 2017/6/5.
 */
/**
 * 弹窗
 */
var zTreeObj;
var onClickNode;
var flag=0;

function treeReload(){
    var params={
        "userId":getZTreeUserID(),
        handleOnly: false,
    }
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
    flag = 0;
}

function add(){
    parent.devicePopusManager('addZone');
}
function update(){
    parent.devicePopusManager('editZone',onClickNode);
}
function deleteArea() {

    var param_json = {
        id : onClickNode.id
    };
    post_async(param_json, '/../IntegratedMM/deleteArea.do', _callBack);
}
function _callBack(data) {
    if (data.code == 1) {
        treeReload();
        onClickNode = null;
        parent.alertTip("删除成功",2000,null);
    } else {
        console.log(data);
        parent.alertTip("删除失败",2000,null);
    }
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode){
    onClickNode = treeNode;
    showUserInfoManager(treeNode);
}

function areaTreeBeforeExpand(treeId, treeNode) {
    zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
    /*async: {
        enable: true,
        url:"/../IntegratedMM/getAreaList.do",           //    /../IntegratedMM/getAreaZtree.do
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID(),
            handleOnly: false,
        },
        dataFilter: filter
    },*/
    view: {
        showIcon: false,
        addDiyDom : myDiyDom
    },
    callback: {
        beforeExpand : areaTreeBeforeExpand,
        onClick: zTreeOnClick,
        onAsyncSuccess: zTreeOnAsyncSuccess
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
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    if(flag == 0) {
        var nodes = zTreeObj.getNodes();
        var firstNode = nodes[0];
        //var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
        zTreeObj.selectNode(firstNode);
        if(firstNode == "undefined"||firstNode == undefined){
            firstNode="";
        }
        setting.callback.onClick('',firstNode.id,firstNode);
        flag=1;
    }
}
function myDiyDom(treeId, treeNode) {
    var spaceWidth = 5;
    var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#"
        + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    if (treeNode.level > 0) {
        var spaceStr = "<span style='display: inline-block;width:"
            + (spaceWidth * treeNode.level) + "px'></span>";
        switchObj.before(spaceStr);
    }
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].open = true;
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}
/**
 * 树点击事件结束
 */

function getZTreeUserID(){
    var userId = parent.getUserId();
    return userId;
}

$(document).ready(function(){
    $("#add").click(function(){add()});
    $("#update").click(function(){update()});
    $("#flash").click(function(){treeReload()});
    $("#close").click(function() {
        var platformId= parent.getMain();
        if(onClickNode!=null&&onClickNode.platformId!=platformId.platform_id) {
            parent.alertTip("不能删除非本平台数据！",0,null);
            return;
        }
        if (onClickNode == null)
            return;
        parent.comfireFloat("是否确认删除？",deleteArea,null)
    });

    var params={
        "userId":getZTreeUserID(),
        handleOnly: false,
    }
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
    init();
});
;(function(window,$,undefined){
    window.init = _init;
    window.addTableRow = _addTableRow;
    window.showCustomerinframe = _showCustomerinframe;
    window.showCustomerinframeSearch = _showCustomerinframeSearch;
    window.delUserInfo = _delUserInfo;
    window.determinecls=_determinecls;
    window.queryData_page = _queryData_page;
    window.getCustomerinframes = _getCustomerinframes;
    window.showUserInfoManager = _showUserInfoManager;

    var _config={
        ajaxUrl:{
            getCustomerinframeUrl:'/IntegratedMM/getOwnerInfoByAreaId.do',
            deleteGeneralUserUrl:'/IntegratedMM/deleteGeneralUser.do',
            deleteOwnerUserUrl:'/IntegratedMM/deleteOwnerUser.do'
        }
    };
    var _global = {
        top:parent,
        plugins:{
            page:null
        },
        getCustomerinframeParams: {
            queryTond: {
                areaId: '',
                userId_name:''
            },
            pageInfoPojo: {
                currentPage: '1',
                orderBy: 'userId|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        deleteUserParams:{
            userPojo:{
                userId:''
            }
        },
        dow:{
            row:'',
            div_row:''
        },
        treeNode:"",
        flag:[]
    };
    var platformId= parent.getMain();

    function _init(){
        _initEvent();
    }
    //事件绑定函数
    function _initEvent(){
        _global.flag = [0,0];
        $("#contentRight_add").bind('click', function(event) {
            _global.top.userPopusManager('addOwnerUser');
        });
        $("#contentRight_del").bind('click', function(event) {
            /*
            * SJ
            * 2018-5-24
            * 弃用之前的直接使用全局对象的值，改为每次点击删除的时候从页面获取
            * 缺点：如果在前端web改变了页面上的值，那么此处获取的值可以为改变后的值。
            * 值：uerID
            * */
            var uerID=$("#listBox2").find(".row_checked").children("td").eq(0).html();
            _delUserInfo(uerID);
        });
        //搜索按钮  根据userId userName 模糊搜索
        $("#contentRight_search_img").bind('click', function(event) {
            var userId_name = $("#contentRight_search_input").val();
            _showUserInfoSearch(userId_name);
        });
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var userId_name = $(this).val();
                _showUserInfoSearch(userId_name);
            }
        });

        //计划任务点击事件
        $("#contentRight_taskPlan").bind('click', function(event) {
            var iframeTab =  _global.top.getUserIframeTab();
            var result = '';
            result = _determinecls();
            _taskPlan(result);
            //getCustomerinframes();
        });
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        zTreeOnAsyncSuccess();
    }
    function _showUserInfoManager(treeNode){
        $("#contentRight_search_input").val('');
        _global.treeNode = treeNode;
        showCustomerinframe(treeNode.id);
    }
    //用户id、用户名称 模糊搜索
    function _showUserInfoSearch(userId_name) {
        showCustomerinframeSearch(userId_name);
    }

    function _delUserInfo(userID) {
        _deleteOwnerUser(userID);
    }
    function _addTableRow(jsonData, isPre) {
        var row_json = _exchangeText(jsonData);
        var $div_row = $("<tr></tr>");
        var $div_userId = $("<td></td>");
        var $div_userName = $("<td></td>");
        var $div_userType = $("<td></td>");
        var $div_userAddr = $("<td></td>");
        var $div_userProperty = $("<td></td>");
        var $div_businessId = $("<td></td>");
        var $div_platformName = $("<td></td>");
        var $div_payNO = $("<td></td>");
        $div_row
            .append($div_userId)
            .append($div_userName)
            .append($div_userType)
            //.append($div_areaId)
            .append($div_userAddr)
            .append($div_userProperty)
            .append($div_businessId)
            .append($div_platformName)
            .append($div_payNO)
            .addClass('row row_noChecked')
            .attr('id', row_json.userId);
        $div_userId.addClass('table_item_4').text(row_json.userId).attr("title", row_json.userId);
        $div_userName.addClass('table_item_4').text(row_json.userName).attr("title", row_json.userName);
        $div_userType.addClass('table_item_4').text(row_json.userType).attr("title", row_json.userType);
        $div_userAddr.addClass('table_item_4').text(row_json.userAddr).attr("title", row_json.userAddr);
        $div_userProperty.addClass('table_item_4').text(row_json.userProperty).attr("title", row_json.userProperty);
        $div_businessId.addClass('table_item_4').text(row_json.businessName).attr("title", row_json.businessName);
        $div_platformName.addClass('table_item_5').text(row_json.platformName).attr("title", row_json.platformName);
        $div_payNO.addClass('table_item_2').text(row_json.payNO).attr("title", row_json.payNO);
        $("#table_content").append($div_row);


        $div_row.bind('dblclick', function (e) {
            if(row_json.platformId==platformId.platform_id){
                parent.parent.userPopusManager('alterOwnerUser');
                parent.parent.setPopupsRowJson(row_json);
            }else{
                parent.parent.popusStaManager('alterOwnerUser');
                parent.parent.setPopupsRowJson(row_json);
            }

        }).bind('click', function () {
            _global.dow.row = 1;
            _global.dow.div_row=jsonData;
            row_checked($(this),jsonData);
        });


    }

    /************************************************************
     判断是否被选中
     *************************************************************/
    function  _determinecls() {
        return _global.dow;
    }
    function _showCustomerinframe(areaId){
        _global.getCustomerinframeParams.queryTond.areaId = areaId;
        _global.getCustomerinframeParams.queryTond.userId_name='';
        _global.getCustomerinframeParams.pageInfoPojo.currentPage = '1';
        _getCustomerinframes();
    }
    function _showCustomerinframeSearch(userId_name){
        _global.getCustomerinframeParams.queryTond.userId_name = userId_name;
        _global.getCustomerinframeParams.pageInfoPojo.currentPage = '1';
        _getCustomerinframes();
    }

    function _getCustomerinframesParams() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getCustomerinframeParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getCustomerinframeParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.orderBy = _global.getCustomerinframeParams.pageInfoPojo.orderBy;
        params.pageInfoPojo.pageSize = _global.getCustomerinframeParams.pageInfoPojo.pageSize;
        return params;
    }
    function _getCustomerinframes(){
        var params = _getCustomerinframesParams();
        $(parent.document.body).loading();                        //加载的时候转圈
        post_async(params, _config.ajaxUrl.getCustomerinframeUrl, _callback_getCustomerinframes);
    }

    function _callback_getCustomerinframes(data) {
        $(parent.document.body).removeLoading();                    //取消转圈*/
        $("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;
        if (result.code == 0) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getCustomerinframeParams.pageInfoPojo.currentPage = currentPage;
            _global.getCustomerinframeParams.pageInfoPojo.totalNum = totalNum;
            _global.getCustomerinframeParams.pageInfoPojo.totalPage = totalPage;
            if(totalNum == 0){totalNum = -1;}
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.ownerPojo;
            for (var i = 0; i < json.length; i++) {
                _addTableRow(json[i]);
            }
        } else {
            _clearRow();
        }
        setColSize();
    }
    function _queryData_page(page) {
        _global.getCustomerinframeParams.pageInfoPojo.currentPage = page;
        var params = _getCustomerinframesParams();
        $(parent.document.body).loading();                                            //加载的时候转圈
        post_async(params, _config.ajaxUrl.getCustomerinframeUrl, _callback_getCustomerinframes);
    }
    function _clearRow() {
        var i = 1;

        $(".row").each(function () {
            var $this = $(this);
            $this.remove();
        });
    }

    function _exchangeText(json){
        if(json.userType == '0'){
            json.userType = '一般客户';
        }else if (json.userType == '1') {
            json.userType = '机主';
        }
        if(json.userProperty == '0'){
            json.userProperty = '未注册';
        }else if (json.userProperty == '1') {
            json.userProperty = '已注册';
        }
        return json;
    }
    function row_checked($row,jsonData) {
        if ($row.hasClass('row_noChecked')) {
            $row.removeClass('row_noChecked').addClass('row_checked').data('jsonData',jsonData);
            $row.siblings().removeClass('row_checked').addClass('row_noChecked');
        } else {
        }
    }
    //删除机主用户
    function _getDeleteOwnerUserParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.deleteUserParams.userPojo.userId;
        return params;
    }
    function _deleteOwnerUser(userId) {
    	
        if(typeof(userId)=='undefined'||userId.length==0){
            _global.top.alertTip("请选择要删除的机主！",2000,null);
            return;
        }
        else {
            if (_global.dow.div_row.platformId != platformId.platform_id) {
                _global.top.alertTip("不能删除非本平台数据！", 0, null);
                return;
            }
            parent.parent.comfireFloat("确认要删除用户" + userId + "?", callbackdelown, null);
            _global.deleteUserParams.userPojo.userId = userId;
        }
    }
    function callbackdelown() {
        var params = _getDeleteOwnerUserParams();
        $("body").loading();                                            //加载的时候转圈
        post_async(params, _config.ajaxUrl.deleteOwnerUserUrl, _callback_deleteOwnerUser);
        _global.dow.div_row.userId='';
    }
    function _callback_deleteOwnerUser(data) {
        $("body").removeLoading();                                  //取消转圈*/
        $("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;
        if(result.code == '0'){
            //alert("删除机主用户成功");
            parent.parent.alertTip("删除机主用户成功！",0,null);
            getCustomerinframes();
        }
    }
    /************************************************************
     判断是否被选中
     *************************************************************/
    function  _determinecls() {
        return _global.dow;
    }

    function _taskPlan(result) {
        //if(result.row == ""){
        if(!($("#table_content tr").hasClass("row_checked"))){
            //alert("请选择你需要修改的任务计划！");
            _global.top.alertTip("请选择用户！",0,null);
        }
        else{
            _global.top.userPopusManager('taskplan',result.div_row);
            result.row = "";
        }
    }

    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:true,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(window,jQuery,undefined);
