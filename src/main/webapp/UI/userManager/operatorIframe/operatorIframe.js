$(document).ready(function() {
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function(window,$){
    window.init = _init;
    window.resizeDocment = _resizeDocment;
    window.addTableRow = _addTableRow;
    window.showOperatorIframe = _showOperatorIframe;
    window.showOperatorIframeSearch = _showOperatorIframeSearch;
    window.delUserInfo = _delUserInfo;
    window.queryData_page = _queryData_page;    //页面刷新
    window.getOperator = _getOperator;
    window.determinecls = _determinecls;
    var _config={
        ajaxUrl:{
            getOperatorUrl:'../../../getOperatorsInfoByAreaId.do',
            deleteOperatorUserUrl:'../../../deleteOperatorUser.do'
        }
    };
    var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getOperatorParams: {
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
        main:null,
        platformId:"",
    };

    function _resizeDocment(){

    }


    function _init(){
        _global.main=parent.parent.getMain();
        _initEvent();
    }

    function _initEvent(){
        $(".row").bind('dblclick', function(event) {
            /* Act on the event */
            _global.top.devicePopusManager('editDevice');
        });
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
    }

    function _addTableRow(jsonData, isPre) {
        var row_json = _exchangeText(jsonData);
		$div_row = $("<tr></tr>");
        $div_userId = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_userType = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_overDateTime = $("<td></td>");
        $div_acctIP = $("<td></td>");
        $div_sex = $("<td></td>");
        $div_telephone = $("<td></td>");
        $div_email = $("<td></td>");
        $div_office = $("<td></td>");
        $div_userPWDhint = $("<td></td>");
        $div_platformName = $("<td></td>");
        $div_acctDY = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_userId)
            .append($div_userName)
            .append($div_userType)
            .append($div_areaName)
            .append($div_overDateTime)
            .append($div_acctIP)
            .append($div_sex)
            .append($div_telephone)
            .append($div_email)
            .append($div_office)
            .append($div_userPWDhint)
            .append($div_platformName)
            .append($div_acctDY)
            .append($div_fMemo)
            .addClass('row row_noChecked')
            .attr('id', row_json.userId);
        $div_userId.text(row_json.userId).attr("title", row_json.userId);
        $div_userName.text(row_json.userName).attr("title", row_json.userName);
        $div_userType.text(row_json.userType).attr("title", row_json.userType);
        $div_areaName.text(row_json.areaName).attr("title", row_json.areaName);
        $div_overDateTime.text(row_json.overDateTime).attr("title", row_json.overDateTime);
        $div_acctIP.text(row_json.acctIP).attr("title", row_json.acctIP);
        $div_sex.text(row_json.sex).attr("title", row_json.sex);
        $div_telephone.text(row_json.telephone).attr("title", row_json.telephone);
        $div_email.text(row_json.email).attr("title", row_json.email);
        $div_office.text(row_json.office).attr("title", row_json.office);
        $div_userPWDhint.text(row_json.userPWDhint).attr("title", row_json.userPWDhint);
        $div_platformName.text(row_json.platformName).attr("title", row_json.platformName);
        $div_acctDY.text(row_json.acctDY).attr("title", row_json.acctDY);
        $div_fMemo.text(row_json.fMemo).attr("title", row_json.fMemo);
        //$("#table_content").append($div_row);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('dblclick', function (e) {
            if(_global.main.platform_id==jsonData.platformId) {
                if (row_json.userType == "系统操作员") {
                    parent.parent.userPopusManager('alterSysOperator');
                }
                if (row_json.userType == "业务操作员") {
                    parent.parent.userPopusManager('alterSysOperator');
                }
            }
            else{
                parent.parent.popusStaManager('alterSysOperator');
            }

            parent.parent.setPopupsRowJson(row_json);
        }).bind('click', function () {
            _global.dow.row = 1;
            _global.dow.div_row=row_json;
            row_checked($(this),row_json);
        });
    }

    function _showOperatorIframe(areaId){
        _global.dow.row = "";
        _global.getOperatorParams.queryTond.areaId = areaId;
        _global.getOperatorParams.queryTond.userId_name = '';
        _global.getOperatorParams.pageInfoPojo.currentPage = '1';
        _getOperator();
    }
    function _showOperatorIframeSearch(userId_name){
        _global.dow.row = "";
        _global.getOperatorParams.queryTond.userId_name = userId_name;
        _global.getOperatorParams.pageInfoPojo.currentPage = '1';
        _getOperator();
    }

    function _getOperatorParams() {

        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getOperatorParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getOperatorParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.orderBy = _global.getOperatorParams.pageInfoPojo.orderBy;
        params.pageInfoPojo.pageSize = _global.getOperatorParams.pageInfoPojo.pageSize;
        return params;
    }
    function _getOperator(){
        var params = _getOperatorParams();
        $(parent.document.body).loading();                        //加载的时候转圈
        post_async(params, _config.ajaxUrl.getOperatorUrl, _callback_getOperator);
    }

    function _callback_getOperator(data) {
        $(parent.document.body).removeLoading();                                  //取消转圈*/
        //$("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;

        if (result.code == '0') {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getOperatorParams.pageInfoPojo.currentPage = currentPage;
            _global.getOperatorParams.pageInfoPojo.totalNum = totalNum;
            _global.getOperatorParams.pageInfoPojo.totalPage = totalPage;
            if(totalNum == 0){totalNum = -1;}
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.operatorPojo;
            for (var i = 0; i < json.length; i++) {
                _addTableRow(json[i]);
            }
        } else {
            _clearRow();
        }
        setColSize();
    }
    function _queryData_page(page) {
        _global.getOperatorParams.pageInfoPojo.currentPage = page;
        var params = _getOperatorParams();
        $(parent.document.body).loading();
        post_async(params, _config.ajaxUrl.getOperatorUrl, _callback_getOperator);
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
        }if (json.userType == '1') {
            json.userType = '机主';
        }if (json.userType == '2') {
            json.userType = '系统操作员';
        }if (json.userType == '3') {
            json.userType = '业务操作员';
        }if(json.sex == '0'){
        	json.sex = '男';
        }if(json.sex == '1'){
        	json.sex = '女';
        }if(json.acctDY == '0'){
        	json.acctDY='不启用';
        }if(json.acctDY == '1'){
        	json.acctDY='启用并回发消息';
        }if(json.acctDY == '2'){
        	json.acctDY='启用不回发消息';
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

    function _delUserInfo() {
        var jsonData = $('.row_checked').data('jsonData');
        _deleteOperatorUser(jsonData.userId);
    }

    //删除机主用户
    function _getDeleteOperatorUserParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.deleteUserParams.userPojo.userId;
        return params;
    }
    function _deleteOperatorUser(userId) {
        if(_global.main.platform_id!=_global.dow.div_row.platformId) {
            _global.top.alertTip("不能删除非本平台数据！",0,null);
            return;
        }
        parent.parent.comfireFloat("确认要删除用户" + userId +"?",callbackdelsuc,null);
        _global.deleteUserParams.userPojo.userId = userId;
    }
    function callbackdelsuc() {
        var params = _getDeleteOperatorUserParams();
        $("body").loading();                        //加载的时候转圈
        post_async(params, _config.ajaxUrl.deleteOperatorUserUrl, _callback_deleteOperatorUser);
    }
    function _callback_deleteOperatorUser(data) {
        $("body").removeLoading();                                  //取消转圈*/
        $("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;
        if(result.code == '0'){
            //alert("删除操作员成功");
            parent.parent.alertTip("删除操作员成功！",0,null);
            getOperator();
        }
    }
    /************************************************************
     判断是否被选中
     *************************************************************/
    function  _determinecls() {
        return _global.dow;
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
})(window,jQuery);