function isEmpty(field,type){
	var textValue = $("#"+field).val();
	if(textValue != ""){
		if( type== "1" ){
			var reg1 = "^([A-Z]|[a-z]|[0-9]){2,18}$";
			if(!textValue.match(reg1)){
				alert("请输入2-18位的字母和数字。");
				$("#"+field).focus();
			}else{
				post_async(
						{
							"validateName":"userAccount",
							"validateValue":textValue
						},
						"../../../../../validate/isCanUse.do",
						 validate_callback,field);
			}
		}
		if( type=="2" ){
			var reg = "^([A-Z]|[a-z]|[0-9]){4,9}$";
			if(!textValue.match(reg)){
				alert("请输入4-9位的字母和数字。");
				$("#"+field).focus();
				return;
			}else{
				post_async(
						{
							"validateName":"userId",
							"validateValue":textValue
						},
						"../../../../../validate/isCanUse.do",
						 validate_callback,field);
			}
		}
	}
	else{
		
	}
}
function validate_callback(data,field){
	if(data.result.code == 0){
		
	}else{
		if(field == "userAccount"){
			//alert("该用户账号已经存在。");
            _global.top.alertTip("该用户账号已经存在",0,null);
			$("#"+field).focus();
		}
		if(field == "userId"){
			//alert("该用户编号已经存在。");
            _global.top.alertTip("该用户账号已经存在",0,null);
			$("#"+field).focus();
		}
	}
}
function validatePwd(){
	var pwd = $("#userPwd").val();
	var reg = "^([A-Z]|[a-z]|[0-9]|[_]){6,16}$";
	if(pwd != ""){
		if(!pwd.match(reg)){
			alert("请输入数字、字母、_组成的6-16位密码。");
			$("#userPwd").focus();
		}else{
			
		}
	}else{
		
	}
}
function validatePhone(field){
	var validateValue = $("#"+field).val();
	var mobieReg = "^1[3|4|5|7|8][0-9]{9}$";
	var telphoneReg = "^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$";
	if(validateValue!=""){
		if(validateValue.match(mobieReg) || validateValue.match(telphoneReg)){
			
		}else{
			if(field == "cHmPhone"){
				alert("请输入正确的电话。");
				$("#cHmPhone").focus();
			}
			if(field == "cMobile"){
				alert("请输入正确的手机。");
				$("#cMobile").focus();
			}
			if(field == "cPhone"){
				alert("请输入正确的电话。");
				$("#cPhone").focus();
			}
		}
	}else{
		
	}
}