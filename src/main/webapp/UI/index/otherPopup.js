
;(function(window,$,undefined){
    window.openOtherPopus = _openOtherPopups;         //打开弹窗
    window.closeOtherPopus = _closeOtherPopus;        //关闭弹窗
    window.setUserIdO=_setUserIdO;
    window.getUserIdO=_getUserIdO;
    window.setUserIdBack=_setUserIdBack;
    window.setIframeNameO=_setIframeNameO;
    window.setDevIdO=_setDevIdO;
    window.getDevIdO=_getDevIdO;
    window.setDevIdBack=_setDevIdBack;

    var _global = {
        userId: "",
        devId:'',
        iframeName:"",
    }

    function _openOtherPopups(url, iframSize) {
        var body=$('body');
        if ($("#mainDivOther").length > 0) {
            $("#mainDivOther").remove();
        }
        if ($("#bottomDivOther").length > 0) {
            $("#bottomDivOther").remove();
        }
        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        var mainDiv = $("<div></div>");
        var bottomDivOther = $("<div></div>");
        var iframe = $("<iframe></iframe>");
        iframe.attr({
            name:'mainOtherIframe',
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
        var iframeHeightCenter = (bodyHeight - iframeSizeHeight)/2 ;
        var iframeWidthCenter = (bodyWidth - iframSizeWidth-5)/2 ;
        iframeHeightCenter = parseInt(iframeHeightCenter);
        iframeWidthCenter = parseInt(iframeWidthCenter);
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDivOther.attr({
            id: "bottomDivOther"
        });
        bottomDivOther.css({
            "opacity": 0.5,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "99998",
            "background-color": "black",

        });
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            "width": iframSizeWidth + 'px',
            "height": iframeSizeHeight + 'px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "99999",
            "border-radius": "3px",
            "background-color": "#FFF"
        });
        mainDiv.attr({
            id: "mainDivOther"
        });
        body.resize(function () {
            bodyHeight = body.height();
            bodyWidth = body.width();
            bodyHeight = parseInt(bodyHeight);
            bodyWidth = parseInt(bodyWidth);
            iframeHeightCenter = (bodyHeight - iframeSizeHeight) ;
            iframeWidthCenter = (bodyWidth - iframSizeWidth) ;
            mainDiv.css({
                "top": iframeHeightCenter + 'px',
                "left": iframeWidthCenter + 'px'
            });
        });
        mainDiv.append(iframe);
        body.append(mainDiv);
        body.append(bottomDivOther);
    }

    function _closeOtherPopus() {
        $("#mainDivOther").remove();
        $("#bottomDivOther").remove();
    }
    function _setUserIdO(userId) {
        _global.userId=userId;
    }
    function _getUserIdO(){
        return _global.userId;
    }

    function _setDevIdO(devId) {
        _global.devId=devId;
    }
    function _getDevIdO(){
        return _global.devId;
    }

    function _setIframeNameO(iframeName) {
        _global.iframeName=iframeName;
    }
    function _setUserIdBack(userId) {
        mainDivIframe.alterUserIframe.setUserId(userId);
    }
    function _setDevIdBack(devId) {
        //if(_global.iframeName=="1"){
            mainDivIframe.showiframeBase.setDevId(devId);
        //}
    }
})(window,jQuery);