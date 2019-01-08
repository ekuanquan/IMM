
(function() {
    $.extend($.fn, {
        //提示框组件
        alertSure: function(options) {
            var defaults = {
                sec: -1,
                src:'images/sure.png',
                title:'确认信息',
                tip: '',
                confirmBtnLbl: '确定',
                maskColor: '#000',
                selectMainSizeWidth: 360,
                selectMainSizeHeight: 222,
                confirmCallback: null
            };
            var settings = $.extend(defaults, options || {}),
                $this;
            var globalObj = {};
            function initialize() {
                if ($("#selectMainDiv").length > 0) {
                    $("#selectMainDiv").remove();
                }
                if ($("#selectBottomDiv").length > 0) {
                    $("#selectBottomDiv").remove();
                }
                var selectMainDiv = $("<div></div>");
                var selectBottomDiv = $("<div></div>");
                globalObj.selectMainDiv = selectMainDiv;
                globalObj.selectBottomDiv = selectBottomDiv;
                
                selectBottomDiv.css({
                    "opacity": 0.5,
                    "top": "0px",
                    "left": "0px",
                    "width": "100%",
                    "height": "100%",
                    "display": "inline-block",
                    "position": "absolute",
                    "z-index": "999999",
                    "background-color": "black",
                    "float":"none"

                });
                selectBottomDiv.attr({
                    id: "selectBottomDiv"

                });
                var windowHeight = selectBottomDiv.height();
                var windowWidth = selectBottomDiv.width();
                var selectMainHeightCenter = (windowHeight - settings.selectMainSizeWidth) / 2;
                var selectMainWidthCenter = (windowWidth - settings.selectMainSizeHeight) / 2;
                selectMainHeightCenter = parseInt(selectMainHeightCenter);
                selectMainWidthCenter = parseInt(selectMainWidthCenter);
                selectMainDiv.css({
                    "top": '50%',
                    "left": '50%',
                    "width": settings.selectMainSizeWidth + 'px',
                    "height": settings.selectMainSizeHeight + 'px',
                    "display": "inline-block",
                    "position": "absolute",
                    "z-index": "1000000",
                    "border-radius": "3px",
                    "background-color": "#FFF",
                    "-webkit-transform":"translate(-50%,-50%)",
                    "-moz-transform":"translate(-50%,-50%)",
                    "transform":"translate(-50%,-50%)",
                    "text-align":"center",
                    "float":"none"
                });
                
                selectMainDiv.attr({
                    id: "selectMainDiv"

                });
                var selectTitleDiv = $("<div></div>");
                selectTitleDiv.css({
                    "width":"100%",
                    "background-color":" #2777E2",
                    "height":"30px",
                    "line-height":"30px",
                    "float":"none"
                });
                
                selectTitleDiv.attr({
                    id: "selectTitleDiv"

                });
                var selectTitleSpanDiv = $("<span></span>");
                selectTitleSpanDiv.css({
                    "height":"28px",
                    "line-height":"28px",
                    "vertical-align":"middle",
                    "text-align":"left",
                    "font-size":"14px",
                    "color":"#fff",
                    "padding-left":"10px",
                    "float":"left"
                });
                
                selectTitleSpanDiv.attr({
                    id: "selectTitleSpanDiv"

                });
                selectTitleSpanDiv.text(settings.title);
                
                var selectTitleCloseDiv = $("<div>×</div>");
                selectTitleCloseDiv.css({
                    "width":"30px",
                    "height":"30px",
                    "line-height":"24px",
                    "vertical-align":"middle",
                    "float":"right",
                    "font-size":"30px",
                    "color":"#fff",
                    "cursor":"pointer"
                });
                
                selectTitleCloseDiv.attr({
                    id: "close"
                });
				 selectTitleCloseDiv.hover(function () {
                    $(this).css({
                        "background-color": "#d44027"
                    });
                },function () {
                    $(this).css({
                        "background-color": "#2777E2"
                    });
                });
                selectMainDiv.append(selectTitleDiv);
                selectTitleDiv.append(selectTitleSpanDiv);
                selectTitleDiv.append(selectTitleCloseDiv);
                 var selectMiddleDiv = $("<div></div>");
                selectMiddleDiv.css({
                    "display":"table",
                    "width":"100%",
                    "height":"132px",
                    "text-align":"center",
                    "float":"none"
                });
                
                selectMiddleDiv.attr({
                    id: "selectMiddleDiv"
                });

                selectMainDiv.append(selectMiddleDiv);
                
                 var selectMmwDiv = $("<div></div>");
                selectMmwDiv.css({
                    "height":"124px",
                    "line-height":"124px",
                    "width":"216px",
                    "margin":"auto",
                    "float":"none"
                });

                selectMmwDiv.attr({
                    id: "selectMmwDiv"
                });

                selectMiddleDiv.append(selectMmwDiv);
                var selectMmDiv = $("<div></div>");
                selectMmDiv.css({
                    "display":"flex",
                    "justify-content":"center",
                    "height":"124px",
                    "line-height":"124px",
                    "align-items":"center",
                    "vertical-align":"middle",
                    "float":"none"
                });
                selectMmDiv.attr({
                    id: "selectMmDiv"
                });
                selectMmwDiv.append(selectMmDiv);

                var selectMmcenterDiv = $("<div></div>");
                selectMmcenterDiv.css({
                    "width":"221px",
                    "margin":"auto"
                });
                selectMmcenterDiv.attr({
                    id: "selectMmcenterDiv"
                });
                selectMmDiv.append(selectMmcenterDiv);

                /*var selectimg = $("<img/>");
                selectimg.css({
                    "margin":"auto",
                    "float":"left"
                });
                
                selectimg.attr({
                    id: "selectImg",
                    src:settings.src
                });
                

                selectMmcenterDiv.append(selectimg);*/
                
                var selectTipSpan = $("<span></span>");
                selectTipSpan.css({
                    "line-height":"20px",
                    "text-align":"left",
                    "font-size":"14px",
                    "float":"left",
                    "color":"#000",
					"width":"221px"
                });

                selectTipSpan.attr({
                    id: "selectTipSpan"
                });

                selectTipSpan.text(settings.tip);
				
				
				
                var selectTipSpanDiv = $("<div></div>");
//                selectTipSpanDiv.css({
//                    "margin-left":"10px",
//                    "float":"left"
//                });
                
                selectTipSpanDiv.css({
                    "float":"left",
                    "width":"221px"
                });
				var tipStr = settings.tip;
				if(tipStr!=null && tipStr!=undefined && tipStr.length<16){
					selectTipSpanDiv.css({
						"margin-top":"25px"
					});
					
					 selectTipSpan.css({
						 "text-align":"center"
					});
				}
                selectTipSpanDiv.attr({
                    id: "selectTipSpanDiv"
                });
                selectMmcenterDiv.append(selectTipSpanDiv);
                selectTipSpanDiv.append(selectTipSpan);


                var selectFootDiv = $("<div></div>");
                selectFootDiv.css({
                    "width":"100%",
                    "height":"68px",
                });
                
                selectFootDiv.attr({
                    id: "selectFootDiv"
                });

                selectMainDiv.append(selectFootDiv);
                var confirmBtn = $('<input type="button" id="confirmBtn"/>');
                confirmBtn.css({
                    "width":"89px",
                    "height":"28px",
                    "vertical-align":"middle",
                    "color":"#000000",
                    "line-height":"25px",
                    "border-radius": "5px",
                    "border":"0px",
                    "float":"none",
                    "background-image": "url('img/btn.png')",
                    "cursor":"pointer"
                });
                confirmBtn.val(settings.confirmBtnLbl);
                selectFootDiv.append(confirmBtn);
                

                
                $('body').append(selectBottomDiv);
                $('body').append(selectMainDiv);

                $("#confirmBtn").hover(function(){
                    $("#confirmBtn").css("background-color","#1b5fde");
                },function(){
                    $("#confirmBtn").css("background-color","#2577e5");
                });
                $("#confirmBtn").bind('click', function () {
                    confirmBtnClickHandler();
                });
                $("#close").bind('click', function () {
                    confirmBtnClickHandler();
                });
            }
            function confirmBtnClickHandler() {
                globalObj.selectMainDiv.remove();
                globalObj.selectBottomDiv.remove();
                if (settings.confirmCallback && typeof settings.confirmCallback == 'function') {
                    settings.confirmCallback();
                }
                if(id_of_setinterval != null){
                clearTimeout(id_of_setinterval) ;
                id_of_setinterval = null;
                }
            }
            initialize();
            
            var id_of_setinterval = null;
            if(settings.sec>0){
                id_of_setinterval= setTimeout(confirmBtnClickHandler,settings.sec);
            }
        },
    });
})(jQuery)