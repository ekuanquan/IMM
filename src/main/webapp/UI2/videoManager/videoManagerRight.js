$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;

	var _global = {
		top: parent.parent,
		plugins: {
			page: null
		},
		getParams: {
			pageInfoPojo: {
				currentPage: '1',
				sort: 'eventTime|DESC',
				pageSize: '25',
				totalNum: '',
				totalPage: ''
			}
		}
	};

	function _init() {
		_initEvent();

	}
	//事件绑定函数
	function _initEvent() {
		_global.plugins.page = new YW.PAGEUI({
			ID: 'pageBox',
			clickPage: _queryData_page,
			cssPath: '../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
		});

		$("#contentRight_add").bind('click', function(event) {

		});
		$("#contentRight_del").bind('click', function(event) {

		});
		$("#contentRight_search_input").keydown(function(event) {
			if(event.keyCode == 13) { //绑定回车
				var userId_name = $(this).val();
			}
		});
		
		$('.configurationPlan').bind('click',function(e){
			parent.videoManager('allocationPlan','');
		});

	}

	function _queryParams() {
		var params = {};
		params.pageInfoPojo = {};
		params.pageInfoPojo.currentPage = _global.getParams.pageInfoPojo.currentPage;
		params.pageInfoPojo.sort = _global.getParams.pageInfoPojo.sort;
		params.pageInfoPojo.pageSize = _global.getParams.pageInfoPojo.pageSize;
		return params;
	}

	function _queryData_page(page) {
		_global.getParams.pageInfoPojo.currentPage = page;
		var params = _queryParams();
		post_async(params, _config.ajaxUrl.queryRole, callbackRole);
	}

})(window, jQuery, undefined);