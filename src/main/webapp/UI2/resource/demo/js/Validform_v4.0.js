
(function($){
	var errorobj=null,//指示当前验证失败的表单元素;
		msgobj,//pop box object 
		msghidden=true, //msgbox hidden?
		tipmsg={//默认提示文字;
			tit:"提示信息",
			w:"请输入正确信息！",
			r:"通过信息验证！",
			c:"正在检测信息…",
			s:"请填入信息！",
			v:"所填信息没有经过验证，请稍后…",
			p:"正在提交数据…",
			err:"出错了！请检查提交地址或返回数据格式是否正确！"
		};
		
	$.Tipmsg=tipmsg;

	$.fn.Validform=function(settings){
		var defaults={};
		settings=$.extend({},$.fn.Validform.sn.defaults,settings);
		settings.datatype && $.extend($.Datatype,settings.datatype);

		this.each(function(index){
			var $this=$(this),
				posting=false; //防止表单按钮双击提交两次;

			//bind the blur event;
			$this.find("[datatype]").blur(function(){
				flag=$.fn.Validform.sn.checkform($(this),$this,{type:settings.tiptype,sweep:settings.tipSweep},"hide");
			});

			//subform
			var subform=function(){
				settings.beforeCheck && settings.beforeCheck($this);
				
				var flag=true,
					inflag=true;
				if(posting){return false;}

				$this.find("[datatype]").each(function(){
					inflag=$.fn.Validform.sn.checkform($(this),$this,{type:settings.tiptype,sweep:settings.tipSweep});
				});

			};

			if(settings.btnSubmitId.length>0)
			{
				$("#"+settings.btnSubmitId).click(function(){
					subform();
					if (settings.callback && typeof settings.callback == 'function') {
						var sigh=$(".Validform_sigh");
						var wrong=$(".Validform_wrong");
						if(sigh.length==0 && wrong.length==0){
							settings.callback(true);
						}else{
							settings.callback(false);
						}
					}
					return false;
				});
			}
			//settings.btnSubmit && $this.find(settings.btnSubmit).bind("click",subform);
			$this.submit(function(){
				subform();
				if (settings.callback && typeof settings.callback == 'function') {
					var sigh=$(".Validform_sigh");
					var wrong=$(".Validform_wrong");
					if(sigh.length==0 && wrong.length==0){
						settings.callback(true);
					}else{
						settings.callback(false);
					}
				}
				return false;
			});
			$this.find("input[type='reset']").click(function(){
				$this.find(".Validform_checktip").removeClass("Validform_wrong Validform_right Validform_sigh");
				$this.find("input:first").focus();
			});
		});


	};

	$.fn.Validform.sn={
		defaults:{
			tiptype:1,
			tipSweep:false,
			showAllError:false,
			postonce:false,
            ajaxPost:false,
			callback:null
		},

		toString:Object.prototype.toString,

		showmsg:function(msg,type,o,show){//o:{obj:当前对象, type:1=>正在检测 | 2=>通过}, show用来判断tiptype=1的情况下是否弹出信息框;
			if(type==2 && o.obj){
				o.obj.next().text("");
				o.obj.next().attr("title",msg);
				this.cssctl(o.obj.next(),o.type);
			}
		},

		checkform:function(obj,parentobj,tiptype,show){//show用来判断是表达提交还是blur事件引发的检测;
			if($.trim(obj.val())===""){
				if(typeof(obj.attr("nullmsg"))=="undefined"||obj.attr("nullmsg").length==0) {
					return false;
				}
				else {
					this.showmsg(obj.attr("nullmsg"), tiptype.type, {
						obj: obj,
						curform: parentobj,
						type: 1,
						sweep: tiptype.sweep
					}, show);
					return false;
				}
			}else if(!$.Datatype[obj.attr("datatype")].test(obj.val())){
				if(typeof(obj.attr("errormsg"))!="undefined"&&obj.attr("errormsg").length>0&&obj.val().length>0) {
					this.showmsg(obj.attr("errormsg"), tiptype.type, {
						obj: obj,
						curform: parentobj,
						type: 3,
						sweep: tiptype.sweep
					}, show);
					return false;
				}
			}
			else{
				this.showmsg(obj.attr("通过验证") || tipmsg.s, tiptype.type, {
					obj: obj,
					curform: parentobj,
					type: 5,
					sweep: tiptype.sweep
				}, show);
				return false;
			}
			return true;
		},
		cssctl:function(obj,status){
			switch(status){
				case 1:
					obj.removeClass("Validform_right Validform_wrong").addClass("Validform_checktip Validform_sigh");//checking;
					break;
				case 3:
					obj.removeClass("Validform_sigh Validform_right").addClass("Validform_checktip Validform_wrong");//wrong;
					break;
				case 5:
					obj.removeClass("Validform_sigh Validform_wrong").addClass("Validform_checktip Validform_right");//wrong;
					break;
				default:
					obj.removeClass("Validform_sigh Validform_wrong").addClass("Validform_checktip Validform_right");//wrong;
			}	
		}

	};

	//公用方法显示&关闭信息提示框;
	$.Showmsg=function(msg){
		$.fn.Validform.sn.showmsg(msg,1,{});
	};
	$.Hidemsg=function(){
		msgobj.hide();
		msghidden=true;
	};
	$.Datatype={
		"match":/^(.+?)(\d+)-(\d+)$/,
		"*":/.+/,
		"*6-16":/^.{6,16}$/,
		"n":/^\d+$/,
		"n6-16":/^\d{6,16}$/,
		"s":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/m,
		"s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,
		"p":/^[0-9]{6}$/,
		"mobile":/^1[0-9]{10}$/,
		"email":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"url":/^(\w+:\/\/)?\w+(\.\w+)+$/,
		"card":/^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}?$/,
		"nember":/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
		"nce":/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
		"letter":/^[A-Za-z]+$/,
		"letternember":/^[A-Za-z0-9]+$/,
		"tell":/([0-9]{3,4}-)?[0-9]{7,8}$/,
		"tellormobile":/^([0-9]{3,4}-)?[0-9]{7,8}$|(1[0-9]{10})$/,
		"date":/^\d{4}-\d{1,2}-\d{1,2}/,
		"datetime":/^(((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d)$/,
		"time":/^((20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d)$/,
		"realnumber":/^[-+]?\d+(\.\d+)?$/,
		"realnumberup":/^\d+(\.\d+)?$/,
		"realnumberdown":/^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
		"integer":/^-?\d+$/,
		"positiveinteger":/^\d+$/,
		"negtiveinteger":/^\-[1-9][0-9]*$/,
		"float":/^(-?\d+)(\.\d+)?$/,
		"floatup":/^\d+(\.\d+)?$/,
		"floatdown":/^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
		"16number":/^[A-Fa-f0-9]+$/,
		"pwd":/^[0-9a-zA-Z!@#$%&~^\+\-*_.><?/:;|]{6,16}$/,
		"nce":/^[\u4E00-\u9FA5A-Za-z0-9!@#$%&~^\+\-*_.><?/:;|]+$/,
		"ip":/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
		"licensePlate":/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
		"port":/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
		"longitude":/^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,17})?)|180(([.][0]{1,17})?))$/,
		"latitude":/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,17})?)|90(([.][0]{1,17})?))$/,
};
})(jQuery);