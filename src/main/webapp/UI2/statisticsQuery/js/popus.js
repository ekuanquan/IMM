/**
 * Created by Administrator on 2017/8/1.
 */
var flagpupo=false;
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
function _openPopupsSta(body, url, iframSize,isOpacity) {
    flagpupo=true;
    if ($("#mainDiv").length > 0) {
        $("#mainDiv").remove();
    }
    if ($("#bottomDiv").length > 0) {
        $("#bottomDiv").remove();
    }
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    var mainDiv = $("<div></div>");
    var bottomDiv = $("<div></div>");
    var iframe = $("<iframe></iframe>");
    iframe.attr({
        id:'mainDivIframe',
        name:'mainDivIframe',
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
    var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
    var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
    iframeHeightCenter = parseInt(iframeHeightCenter);

    if(iframeHeightCenter<10) {
        iframeHeightCenter = 10;
    }

    //iframeHeightCenter==iframeHeightCenter>0?10:iframeHeightCenter;

    iframeWidthCenter = parseInt(iframeWidthCenter);
    bodyHeight = parseInt(bodyHeight);
    bodyWidth = parseInt(bodyWidth);
    bottomDiv.attr({
        id: "bottomDiv"
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
        "z-index": "99",
        "background-color": "black",

    });
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px',
        "width": iframSizeWidth + 'px',
        "height": iframeSizeHeight + 'px',
        "display": "inline-block",
        "position": "absolute",
        "z-index": "100",

        "background-color": "#FFF"


    });
    if (isOpacity){
        mainDiv.css('background-color','rgba(0,0,0,0.5)');
    }
    mainDiv.attr({
        id: "mainDiv"

    });
    var _popusResizeSta = function  () {
        console.log('resize body');
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
    setResizeSta(_popusResizeSta);



    mainDiv.append('<div class="titleOut" id="titlemain"> ' +
        '<span id="titlespan" class="title_1"> </span>' +
        ' <div id="close" >×</div> </div>');

    mainDiv.append(iframe);
    body.append(bottomDiv);
    body.append(mainDiv);
    $(".titleOut").css({
        "height": "30px",
        "width":"100%",
        "background-color":"#2577e5"
    });
    $(".title_1").css({
        "font-family":  "微软雅黑",
        "font-size": "14px",
        "color": "#ffffff",
        "line-height": "30px",
        "margin-left": "20px"
    });

    $("#close").css({
        "float":  "right",
        "color": "white",
        "width": "30px",
        "height": "30px",
        "text-align":"center",
        "line-height":"22px",
        "font-size":"30px",
        "cursor": "pointer"
    });
    $("#titlemain").hover(function(){
        $("#titlemain").css("cursor","move");
    },function(){
        $("#titlemain").css("cursor","default");
    });
    $("#close").hover(function(){
        $("#close").css("background-color","#f75352");
        DragClear("mainDiv");//移除点击事件
    },function(){
        $("#close").css("background-color","#2577e5");
        Drag("mainDiv");//添加点击事件
    });
    $("#close").bind('click', function () {
//            $("#mainDivIframe").contents().find("#close").click();
        _closePopus();
    });

    new Drag("mainDiv");
}
function _closePopus() {
    flagpupo=false;
    $("#mainDiv").remove();
    $("#bottomDiv").remove();
}

function _setTitle(title){
    $("#titlespan").text(title);
}

function _changeUpSize(){
    var body = $("body");
    var bottomDiv = $("#BottomDiv");
    var mainDiv = $("#MainDiv");

    console.log('resize body');
    bodyHeight = body.height();
    bodyWidth = body.width();
    bodyHeight = parseInt(bodyHeight);
    bodyWidth = parseInt(bodyWidth);
    bottomDiv.css({
        "width": "100%",
        "height":"100%"
    });
    var iframeHeightCenter = (bodyHeight - mainDiv.height()) / 2;
    var iframeWidthCenter = (bodyWidth - mainDiv.width()) / 2;
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px'
    });
}
