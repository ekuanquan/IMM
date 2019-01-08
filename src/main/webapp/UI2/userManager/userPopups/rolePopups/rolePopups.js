//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;


    var _config = {
        ajaxUrl: {
            getRoleUrl: '../../../../role/getRole.do',
            queryRoleUrl: "/IntegratedMM/role/queryRole.do"
        }
    };
    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },
        treeId:"",
        getRoleParams: {
            /*pageInfoPojo: {
                currentPage: '1',
                orderBy: 'roleId|ASC',
                pageSize: '30',
                totalNum: '',
                totalPage: ''
            }*/
            pageInfoPojo: {
                currentPage: '1',
                sort: 'eventTime|DESC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            },
            value:""
        }
    };
    var setting = {
        /*async: {
         enable: true,
         url:"/../IntegratedMM/getAreaDefault.do",
         autoParam:["id"],
         otherParam:{"otherParam":"zTreeAsyncTest"},
         dataFilter: filter
         },*/

        view: {
            showIcon: false
        },
        callback: {
            onClick: zTreeOnClick
        }
    };

    function _init() {
        _initEvent();
        _initData();
    }

    function _initData() {
        _treeplay();
        //_getRole();
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
        $("#contentRight_search_img").bind('click',function(event){
            var params = _getRoleParams();
            params.roleType = _global.treeId;
            params.value = $("#contentRight_search_input").val();
            post_async(params, _config.ajaxUrl.queryRoleUrl, _callback_getRole);
        });
        //模糊搜索绑定回车
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var params = _getRoleParams();
                params.roleType = _global.treeId;
                params.value = $(this).val();
                post_async(params, _config.ajaxUrl.queryRoleUrl, _callback_getRole);
            }
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
        //_global.getRoleParams.userPojo.userId = rowJson.userId;
        var params = _getRoleParams();
        params.roleType = treeNodeId;
        params.value = _global.getRoleParams.value;
        post_async(params, _config.ajaxUrl.queryRoleUrl, _callback_getRole);
    }
    function _queryRole(treeNodeId) {
        var params = _getRoleParams();
        params.roleType = treeNodeId;
        params.value = _global.getRoleParams.value;
        post_async(params, _config.ajaxUrl.queryRoleUrl, _callback_getRole);
    }

    function _callback_getRole(data) {
        var result = data.result;

        if (result.code == 200) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getRoleParams.pageInfoPojo.currentPage = "1";
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
            roleType = '客户';
        } else if (row_json.roleType == '1') {
            roleType = '操作员';
        }
        $checkbox.addClass("noChecked");
        $roleId.addClass('table_item_first').text(row_json.roleId).attr("title", row_json.roleId);
        $roleType.addClass('table_item_4').text(roleType).attr("title", roleType);
        $roleName.addClass('table_item_4').text(row_json.roleName).attr("title", row_json.roleName);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $checkbox.bind("click", function () {
            if ($(this).hasClass('noChecked')) {
                $(this).removeClass('noChecked').addClass('isChecked');
                $(this).parent().siblings().children('.isChecked').removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('isChecked').addClass('noChecked');
            }
        });
        $div_row.bind('dblclick', function (e) {

        });
    }

    function _queryData_page(page) {
        _global.getRoleParams.pageInfoPojo.currentPage = page;
        var params = _getRoleParams();
        params.roleType = _global.treeId;
        params.value = _global.getRoleParams.value;
        post_async(params, _config.ajaxUrl.queryRoleUrl, _callback_getRole);
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
    function _treeplay() {
        $.fn.zTree.init($("#treeDemo"), setting);
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var newNode = [{
            id: '0',
            /*parentId: 'DEFAULTDIR',*/
            name: '客户',
            isParent: false
        }, {
            id: '1',
            /*parentId: 'DEFAULTDIR',*/
            name: '操作员',
            isParent: false
        }];
        newNode = treeObj.addNodes(null, newNode);
    }
    /**
     * 树点击事件开始
     */
    function zTreeOnClick(event, treeId, treeNode) {
        _queryRole(treeNode.id);
        _global.treeId = treeNode.id;
    }
    function filter(treeId, parentNode, childNodes) {
        if(!childNodes) return null;
        for(var i = 0, l = childNodes.length; i < l; i++) {
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }
    /**
     * 树点击事件结束
     */

    $(document).ready(function() {
        $.fn.zTree.init($("#treeDemo"), setting);
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var newNode = [{
            id: '0',
            /*parentId: 'DEFAULTDIR',*/
            name: '客户',
            isParent: false
        }, {
            id: '1',
            /*parentId: 'DEFAULTDIR',*/
            name: '操作员',
            isParent: false
        }];
        newNode = treeObj.addNodes(null, newNode);
    });
    $(window).load(function(){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var node = treeObj.getNodeByParam("id", "0");
        treeObj.selectNode(node);

        setting.callback.onClick = zTreeOnClick('','0',node);
    });
})(window, jQuery, undefined);