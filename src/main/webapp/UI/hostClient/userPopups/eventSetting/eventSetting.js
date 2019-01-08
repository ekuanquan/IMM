$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.showEventSettingList = _showEventSettingList;
	window.clearCheck = _clearCheck;
	var _global = {
		ajaxUrl: {
			getEventSettingList: '/IntegratedMM/eventSetting/getEventSettingList.do',
			delEventSetting: '/IntegratedMM/eventSetting/delEventSetting.do'
		},
		hookUserEvtId: []
	}

	function _init() {
		_initEvent();
		_initData();
	}

	function _initData() {
		_showEventSettingList("");
	}

	function _initEvent() {
		$('#allCheck').bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('isChecked');
			if(check) {
				$this.removeClass('isChecked').addClass('noChecked');
				$('.UserEvtId > div').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
				_global.hookUserEvtId = [];
				console.log(JSON.stringify(_global.hookUserEvtId));
			} else {
				$this.removeClass('noChecked').addClass('isChecked');
				$('.UserEvtId > div').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
				_global.hookUserEvtId = [];
				var all_row = $('.table_row', '#table_content');
				for(var i = 0; i < all_row.length; i++) {
					var $this = all_row[i];
					var UserEvtId = $this.id;
					_global.hookUserEvtId.push(UserEvtId);
				}
				console.log(JSON.stringify(_global.hookUserEvtId));
			}
		});

		$('#title_add').bind('click', function(e) {
			parent.parent.eventSettingManage('addEventSetting', '');
		});

		$('#title_del').bind('click', function(e) {
			//deleteEventSetting();
			if(_global.hookUserEvtId != ''){
                parent.parent.comfireFloat("确定删除选中的事件配置信息？删除后此防区/通道的报警信息无法查看联动视频",deleteEventSetting,null);
			}else if(_global.hookUserEvtId == ''){
                parent.parent.alertWarn("请先选择您所要删除的事件配置！",null,null);
			}
		});

		$('#configurationType').change(function(e) {
			var ZoneCHFlag = $("#configurationType").val();
			console.log(ZoneCHFlag)
			_showEventSettingList(ZoneCHFlag);
		});

		$('#linkage_setting').bind('click', function(e) {
			/*var row_checked = $('.row_checked','#table_content');
			if (row_checked.length>0) {
				parent.parent.eventSettingManage('checklinkage_setting',row_checked.data('key'));
			}else{
				var row_hook = $('.UserEvtId > .isChecked');
				if (row_hook.length>0) {
					parent.parent.eventSettingManage('hooklinkage_setting',_global.hookUserEvtId);
				}
				
			}*/
			var row_hook = $('.UserEvtId > .isChecked');
			if(row_hook.length > 0) {
				parent.parent.eventSettingManage('hooklinkage_setting', _global.hookUserEvtId);
			} else {
				var row_checked = $('.row_checked', '#table_content');
				if(row_checked.length > 0) {
					parent.parent.eventSettingManage('checklinkage_setting', row_checked.data('key'));
				}
			}

		});

		$('#SMS_forwarding').bind('click', function(e) {
			/*var row_checked = $('.row_checked', '#table_content');
			if(row_checked.length > 0) {
				parent.parent.eventSettingManage('checkSMS_forwarding', row_checked.data('key'));
			} else {
				var row_hook = $('.UserEvtId > .isChecked');
				if(row_hook.length > 0) {
					parent.parent.eventSettingManage('hookSMS_forwarding', _global.hookUserEvtId);
				}
			}*/
			var row_hook = $('.UserEvtId > .isChecked');
			if(row_hook.length > 0) {
				parent.parent.eventSettingManage('hookSMS_forwarding', _global.hookUserEvtId);
			} else {
				var row_checked = $('.row_checked', '#table_content');
				if(row_checked.length > 0) {
					parent.parent.eventSettingManage('checkSMS_forwarding', row_checked.data('key'));
				}
			}

		});

	}

	//其他窗口保存后初始化勾选
	function _clearCheck() {
		$('.UserEvtId > div').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
		$('#allCheck').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
		_global.hookUserEvtId = [];
	}

	//在勾选数组里添加
	function add_hookUserEvtId(UserEvtId) {
		var addData = _global.hookUserEvtId;
		if(addData > 0) {
			for(var i = 0; i < addData.length; i++) {
				var oJsonDevZoneId = addData[i];
				if(UserEvtId == oJsonDevZoneId) {
					break;
				}
				if(i == addData.length - 1) {
					addData.push(UserEvtId);
				}
			}
		} else {
			addData.push(UserEvtId);
		}
		_global.hookUserEvtId = addData;
		console.log(JSON.stringify(_global.hookUserEvtId));

	}
	//在勾选数组里删除
	function del_hookUserEvtId(UserEvtId) {
		var addData = _global.hookUserEvtId;
		var index = null;
		for(var j = 0; j < addData.length; j++) {
			var oJsonDevZoneId = addData[j];
			if(UserEvtId == oJsonDevZoneId) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		console.log('index:' + index);
		addData.splice(index, 1);
		_global.hookUserEvtId = addData;
		console.log(JSON.stringify(_global.hookUserEvtId));

	}

	function deleteEventSetting() {
		//var UserEvtId = $('.row_checked', '#table_content').attr('id');
		var param = {};
		param.UserEvtList = _global.hookUserEvtId;
		console.log(JSON.stringify(param));
		post_async(param, _global.ajaxUrl.delEventSetting, deleteEventSettingcallBack);
	}

	function deleteEventSettingcallBack(data) {
		if(data.result.code == 200) {
            parent.parent.alertSuccess("删除成功。",null,null);
			_showEventSettingList("");
		}
		else {
            parent.parent.alertFail("删除失败。",null,null);
		}
	}

	function _showEventSettingList(ZoneCHFlag) {
		if(ZoneCHFlag == '') {
			$('#configurationType').val("");
		}
		var rowJson = parent.parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var param = {};
		param.userId = userId;
		param.ZoneCHFlag = ZoneCHFlag;
		post_async(param, _global.ajaxUrl.getEventSettingList, showEventSettingListCallBack);
	}

	function clearEventSettingList() {
		$('#table_content').empty();
	}

	function showEventSettingListCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			_clearCheck();
			clearEventSettingList();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				showEventSetting(json[i]);
			}
		}
        setColSize();

	}

	function showEventSetting(row_json) {
		var $table_row = $('<tr></tr>');
		var $UserEvtId = $('<td></td>');
		var $noChecked = $('<div></div>');
		var $div = $('<span></span>');
		var $ZoneCHFlag = $('<td></td>');
		var $ZoneCHValue1 = $('<td></td>');
		var $ZoneCHValue2 = $('<td></td>');
		var $isVideo = $('<td></td>');
		var $fMemo = $('<td></td>');

		var ZoneCHValue1 = '';
		var ZoneCHValue2 = '';
		if(row_json.ZoneCHFlag == 0) { //防区
			ZoneCHValue1 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		if(row_json.ZoneCHFlag == 1) { //通道
			ZoneCHValue2 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		$noChecked.appendTo($UserEvtId);
		$div.appendTo($UserEvtId);
		$UserEvtId.appendTo($table_row);
		$ZoneCHFlag.appendTo($table_row);
		$ZoneCHValue1.appendTo($table_row);
		$ZoneCHValue2.appendTo($table_row);
		$isVideo.appendTo($table_row);
		$fMemo.appendTo($table_row);
		$table_row.appendTo($('#table_content'));

		$fMemo.addClass('fMemo').text(row_json.fMemo == null ? '' : row_json.fMemo);
		$isVideo.addClass('isVideo').text(row_json.isVideo == 1 ? '是' : '否');
		$ZoneCHValue2.addClass('ZoneCHValue2').text(ZoneCHValue2);
		$ZoneCHValue1.addClass('ZoneCHValue1').text(ZoneCHValue1);
		$ZoneCHFlag.addClass('ZoneCHFlag').text(row_json.ZoneCHFlag == 0 ? '用户防区' : '用户监控点');
		$noChecked.addClass('noChecked').data('key', row_json);
		$UserEvtId.addClass('UserEvtId');
		$div.addClass('table_row_text').text(row_json.UserEvtId).attr('title', row_json.UserEvtId);
		$table_row.addClass('table_row').attr('id', row_json.UserEvtId).data('key', row_json);

		$noChecked.bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('isChecked');
			if(check) {
				if($('#allCheck').hasClass('isChecked')) {
					$('#allCheck').removeClass('isChecked').addClass('noChecked');
				}
				$this.removeClass('isChecked').addClass('noChecked');
				del_hookUserEvtId($this.parent().parent().attr('id'));
			} else {
				$this.removeClass('noChecked').addClass('isChecked');
				add_hookUserEvtId($this.parent().parent().attr('id'));
			}
		});

		$table_row.bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('row_checked');
			if(check) {
				$this.removeClass('row_checked');
			} else {
				$this.addClass('row_checked').siblings().removeClass('row_checked');
			}
		});

		$table_row.bind('dblclick', function(e) {
			var UserEvtData = $(this).data('key');
			parent.parent.eventSettingManage('editEventSetting', UserEvtData);
		});
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

})(window, jQuery, undefined);