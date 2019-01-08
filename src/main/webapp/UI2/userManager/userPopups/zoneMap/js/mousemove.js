/**
 * Created by Administrator on 2017/8/1.
 */
var Drag = function(id,divid,kuangkuangId,clickFunction){
    var el = document.getElementById(id);
    var div = document.getElementById(divid);
    var kuangkuang = document.getElementById(kuangkuangId);
    el.style.position = "absolute";
    var drag = function(e) {
        e = e || window.event;
        el.style.cursor = "pointer";
        !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
        var x=e.clientX-(div.offsetLeft)- kuangkuang.offsetLeft + kuangkuang.parentNode.scrollLeft ;
        var y=e.clientY-(div.offsetTop)- kuangkuang.offsetTop + kuangkuang.parentNode.scrollTop;
        var x1 = x,y1 = y;
        if(x>0 && x<div.offsetWidth-$("#"+id).width()) {
            el.style.left = x1 + "px";
        }

        //console.log("e.clientY:"+e.clientY+"  div.offsetTop:" +div.offsetTop)
        if(y>0 &&y<div.offsetHeight-$("#"+id).height()) {
            el.style.top = y1 + "px";
        }
        addJson(id,x1,div.offsetWidth, y1,div.offsetHeight,divid);
    }

    var dragend = function(){
        document.onmouseup = null;
        document.onmousemove = null;
        clickFunction(id);
    }

    document.onmouseup = dragend;
    document.onmousemove = drag;
}
var DragClear = function(id) {
    var el = document.getElementById(id);
    el.onmousedown = null;
}
function addJson(id,x,divW,y,divH,divid) {//创建json
    var jsonArr=$("#"+divid).data("draggableJson");
    var jsonflag=false;
    for(var i=0;i<jsonArr.length;i++){
        if(jsonArr[i].id==id){
            var w = x/divW;
            w = w <= 0 ? 0.0001 : w > 1 ? (divW-$("#"+id).width())/divW : w;//x介于0、1之间
            var h = y/divH;
            h = h <= 0 ? 0.0001 : h > 1 ? (divH-$("#"+id).height())/divH : h;//y介于0、1之间
            jsonArr[i].x=w;
            jsonArr[i].y=h;
            jsonflag=true;
            $("#"+divid).data("draggableJson",jsonArr);
        }
    }
    if(!jsonflag){
        var w = x/divW;
        w = w <= 0 ? 0.0001 : w > 1 ? (divW-$("#"+id).width())/divW : w;
        var h = y/divH;
        h = h <= 0 ? 0.0001 : h > 1 ? (divH-$("#"+id).height())/divH : h;
        var jsonStr={
            "id":id,
            "x":w,
            "y":h,
            "roleZoneName":""
        }
        jsonArr.push(jsonStr);
        $("#"+divid).data("draggableJson",jsonArr);
    }
}