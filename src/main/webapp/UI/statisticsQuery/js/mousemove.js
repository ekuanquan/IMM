/**
 * Created by Administrator on 2017/8/1.
 */
var Drag = function(id){
    var el = document.getElementById(id);
    el.style.position = "absolute";
    var toptopDiv = $("<div></div>");
    var drag = function(e) {
        e = e || window.event;
        el.style.cursor = "move";
        !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
        el.style.left = e.clientX - el.offset_x  + "px";
        var y=e.clientY - el.offset_y;
        if(y>0&&y<$('body').height()-30){
            el.style.top =  y + "px";
        }
    }

    var dragend = function(){
        if (toptopDiv.length > 0) {
            toptopDiv.remove();
        }
        //$("#toptopDiv").remove();
        document.onmouseup = null;
        document.onmousemove = null;
    }

    var dragstart = function(e){
        toptopDiv.css({
            "opacity": 0.5,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "19999",
            "cursor":"move"

        });
        toptopDiv.attr({
            id: "toptopDiv"
        });
        $("body").append(toptopDiv);
        e = e || window.event;
        el.offset_x = e.clientX - el.offsetLeft;
        el.offset_y = e.clientY - el.offsetTop;
        document.onmouseup = dragend;
        document.onmousemove = drag;
        return false;
    }
    el.onmousedown = dragstart;
}
var DragClear = function(id) {
    var el = document.getElementById(id);
    el.onmousedown = null;
}