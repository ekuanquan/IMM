/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function() {
	// 重绘一次布局，然后再设置页面的resize事件
	resizeDocment(); // 重绘函数
	$(window).resize(function() {
		resizeDocment(); // 重绘函数
	});
	init();
});

;
(function($, window) {
	window.resizeDocment = _resizeDocment;// 修改页面大小
	window.init = _init;// 修改页面大小
	window.appendRow = addRow;
	window.removeRow = _removeRow;
	window.switchPoliceType = _switchPoliceType;
	window.getAlarmInfos = _getAlarmInfos;
	window.queryData_page = _queryData_page;
	window.getPageInfo = _getPageInfo;
	window.setPageInfo = _setPageInfo;
	window.searchEventInfo = _searchEventInfo;
	var _config = {
		minWidth : 3363,
		minHeight : 765,
		module : {
			suspectSRC : '../suspect/suspect_Index.html',
			caseSRC : '../case/case_Index.html',
			clueSRC : '../clue/clue_Index.html'
		},
		win : {
			addCase : '../addNewCase/newCase.html',
			saveTo : '../saveTo/SaveTo.html',
			lookFile : '../videoPlayer/videoPlayer.html',
			upload : '../upload/upload.html'
		},
		ajaxUrl : {
			getMaintainListUrl : '/IntegratedMM/query/maintenanceQuery.do '
		}
	};
	var _global = {
		currentUser : '',// 当前用户名
		heartBeatTime : 1000,// 心跳间隔
		casLog : 'https://pc-20150819yb:8843/cas/logout?service=',
		uploadURL : '',
		dwonloadURL : '',
		sendInfo : {},
		userInfo : {},
		top : parent.parent,
		up : parent,
		plugins : {
			page : null
		},
		mouseoutEventA : null,
		mouseoutEventB : null,
		getAlarmInfosParams : {
			maintenancePojo : {
				maintainNum : '',
				createTime : ''

			},
			pageInfoPojo : {
				currentPage : '1',
				sort : 'createTime|ASC',
				pageSize : '25',
				totalNum : '',
				totalPage : ''
			}
		},
		eventTypeSearch : '',
		maintainTypeJson : null,
		eventTypePush : null
	};
	var _globalH = {
		getAlarmInfosParams : {
			maintenancePojo : {
				maintainNum : '',
				createTime : ''

			},
			pageInfoPojo : {
				currentPage : '1',
				sort : 'createTime|ASC',
				pageSize : '25',
				totalNum : '',
				totalPage : ''
			}
		}
	};

	// 重绘布局
	function _resizeDocment() {
	}

	function _init() {
		_initData();
		_initEven();
	}

	var maintainTypeJson = [ {
		"maintainTypeId" : " 0",
		"maintainTypeName" : "维修类型"
	}, {
		"maintainTypeId" : " 1",
		"maintainTypeName" : "安装"
	}, {
		"maintainTypeId" : " 2",
		"maintainTypeName" : "变更"
	}, {
		"maintainTypeId" : " 3",
		"maintainTypeName" : "维修探测器"
	} ];
	function _initData() {
		var nowTime = getNowFormatDate();
		// var startTime = getBeforeFormatDate();
		var startTime = getBeforeHalfYearFormatDate();
		nowTime = nowTime.split(" ")[0] + " 23:59:59";
		startTime = startTime.split(" ")[0] + " 00:00:00";
		$("#startTime").val(startTime);
		$('#startTime').bind('focus', function() {
			WdatePicker({
				maxDate : '#F{$dp.$D(\'endTime\')}',
				dateFmt : 'yyyy-MM-dd HH:mm:ss',
				isShowClear : false
			});
			this.blur();
		});
		$("#endTime").val(nowTime);
		$('#endTime').bind('focus', function() {
			WdatePicker({
				minDate : '#F{$dp.$D(\'startTime\')}',
				dateFmt : 'yyyy-MM-dd HH:mm:ss',
				isShowClear : false
			});
			this.blur();
		});

		_global.maintainTypeJson = maintainTypeJson;

	}

	function _initEven() {

		document.oncontextmenu = function() {
			return false;
		}
		_global.plugins.page = new YW.PAGEUI({
			ID : 'pageBox',
			clickPage : _queryData_page,
			cssPath : '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
		});
		_switchFiltrate();

		$("#search_text").keydown(function(event) {
			if (event.keyCode == 13) { // 绑定回车
				_searchEventInfo();
			}
		});
		/*
		 * $(".Checked_img").bind('click',function () { _searchEventInfo(); });
		 */

		$("#timeorder").click(function() {
			$("#timePng").toggleClass("timePngchange");
			_getAlarmInfosH();
		});

		$("#policeCheck").click(function() {
			_searchEventInfo();
		});
		$("#policeCheck").click();
	}
	function _searchEventInfo() {
		var maintenancePojo = {};

		maintenancePojo.sysuserID = 'E123';

		var scarch = $("#fuzzy").val();
		if (scarch == ("all")) {
			maintenancePojo.all = $("#search_text").val();
			maintenancePojo.maintainNum = '';
			maintenancePojo.accountNum = '';
			maintenancePojo.accountName = '';
			maintenancePojo.cMobile = '';
		} else if (scarch == ("maintainNum")) {
			maintenancePojo.all = '';
			maintenancePojo.maintainNum = $("#search_text").val();
			maintenancePojo.accountNum = '';
			maintenancePojo.accountName = '';
			maintenancePojo.cMobile = '';
		} else if (scarch == ("accountNum")) {
			maintenancePojo.all = '';
			maintenancePojo.maintainNum = '';
			maintenancePojo.accountNum = $("#search_text").val();
			maintenancePojo.accountName = '';
			maintenancePojo.cMobile = '';
		} else if (scarch == ("accountName")) {
			maintenancePojo.all = '';
			maintenancePojo.maintainNum = '';
			maintenancePojo.accountNum = '';
			maintenancePojo.accountName = $("#search_text").val();
			maintenancePojo.cMobile = '';
		} else if (scarch == ("cMobile")) {
			maintenancePojo.all = '';
			maintenancePojo.maintainNum = '';
			maintenancePojo.accountNum = '';
			maintenancePojo.accountName = '';
			maintenancePojo.cMobile = $("#search_text").val();
		}

		var time = $("#startTime").val() + ";" + $("#endTime").val();
		maintenancePojo.warrantyTime = time.replace(" ", "T")
		maintenancePojo.warrantyTime = maintenancePojo.warrantyTime.replace(
				" ", "T");

		var searchTime = '';
		var nowTime = getNowFormatDate();
		nowTime = nowTime.split(" ")[0] + " 23:59:59";
		switch (_global.eventTypeSearch) {
		// 当日单据
		case '1':
			searchTime = getTodayTime();
			break;
		// 昨日单据
		case '2':
			searchTime = getYestodayTime();
			break;
		// 当月单据
		case '3':
			searchTime = getMonthTime();
			break;

		// 全部单据
		case '':
			searchTime = "1970-01-01 00:00:00" + ";" + nowTime;
			break;
		default:
			return;
			break;

		}
		searchTime = searchTime.replace(" ", "T");
		searchTime = searchTime.replace(" ", "T");
		maintenancePojo.createTime = searchTime;

		_getAlarmInfos(maintenancePojo); // 初始化请求未处理事件
	}
	function _switchFiltrate() {
		$('.filtrate').bind(
				'click',
				function() {
					$(this).siblings().children('.Checked_img').removeClass(
							'isChecked_search').addClass('noChecked_search');
					$(this).children('.Checked_img').removeClass(
							'noChecked_search').addClass('isChecked_search');
					_swichEventType($(this).attr('id'));
				});

	}
	function _swichEventType(eventType) {
		switch (eventType) {
		case 'dayForm':
			_global.eventTypeSearch = '1';
			break;
		case 'yesterdayForm':
			_global.eventTypeSearch = '2';
			break;
		case 'monthForm':
			_global.eventTypeSearch = '3';
			break;
		case 'allForm':
			_global.eventTypeSearch = '';
			break;
		default:
			break;

		}
		_searchEventInfo();
	}

	function _removeRow(eventNum) {

		if ($("#" + eventNum).length > 0) {
			$("#" + eventNum).remove();
			_pageRemove();
		}
		;
		var sysuserID = _global.top.getSysuserID();
		parent.statisticalt(sysuserID, '0', "", alarmData_callbackfunc);
	}
	function addRow(jsonData, isPre) {
		addTableRow(jsonData, isPre);
		setColSize()
	}

	function addTableRow(jsonData, isPre) {
		var row_json = _messageExchange(jsonData);// 转换原始数据与显示的数据
		$div_row = $("<tr></tr>");

		$div_maintainNum = $("<td></td>");
		$div_faultCause = $("<td></td>");
		$div_disposalFaultResult = $("<td></td>");
		$div_eventNum = $("<td></td>");
		$div_usrAlmType = $("<td></td>");
		$div_PayNO = $("<td></td>");
		$div_accountNum = $("<td></td>");
		$div_contact = $("<td></td>");
		$div_cMobile = $("<td></td>");
		$div_accountName = $("<td></td>");
		$div_accountAddr = $("<td></td>");
		$div_applyMaintainer = $("<td></td>");
		$div_warrantyTime = $("<td></td>");
		$div_acceptAlarmer = $("<td></td>");
		$div_warrantyTel = $("<td></td>");
		$div_maintainFormNum = $("<td></td>");
		$div_maintainTime = $("<td></td>");
		$div_maintainUnit = $("<td></td>");
		$div_maintainer = $("<td></td>");
		/* $div_faultAppear = $("<td></td>"); */
		$div_memo = $("<td></td>");

		$div_row.append($div_maintainNum).append($div_faultCause).append(
				$div_disposalFaultResult).append($div_eventNum).append(
				$div_usrAlmType).append($div_PayNO).append($div_accountNum)
				.append($div_contact).append($div_cMobile).append(
						$div_accountName).append($div_accountAddr).append(
						$div_applyMaintainer).append($div_warrantyTime).append(
						$div_acceptAlarmer).append($div_warrantyTel).append(
						$div_maintainFormNum).append($div_maintainTime).append(
						$div_maintainUnit).append($div_maintainer)
				/* .append($div_faultAppear ) */
				.append($div_memo).addClass('table_row').attr('id',
						row_json.maintainNum);

		$div_maintainNum.addClass("maintainNum_title").text(
				row_json.maintainNum).attr("title", row_json.maintainNum);
		$div_faultCause.addClass("faultCause_title table_title_item").text(
				row_json.faultCause).attr("title", row_json.faultCause);
		$div_disposalFaultResult.addClass(
				"disposalFaultResult_title table_title_item").text(
				row_json.disposalFaultResult).attr("title",
				row_json.disposalFaultResult);
		$div_eventNum.addClass("eventNum_title").text(row_json.eventNum).attr(
				"title", row_json.eventNum);
		$div_usrAlmType.addClass("table_item_time").text(
				getUsrAlmType(row_json.usrAlmType)).attr("title",
				getUsrAlmType(row_json.usrAlmType));

		$div_PayNO.addClass("table_item_time").text(row_json.payNO).attr(
				"title", row_json.payNO);
		$div_accountNum.addClass("accountNum_title").text(row_json.accountNum)
				.attr("title", row_json.accountNum);
		$div_contact.addClass("contact_title").text(row_json.contact).attr(
				"title", row_json.contact);
		$div_cMobile.addClass("cMobile_title").text(row_json.cMobile).attr(
				"title", row_json.cMobile);
		$div_accountName.addClass("userName_title").text(row_json.accountName)
				.attr("title", row_json.accountName);
		$div_accountAddr.addClass("userName_title").text(row_json.accountAddr)
				.attr("title", row_json.accountAddr);
		$div_applyMaintainer.addClass("applyMaintainer_title table_title_item")
				.text(row_json.applyMaintainer).attr("title",
						row_json.applyMaintainer);
		$div_warrantyTime.addClass("warrantyTime_title table_title_item_time")
				.text(row_json.warrantyTime).attr("title",
						row_json.warrantyTime);
		$div_acceptAlarmer.addClass("disposer_title table_title_item").text(
				row_json.acceptAlarmer).attr("title", row_json.acceptAlarmer);
		$div_warrantyTel.addClass("warrantyTel_title table_title_item").text(
				row_json.warrantyTel).attr("title", row_json.warrantyTel);
		$div_maintainFormNum.addClass("zoneNum_title").text(
				row_json.maintainFormNum).attr("title",
				row_json.maintainFormNum);
		$div_maintainTime.addClass("maintainTime_title table_title_item_time")
				.text(row_json.maintainTime).attr("title",
						row_json.maintainTime);
		$div_maintainUnit.addClass("maintainUnit_title table_title_item").text(
				row_json.maintainUnit).attr("title", row_json.maintainUnit);
		$div_maintainer.addClass("maintainer_title table_title_item").text(
				row_json.maintainer).attr("title", row_json.maintainer);
		/*
		 * $div_faultAppear.addClass("faultAppear_title
		 * table_title_item").text(row_json.faultAppear).attr("title",
		 * row_json.faultAppear);
		 */
		$div_memo.addClass("memo_title table_title_item").text(row_json.memo)
				.attr("title", row_json.memo);

		if (isPre) {
			$div_row.prependTo($("#table_content"));
		} else {
			$div_row.appendTo($("#table_content"));
		}
		$div_row.bind('dblclick', function() {
			parent.parent.setPopupsRowJson(jsonData);
			_global.top.popusStaManager('fixQuery');

		});

	}
	function getUsrAlmType(usrAlmType) {
		var rst = '';
		switch (usrAlmType) {
		case '0':
			rst = "一级";
			break;
		case '1':
			rst = "二级";
			break;
		case '2':
			rst = "三级";
			break;
		case '3':
			rst = "四级";
			break;
		case '4':
			rst = "五级";
			break;
		default:
			rst = usrAlmType;
			break;
		}
		return rst;
	}
	function _buildAlertPojo(eventType) {
		var alertPojo = {};
		alertPojo.sysuserID = _global.getAlarmInfosParams.alertPojo.sysuserID;
		alertPojo.disposeStatus = '0';
		alertPojo.eventLevel = '';
		alertPojo.eventType = eventType;
		return alertPojo;
	}

	function alarmData_callbackfunc(data) {
		var result = data.result;
		if (result.code == 0) {
			var statistics = parent.getStatistics();
			statistics[0] = data.statistics;
			parent.setStatistics(statistics);
			parent.updateStatistics();
		} else {

		}
	}

	function _switchPoliceType(policeType) {
		var sysuserID = _global.top.getSysuserID();
		parent.statisticalt(sysuserID, '0', "", alarmData_callbackfunc)
		switch (policeType) {
		// 火警
		case 'fire':
			_global.eventTypePush = '0';
			var alertPojo = _buildAlertPojo("0")
			_getAlarmInfos(alertPojo);

			break;
		// 劫盗
		case 'holding':
			_global.eventTypePush = '1';
			var alertPojo = _buildAlertPojo("1")
			_getAlarmInfos(alertPojo);

			break;
		// 有声劫盗
		case 'haveholdup':
			_global.eventTypePush = '2';
			var alertPojo = _buildAlertPojo("2")
			_getAlarmInfos(alertPojo);

			break;
		// 无声劫盗
		case 'noholdup':
			_global.eventTypePush = '3';
			var alertPojo = _buildAlertPojo("3")
			_getAlarmInfos(alertPojo);

			break;
		// 挟持
		case 'holdup':
			_global.eventTypePush = '4';
			var alertPojo = _buildAlertPojo("4")
			_getAlarmInfos(alertPojo);

			break;
		// 周边防范
		case 'prevent':
			_global.eventTypePush = '5';
			var alertPojo = _buildAlertPojo("5")
			_getAlarmInfos(alertPojo);
			break;

		// 窃盗
		case 'theft':
			_global.eventTypePush = '6';
			var alertPojo = _buildAlertPojo("6")
			_getAlarmInfos(alertPojo);
			break;
		// 出入防区
		case 'inoutplay':
			_global.eventTypePush = '7';
			var alertPojo = _buildAlertPojo("7")
			_getAlarmInfos(alertPojo);
			break;
		// 一般报警
		case 'callpolice':
			_global.eventTypePush = '8';
			var alertPojo = _buildAlertPojo("8")
			_getAlarmInfos(alertPojo);
			break;
		// 拆动
		case 'split':
			_global.eventTypePush = '9';
			var alertPojo = _buildAlertPojo("9")
			_getAlarmInfos(alertPojo);
			break;

		// 无交流
		case 'nocommunication':
			_global.eventTypePush = '10';
			var alertPojo = _buildAlertPojo("10")
			_getAlarmInfos(alertPojo);
			break;
		// 系统电池电压过低
		case 'voltagelow':
			_global.eventTypePush = '11';
			var alertPojo = _buildAlertPojo("11")
			_getAlarmInfos(alertPojo);
			break;
		// 电池测试故障
		case 'voltagefault':
			_global.eventTypePush = '12';
			var alertPojo = _buildAlertPojo("12")
			_getAlarmInfos(alertPojo);
			break;
		// 扩充器故障
		case 'Extenderfault':
			_global.eventTypePush = '13';
			var alertPojo = _buildAlertPojo("13")
			_getAlarmInfos(alertPojo);
			break;
		// 警铃1
		case 'alarmone':
			_global.eventTypePush = '14';
			var alertPojo = _buildAlertPojo("14")
			_getAlarmInfos(alertPojo);
			break;
		// 警铃1恢复
		case 'alarmonerestore':
			_global.eventTypePush = '15';
			var alertPojo = _buildAlertPojo("15")
			_getAlarmInfos(alertPojo);
			break;
		// 警铃2
		case 'alarmtow':
			_global.eventTypePush = '16';
			var alertPojo = _buildAlertPojo("16")
			_getAlarmInfos(alertPojo);
			break;
		// 警铃2恢复
		case 'alarmtowrestore':
			_global.eventTypePush = '17';
			var alertPojo = _buildAlertPojo("17")
			_getAlarmInfos(alertPojo);
			break;
		// 通讯失败
		case 'communicationfailure':
			_global.eventTypePush = '18';
			var alertPojo = _buildAlertPojo("18")
			_getAlarmInfos(alertPojo);
			break;
		// 电话线1故障
		case 'Telephonelineonefault':
			_global.eventTypePush = '19';
			var alertPojo = _buildAlertPojo("19")
			_getAlarmInfos(alertPojo);
			break;
		// 电话线1故障恢复
		case 'Telephonelineonefaultrestore':
			_global.eventTypePush = '20';
			var alertPojo = _buildAlertPojo("20")
			_getAlarmInfos(alertPojo);
			break;
		// 电话线2故障
		case 'Telephonelinetowfaultre':
			_global.eventTypePush = '21';
			var alertPojo = _buildAlertPojo("21")
			_getAlarmInfos(alertPojo);
			break;
		// 电话线2故障恢复
		case 'Telephonelinetowfaultrestore':
			_global.eventTypePush = '22';
			var alertPojo = _buildAlertPojo("22")
			_getAlarmInfos(alertPojo);
			break;
		// 感应器故障
		case 'Sensorfault':
			_global.eventTypePush = '23';
			var alertPojo = _buildAlertPojo("23")
			_getAlarmInfos(alertPojo);
			break;
		// 无线感应器故障
		case 'Radioinducedfailure':
			_global.eventTypePush = '24';
			var alertPojo = _buildAlertPojo("24")
			_getAlarmInfos(alertPojo);
			break;
		// 无线感应器电池过低
		case 'sensorbatterieslow':
			_global.eventTypePush = '25';
			var alertPojo = _buildAlertPojo("25")
			_getAlarmInfos(alertPojo);
			break;

		case 'onealert':
			_global.eventTypePush = '27';
			var alertPojo = _buildAlertPojo("27")
			_getAlarmInfos(alertPojo);

			break;
		case 'twoalert':
			_global.eventTypePush = '28';
			var alertPojo = _buildAlertPojo("28")
			_getAlarmInfos(alertPojo);

			break;
		case 'onefault':
			_global.eventTypePush = '29';
			var alertPojo = _buildAlertPojo("29")
			_getAlarmInfos(alertPojo);

			break;
		case 'twofault':
			_global.eventTypePush = '30';
			var alertPojo = _buildAlertPojo("30")
			_getAlarmInfos(alertPojo);

			break;
		case 'superm':
			_global.eventTypePush = '26';
			var alertPojo = _buildAlertPojo("26")
			_getAlarmInfos(alertPojo);

			break;
		case 'all':
			_global.eventTypePush = '31';
			var alertPojo = _buildAlertPojo("")
			_getAlarmInfos(alertPojo);
			break;
		default:
			break;
		}
	}

	function _messageExchange(dataJson) {
		var row_json = {
			maintainNum : "",
			eventNum : "",
			usrAlmType : "",
			accountNum : "",
			contact : "",
			cMobile : "",
			accountName : "",
			accountAddr : "",
			applyMaintainer : "",
			warrantyTime : "",
			acceptAlarmer : "",
			warrantyTel : "",
			maintainFormNum : "",
			maintainTime : "",
			maintainUnit : "",
			maintainer : "",
			faultAppear : "",
			faultCause : "",
			disposalFaultResult : "",
			memo : "",
			feedback : "",
			payNO : ''
		};

		row_json.maintainNum = dataJson.maintainNum;
		row_json.eventNum = dataJson.eventNum;
		row_json.usrAlmType = dataJson.usrAlmType;
		row_json.accountNum = dataJson.accountNum;
		row_json.contact = dataJson.contact;
		row_json.cMobile = dataJson.cMobile;
		row_json.accountName = dataJson.accountName;
		row_json.accountAddr = dataJson.accountAddr;
		row_json.applyMaintainer = dataJson.applyMaintainer;
		row_json.warrantyTime = dataJson.warrantyTime;
		row_json.acceptAlarmer = dataJson.acceptAlarmer;
		row_json.warrantyTel = dataJson.warrantyTel;
		row_json.maintainFormNum = dataJson.maintainFormNum;
		row_json.maintainTime = dataJson.maintainTime;
		row_json.maintainUnit = dataJson.maintainUnit;
		row_json.maintainer = dataJson.maintainer;
		row_json.faultAppear = dataJson.faultAppear;
		row_json.faultCause = dataJson.faultCause;
		row_json.disposalFaultResult = dataJson.disposalFaultResult;
		row_json.memo = dataJson.memo;
		row_json.feedback = dataJson.feedback;
		row_json.payNO = dataJson.payNO;
		return row_json;

	}

	function _getAlarmInfosParams() {

		var params = {};
		params.maintenancePojo = {};
		params.pageInfoPojo = {};
		params.maintenancePojo = _global.getAlarmInfosParams.maintenancePojo;
		params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
		params.pageInfoPojo.sort = sortVal();
		params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
		return params;
	}
	/***************************************************************************
	 * 判断升降序222
	 **************************************************************************/
	function sortVal() {
		var sort = "";
		/* var timepng=$("#timePng"); */
		if ($("#timePng").hasClass('timePngchange')) {
			sort = "warrantyTime|DESC";
		} else {
			sort = "warrantyTime|ASC";
		}

		return sort;
	}

	function _getAlarmInfos(maintenancePojo) {
		_global.getAlarmInfosParams.maintenancePojo = maintenancePojo;
		_global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
		_globalH.getAlarmInfosParams = _global.getAlarmInfosParams;
		$('body').loading();
		var param = _getAlarmInfosParams();

		var params = {
			"sysuserID" : param.maintenancePojo.sysuserID,
			"all" : param.maintenancePojo.all,
			"accountNum" : param.maintenancePojo.accountNum,
			"accountName" : param.maintenancePojo.accountName,
			"cMobile" : param.maintenancePojo.cMobile,
			"warrantyTime" : param.maintenancePojo.warrantyTime,
			"maintainNum" : param.maintenancePojo.maintainNum,
			"createTime" : param.maintenancePojo.createTime,
			"roleId" : _global.top.getSysroleId(),
			"pageInfoPojo" : {
				"currentPage" : param.pageInfoPojo.currentPage,
				"sort" : param.pageInfoPojo.sort,
				"pageSize" : param.pageInfoPojo.pageSize
			}
		}

		post_async(params, _config.ajaxUrl.getMaintainListUrl,
				_callback_getAlarmInfos);
	}

	function _getAlarmInfosH() {
		_global.getAlarmInfosParams = _globalH.getAlarmInfosParams;
		$('body').loading();
		var param = _getAlarmInfosParams();

		var params = {
			"sysuserID" : param.maintenancePojo.sysuserID,
			"all" : param.maintenancePojo.all,
			"accountNum" : param.maintenancePojo.accountNum,
			"accountName" : param.maintenancePojo.accountName,
			"cMobile" : param.maintenancePojo.cMobile,
			"warrantyTime" : param.maintenancePojo.warrantyTime,
			"maintainNum" : param.maintenancePojo.maintainNum,
			"createTime" : param.maintenancePojo.createTime,
			"roleId" : _global.top.getSysroleId(),
			"pageInfoPojo" : {
				"currentPage" : param.pageInfoPojo.currentPage,
				"sort" : param.pageInfoPojo.sort,
				"pageSize" : param.pageInfoPojo.pageSize
			}
		}

		post_async(params, _config.ajaxUrl.getMaintainListUrl,
				_callback_getAlarmInfos);
	}
	function _callback_getAlarmInfos(data) {
		var result = data.result;
		$('body').removeLoading();
		if (result.code == 0) {
			var pageInfo = data.pageInfo;
			var totalNum = pageInfo.totalNum;
			var totalPage = pageInfo.totalPage;
			var currentPage = pageInfo.currentPage;
			_global.getAlarmInfosParams.pageInfoPojo.currentPage = currentPage;
			_global.getAlarmInfosParams.pageInfoPojo.totalNum = totalNum;
			_global.getAlarmInfosParams.pageInfoPojo.totalPage = totalPage;
			// var pluginsPage = parent.pluginsPage();
			if (totalNum == 0)
				totalNum = -1;
			_global.plugins.page.setPage(totalPage, currentPage, totalNum);
			// pluginsPage.setPage(totalPage, currentPage, totalNum);
			_clearRow();
			var maintenancePojo = data.maintenancePojo;
			for (var i = 0; i < maintenancePojo.length; i++) {
				addTableRow(maintenancePojo[i]);
			}

		} else {
			_clearRow();
		}
		setColSize();
	}

	function _clearRow() {
		var i = 1;

		$(".table_row").each(function() {

			var $this = $(this);
			/* setTimeout(function () { */

			$this.remove();
			/*
			 * }, i * 1); i++;
			 */
		});
	}

	function _queryData_page(page) {
		_global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
		$('body').loading();
		var param = _getAlarmInfosParams();
		var params = {
			"sysuserID" : param.maintenancePojo.sysuserID,
			"all" : param.maintenancePojo.all,
			"accountNum" : param.maintenancePojo.accountNum,
			"accountName" : param.maintenancePojo.accountName,
			"cMobile" : param.maintenancePojo.cMobile,
			"warrantyTime" : param.maintenancePojo.warrantyTime,
			"maintainNum" : param.maintenancePojo.maintainNum,
			"createTime" : param.maintenancePojo.createTime,
			"roleId" : _global.top.getSysroleId(),
			"pageInfoPojo" : {
				"currentPage" : param.pageInfoPojo.currentPage,
				"sort" : param.pageInfoPojo.sort,
				"pageSize" : param.pageInfoPojo.pageSize
			}
		}
		post_async(params, _config.ajaxUrl.getMaintainListUrl,
				_callback_getAlarmInfos);
	}

	function _getPageInfo() {
		return _global.getAlarmInfosParams.pageInfoPojo;
	}
	function _setPageInfo(pageInfoPojo) {
		_global.getAlarmInfosParams.pageInfoPojo.currentPage = pageInfoPojo.currentPage;
		_global.getAlarmInfosParams.pageInfoPojo.totalNum = pageInfoPojo.totalNum;
		_global.getAlarmInfosParams.pageInfoPojo.totalPage = pageInfoPojo.totalPage;
		_global.getAlarmInfosParams.pageInfoPojo.pageSize = pageInfoPojo.pageSize;
		_global.plugins.page.setPage(pageInfoPojo.totalPage,
				pageInfoPojo.currentPage, pageInfoPojo.totalNum);
	}

	function _pageRemove() {
		var pageInfoPojo = {};
		pageInfoPojo = _getPageInfo();
		var currentPage = pageInfoPojo.currentPage;
		var totalNum = pageInfoPojo.totalNum;
		var totalPage = pageInfoPojo.totalPage;
		var pageSize = pageInfoPojo.pageSize;
		totalNum--;
		totalPage = ((totalNum - 1) / pageSize) + 1;
		pageInfoPojo.currentPage = currentPage;
		pageInfoPojo.totalNum = totalNum;
		pageInfoPojo.totalPage = totalPage;
		pageInfoPojo.pageSize = pageSize;
		_setPageInfo(pageInfoPojo);
	}
	function setColSize() {
		var col1 = document.getElementById("listBox1").getElementsByTagName(
				'td');// 获取表头所有列
		var col2 = document.getElementById("listBox2").getElementsByTagName(
				'td');// 获取数据表所有列
		$("#listBox1").colResizable({
			minWidth : 20, // 最小宽度
			liveDrag : true, // 是否实时拖动
			gripInnerHtml : "<div id='dragDiv1'></div>", // 拖动div
			draggingClass : "dragging", // 拖动div样式
			onResize : null, // 拖动时调用函数
			followCol : col2,// 数据表的列集合
			mainCol : col1,// 表头表的列结婚firstColDrag:false
			firstColDrag : true,
		});
		$("#listBox2").colResizableNot({
			minWidth : 20, // 最小宽度
			liveDrag : true, // 是否实时拖动
			gripInnerHtml : "<div id='dragDiv'></div>", // 拖动div
			draggingClass : "dragging", // 拖动div样式
			onResize : null
		// 拖动时调用函数
		});
		document.getElementById("listBox2").style.width = document
				.getElementById("listBox1").style.width;
		var columnsize = col1.length;

		if ((col2 != null && col2.length > 0) && col1 != null) {
			// 给数据表重新获取宽度
			for (var i = 0; i < columnsize - 1; i++) { // 遍历Table的所有列
				col2[i].style.width = col1[i].style.width;// 实际应用用这里
			}
		}
		// 固定和滚动
		document.getElementById("listBox2").style.width = document
				.getElementById("listBox1").style.width;
		var right_div2 = document.getElementById("right_div2");
		right_div2.onscroll = function() {
			var right_div2_left = this.scrollLeft;
			document.getElementById("right_div1").scrollLeft = right_div2_left;
		}
	}
})(jQuery, window);
