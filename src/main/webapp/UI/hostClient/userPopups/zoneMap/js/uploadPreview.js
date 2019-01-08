//代码整理：懒人之家  www.lanrenzhijia.com
var uploadPreview = function(setting) {

    var _self = this;

    _self.IsNull = function(value) {
        if (typeof (value) == "function") { return false; }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }

    _self.DefautlSetting = {
        UpBtn: "",
        DivShow: "",
        ImgShow: "",
        kuangkuang:"kuangkuang",
        bianbian:"bianbian",
        Width: 100,
        Height: 100,
        ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
        ErrMsg: "选择文件错误,图片类型必须是(gif,jpeg,jpg,bmp,png)中的一种",
        callback: function() { }
    };

    _self.Setting = {
        UpBtn: _self.IsNull(setting.UpBtn) ? _self.DefautlSetting.UpBtn : setting.UpBtn,
        DivShow: _self.IsNull(setting.DivShow) ? _self.DefautlSetting.DivShow : setting.DivShow,
        ImgShow: _self.IsNull(setting.ImgShow) ? _self.DefautlSetting.ImgShow : setting.ImgShow,
        kuangkuang: _self.IsNull(setting.kuangkuang) ? _self.DefautlSetting.kuangkuang : setting.kuangkuang,
        bianbian: _self.IsNull(setting.bianbian) ? _self.DefautlSetting.bianbian : setting.bianbian,
        Width: _self.IsNull(setting.Width) ? _self.DefautlSetting.Width : setting.Width,
        Height: _self.IsNull(setting.Height) ? _self.DefautlSetting.Height : setting.Height,
        ImgType: _self.IsNull(setting.ImgType) ? _self.DefautlSetting.ImgType : setting.ImgType,
        ErrMsg: _self.IsNull(setting.ErrMsg) ? _self.DefautlSetting.ErrMsg : setting.ErrMsg,
        callback: _self.IsNull(setting.callback) ? _self.DefautlSetting.callback : setting.callback
    };

    _self.getObjectURL = function(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    _self.Bind = function() {

			document.getElementById(_self.Setting.UpBtn).onchange = function() {
				if (this.value) {
					if (!RegExp("\.(" + _self.Setting.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
						alert(_self.Setting.ErrMsg);
						this.value = "";
						return false;
					}
					if (navigator.userAgent.indexOf("MSIE") > -1) {
						try {
                            var kuangkuang=$("#"+ _self.Setting.kuangkuang);
                            var bianbian=$("#"+ _self.Setting.bianbian);
                            var kwidth=kuangkuang.width()-28;
                            var kheight=kuangkuang.height()-33;
                            var img = new Image();
                            img.src = _self.getObjectURL(this.files[0]);
                            if(img.complete) {
                                var x=kwidth/img.width;
                                var y=kheight/img.height;
                                var lv=x<y?x:y;
                                $("#" + _self.Setting.ImgShow).width(img.width*lv);
                                $("#" + _self.Setting.ImgShow).height(img.height*lv);

                                bianbian.css({
                                    "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
                                    "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
                                    "width":img.width*lv+28+'px',
                                    "height":img.height*lv+33+'px'
                                });
                            }
                            else {
                                img.onload = function(){
                                    var x=kwidth/img.width;
                                    var y=kheight/img.height;
                                    var lv=x<y?x:y;
                                    $("#" + _self.Setting.ImgShow).width(img.width*lv);
                                    $("#" + _self.Setting.ImgShow).height(img.height*lv);

                                    bianbian.css({
                                        "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
                                        "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
                                        "width":img.width*lv+28+'px',
                                        "height":img.height*lv+33+'px'
                                    });
                                };
                            }
                            $("#"+_self.Setting.ImgShow).attr("style","background:url('"+_self.getObjectURL(this.files[0])+"') no-repeat;background-size: 100% 100%; ");
						} catch (e) {
						}
					} else {
                        var kuangkuang=$("#"+ _self.Setting.kuangkuang);
                        var bianbian=$("#"+ _self.Setting.bianbian);
                        var kwidth=kuangkuang.width()-28;
                        var kheight=kuangkuang.height()-33;
                        var img = new Image();
                        img.src = _self.getObjectURL(this.files[0]);
                        if(img.complete) {
                            var x=kwidth/img.width;
                            var y=kheight/img.height;
                            var lv=x<y?x:y;
                            $("#" + _self.Setting.ImgShow).width(img.width*lv);
                            $("#" + _self.Setting.ImgShow).height(img.height*lv);

                            bianbian.css({
                                "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
                                "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
                                "width":img.width*lv+28+'px',
                                "height":img.height*lv+33+'px'
                            });
                        }
                        else {
                            img.onload = function(){
                                var x=kwidth/img.width;
                                var y=kheight/img.height;
                                var lv=x<y?x:y;
                                bianbian.css({
                                    "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
                                    "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
                                    "width":img.width*lv+28+'px',
                                    "height":img.height*lv+33+'px'
                                });
                                $("#" + _self.Setting.ImgShow).width(img.width*lv);
                                $("#" + _self.Setting.ImgShow).height(img.height*lv);

                            };

                        }
                        $("#"+_self.Setting.ImgShow).attr("style","background:url('"+_self.getObjectURL(this.files[0])+"') no-repeat;background-size: 100% 100%;");
					}
					_self.Setting.callback();
				}
	
        }
    }

    _self.Bind();
}
var showBackUrl = function(setting,onloadCallback) {
    var $elem = $("#"+setting.wrapperId);
    $elem.attr("style","background:url('"+setting.imageUrl+"') no-repeat;background-size: 100% 100%;");
    var kuangkuang=$("#"+setting.kuangkuangId);
    var bianbian=$("#"+setting.bianbianId);
    var kwidth=kuangkuang.width()-28;
    var kheight=kuangkuang.height()-33;
    var type = setting.type;
    var img = new Image();
    img.src = setting.imageUrl;
    if(img.complete) {
        if(type == 1){
            kwidth = img.width;
            kheight = img.height;
            kuangkuang.width(kwidth);
            kuangkuang.height(kheight);
        }

        var x=kwidth/img.width;
        var y=kheight/img.height;
        var lv=x<y?x:y;
        $elem.width(img.width*lv);
        $elem.height(img.height*lv);
        bianbian.css({
            "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
            "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
            "width":img.width*lv+28+'px',
            "height":img.height*lv+33+'px'
        });
        if(onloadCallback != null &&  typeof onloadCallback == 'function'){
            onloadCallback(true);
        }
    }
    else {
        img.onload = function(){
            if(type == 1){
                kwidth = img.width;
                kheight = img.height;
                kuangkuang.width(kwidth);
                kuangkuang.height(kheight);
            }
            var x=kwidth/img.width;
            var y=kheight/img.height;
            var lv=x<y?x:y;
            $elem.width(img.width*lv);
            $elem.height(img.height*lv);

            bianbian.css({
                "margin-top" : (kuangkuang.height()-img.height*lv-33)/2+'px',
                "margin-left" : (kuangkuang.width()-img.width*lv-28)/2+'px',
                "width":img.width*lv+28+'px',
                "height":img.height*lv+33+'px'
            });
            if(onloadCallback != null &&  typeof onloadCallback == 'function'){
                onloadCallback(true);
            }
        };
        img.onerror = function(){
            if(onloadCallback != null &&  typeof onloadCallback == 'function'){
                onloadCallback(false);
            }
        }
    }
}


