/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    addinit();
});

;(function(window,$){

    var areaId ;
    var aun = 0;
    var form1=null;
    window.addinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;

    var _global = {
        popusName:''
    };
    function _init(){
        $("#choseplace").click(function(){setDeviceLocation()});
        $("#close,#cancel").click(function(){parent.closePopus();});

        $("#areaname").click(function(){_devicePopusManager('openArea')});
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
            $("#installTime_inputXin").removeClass("prompt");
        });
        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });

        $("#sure").click(function(){sureAddDevice();});

        $("#devModelId").click(function(){openDevicePlay();});
        check();

    }
    //发送经纬度
    function setDeviceLocation(){
        var line = $("#line").val();
        var column = $("#column").val();
        var location = {
            "x":line,
            "y":column
        };
        parent.setDeviceLocation(location);
        parent.devicePopusManager("addLocation");
    }

    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
        $("#lineXin").removeClass("prompt");
        $("#columnXin").removeClass("prompt");
    }

    //所属区域显示
    function _getArea(areaname){
            $("#areaname").val(areaname.name);
            areaId = areaname.id;
        $("#areanameXin").removeClass("prompt");
    }

    //弹窗开始
    function _devicePopusManager(popusPage_str) {

        switch (popusPage_str) {
           /* case 'selectDevice':
                _global.popusName = 'selectDevice';
                _open_selectDevice();
                break;*/
            case 'openArea':
                _open_openArea();
                break;
            default:
                break;
        }

    }

     //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    function sureAddDevice(){       //添加报警主机设备、

        checkNull();

        var s1 =form1.form();
        if(s1==false){
            alert("信息填写不全或错误！");
            return;
        }

        var object = {  "devId":pad2($("#devId").val()),
                        "devName":$("#devName").val(),
                        "pnlActID":$("#pnlActID").val(),
                        "areaId":areaId,
                        "devType":1,
                        "devModelId":$("#devModelId").val(),                    //拿到的是设备型号的编号不是设备型号名称
                        "instMan":$("#instMan").val(),
                        "telAddr":$("#telAddr").val(),
                        "pnlTel":$("#pnlTel").val(),
                        "devInstDate":$("#installTime_input").val(),
                        "devLng":$("#line").val(),
                        "devlat":$("#column").val(),
                        "keyboardAddr":$("#keyboardAddr").val(),
                        "pnlAddr":$("#pnlAddr").val(),
                        "pnlPowerAddr":$("#pnlPowerAddr").val(),
                        "instUnit":$("#instUnit").val(),
                        "pnlHdTel":$("#pnlHdTel").val(),
                        "RegexPWD":$("#RegexPWD").val(),
                        "fMemo":$("#fMemo").val(),
                        "manufacturer":$("#manufacturer").val()
        };
      var end =   post_sync(object, "../../../../addDevice/addAlarmhost.do");
      alert(end.result.message);
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
           var model =  getDevModel();
            for(var i=0; i<model.length; i++){
               // devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            $("#devModelIdXin").removeClass("prompt");
            aun=1;
        }
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:1};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

   function check(){
       form1 = $("#signupForm").validate({
            rules: {
                deaId: {
                //    required:true,
                    maxlength:12,
                },
                devName: {
                //    required:true,
                    minlength:3,
                    maxlength:10,
                },
                pnlActID: {
                //    required:true,
                    minlength:5,
                    maxlength:20,
                },
                areaname: {
                //    required: true,
                },
                devModelId: {
                //    required: true,
                },
                installTime_input: {
                //    required: true,
                },
                line: {
                //    required:true,
                    number:true
                },
                column: {
                //    required:true,
                    number:true
                }
            },
            messages: {
                deaId: {
                    required:"请输入设备编号！",
                    maxlength:"最大长度为12！"
                },
                deaName: {
                    required:"请输入设备名称！",
                    minlength: "最小长度为3！",
                    maxlength:"最大长度为10！"
                },
                pnlActID: {
                    required:"请输入关联设备编号！",
                    minlength: "最小长度为5！",
                    maxlength:"最大长度为20！"
                },
                areaname: {
                    required: "请输入所属区域！",
                },
                devModelId: {
                    required: "请输入设备型号！",
                },
                installTime_input: {
                    required: "请输入安装时间！",
                },
                line: {
                    required:"请输入经度！",
                    number: "请输入正确的数字！",
                },
                column:{
                    required:"请输入纬度！",
                    number: "请输入正确的数字！",
                }
            }
        });
    }

    function alterErrot(){
        alert("最大长度为4！");
    }

    function checkNull(){                                                                                   //校验是否为空
        var devId = $("#devId").val();
        var devName = $("#devName").val();
        var pnlActID = $("#pnlActID").val();
        var areaname = $("#areaname").val();
        var devModelId = $("#devModelId").val();
        var installTime_input = $("#installTime_input").val();
        var line = $("#line").val();
        var column = $("#column").val();
        if(devId==''){
            $("#devIdXin").addClass("prompt");
            $("#devId").bind('input porpertychange',function(){
                if($("#devId").val()!=''){
                    $("#devIdXin").removeClass("prompt");
                }
            });
        }
        if(devName==''){
            $("#devNameXin").addClass("prompt");
            $("#devName").bind('input porpertychange',function(){
                if($("#devName").val()!=''){
                    $("#devNameXin").removeClass("prompt");
                }
            });
        }
        if(pnlActID==''){
            $("#pnlActIDXin").addClass("prompt");
            $("#pnlActID").bind('input porpertychange',function(){
                if($("#pnlActID").val()!=''){
                    $("#pnlActIDXin").removeClass("prompt");
                }
            });
        }
        if(areaname==''){
            $("#areanameXin").addClass("prompt");
            $("#areaname").bind('input porpertychange',function(){
                if($("#areaname").val()!=''){
                    $("#areanameXin").removeClass("prompt");
                }
            });
        }
        if(devModelId==''||devModelId==null){
            $("#devModelIdXin").addClass("prompt");
            $("#devModelId").bind('select porpertychange',function(){
                if($("#devModelId").val()!=''){
                    $("#devModelIdXin").removeClass("prompt");
                }
            });
        }
        if(installTime_input==''||installTime_input==null){
            $("#installTime_inputXin").addClass("prompt");
            $("#installTime_input").bind('select porpertychange',function(){
                if($("#installTime_input").val()!=''){
                    $("#installTime_inputXin").removeClass("prompt");
                }
            });
        }
        if(line==''||line==null){
            $("#lineXin").addClass("prompt");
            $("#line").bind('input porpertychange',function(){
                if($("#line").val()!=''){
                    $("#lineXin").removeClass("prompt");
                }
            });
        }
        if(column==''||column==null){
            $("#columnXin").addClass("prompt");
            $("#column").bind('input porpertychange',function(){
                if($("#column").val()!=''){
                    $("#columnXin").removeClass("prompt");
                }
            });
        }
    }

    function alte(){
        alert("adasfdsdfsafasfasf");
    }
    //前面自动补零
    function pad2(num) {
        if((num + "").length >= 9)return num;
        return pad2("0" + num);
    }



})(window,jQuery);