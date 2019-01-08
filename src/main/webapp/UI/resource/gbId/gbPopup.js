
;(function(window,$,undefined){
    window.openGBPopus = _openGBPopups;         //打开弹窗
    window.closeGBPopus = _closeGBPopus;        //关闭弹窗

    var _global = {
    }

    function _openGBPopups(url, iframSize) {
        var body=$('body');
        if ($("#mainDivGB").length > 0) {
            $("#mainDivGB").remove();
        }
        if ($("#bottomDivGB").length > 0) {
            $("#bottomDivGB").remove();
        }
        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        var mainDiv = $("<div></div>");
        var bottomDivGB = $("<div></div>");
        var iframe = $("<iframe></iframe>");
        iframe.attr({
            name:'mainGBIframe',
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
        bottomDivGB.attr({
            id: "bottomDivGB"
        });
        bottomDivGB.css({
            "opacity": 0.5,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "598",
            "background-color": "black",

        });
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            "width": iframSizeWidth + 'px',
            "height": iframeSizeHeight + 'px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "599",
            "border-radius": "3px",
            "background-color": "#FFF"
        });
        mainDiv.attr({
            id: "mainDivGB"
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
        body.append(bottomDivGB);
    }

    function _closeGBPopus() {
        $("#mainDivGB").remove();
        $("#bottomDivGB").remove();
    }
})(window,jQuery);