/**
 * Created by Administrator on 2017/12/6.
 */
/**
 * Created by Administrator on 2017/8/19.
 */
/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function() {
	init();
});

;
(function($, window) {
	window.init = _init;
	window.getRowJson = _getRowJson;
	window.addTableRow = addTableRow;
	window.getList = _getList;
	var _config = {
		ajaxUrl : {
			getList : '/IntegratedMM/assemble_cfg/list.do',
			getMain : '/IntegratedMM/assemble_cfg/main.do',
			getDelete : '/IntegratedMM/assemble_cfg/delete.do',
		}
	};
	var _global = {
		rowJson : null
	}
	function _init() {
		_getMain();
		_getList();
		_initEven();
	}
    //删除按钮的确认后的函数
    function _delete(){
        var ids = [];
        $("div.isCheckedm[name=checknameson]").each(function() {
            ids.push(this.id);
        });
        if (ids == "") {
            parent.parent.alertTip("请先选择你所要删除的项！", 0, null);
            return;
        }

        var params = {
            ids : ids,
        };
        post_async(params, _config.ajaxUrl.getDelete, _callback_getDelete);
    }
	function _initEven() {
		$("#contentRight_add").click(function() {
			_global.rowJson = null;
			parent.parent.popusStaManager('dataUpSet');
		});
		$("#contentRight_del").click(function() {
			//确认提示框，是否删除
            parent.parent.comfireFloat("是否确认删除？",_delete,null);
		});

		$("div[name=checkname]").bind(
				'click',
				function(e) {
					var $this = $(this);
					var check = $this.hasClass('isCheckedm');
					if (check) {
						$this.removeClass('isCheckedm').addClass('noCheckedm');
						$("div[name=checknameson]").removeClass('isCheckedm')
								.addClass('noCheckedm');
					} else {
						$this.removeClass('noCheckedm').addClass('isCheckedm');
						$("div[name=checknameson]").removeClass('noCheckedm')
								.addClass('isCheckedm');
					}
				});
	}

	function _delete_platform_data(ids) {
		
	}
	function _getMain() {
		post_async(null, _config.ajaxUrl.getMain, _callback_getMain);
	}
	function _callback_getDelete(data) {
		if (data.code == "200") {
			_getList();
			parent.parent.alertTip(data.message, 2000, null);
		} else {
			parent.parent.alertTip(data.message, 2000, null);
		}
	}
	function _callback_getMain(data) {
		var result = data.result;
		for (var i = 0; result.length > i; i++) {
			if (result[i].platform_type == '本平台') {
				$("#benId").val(result[i].platform_id);
			} else if (result[i].platform_type == '上级平台') {
				$("#upId").val(result[i].platform_host);
			}
		}
	}
	function _getList() {
		post_async(null, _config.ajaxUrl.getList, _callback_getList);
	}

	function _callback_getList(data) {
		var result = data.result;
		if (data.code == "200") {
			_clearRow();
			for (var i = 0; i < result.length; i++) {
				addTableRow(result[i]);
			}

			$("div[name=checknameson]")
					.bind(
							'click',
							function(e) {
								var $this = $(this);
								var check = $this.hasClass('isCheckedm');
								if (check) {
									$this.removeClass('isCheckedm').addClass(
											'noCheckedm');
								} else {
									$this.removeClass('noCheckedm').addClass(
											'isCheckedm');
								}
								if ($("div.isCheckedm[name=checknameson]").length == result.length) {
									$("div[name=checkname]").removeClass(
											'noCheckedm')
											.addClass('isCheckedm');
								} else {
									$("div[name=checkname]").removeClass(
											'isCheckedm')
											.addClass('noCheckedm');
								}
							});
		} else {
			_clearRow();
		}
	}

	function addTableRow(jsonData) {
		_global.rowJson = null;
		var row_json = jsonData;
		$div_row = $("<tr></tr>");

		$div_check = $('<td><div id="'
				+ jsonData.id
				+ '" name="checknameson" class="noCheckedm" style="margin: 3px 10px 0 15px;"></div></td>');
		$div_ID = $("<td></td>");
		$div_name = $("<td></td>");
		$div_host = $("<td></td>");
		$div_memo = $("<td></td>");
		$div_row.append($div_check).append($div_name).append($div_ID).append(
				$div_host).append($div_memo).addClass('table_row').attr('id',
				row_json.platform_id);

		$div_ID.text(row_json.platform_id).attr("title", row_json.platform_id);
		$div_name.text(row_json.platform_name).attr("title",
				row_json.platform_name);
		$div_host.text(row_json.platform_host).attr("title",
				row_json.platform_host);
		$div_memo.text(row_json.memo).attr("title", row_json.memo);
		$div_row.prependTo($("#table_content"));

		$div_row.bind('dblclick', function(e) {
			parent.parent.popusStaManager('dataUpSet');
			_global.rowJson = row_json;
		})
	}
	function _clearRow() {
		$(".table_row").each(function() {
			var $this = $(this);
			$this.remove();
		});
	}
	function _getRowJson() {
		return _global.rowJson;
	}
})(jQuery, window);
