//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;


    var _config = {
        ajaxUrl: {
            getRoleUrl: '/IntegratedMM/role/getRole.do'
        }
    };
    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },
        getRoleParams: {
            pageInfoPojo: {
                currentPage: '1',
                orderBy: 'roleId|ASC',
                pageSize: '30',
                totalNum: '',
                totalPage: ''
            }
        }
    }

    function _init() {
        _initEvent();
        _initData();
    }

    function _initData() {
        _getRole();
    }

    function _initEvent() {
        $("#title_close").bind("click", function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click", function () {
            parent._closePopus();
        });
        $("#confirmButton").bind("click", function () {
           var roleRowJson = $(".isChecked").parent().data('row_json');
            parent.alterUserIframe.setRole(roleRowJson);
            parent._closePopus();
        });
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });

    }

    function _getRoleParams() {
        var params = {};
        params.pageInfoPojo = {};
        params.pageInfoPojo = _global.getRoleParams.pageInfoPojo;
        return params;
    }

    function _getRole() {
        var params = _getRoleParams();
        post_async(params, _config.ajaxUrl.getRoleUrl, _callback_getRole);
    }

    function _callback_getRole(data) {
        var result = data.result;

        if (result.code == 200) {

            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getRoleParams.pageInfoPojo.currentPage = currentPage;
            _global.getRoleParams.pageInfoPojo.totalNum = totalNum;
            _global.getRoleParams.pageInfoPojo.totalPage = totalPage;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var rolePojo = data.json;
            for (var i = 0; i < rolePojo.length; i++) {
                _addRow(rolePojo[i]);
            }
        }

    }


    function _addRow(row_json) {

        $div_row = $("<div></div>");
        $checkbox = $("<div></div>");
        $roleId = $("<div></div>");
        $roleType = $("<div></div>");
        $roleName = $("<div></div>");
        $fMemo = $("<div></div>");

        $div_row
            .append($checkbox)
            .append($roleId)
            .append($roleType)
            .append($roleName)
            .append($fMemo)
            .addClass('row')
            .data('row_json',row_json);
        if (row_json.roleType == '0') {
            row_json.roleType = '客户';
        } else if (row_json.roleType == '1') {
            row_json.roleType = '操作员';
        }
        $checkbox.addClass("noChecked");
        $roleId.addClass('table_item_first').text(row_json.roleId).attr("title", row_json.roleId);
        $roleType.addClass('table_item_4').text(row_json.roleType).attr("title", row_json.roleType);
        $roleName.addClass('table_item_4').text(row_json.roleName).attr("title", row_json.roleName);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        /*$checkbox.bind("click", function () {
            if ($(this).hasClass('noChecked')) {
                $(this).removeClass('noChecked').addClass('isChecked');
                $(this).parent().siblings().children('.isChecked').removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('isChecked').addClass('noChecked');
            }
        });*/
    }

    function _queryData_page(page) {
        _global.getRoleParams.pageInfoPojo.currentPage = page;
        var params = _getRoleParams();
        post_async(params, _config.ajaxUrl.getRoleUrl, _callback_getRole);
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
})(window, jQuery, undefined);