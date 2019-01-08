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
        }

    };

    function _resizeDocment(){

    }


    function _init(){
        _initEvent();
       // _showCustomerinframe("DEFAULTDIR");
    }

    function _initEvent(){
        
//        $(".row").bind('dblclick', function(event) {
//            /* Act on the event */
//            _global.top.devicePopusManager('editDevice');
//        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        parent.zTreeOnAsyncSuccess();
    }

    function _addTableRow(jsonData, isPre) {
        var row_json = _exchangeText(jsonData);
		$div_row = $("<div></div>");
        $div_userId = $("<div></div>");
        $div_userName = $("<div></div>");
        $div_userType = $("<div></div>");
        $div_userAddr = $("<div></div>");
        $div_userProperty = $("<div></div>");
        $div_businessId = $("<div></div>");
        $div_centerId = $("<div></div>");
        $div_payNO = $("<div></div>");
		
      /*  $div_devModelId = $("<div></div>");
        $div_devModelName = $("<div></div>");
        $div_devIndex = $("<div></div>");
        $div_telAddr = $("<div></div>");
        $div_instMan = $("<div></div>");
        $div_devInstDate = $("<div></div>");
        $div_devLng = $("<div></div>");
        $div_devlat = $("<div></div>");
        $div_keyboardAddr = $("<div></div>");
        $div_pnlAddr = $("<div></div>");
        $div_pnlPowerAddr = $("<div></div>");
        $div_instUnit = $("<div></div>");
        $div_hostTel = $("<div></div>");
        $div_passCode = $("<div></div>");
        $div_pnlTel = $("<div></div>");
        $div_fMemo = $("<div></div>");*/

        $div_row
            .append($div_userId)
            .append($div_userName)
            .append($div_userType)
            //.append($div_areaId)
            .append($div_userAddr)
            .append($div_userProperty)
            .append($div_businessId)
            //.append($div_devModelId)
            .append($div_centerId)
            .append($div_payNO)
            /*.append($div_telAddr)
            .append($div_instMan)
            .append($div_devInstDate)
            .append($div_devLng)
            .append($div_devlat)
            .append($div_keyboardAddr)
            .append($div_pnlAddr)
            .append($div_pnlPowerAddr)
            .append($div_instUnit)
            .append($div_hostTel)
            .append($div_passCode)
            .append($div_pnlTel)
            .append($div_fMemo)*/
            .addClass('row row_noChecked')
            .attr('id', row_json.userId);
        $div_userId.addClass('table_item_4').text(row_json.userId).attr("title", row_json.userId);                       
        $div_userName.addClass('table_item_4').text(row_json.userName).attr("title", row_json.userName);
        $div_userType.addClass('table_item_4').text(row_json.userType).attr("title", row_json.userType);
        //$div_areaId.addClass('table_item_4').text(row_json.areaId).attr("title", row_json.areaId);
        $div_userAddr.addClass('table_item_4').text(row_json.userAddr).attr("title", row_json.userAddr);
        //$div_devType.addClass('table_item_4').text(row_json.devType).attr("title", row_json.devType);
        $div_userProperty.addClass('table_item_4').text(row_json.userProperty).attr("title", row_json.userProperty);
        //$div_devModelId.addClass('table_item_4').text(row_json.devModelId).attr("title", row_json.devModelId);
        $div_businessId.addClass('table_item_4').text(row_json.businessName).attr("title", row_json.businessName);
        $div_centerId.addClass('table_item_5').text(row_json.centerName).attr("title", row_json.centerName);
        $div_payNO.addClass('table_item_2').text(row_json.payNO).attr("title", row_json.payNO);
       /* $div_instMan.addClass('table_item_3').text(row_json.instMan).attr("title", row_json.instMan);
        $div_devInstDate.addClass('table_item_4').text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_devLng.addClass('table_item_2').text(row_json.devLng).attr("title", row_json.devLng);
        $div_devlat.addClass('table_item_2').text(row_json.devlat).attr("title", row_json.devlat);
        $div_keyboardAddr.addClass('table_item_4').text(row_json.keyboardAddr).attr("title", row_json.keyboardAddr);
        $div_pnlAddr.addClass('table_item_4').text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_pnlPowerAddr.addClass('table_item_4').text(row_json.pnlPowerAddr).attr("title", row_json.pnlPowerAddr);
        $div_instUnit.addClass('table_item_4').text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_hostTel.addClass('table_item_4').text(row_json.hostTel).attr("title", row_json.hostTel);
        $div_passCode.addClass('table_item_4').text(row_json.passCode).attr("title", row_json.passCode);
        $div_pnlTel.addClass('table_item_4').text(row_json.pnlTel).attr("title", row_json.pnlTel);
        $div_fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        */
        $("#table_content").append($div_row);

       
        $div_row.bind('dblclick', function (e) {
        	if(row_json.userType == "机主"){
        		parent.parent.userPopusManager('alterOwnerUser');
        	}
            if(row_json.userType == "一般客户"){
            	parent.parent.userPopusManager('alterGeneralUser');
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
        $(parent.document.body).removeLoading();                                  //取消转圈*/
        //$("body").removeLoading();
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
            setTimeout(function () {

                $this.remove();
            }, i * 1);
            i++;
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

})(window,jQuery);