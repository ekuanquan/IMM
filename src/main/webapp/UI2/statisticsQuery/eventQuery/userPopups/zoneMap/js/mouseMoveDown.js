/**
 * Created by Administrator on 2017/8/12.
 */
var DragDown = function(id,divid,clickFunction,callback){
    var el = document.getElementById(id);
    var div = document.getElementById(divid);
    el.style.position = "absolute";
    var isClick=true;
    var dragDown = function(e) {
        isClick=true;
        e = e || window.event;
        el.style.cursor = "pointer";
        !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
        var x=e.clientX-(div.offsetLeft)-6 ;
        if(x>0 && x<div.offsetWidth) {
            isClick=false;
            el.style.left = x+div.offsetLeft + "px";
        }
        else{
            isClick=false;
        }
        var y=e.clientY-(div.offsetTop)-15 ;
        if(y>0 &&y<div.offsetHeight) {
            isClick=false;
            el.style.top = y+div.offsetTop + "px";
        }
        else{
            isClick=false;
        }
        addJson(id,el.offsetLeft-div.offsetLeft,div.offsetWidth, el.offsetTop-div.offsetTop,div.offsetHeight,divid);
    }

    var dragendDown = function(){
        document.onmouseup = null;
        document.onmousemove = null;
        if(isClick){
            clickFunction(id);
        }
        else{
            var data={
                "x":0,
                "y":0,
                "roleZoneName":""
            };
            //删除json数据
            var jsonArr=$("#"+divid).data("draggableJson");
            for(var i=0;i<jsonArr.length;i++){
                if(jsonArr[i].id==id){
                    data.x=jsonArr[i].x;
                    data.y=jsonArr[i].y;
                    data.roleZoneName=jsonArr[i].roleZoneName;
                }
            }
            callback(data);
        }
        isClick=true;
    }

    var dragstartDown = function(e){
        e = e || window.event;
        el.offset_x = e.clientX - el.offsetLeft;
        el.offset_y = e.clientY - el.offsetTop;
        document.onmouseup = dragendDown;
        document.onmousemove = dragDown;
        return false;
    }
    el.onmousedown = dragstartDown;
}
var DragClear = function(id) {
    var el = document.getElementById(id);
    el.onmousedown = null;
}