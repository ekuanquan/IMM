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
    window.showCustomerinframe = _showCustomerinframe;
    window.showCustomerinframeSearch = _showCustomerinframeSearch;
    window.delUserInfo = _delUserInfo;
    window.determinecls=_determinecls;
    window.queryData_page = _queryData_page;
    window.getCustomerinframes = _getCustomerinframes;
    var _config={
        ajaxUrl:{
            getCustomerinframeUrl:'../../../getCustomerInfoByAreaId.do',
            deleteGeneralUserUrl:'../../../deleteGeneralUser.do',
            deleteOwnerUserUrl:'../../../deleteOwnerUser.do'
        }
    };
    var _global = {
        top:parent.parent,
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
        main:null,
    };

    function _resizeDocment(){

    }


    function _init(){
        _global.main=parent.parent.getMain();
        _initEvent();
        parent.zTreeOnAsyncSuccess();
    }

    function _initEvent(){
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        //parent.zTreeOnAsyncSuccess();
    }

    function _addTableRow(jsonData, isPre) {
        var row_json = _exchangeText(jsonData);
		$div_row = $("<tr></tr>");
        $div_userId = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_userType = $("<td></td>");
        $div_userAddr = $("<td></td>");
        $div_userProperty = $("<td></td>");
        $div_businessId = $("<td></td>");
        $div_platformName = $("<td></td>");
        $div_payNO = $("<td></td>");
        $div_row
            .append($div_userId)
            .append($div_userName)
            .append($div_userType)
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
        $div_payNO.addClass('table_item_2').text(row_json.payNo).attr("title", row_json.payNo);
        //$("#table_content").append($div_row);
        $("#table_content").append($div_row);

       
        $div_row.bind('dblclick', function (e) {
            if(_global.main.platform_id==jsonData.platformId) {
                if (row_json.userType == "机主") {
                    parent.parent.userPopusManager('alterOwnerUser');
                }
                if (row_json.userType == "一般客户") {
                    parent.parent.userPopusManager('alterGeneralUser');
                }
            }
            else{
                parent.parent.popusStaManager('alterGeneralUser');
            }
            parent.parent.setPopupsRowJson(row_json);
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
        _global.dow.row = "";
        _global.getCustomerinframeParams.queryTond.areaId = areaId;
        _global.getCustomerinframeParams.queryTond.userId_name='';
        _global.getCustomerinframeParams.pageInfoPojo.currentPage = '1';
        _getCustomerinframes();
    }
    function _showCustomerinframeSearch(userId_name){
        _global.dow.row = "";
        _global.getCustomerinframeParams.queryTond.userId_name = userId_name;
        _global.getCustomerinframeParams.pageInfoPojo.currentPage = '1';
        _getCustomerinframes();
    }
    //获取改刷新的页数数据
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
        $(parent.document.body).removeLoading();                                  //取消转圈*/
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
            //$row.removeClass('row_checked').addClass('row_noChecked');
        }

    }
    
    function _delUserInfo() {
        var jsonData = $('.row_checked').data('jsonData');
        if(jsonData.userType == '一般客户'){            //一般客户
            _deleteGeneralUser(jsonData.userId);
        }else if(jsonData.userType == '机主'){         //机主用户
            _deleteOwnerUser(jsonData.userId);
        }

    }
    //删除普通用户
    function _getDeleteGeneralUserParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.deleteUserParams.userPojo.userId;
        return params;
    }
    function _deleteGeneralUser(userId) {
        if(_global.main.platform_id!=_global.dow.div_row.platformId) {
            _global.top.alertTip("不能删除非本平台数据！",0,null);
            return;
        }
        parent.parent.comfireFloat("确认要删除用户" + userId ,callbackdelsuc,null);
        _global.deleteUserParams.userPojo.userId = userId;
    }
    function callbackdelsuc() {
        var params = _getDeleteGeneralUserParams();
        $("body").loading();                                            //加载的时候转圈
        post_async(params, _config.ajaxUrl.deleteGeneralUserUrl, _callback_deleteGeneralUser);
    }
    function _callback_deleteGeneralUser(data) {
        $("body").removeLoading();                                  //取消转圈*/
        $("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;
        if(result.code == '0'){
            //alert("删除普通用户成功");
            parent.parent.alertTip("删除普通用户成功！",0,null);
            getCustomerinframes();
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

        if(_global.main.platform_id!=_global.dow.div_row.platformId) {
            _global.top.alertTip("不能删除非本平台数据！",0,null);
            return;
        }
        parent.parent.comfireFloat("确认要删除用户" + userId +"?",callbackdelown,null);
        _global.deleteUserParams.userPojo.userId = userId;

    }
    function callbackdelown() {
        var params = _getDeleteOwnerUserParams();
        $("body").loading();                                            //加载的时候转圈
        post_async(params, _config.ajaxUrl.deleteOwnerUserUrl, _callback_deleteOwnerUser);
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