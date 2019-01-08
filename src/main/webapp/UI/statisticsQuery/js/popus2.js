/**
 * Created by Administrator on 2017/8/1.
 */
var _global = {
    popusName:'',
    popusResize:null,
    popusMapResize:null,
    deviceIframe:{
        checkedTab:""
    },
    deviceLocation:{
        x:'',
        y:''
    },
    userIframe:{
        checkedTab:''
    },
    popupsData:{
        rowJson:""
    },
    userType:"222"         //用户类型，
}
function _openPopupsSta2(body, url, iframSize,isOpacity) {

    if ($("#mainDiv2").length > 0) {
        $("#mainDiv2").remove();
    }
    if ($("#bottomDiv2").length > 0) {
        $("#bottomDiv2").remove();
    }
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    console.log("iframSizeWidth: " + iframSizeWidth);
    console.log("iframeSizeHeight: " + iframeSizeHeight);
    var mainDiv = $("<div></div>");
    var bottomDiv = $("<div></div>");
    var iframe = $("<iframe></iframe>");
    iframe.attr({
        id:'mainDivIframe2',
        name:'mainDivIframe2',
        src: url,
        scrolling: "no",
        width: iframSizeWidth,
        height: iframeSizeHeight,
        border: 0,
        frameborder: "no"
    });
    var bodyHeight = body.height();
    var bodyWidth = body.width();
    bodyHeight = body.height();
    bodyWidth = body.width();
    console.log("bodyWidth: " + bodyWidth);
    var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
    var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
    iframeHeightCenter = parseInt(iframeHeightCenter);

    if(iframeHeightCenter<10) {
        iframeHeightCenter = 10;
    }
    //iframeHeightCenter==iframeHeightCenter>0?iframeHeightCenter:10;
    iframeWidthCenter = parseInt(iframeWidthCenter);
    console.log("iframeWidthCenter: " + iframeWidthCenter);
    bodyHeight = parseInt(bodyHeight);
    bodyWidth = parseInt(bodyWidth);
    bottomDiv.attr({
        id: "bottomDiv2"
    });
    bottomDiv.css({
        "opacity": 0.5,
        "float": "left",
        "top": "0px",
        "left": "0px",
        "width": bodyWidth + "px",
        "height": bodyHeight + "px",
        "display": "inline-block",
        "position": "absolute",
        "z-index": "399",
        "background-color": "black",

    });
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px',
        "width": iframSizeWidth + 'px',
        "height": iframeSizeHeight + 'px',
        "display": "inline-block",
        "position": "absolute",
        "z-index": "400",

        "background-color": "#FFF"


    });
    if (isOpacity){
        mainDiv.css('background-color','rgba(0,0,0,0.5)');
    }
    mainDiv.attr({
        id: "mainDiv2"

    });
    var _popusResizeSta2 = function  () {
        bodyHeight = body.height();
        bodyWidth = body.width();
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.css({
            "width": bodyWidth + "px",
            "height": bodyHeight + "px",
        });
        iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
        iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px'
        });
    }
    setResizeSta2(_popusResizeSta2);



    mainDiv.append('<div class="titleOut" id="titlemain2"> <span id="titlespan2" class="title_1"> </span> <div id="close2">×</div> </div>');

    mainDiv.append(iframe);
    body.append(bottomDiv);
    body.append(mainDiv);

    $(".titleOut").css({
        "height": "30px",
        "width":"100%",
        "background-color":"#2577e5"
    });
    $("#titlemain2").css({
        "height": "30px",
        "background-color":"#2577e5"
    });
    $("#titlespan2").css({
        "font-family":  "微软雅黑",
        "font-size": "14px",
        "color": "#ffffff",
        "line-height": "30px",
        "margin-left": "20px"
    });

    $("#close2").css({
        "float":  "right",
        "color": "white",
        "width": "30px",
        "height": "30px",
        "text-align":"center",
        "line-height":"22px",
        "font-size":"30px",
        "cursor": "pointer"
    });
    $("#titlemain2").hover(function(){
        $("#titlemain2").css("cursor","move");
    },function(){
        $("#titlemain2").css("cursor","default");
    });
    $("#close2").hover(function(){
        $("#close2").css("background-color","#f75352");
        DragClear("mainDiv2");//移除点击事件
    },function(){
        $("#close2").css("background-color","#2577e5");
        Drag("mainDiv2");//添加点击事件
    });
    $("#close2").bind('click', function () {
//            $("#mainDivIframe").contents().find("#close").click();
        _closePopus2();
    });

    new Drag("mainDiv2");
}

function _closePopus2() {
    if(mainDivIframe2.close&&(typeof (mainDivIframe2.close)=='function')) {
        mainDivIframe2.close();
    }
    $("#mainDiv2").remove();
    $("#bottomDiv2").remove();
}
function _setTitle2(title){
    $("#titlespan2").text(title);
}

function _getArea(curTreeNode){
    mainDivIframe.getArea(curTreeNode);
    //mainDivIframe是一级弹窗的name，调用一级弹窗内部方法，达到传参效果
}
function _changeUpSize2(iframSize){
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    var body = $("body");
    var bottomDiv = $("#BottomDiv2");
    var mainDiv = $("#MainDiv2");

    console.log('resize body');
    bodyHeight = body.height();
    bodyWidth = body.width();
    bodyHeight = parseInt(bodyHeight);
    bodyWidth = parseInt(bodyWidth);
    bottomDiv.css({
        "width": "100%",
        "height":"100%"
    });
    var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
    var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px',
        'width': iframSizeWidth + 'px',
        'height': iframeSizeHeight + 'px'
    });
}
