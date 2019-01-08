/**
 * Created by admin on 15-6-8.
 */

var ajaxHttp = {
    ajaxUrl: "z-javaWEBtest13/",
    ajaxRequest:function(param,url,method){
        try {
            method = baseClass.isNull(method) ? "post" : method;
        } catch (e) {
            method = "post";
        }
        var returnData = null;
        $.ajax({
            url:"/"+this.ajaxUrl+"/"+url,
            data:param,
            type:method,
            dataType:"json",
            async:false,
            traditional:true,
            success: function(data){
                returnData = data;
            },
            error:function(){}
        });
        return returnData;
    },
    ajaxAsyncRequest:function(param,url,method){
        try {
            method = baseClass.isNull(method) ? "post" : method;
        } catch (e) {
            method = "post";
        }
        var returnData = null;
        $.ajax({
            url:"/"+this.ajaxUrl+"/"+url,//�����url
            data:param,//���뷢�ͳ�ȥ�����
            type:method,
            dataType:"json",
            async:true,
            traditional:true,
            success: function(data){
                returnData = data;
            },
            error:function(){}
        });
        return returnData;
    },
    ajax:function(inner,url,callback,method){
        //alert(JSON.stringify(inner));
        $.ajax({
            type:method||"POST",
            url:"/"+this.ajaxUrl+"/"+url,
            async: true,
            data : inner?(method==="GET"?inner:JSON.stringify(inner)):null,
            dataType : "json",
            contentType : "application/json;charset=utf-8",
            /*contentType : "application/x-www-form-urlencoded",*/
            traditional:true,
            beforeSend: function(request) {
                //request.setRequestHeader("Authorization",$("#Authorization").val());
                /*request.setRequestHeader("Access-Control-Allow-Origin","*");*/
            },
            success:function(data){
                if(data && callback) {
                    callback(data);
                }
            },
            error:function(){

            }
        });
    },
}