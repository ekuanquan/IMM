/**
 * Created by Administrator on 2017/8/18.
 */

var index = 0;
var userAreaImage = function(setting) {

    var isAdd=false;

    var _self = this;

    _self.IsNull = function(value) {
        if (typeof (value) == "function") { return false; }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }

    _self.DefautlSetting = {
        addbtnId:"addbtn",//添加按钮id
        kuangkuangId:"kuangkuang",//防区图外框div id
        bianbianId:"bianbian",//防区图边框div id
        wrapperId:"wrapper1",//防区图div id
        src:'images/addarea.jpg',//图标图片
        jsonSelect:[],//下拉框数据json
        DragDownCallBack:null,
        OKCallBack:null,
        delCallBack:null,
        addBeforeCallBack:null,
        mapId: ''
    };

    _self.Setting = {
        addbtnId: _self.IsNull(setting.addbtnId) ? _self.DefautlSetting.addbtnId : setting.addbtnId,
        kuangkuangId: _self.IsNull(setting.kuangkuangId) ? _self.DefautlSetting.kuangkuangId : setting.kuangkuangId,
        bianbianId: _self.IsNull(setting.bianbianId) ? _self.DefautlSetting.bianbianId : setting.bianbianId,
        wrapperId: _self.IsNull(setting.wrapperId) ? _self.DefautlSetting.wrapperId : setting.wrapperId,
        src: _self.IsNull(setting.src) ? _self.DefautlSetting.src : setting.src,
        jsonSelect: _self.IsNull(setting.jsonSelect) ? _self.DefautlSetting.jsonSelect : setting.jsonSelect,
        DragDownCallBack: _self.IsNull(setting.DragDownCallBack) ? _self.DefautlSetting.DragDownCallBack : setting.DragDownCallBack,
        OKCallBack: _self.IsNull(setting.OKCallBack) ? _self.DefautlSetting.OKCallBack : setting.OKCallBack,
        delCallBack: _self.IsNull(setting.delCallBack) ? _self.DefautlSetting.delCallBack : setting.delCallBack,
        addBeforeCallBack: _self.IsNull(setting.addBeforeCallBack) ? _self.DefautlSetting.addBeforeCallBack : setting.addBeforeCallBack,
        mapId: _self.IsNull(setting.mapId) ? _self.DefautlSetting.mapId : setting.mapId
    };
    function bindClick(di){
        console.log('bindClick() in');

        $("#"+_self.Setting.addbtnId).attr("disabled","true")
        if ($("#"+di).data("flag") == 0) {
            getZoneByOwnerIdSub(function (datas) {
                $.fn.alert({
                    cancelBtnLbl: '取消',//取消按钮文字
                    confirmBtnLbl: '保存',//确定按钮文字
                    wrapperId: _self.Setting.wrapperId,//防区图div Id
                    kuangkuangId: _self.Setting.kuangkuangId,//防区图大框div Id
                    draggableId:di,
                    jsonSelect:datas.zonePojo,//下拉框数据json
                    confirmIsTrue: true,//是否有确定按钮
                    confirmCallback: function (data) {
                        $("#"+di).data("flag", 1);
                        //当图标数等于选项数是添加按钮不可用
                        var jsonArr=$("#"+_self.Setting.wrapperId).data("draggableJson");
                        if(jsonArr.length==_self.Setting.jsonSelect.length){
                            $("#"+_self.Setting.addbtnId).attr("disabled","true");
                        }else {
                            $("#"+_self.Setting.addbtnId).attr("disabled", false);
                        }
                        if (_self.Setting.OKCallBack && typeof _self.Setting.OKCallBack == 'function') {
                            _self.Setting.OKCallBack(data);
                        }
                    },
                    cancelCallback: function (data) {
                        $("#"+_self.Setting.addbtnId).attr("disabled",false);
                    }
                });
            })
        }
        else {
            getZoneByOwnerIdSub(function (datas) {
                $.fn.alert({
                    cancelBtnLbl: '删除',//取消按钮文字
                    wrapperId: _self.Setting.wrapperId,//防区图div Id
                    kuangkuangId: _self.Setting.kuangkuangId,//防区图大框div Id
                    selected: $("#" + di + "Number").html(),//图标编号
                    draggableId: di,//防区图图标div Id
                    jsonSelect: datas.zonePojo,//下拉框数据json
                    confirmIsTrue: false,//是否有确定按钮
                    cancelCallback: function (data) {
                        $("#" + _self.Setting.addbtnId).attr("disabled", false);

                        if (_self.Setting.delCallBack && typeof _self.Setting.delCallBack == 'function') {
                            _self.Setting.delCallBack(data);
                        }
                    },
                    closeCallback: function () {
                        //当图标数等于选项数是添加按钮不可用
                        var jsonArr = $("#" + _self.Setting.wrapperId).data("draggableJson");
                        if (jsonArr.length == _self.Setting.jsonSelect.length) {
                            $("#" + _self.Setting.addbtnId).attr("disabled", "true");
                        } else {
                            $("#" + _self.Setting.addbtnId).attr("disabled", false);
                        }
                    }
                });
            });
        }
    }
    function  ctreatIcon() {
        $.fn.addicon({
            containment: _self.Setting.wrapperId,//防区图div id
            iconId:'draggable'+ _self.Setting.mapId + '_' + index,//图标id
            src:_self.Setting.src,//图标图片
        });
    }
    function mouseOverDiv() {
        if(isAdd){
            isAdd=false;
            ctreatIcon();
            $("#"+'draggable'+ _self.Setting.mapId + '_' + index).data("flag",0);
            new Drag('draggable'+ _self.Setting.mapId + '_' +  index, _self.Setting.wrapperId, _self.Setting.kuangkuangId, bindClick);

            new DragDown('draggable'+ _self.Setting.mapId + '_' + index, _self.Setting.wrapperId, _self.Setting.kuangkuangId, bindClick,function (data) {
                if (_self.Setting.DragDownCallBack && typeof _self.Setting.DragDownCallBack == 'function') {
                    _self.Setting.DragDownCallBack(data);
                }
            });
        }
    }
    $("#"+_self.Setting.addbtnId).bind("click",function () {
        if (_self.Setting.addBeforeCallBack && typeof _self.Setting.addBeforeCallBack == 'function') {
            _self.Setting.addBeforeCallBack();
        }
        isAdd=true;
        index++;
    })
    $("#"+_self.Setting.wrapperId).mouseover(function(e){
        mouseOverDiv(e);
    })
    $("#"+_self.Setting.wrapperId).data("draggableJson",[]);
}

var clearImage = function(settingClear) {
    var _self = this;

    _self.IsNull = function (value) {
        if (typeof (value) == "function") {
            return false;
        }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }

    _self.DefautlSettingClear = {
        addbtnId: "addbtn",//添加按钮id
        wrapperId: "wrapper1",//防区图div id
        mapId: "",//防区图div id
        isDelete: false,//防区图div id
        clearCallBack: null
    };

    _self.SettingClear = {
        addbtnId: _self.IsNull(settingClear.addbtnId) ? _self.DefautlSettingClear.addbtnId : settingClear.addbtnId,
        wrapperId: _self.IsNull(settingClear.wrapperId) ? _self.DefautlSettingClear.wrapperId : settingClear.wrapperId,
        mapId: _self.IsNull(settingClear.mapId) ? _self.DefautlSettingClear.mapId : settingClear.mapId,
        isDelete: _self.IsNull(settingClear.isDelete) ? _self.DefautlSettingClear.isDelete : settingClear.isDelete,
        clearCallBack: _self.IsNull(settingClear.clearCallBack) ? _self.DefautlSettingClear.clearCallBack : settingClear.clearCallBack
    };

    var jsonArr2=[];
    var jsonArr=$("#"+_self.SettingClear.wrapperId).data("draggableJson");
    if(!jsonArr){
        return;
    }
    if(jsonArr.length==0){
        var child=$("#"+_self.SettingClear.wrapperId).children();
        if(child.length>0){
            $("#"+_self.SettingClear.wrapperId).children().remove();
        }
    }
    for(var i=0;i<jsonArr.length;i++){
        if(jsonArr[i].mapId==_self.SettingClear.mapId) {
            $("#" + jsonArr[i].id).remove();
            if(_self.SettingClear.isDelete) {
                var submitZonePojo = {
                    x: 0,
                    y: 0,
                    ownerZoneName: jsonArr[i].ownerZoneName,
                    devZoneId: jsonArr[i].devZoneId,
                    mapId: ''
                }
                parent.delDraw(submitZonePojo);
            }
        }
        else{
            jsonArr2.push(jsonArr[i]);
        }
    }
    $("#"+_self.SettingClear.wrapperId).data("draggableJson",jsonArr2);
    $("#"+_self.SettingClear.addbtnId).attr("disabled",false);
    if (_self.SettingClear.clearCallBack && typeof _self.SettingClear.clearCallBack == 'function') {
        _self.SettingClear.clearCallBack(jsonArr);
    }
}
var getAllImage = function(settingAll) {
    var _self = this;

    _self.IsNull = function (value) {
        if (typeof (value) == "function") {
            return false;
        }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }

    _self.DefautlSettingAll = {
        wrapperId: "wrapper1",//防区图div id
        getAllCallBack: null
    };

    _self.SettingAll = {
        wrapperId: _self.IsNull(settingAll.wrapperId) ? _self.DefautlSettingAll.wrapperId : settingAll.wrapperId,
        getAllCallBack: _self.IsNull(settingAll.getAllCallBack) ? _self.DefautlSettingAll.getAllCallBack : settingAll.getAllCallBack
    };

    var jsonArr=$("#"+_self.Settingc.wrapperId).data("draggableJson");

    if (_self.SettingAll.getAllCallBack && typeof _self.SettingAll.getAllCallBack == 'function') {
        _self.SettingAll.getAllCallBack(jsonArr);
    }
}