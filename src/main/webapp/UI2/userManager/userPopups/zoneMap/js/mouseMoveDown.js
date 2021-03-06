/**
 * Created by Administrator on 2017/8/12.
 */
var DragDown = function(id,divid,kuangkuangId,clickFunction,callback){
    //console.log("the isAdd is "+isAdd);
    var el = document.getElementById(id);
    var div = document.getElementById(divid);
    var kuangkuang = document.getElementById(kuangkuangId);
    el.style.position = "absolute";
    var isClick=true;
    var dragDown = function(e) {
        isClick=true;
        e = e || window.event;
        el.style.cursor = "pointer";
        !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
        var x=e.clientX-(div.offsetLeft) - kuangkuang.offsetLeft ;
        if(x>0 && x<div.offsetWidth-$("#"+id).width()) {
            isClick=false;
            el.style.left = x+/*div.offsetLeft - kuangkuang.offsetLeft + kuangkuang.parentNode.scrollLeft +*/ "px";
        }
        else{
            isClick=false;
        }
        var y=e.clientY-(div.offsetTop) - kuangkuang.offsetTop;
        if(y>0 && y<div.offsetHeight-$("#"+id).height()) {
            isClick=false;
            el.style.top = y/*+div.offsetTop - kuangkuang.offsetTop + kuangkuang.parentNode.scrollTop*/ + "px";
        }
        else{
            isClick=false;
        }
        addJson(id,x,div.offsetWidth,y,div.offsetHeight,divid);
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
        e.stopPropagation();
        return false;
    }
    el.onmousedown = dragstartDown;
}
var DragClear = function(id) {
    var el = document.getElementById(id);
    el.onmousedown = null;
}