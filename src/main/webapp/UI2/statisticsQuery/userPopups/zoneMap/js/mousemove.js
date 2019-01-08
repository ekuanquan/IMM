/**
 * Created by Administrator on 2017/8/1.
 */
var Drag = function(id,divid,clickFunction){
    var el = document.getElementById(id);
    var div = document.getElementById(divid);
    el.style.position = "absolute";
    var drag = function(e) {
        e = e || window.event;
        el.style.cursor = "pointer";
        !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
        var x=e.clientX-(div.offsetLeft)-6 ;
        if(x>0 && x<div.offsetWidth) {
            el.style.left = x+div.offsetLeft + "px";
        }
        var y=e.clientY-(div.offsetTop)-15 ;
        //console.log("e.clientY:"+e.clientY+"  div.offsetTop:" +div.offsetTop)
        if(y>0 &&y<div.offsetHeight) {
            el.style.top = y+div.offsetTop + "px";
        }
        addJson(id,el.offsetLeft-div.offsetLeft,div.offsetWidth, el.offsetTop-div.offsetTop,div.offsetHeight,divid);
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
            jsonArr[i].x=x/divW;
            jsonArr[i].y=y/divH;
            jsonflag=true;
            $("#"+divid).data("draggableJson",jsonArr);
        }
    }
    if(!jsonflag){
        var jsonStr={
            "id":id,
            "x":x/divW,
            "y":y/divH,
            "roleZoneName":""
        }
        jsonArr.push(jsonStr);
        $("#"+divid).data("draggableJson",jsonArr);
    }
}