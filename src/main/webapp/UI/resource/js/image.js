/**
 * Created by Administrator on 2017/11/13.
 */
/**
 * Created by Administrator on 2017/8/12.
 */

(function() {
    $.extend($.fn, {
        redraw:function(options,isCenter,pos){
            var $elem = $($("#Map").data("areaImage"));
            var zoom = $($("#Map").data("areaImage")).data("zoom");
            var target=$elem.data('imageTarget');
            var iWidth = target.width;
            var iHeight = target.height;
            if(isCenter){
                var kuangkuang = $("#"+options["containerId"]);
                var left = (kuangkuang.width() - iWidth*zoom) / 2;
                var top = (kuangkuang.height() - iHeight*zoom) / 2;
                console.log("the left is "+left);
                $elem.css({"left":left+"px",top:top+"px"})
            }
            else if(pos){
                var cOffset = {};
                cOffset.top = $.fn.getTop(document.getElementById(options["containerId"]));
                cOffset.left = $.fn.getLeft(document.getElementById(options["containerId"]));
                var offset = $elem.offset();
                var width = $elem.width();
                var height = $elem.height();
                var x = (pos["x"] - offset["left"]) / width;
                var y = (pos["y"] - offset["top"]) / height;
                var left = pos["x"] - iWidth*zoom * x;
                var top = pos["y"] - iHeight*zoom * y;
                $elem.css({"left":left-cOffset.left-1+"px",top:top-cOffset.top-1+"px"});
            }
            $elem.width(iWidth*zoom);
            $elem.height(iHeight*zoom);

            var data = $.fn.getDraggableJson($("#"+options["containerId"]).data("areaImage"));
            var len = data.length;
            for(var i=0;i<len;i++){
                var info = data[i];
                var x = $elem.width() * info.x  - 17;
                var y = $elem.height() * info.y - 41;
                $("#"+info["id"]).css({"left":x,"top":y});
            }
        },
        getTop:function(e){
            var offset=e.offsetTop;
            if(e.offsetParent!=null) offset+=$.fn.getTop(e.offsetParent);
            return offset;
        },
        getLeft:function(e){
            var offset=e.offsetLeft;
            if(e.offsetParent!=null) offset+=$.fn.getLeft(e.offsetParent);
            return offset;
        },
        addiconList: function(optionsList) {
            var _self = this;
            $("#"+optionsList["containerId"]).removeClass("falsePicture");

            $('#'+optionsList["containerId"]).bind('mousewheel DOMMouseScroll', function(event, delta, deltaX, deltaY) {
                var delta = -event.originalEvent.wheelDelta || event.originalEvent.detail;
                var zoom = $($('#'+optionsList["containerId"]).data("areaImage")).data("zoom")||1;
                var setting = optionsList;
                if(delta>0){
                    zoom -= setting["zoomSize"];
                    zoom = zoom <= setting["minZoom"] ? setting["minZoom"] : zoom;
                }else{
                    zoom += setting["zoomSize"];
                    zoom = zoom >= setting["maxZoom"] ?  setting["maxZoom"] : zoom;
                }
                var pos = {x:event.originalEvent.clientX,y:event.originalEvent.clientY};
                $($('#'+optionsList["containerId"]).data("areaImage")).data("zoom",zoom);
                $.fn.redraw(setting,false,pos);
                if(navigator.userAgent.indexOf('Firefox') >= 0){
                    event.preventDefault();
                }
            });

            (function() {
                $('#'+optionsList["containerId"]).mousemove(function(e) {
                    if (!!this.move) {
                        var posix = !this.move_target ? {'x': 0, 'y': 0} : this.move_target.posix,
                            callback = this.call_down || function() {
                                    $(this.move_target).css({
                                        'top': e.pageY - posix.y,
                                        'left': e.pageX - posix.x
                                    });
                                };
                        callback.call(this, e, posix);
                    }
                }).mouseup(function(e) {
                    var width = $(this).width();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top;
                    var height = $(this).height();
                    var isIn = (e.clientX >= left && e.clientX <= left + width)
                        && e.clientY >= top && e.clientY <= top + height
                    if (!!this.move&&isIn) {
                        var callback = this.call_up || function(){};
                        callback.call(this, e);
                        $.extend(this, {
                            'move': false,
                            'move_target': null,
                            'call_down': false,
                            'call_up': false
                        });
                    }
                });
                var lenw=$('#'+optionsList["containerId"]).children().length;
                for(var i=0;i<lenw;i++){
                    var $box = $('#'+$('#'+optionsList["containerId"]).children()[i].id).mousedown(function(e) {
                     var offset = $(this).offset();
                     var cOffset = $("#"+optionsList["containerId"]).offset();
                     this.posix = {'x': e.pageX - offset.left + cOffset.left, 'y': e.pageY - offset.top + cOffset.top};
                     $.extend(document.getElementById(optionsList["containerId"]), {'move': true, 'move_target': this});
                     })
                }
                /*var $box = $($("#Map").data("areaImage")).mousedown(function(e) {
                    var offset = $(this).offset();
                    var cOffset = $("#"+optionsList["containerId"]).offset();
                    this.posix = {'x': e.pageX - offset.left + cOffset.left, 'y': e.pageY - offset.top + cOffset.top};
                    $.extend(document.getElementById(optionsList["containerId"]), {'move': true, 'move_target': this});
                })*/
            })();
        }
        ,
        getDraggableJson: function(wrapperId){
            var draggableJson = $(wrapperId).data("draggableJson");
            return draggableJson;
        },
        setMouseDown:function (pathId) {
            var $box = $("#"+pathId).mousedown(function(e) {
                var offset = $(this).offset();
                var cOffset = $('#Map').offset();
                this.posix = {'x': e.pageX - offset.left + cOffset.left, 'y': e.pageY - offset.top + cOffset.top};
                $.extend(document.getElementById('#Map'), {'move': true, 'move_target': this});
            })
        }
    });
})(jQuery)