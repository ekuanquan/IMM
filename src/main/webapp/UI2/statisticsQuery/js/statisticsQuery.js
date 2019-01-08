/**
 * Created by Administrator on 2017/8/19.
 */
$(document).ready(function() {
    init();
});
;(function(window,$,undefined){
    window.init = _init;

    var _global = {
        top:parent
    };


    function _init(){
        _initLayout();
        _initEvent();
    }
    //布局函数
    function _initLayout(){
        $(".son").hide();
        $(".user").show();
        $("#hostClientIframe").css('width', '100%');
        $("#hostClientIframe").siblings().css('width', '0px');
        $("#userBara").addClass('down');
        $("#hostClient").addClass('current');
        $("#hostClientSonImg").css({'background-image': 'url("img/sonChose.png")'});
    }
    //事件绑定函数
    function _initEvent(){
        $("#userManage").click(function(){//用户管理
            if($("#userBara").hasClass('down')){
                $("#userBara").removeClass('down');
                $(".user").hide();
            }else {
                $(".user").show();
                $("#userBara").addClass('down');
            }
            //$(".bar1").removeClass('current');
            //$(".son").removeClass('current');
            //$(this).addClass('current');
            return false; //阻止默认时间
        });
        $("#hostClient").click(function(){//主机客户
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#hostClientSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#hostClientIframe").css('width', '100%');
            $("#hostClientIframe").siblings().css('width', '0px');
            return false; //阻止默认时间
        });
        $("#averageCustomer").click(function(){//一般客户
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#averageCustomerSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#averageCustomerIframe").css('width', '100%');
            $("#averageCustomerIframe").siblings().css('width', '0px');
            if($("#averageCustomerIframe").attr('src').length==0){
                $("#averageCustomerIframe").attr('src','averageCustomer/averageCustomer.html');
            }
            return false; //阻止默认时间
        });
        $("#operator").click(function(){//操作员
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#operatorSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#operatorIframe").css('width', '100%');
            $("#operatorIframe").siblings().css('width', '0px');
            if($("#operatorIframe").attr('src').length==0) {
                $("#operatorIframe").attr('src', 'operator/operator.html');
            }
            return false; //阻止默认时间
        });
        $("#eventManagement").click(function(){//事件查询
            if($("#eventBara").hasClass('down')){
                $("#eventBara").removeClass('down');
                $(".event").hide();
            }else {
                $(".event").show();
                $("#eventBara").addClass('down');
            }

            //$(".bar1").removeClass('current');
            //$(".son").removeClass('current');
            //$(this).addClass('current');
            return false; //阻止默认时间
        });
        $("#eventManage").click(function(){//事件管理
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#eventManageSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#eventManageIframe").css('width', '100%');
            $("#eventManageIframe").siblings().css('width', '0px');
            if($("#eventManageIframe").attr('src').length==0) {
                $("#eventManageIframe").attr('src', 'eventQuery/eventQuery.html');
            }
            return false; //阻止默认时间
        });
        $("#eventStatistics").click(function(){//事件月统计
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#eventStatisticsSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#eventStatisticsIframe").css('width', '100%');
            $("#eventStatisticsIframe").siblings().css('width', '0px');
            return false; //阻止默认时间
        });
        $("#deviceManagement").click(function(){//设备查询
            if($("#deviceBara").hasClass('down')){
                $("#deviceBara").removeClass('down');
                $(".device").hide();
            }else {
                $(".device").show();
                $("#deviceBara").addClass('down');
            }

            //$(".bar1").removeClass('current');
            //$(".son").removeClass('current');
            //$(this).addClass('current');
            return false; //阻止默认时间
        });
        $("#deviceHome").click(function(){//设备管理
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#deviceHomeSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#deviceHomeIframe").css('width', '100%');
            $("#deviceHomeIframe").siblings().css('width', '0px');
            if($("#deviceHomeIframe").attr('src').length==0) {
                $("#deviceHomeIframe").attr('src', 'deviceInfo/deviceInfo.html');
            }
            return false; //阻止默认时间
        });

        $("#documentManagement").click(function(){//单据查询
            if($("#documentBara").hasClass('down')){
                $("#documentBara").removeClass('down');
                $(".document").hide();
            }else {
                $(".document").show();
                $("#documentBara").addClass('down');
            }
            //$(".bar1").removeClass('current');
            //$(".son").removeClass('current');
            //$(this).addClass('current');
            return false; //阻止默认时间
        });
        $("#singleHandle").click(function(){//处警单
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#singleHandleSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#singleHandleIframe").css('width', '100%');
            $("#singleHandleIframe").siblings().css('width', '0px');
            if($("#singleHandleIframe").attr('src').length==0) {
                $("#singleHandleIframe").attr('src', 'rdQuery/rdQuery.html');
            }
            return false; //阻止默认时间
        });
        $("#repairOrder").click(function(){//维修单
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#repairOrderSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#repairOrderIframe").css('width', '100%');
            $("#repairOrderIframe").siblings().css('width', '0px');
            if($("#repairOrderIframe").attr('src').length==0) {
                $("#repairOrderIframe").attr('src', 'fixQuery/fixQuery.html');
            }
            return false; //阻止默认时间
        });
        $("#inspectionFromList").click(function(){//巡检单
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#inspectionFromListSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#inspectionFromListIframe").css('width', '100%');
            $("#inspectionFromListIframe").siblings().css('width', '0px');
            if($("#inspectionFromListIframe").attr('src').length==0) {
                $("#inspectionFromListIframe").attr('src', 'inspection/inspection.html');
            }
            return false; //阻止默认时间
        });
        $("#nuclearPoliceList").click(function(){//核警单
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#nuclearPoliceListSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#nuclearPoliceListIframe").css('width', '100%');
            $("#nuclearPoliceListIframe").siblings().css('width', '0px');
            if($("#nuclearPoliceListIframe").attr('src').length==0) {
                $("#nuclearPoliceListIframe").attr('src', 'rdVerify/rdVerify.html');
            }
            return false; //阻止默认时间
        });

        $("#systemLogManagement").click(function(){//日志查询
            if($("#systemLogBara").hasClass('down')){
                $("#systemLogBara").removeClass('down');
                $(".systemLog").hide();
            }else {
                $(".systemLog").show();
                $("#systemLogBara").addClass('down');
            }
            //$(".bar1").removeClass('current');
            //$(".son").removeClass('current');
            //$(this).addClass('current');
            return false; //阻止默认时间
        });
        $("#systemLog").click(function(){//系统日志
            //$(".bar1").removeClass('current');
            $(".son").removeClass('current');
            $(this).addClass('current');
            $(".sonImg").css({'background-image': 'url("img/sonOffen.png")'});
            $("#systemLogSonImg").css({'background-image': 'url("img/sonChose.png")'});

            $("#systemLogIframe").css('width', '100%');
            $("#systemLogIframe").siblings().css('width', '0px');
            if($("#systemLogIframe").attr('src').length==0) {
                $("#systemLogIframe").attr('src', 'systemLog/systemLog.html');
            }
            return false; //阻止默认时间
        });
    }
})(window,jQuery,undefined);