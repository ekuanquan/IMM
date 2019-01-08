$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.addAddData = _addAddData;
	//window.getDevList = _getDevList;
	window.getAddDevList = _getAddDevList;
	window.getDelDevList = _getDelDevList;
	window.setAddDevList = _setAddDevList;
	window.setDelDevList = _setDelDevList;
	window.clearAddDevList = _clearAddDevList;
	window.setdevInfo = _setdevInfo;
	window.addRow = _addRow;
	window.addraleRow = _addraleRow;
	var _config = {
		ajaxUrl: {
			getRoleDev: '/IntegratedMM/role/ctrlRoleDev.do',
            getOwnerCorrelateDevCtrlUrl:"/IntegratedMM/addDevice/getOwnerCorrelateDevCtrl.do",
            addUrl:'/IntegratedMM/owner/correlateDevices/add.do',//添加关联设备
            deleteUrl:"/IntegratedMM/owner/correlateDevices/delete.do",//取消关联设备
            updateRemoteDeviceUrl:"/IntegratedMM/owner/updateRemoteDevice.do",//修改远程监控设备
            updateMasterDeviceUrl:"/IntegratedMM/owner/updateMasterDevice.do"//修改主设备
		}
	}

	var _global = {
		top: parent.parent,
		devList: [],
		addDevList: [],
		delDevList: [],
        devId:'',
        hookUserEvtId:[],
		devIds:[],
        latedevIds:[],  //要添加关联设备id之家
        delelatedavIds:[],//取消关联设备
        rela:"",
        popupsName:"addOwnerUser",
        ownerId:"",
        rmDevId:{
            remoteDevId:"",
            masterDevId:""
        },
        addraledev:{
            data:{
                ownerId:"",
                correlateDevIds:[]
            }
        },
        deleraledev:{
            data:{
                ownerId:"",
                correlateDevIds:[]
            }
        }
	};

	function _init() {
		_initEvent();
		//_showRoleDev();
	}
	//事件绑定函数
	function _initEvent() {

        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'alterOwnerUser') {
            _showRoleDev();
            //masterDevId:$("#masterDevId option:selected").val(),//主设备
            $("#masterDevId").change(function () {
                var params ={
                    data:{
                        newMasterDevId:$("#masterDevId option:selected").val(),
                        oldMasterDevId:_global.rmDevId.masterDevId
                    }
                };
                post_async(params,_config.ajaxUrl.updateMasterDeviceUrl,_callback_dateMasterDevice)
            });
            //远程监控设备
            $("#remoteDevId").change(function () {
                var params ={
                    data:{
                        newRemoteDevId:$("#remoteDevId option:selected").val(),
                        oldRemoteDevId:_global.rmDevId.remoteDevId
                    }
                };
                post_async(params,_config.ajaxUrl.updateRemoteDeviceUrl,_callback_dateRemoteDevice)
            })
        }
		$("#contentRight_add").bind('click', function(event) {
            if (_global.popupsName == 'addOwnerUser') {
                parent.open_relaDevadd();
            } else if (_global.popupsName == 'alterOwnerUser') {
                _global.addraledev.data.correlateDevIds=[];
                //_global.latedevIds =[];
                parent.open_relaDevalter();
            }

		});
		//选择设备
        $("#title_select").bind("click", function () {
            if (_global.popupsName == 'addOwnerUser') {
                parent.open_associatedApparatusAdd();
            } else if (_global.popupsName == 'alterOwnerUser') {
                _global.addraledev.data.correlateDevIds=[];
                //_global.latedevIds =[];
                parent.open_chooseDev();
            }

        });
        //取消关联设备
		$("#contentRight_del").bind('click', function(event) {
            var all_row = $('.row', '#table_content');
            if(_global.popupsName == "addOwnerUser"){
                for(var i = 0; i < all_row.length; i++) {
                    for(var j=0;j<_global.hookUserEvtId.length;j++){
                        if(all_row[i].id == _global.hookUserEvtId[j]){

                            //遍历将数组中取消的值去除
                            for(var index = 0;index<_global.addDevList.length;index++){
                                // index是索引值（即下标）   item是每次遍历得到的值；
                                if(_global.addDevList[index].devId==all_row[i].id){
                                    _global.addDevList.splice(index,1);
                                }
                            }
                            all_row[i].remove();
                        }
                    }
                }
                var all_row = $('.row', '#table_content');
                $("#masterDevId").empty().append($("<option value=''></option>"));
                $("#remoteDevId").empty().append($("<option value=''></option>"));
                for(var i = 0; i < all_row.length; i++) {
                    $("#masterDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//主设备
                    $("#remoteDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//远程监控设备
                }
                //设置值默认被选中
                $("#remoteDevId").val(_global.rmDevId.remoteDevId);
                $("#masterDevId").val(_global.rmDevId.masterDevId);
                console.log("remoteDevId:"+_global.rmDevId.remoteDevId+" "+"masterDevId:"+_global.rmDevId.masterDevId);
                //当没有设备时，去掉全选的状态
                if(all_row.length == 0){
                    $('#allCheck').removeClass('isChecked').addClass('noChecked');
                }
                setColSize();
            }else if(_global.popupsName =="alterOwnerUser"){
                _global.delelatedavIds = [];
                var pararms = _global.deleraledev;
                pararms.data.ownerId = _global.ownerId;
                pararms.data.correlateDevIds = _global.hookUserEvtId;
                post_async(pararms,_config.ajaxUrl.deleteUrl,_callback_deleraledev)
            }
		});
		//选择设备
        $('#allCheck').bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                $this.removeClass('isChecked').addClass('noChecked');
                $('.isChecked').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
                _global.hookUserEvtId = [];
                console.log(JSON.stringify(_global.hookUserEvtId));
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                $('.noChecked').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
                _global.hookUserEvtId = [];
                var all_row = $('.row', '#table_content');
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    _global.hookUserEvtId.push(UserEvtId);
                }
                console.log(JSON.stringify(_global.hookUserEvtId));
            }
        });
        //监测列表变化
		$("#table_content").bind("DOMNodeInserted",function () {
            var all_row = $('.row', '#table_content');
            $("#masterDevId").empty().append($("<option value=''></option>"));
            $("#remoteDevId").empty().append($("<option value=''></option>"));
            for(var i = 0; i < all_row.length; i++) {
                $("#masterDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//主设备
                $("#remoteDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//远程监控设备
            }
            //设置值为_global.rmDevId.remoteDevId默认被选中
            $("#remoteDevId").val(_global.rmDevId.remoteDevId);
            $("#masterDevId").val(_global.rmDevId.masterDevId);
        })
        setColSize();
	}
    function _callback_deleraledev(data) {
        if(data.code == "200"){
            console.log("删除成功");
            for(var m = 0; m < _global.latedevIds.length; m++) {//_global.latedevIds是本身的关联设备，去掉删除的设备编号
                for(var n=0;n<_global.hookUserEvtId.length;n++){
                    if(_global.latedevIds[m] == _global.hookUserEvtId[n]){
                        _global.latedevIds.splice(m,1);
                        console.log(_global.latedevIds);
                    }
                }
            }
            for(var h = 0; h < _global.addDevList.length; h++) {//_global.addDevList是添加的设备编号，去掉删除的设备编号
                for(var k=0;k<_global.hookUserEvtId.length;k++){
                    if(_global.addDevList[h].devId == _global.hookUserEvtId[k]){
                        _global.addDevList.splice(h,1);
                        console.log(_global.addDevList);
                    }
                }
            }
            var all_row = $('.row', '#table_content');
            for(var i = 0; i < all_row.length; i++) {//去掉列表中被删除的行
                for(var j=0;j<_global.hookUserEvtId.length;j++){
                    if(all_row[i].id == _global.hookUserEvtId[j]){
                        all_row[i].remove();
                    }
                }
            }


            var all_row = $('.row', '#table_content');
            $("#masterDevId").empty().append($("<option value=''></option>"));
            $("#remoteDevId").empty().append($("<option value=''></option>"));
            for(var i = 0; i < all_row.length; i++) {
                $("#masterDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//主设备
                $("#remoteDevId").append($("<option value="+all_row[i].id+">"+all_row[i].id+"</option>"));//远程监控设备
            }
            //设置值默认被选中
            $("#remoteDevId").val(_global.rmDevId.remoteDevId);
            $("#masterDevId").val(_global.rmDevId.masterDevId);
            console.log("remoteDevId:"+_global.rmDevId.remoteDevId+" "+"masterDevId:"+_global.rmDevId.masterDevId);
            //当没有设备时，去掉全选的状态
            if(all_row.length == 0){
                $('#allCheck').removeClass('isChecked').addClass('noChecked');
            }
            setColSize();
        }else {
            console.log("删除失败");
            _global.top.alertTip("取消关联失败,",null,null);
        }
    }
    function _callback_dateMasterDevice(data) {
        if(data.code == "200"){
            _global.rmDevId.masterDevId=$("#masterDevId option:selected").val();
            console.log("主设备修改成功");
        }else if(data.code == "500"){
            console.log("主修改失败："+data.detail);
            _global.top.alertTip("主设备修改失败",2000,null);
        }
    }
    function _callback_dateRemoteDevice(data) {
        if(data.code == "200"){
            _global.rmDevId.remoteDevId=$("#remoteDevId option:selected").val();
            console.log("远程监控设备修改成功");
        }else if(data.code == "500"){
            console.log("远程监控设备修改失败："+data.detail);
            _global.top.alertTip("修改远程监控设备失败",2000,null);
        }
    }
	function _clearAddDevList() {
		//console.log('devList:' + JSON.stringify(_global.devList));
		_global.addDevList = [];
		for(var i = 0; i < _global.devList.length; i++) {
			_global.addDevList.push(_global.devList[i]);
		}
	}

	function _getAddDevList() {
		return _global.addDevList;
	}

	function _getDelDevList() {
		return _global.delDevList;
	}

	function _setAddDevList(data) {
		var devId = data.devId == null ? '' : data.devId;
		var devName = data.devName == null ? '' : data.devName;
		var devTypeName = data.devTypeName == null ? '' : data.devTypeName;
		var devModelName = data.devModelName == null ? '' : data.devModelName;
		var areaName = data.areaName == null ? '' : data.areaName;
		var devState = data.devState == null ? '' : data.devState;
		var devData = _global.addDevList;
		var params = {};
		params.devId = devId;
		params.devName = devName;
		params.devTypeName = devTypeName;
		params.devModelName = devModelName;
		params.areaName = areaName;
		params.devState = devState;
		if(devData.length > 0) {

			for(var i = 0; i < devData.length; i++) {
				var oJsonDevId = devData[i].devId;
				if(devId == oJsonDevId) {
					break;
				}
				if(i == devData.length - 1) {
					devData.push(params);
                    //_global.latedevIds.push(params);
				}
			}

		} else {
			devData.push(params);
            //_global.latedevIds.push(params);
		}
		_global.addDevList = devData;
		//console.log(JSON.stringify(_global.addDevList));
	}

	function _addDelData(data) {
		//console.log(JSON.stringify(data));
		var delData = _global.hookUserEvtId;
		var index = null;
		for(var i = 0; i < delData.length; i++) {
			if(data.devId == delData[i].devId) {
				index = i;
				break;
			} else {
				index = -1;
			}
		}
		delData.splice(index, 1);
		_global.hookUserEvtId = delData;
	}

	function _addAddData() {
		_clearRow();
		var json = _global.addDevList;
		for(var i = 0; i < json.length; i++) {
            _addRow(json[i], i + 1);
        }
        if (_global.popupsName == 'alterOwnerUser') {
            //var latedevIds = _global.latedevIds;
            //json是现在列表所展现的设备，_global.latedevIds是本身的关联设备，得出addreladev为要添加的设备
            var addreladev = [];
            var tmp = true;
            for(var i = 0; i < json.length; i++) {
                tmp = true;
                for (var j=0;j<_global.latedevIds.length;j++){
                    if(json[i].devId ==_global.latedevIds[j]){
                        tmp = false;
                        break;
                    }
                }
                if(tmp == true){
                    addreladev.push(json[i].devId)
                    tmp = true;
                }
            }

            console.log("addreladev:"+addreladev);

            /*for (var j = 0; j < latedevIds.length; j++) {
                _global.addraledev.data.correlateDevIds.push(latedevIds[j].devId);
            }*/
            _global.addraledev.data.correlateDevIds = addreladev;
            var pararms = _global.addraledev;
            post_async(pararms,_config.ajaxUrl.addUrl,_callback_saveraledev)
        }
        console.log(_global.addraledev.data.correlateDevIds);
        //去掉全选的钩
		$('#allCheck').removeClass('isChecked').addClass('noChecked');
        setColSize();
	}
	function _callback_saveraledev(data) {
        if(data.code == "200"){
            console.log("关联成功");
            _global.latedevIds=[];
            var all_row = $('.row', '#table_content');
            for(var i=0;i<all_row.length;i++){
                _global.latedevIds.push(all_row[i].id);//存起目前有主的设备编号
            }
            console.log("latedevIds:"+_global.latedevIds);
        }else if(data.code == "500"){
            _global.top.alertTip(data.message,null,null);
        }
    }

	//获取主设备和远程监控设备
	function _getmrDevId() {
		var params= {
            ownerId:_global.ownerId
		};
		post_async(params,"/IntegratedMM/getControlDevsByUserId.do",_callballdev);
    }
    //填写主设备和远程监控设备
	function _callballdev(data) {
		_global.rmDevId = data.result;
		if(data.code=="200"){
            //$("#remoteDevId").attr("value",data.result.remoteDevId);
            //$("#masterDevId").attr("value",data.result.masterDevId);
            $("#remoteDevId").val(data.result.remoteDevId);
            $("#masterDevId").val(data.result.masterDevId);
		}
    }
	function _showRoleDev() {
		var ownerId = _global.top.getPopupsRowJson().userId;
		_global.ownerId = ownerId;
		_global.addraledev.data.ownerId = ownerId;
		var params = {};
		params.ownerId = ownerId;
        post_async(params, _config.ajaxUrl.getOwnerCorrelateDevCtrlUrl, _callbackRoleDev);
	}

	function _callbackRoleDev(data) {
		//console.log('callbackRoleDev-------' + JSON.stringify(data.json));

		var result = data.result;
		if(result.code == '200') {
            _global.latedevIds=[];
			_clearRow();
           /* $("#masterDevId").empty().append($("<option value=''></option>"));//主设备
            $("#remoteDevId").empty().append($("<option value=''></option>"));//远程监控设备*/
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				_addRow(json[i]);
                _global.latedevIds.push(json[i].devId);
				_setAddDevList(json[i]);
                /*$("#masterDevId").append($("<option value="+json[i].devId+">"+json[i].devId+"</option>"));
                $("#remoteDevId").append($("<option value="+json[i].devId+">"+json[i].devId+"</option>"));*/
            }
            console.log("latedevIds:"+_global.latedevIds);
            if (_global.popupsName == 'alterOwnerUser') {
                _getmrDevId();
            }

		} else {
			_clearRow();
		}
        setColSize();
	}

	function _clearRow() {
		$('#table_content').empty();
	}

	function _setDelDevList(data) {
		var addDve = _global.addDevList;
		var index = null;
		for(var j = 0; j < addDve.length; j++) {
			var oJsonDevId = addDve[j].devId;
			if(data.devId == oJsonDevId) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		//console.log('index:' + index);
		addDve.splice(index, 1);
		_global.addDevList = addDve;
		//_global.latedevIds.splice(index, 1);
		//console.log(JSON.stringify(_global.addDevList));

	}
	function _addraleRow(row_json) {
	    //添加关联设备
        _global.addraledev.data.correlateDevIds = [];
        _global.addraledev.data.correlateDevIds.push(row_json.devId);
        var pararms = _global.addraledev;
        post_async(pararms,_config.ajaxUrl.addUrl,_callback_saveraledev);
        //
        _addRow(row_json);
        _setAddDevList(row_json);
        setColSize();
    }

	function _addRow(row_json, isPre) {
		//console.log('---------editRole-------' + JSON.stringify(row_json));
		var id = row_json.devId;
		if($('#' + id, "#table_content").length == 0) {
			$div_row = $("<tr></tr>");
			$div_devId = $("<td></td>");
            $div_noChecked = $("<div></div>");
            $span = $("<span></span>");
			$div_devName = $("<td></td>");
			$div_devType = $("<td></td>");
			$div_devModelId = $("<td></td>");
			$div_areaId = $("<td></td>");
			$div_devstuats = $("<td></td>");
            $div_devId.append($div_noChecked).append($span);
			$div_row
				.append($div_noChecked)
				.append($div_devId)
				.append($div_devName)
				.append($div_devType)
				.append($div_devModelId)
				.append($div_areaId)
				.append($div_devstuats)
				.addClass('row')
				.attr('id', row_json.devId);
            $div_noChecked.addClass("noChecked").attr('id', row_json.devId);;
            $div_devId.addClass('UserEvtId');
            $span.addClass('table_item_3').text(row_json.devId == null ? '' : row_json.devId).attr("title", row_json.devId == null ? '' : row_json.devId);
			$div_devName.addClass('table_item_4').text(row_json.devName == null ? '' : row_json.devName).attr("title", row_json.devName == null ? '' : row_json.devName);
			$div_devType.addClass('table_item_4').text(row_json.devTypeName == null ? '' : row_json.devTypeName).attr("title", row_json.devTypeName == null ? '' : row_json.devTypeName);
			$div_devModelId.addClass('table_item_4').text(row_json.devModelName == null ? '' : row_json.devModelName).attr("title", row_json.devModelName == null ? '' : row_json.devModelName);
			$div_areaId.addClass('table_item_4').text(row_json.areaName == null ? '' : row_json.areaName).attr("title", row_json.areaName == null ? '' : row_json.areaName);
			var devState = "";
		    switch(row_json.devState) {
		    	case 0:
		    		devState = "离线";
		    		break;
		    	case 1:
		    		devState = "在线";
		    		break;
		    	case 2:
		    		devState = "未知";
		    		break;
		    	default:
		    		break;
		    	}
			$div_devstuats.addClass('table_item_5').text(devState == null ? '' : devState).attr("title", devState == null ? '' : devState);
			$div_row.appendTo($("#table_content")).data('row_json', row_json);
            $div_noChecked.bind('click', function(e) {
                var $this = $(this);
                var check = $this.hasClass('isChecked');
                if(check) {
                    if($('#allCheck').hasClass('isChecked')) {
                        $('#allCheck').removeClass('isChecked').addClass('noChecked');
                    }
                    $this.removeClass('isChecked').addClass('noChecked');
                    //del_hookUserEvtId($this.parent().parent().attr('id'));
                } else {
                    $this.removeClass('noChecked').addClass('isChecked');
                    //add_hookUserEvtId($this.parent().parent().attr('id'));
                    var all_row = $('.row', '#table_content');
                    var all_isChecked = $('.isChecked', '#table_content');
                    if(all_row.length == all_isChecked.length){
                        $('#allCheck').removeClass('noChecked').addClass('isChecked');
					}
                }
                _global.hookUserEvtId = [];
                $(".isChecked").each(function(a,b){
                    _global.hookUserEvtId.push($(this).attr("id"));
                });
                console.log(JSON.stringify(_global.hookUserEvtId));
            });
		}
	}
	//传递关联设备数组数据
	function _setdevInfo() {
        _global.devIds = [];
        var all_row = $('.row', '#table_content');
        for(var i = 0; i < all_row.length; i++) {
            var $this = all_row[i];
            var UserEvtId = $this.id;
            _global.devIds.push(UserEvtId);
        }
		var alldev ={
            devIds:_global.devIds,//关联设备
            masterDevId:$("#masterDevId option:selected").val(),//主设备
            remoteDevId:$("#remoteDevId option:selected").val()	//远程监控设备
		};
        return alldev;
    }
   /* //添加设备
    function _open_relaDevadd() {
        _openPopups($('body'), "owner/relaDev/relaDev.html", {
            width: 300,
            height: 200
        });
    }*/
    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
       /* $("#allCheck").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:false,
        });*/
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