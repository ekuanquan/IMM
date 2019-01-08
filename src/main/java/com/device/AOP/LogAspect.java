package com.device.AOP;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;
import javax.jms.Destination;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.device.service.IProducerService;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.ResultPojo;

@Aspect  //该注解标示该类为切面类 
@Component   //注入依赖
public class LogAspect {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	private static final SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 日期转换
	@Resource
	Destination logSendLogDestination;
	@Resource
	IProducerService iProducerService;
	@Resource
	JmsTemplate logJMSTemplate;
		   
    //标注该方法体为后置通知，当目标方法执行成功后执行该方法体
    @AfterReturning(returning="rvt",pointcut="within(com..*) && @annotation(rl)")
    public void suc(JoinPoint jp, LogAnnotation rl,Object rvt){  
    	log.info("【LogAspect】 rvt={},rl={}",rvt,rl);
    	Date date = new Date();
		String strdate = formater.format(date).replace(" ", "T");
        Object[] parames = jp.getArgs();//目标方法体的参数
        String signature = jp.getSignature().toString();
        String methodName = signature.substring(signature.lastIndexOf(".")+1, signature.indexOf("("));  //获取目标方法名
        String whitelog = rl.whitelog();
        
        JSONObject jsonRvt = null;
        if(rvt instanceof JSONObject){
        	String strRvt = JSONObject.toJSONString(rvt);
        	jsonRvt = JSONObject.parseObject(strRvt);
        }else if(rvt instanceof ResultPojo){
        	jsonRvt = ((ResultPojo) rvt).getReturnVal();
        }else{
        	log.error("LogAspect rvt type err:{}:{}:rvt={}",strdate,methodName,rvt);
        }
        String code = jsonRvt.getString("code");
        if(code==null || "".equals(code)){
        	JSONObject result = jsonRvt.getJSONObject("result");
        	code = result.getString("code");
        }
        if(!whitelog.equals(code)){
        	log.error("LogAspect code err:{}:{}:code={},whitelog={}",strdate,methodName,code,whitelog);
        	return;
        }
 
        String userName = (String) parames[0];
	    String userId =(String) parames[1];
		JSONObject jsonParam = new JSONObject();
	    OperatorPojo objOperator = null;
	    String deluserId="",auserId="",state="",devId="";
	    if(parames[2] instanceof JSONObject){
	    	jsonParam = (JSONObject)parames[2];
	    }else if(parames[2] instanceof OwnerPojo){
	    	OwnerPojo objOwner = (OwnerPojo)parames[2];
	    	String str = JSONObject.toJSONString(objOwner);
	    	jsonParam = JSONObject.parseObject(str);
	    }else if(parames[2] instanceof OperatorPojo){
	    	objOperator = (OperatorPojo)parames[2];
	    }else if(parames[2] instanceof String){
	    	deluserId = (String)parames[2];
	    }
	    String operationContent="";
	    StringBuffer stringBuffer = new StringBuffer();
	    switch(methodName){
	    case "addAlarmhostService":
	    	state = "addDevHost";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("添加报警主机<设备编号").append(jsonParam.getString("devId")).append(">信息为(")
	    			.append(this.alarmhostContent(jsonParam)).toString();
	    	break;
	    case "modifyAlarmhost":
	    	state = "editDevHost";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("修改报警主机<设备编号").append(jsonParam.getString("devId")).append(">的信息为(")
	    			.append(this.alarmhostContent(jsonParam)).toString();
	    	break;
	    case "delAlarmhost":
	    	state = "delDevHost";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("删除报警主机<设备编号").append(jsonParam.getString("devId")).append(">").toString();
	    	break;
	    case "addService":
	    	state = "addDevCableNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("添加有线NVR<设备编号").append(jsonParam.getString("devId")).append(">信息为(")
	    			.append(this.wirenvrContent(jsonParam)).toString();
	    	break;
	    case "modifyWirenvr":
	    	state = "editDevCableNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("修改有线NVR<设备编号").append(jsonParam.getString("devId")).append(">的信息为(")
	    			.append(this.wirenvrContent(jsonParam)).toString();
	    	break;
	    case "delWirenvr":
	    	state = "delDevCableNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("删除有线NVR<设备编号").append(jsonParam.getString("devId")).append(">").toString();
	    	break;
	    case "addNVRnoService":
	    	state = "addDevInternetNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("添加互联网NVR<设备编号").append(jsonParam.getString("devId")).append(">信息为(")
	    			.append(this.netnvrContent(jsonParam)).toString();
			break;
	    case "modifyNetnvr":
	    	state = "editDevInternetNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("修改互联网NVR<设备编号").append(jsonParam.getString("devId")).append(">的信息为(")
	    			.append(this.netnvrContent(jsonParam)).toString();
	    	break;
	    case "delNetnvr":
	    	state = "delDevInternetNVR";
	    	devId = jsonParam.getString("devId");
	    	operationContent=stringBuffer.append("删除互联网NVR<设备编号").append(jsonParam.getString("devId")).append(">").toString();
	    	break;
	    case "addUserInfo":
	    	state = "addUserHost";
	    	auserId=jsonParam.getString("userId");
	    	operationContent=stringBuffer.append("添加机主<用户编号").append(jsonParam.getString("userId")).append(">信息为(")
	    			.append(this.userContent(jsonParam)).toString();
	    	break;
	    case "updateUserInfo":
	    	state = "editUserHost";
	    	auserId=jsonParam.getString("userId");
	    	operationContent=stringBuffer.append("修改机主<用户编号").append(jsonParam.getString("userId")).append(">的信息为(")
			    	.append(this.userContent(jsonParam)).toString();
			break;
	    case "delOwnerUserInfo":
	    	state = "delUserHost";
	    	//auserId=jsonParam.getString("userId");
	    	auserId = deluserId;
	    	operationContent=stringBuffer.append("删除机主<用户编号").append(deluserId).append(">").toString();
	    	break;
	    case "addGeneralUserInfo":
	    	state = "addUserGeneral";
	    	auserId=jsonParam.getString("userId");
	    	operationContent=stringBuffer.append("添加普通用户<用户编号").append(jsonParam.getString("userId")).append(">信息为(")
	    			.append(this.userContent(jsonParam)).toString();
	    	break;
	    case "updateGeneralUserInfo":
	    	state = "editUserGeneral";
	    	auserId=jsonParam.getString("userId");
	    	operationContent=stringBuffer.append("修改普通用户<用户编号").append(jsonParam.getString("userId")).append(">的信息为(")
			    	.append(this.userContent(jsonParam)).toString();
			break;
	    case "delGeneralUserInfo":
	    	state = "delUserGeneral";
	    	//auserId=jsonParam.getString("userId");
	    	auserId = deluserId;
	    	operationContent=stringBuffer.append("删除普通用户<用户编号").append(deluserId).append(">").toString();
	    	break;
	    case "addOperatorUserInfo":
	    	state = "addUserOperator";
	    	//auserId=jsonParam.getString("userId");
	    	auserId=objOperator.getUserId();
	    	operationContent=stringBuffer.append("添加操作员<用户编号").append(objOperator.getUserId()).append(">信息为(")
	    			.append(this.operatorUserContent(objOperator)).toString();
	    	break;
	    case "updateOperatorUserInfo":
	    	state = "editUserOperator";
	    	//auserId=jsonParam.getString("userId");
	    	auserId=objOperator.getUserId();
	    	operationContent=stringBuffer.append("修改操作员<用户编号").append(objOperator.getUserId()).append(">的信息为(")
			    	.append(this.operatorUserContent(objOperator)).toString();
			break;
	    case "delOperatorUserInfo":
	    	state = "delUserOperator";
	    	//auserId=jsonParam.getString("userId");
	    	auserId = deluserId;
	    	operationContent=stringBuffer.append("删除操作员<用户编号").append(deluserId).append(">").toString();
	    	break;

		case "modifyOwnerId":

			state = "editUserHost";
			// 被修改人
			auserId = jsonParam.getString("newUserId");
			operationContent = String.format("操作员 %s 修改机主编号 %s 为 %s", userId, jsonParam.getString("oldUserId"),
					auserId);
			
			break;
	    }
	    JSONObject jsonSend = new JSONObject();
	    jsonSend.put("auserId", auserId);
	    jsonSend.put("userName", userName);
	    jsonSend.put("userId", userId);
	    jsonSend.put("operationContent", operationContent);
	    jsonSend.put("strdate", strdate);	
	    jsonSend.put("state", state);
	    jsonSend.put("devId", devId);
	    iProducerService.sendMessage(logSendLogDestination, jsonSend.toString(),logJMSTemplate);
    } 
   
    private String alarmhostContent(JSONObject jsonParam){
    	StringBuffer stringBuffer = new StringBuffer();
    	String content=stringBuffer.append("设备名称:").append(jsonParam.getString("devName"))
    			.append(";设备关联编号:").append(jsonParam.getString("pnlActID"))
    			.append(";设备所属区域编号:").append(jsonParam.getString("areaId"))
    			.append(";设备类型编号:").append(jsonParam.getString("devType"))
    			.append(";设备型号编号:").append(jsonParam.getString("devModelId"))
    			.append(";设备安装员:").append(jsonParam.getString("instMan"))
    			.append(";设备安装时间:").append(jsonParam.getString("devInstDate"))
    			.append(";设备经度:").append(jsonParam.getString("devLng"))
    			.append(";设备纬度:").append(jsonParam.getString("devlat"))
    			.append(";设备位置:").append(jsonParam.getString("pnlAddr"))
    			.append(";设备安装单位:").append(jsonParam.getString("instUnit"))
    			.append(";备注:").append(jsonParam.getString("fMemo"))
    			.append(";电话位置:").append(jsonParam.getString("telAddr"))
    			.append(";联网电话:").append(jsonParam.getString("pnlTel"))
    			.append(";键盘位置:").append(jsonParam.getString("keyboardAddr"))
    			.append(";电源位置:").append(jsonParam.getString("pnlPowerAddr"))
    			.append(";无线卡号:").append(jsonParam.getString("pnlHdTel"))
    			.append(";回控码:").append(jsonParam.getString("RegexPWD"))	    		    			
    			.append(")").toString();
    	return content;
    }
    
    private String wirenvrContent(JSONObject jsonParam){
    	StringBuffer stringBuffer = new StringBuffer();
    	String content=stringBuffer.append("设备名称:").append(jsonParam.getString("devName"))
    			.append(";设备关联编号:").append(jsonParam.getString("pnlActID"))
    			.append(";设备所属区域编号:").append(jsonParam.getString("areaId"))
    			.append(";设备类型编号:").append(jsonParam.getString("devType"))
    			.append(";设备型号编号:").append(jsonParam.getString("devModelId"))
    			.append(";设备安装员:").append(jsonParam.getString("instMan"))
    			.append(";设备安装时间:").append(jsonParam.getString("devInstDate"))
    			.append(";设备经度:").append(jsonParam.getString("devLng"))
    			.append(";设备纬度:").append(jsonParam.getString("devlat"))
    			.append(";设备位置:").append(jsonParam.getString("pnlAddr"))
    			.append(";设备安装单位:").append(jsonParam.getString("instUnit"))
    			.append(";备注:").append(jsonParam.getString("fMemo"))
    			.append(";设备登录用户名:").append(jsonParam.getString("devLoginName"))
    			.append(";设备登录密码:").append(jsonParam.getString("devLoginPwd"))
    			.append(";设备IP:").append(jsonParam.getString("devIp"))
    			.append(";流转服务:").append(jsonParam.getString("videoServer"))
    			.append(";设备端口:").append(jsonParam.getString("devPort"))	    		    			
    			.append(")").toString();
    	return content;
    }
    
    private String netnvrContent(JSONObject jsonParam){
    	StringBuffer stringBuffer = new StringBuffer();
    	String content=stringBuffer.append("设备名称:").append(jsonParam.getString("devName"))
    			.append(";设备关联编号:").append(jsonParam.getString("pnlActID"))
    			.append(";设备所属区域编号:").append(jsonParam.getString("areaId"))
    			.append(";设备类型编号:").append(jsonParam.getString("devType"))
    			.append(";设备型号编号:").append(jsonParam.getString("devModelId"))
    			.append(";设备安装员:").append(jsonParam.getString("instMan"))
    			.append(";设备安装时间:").append(jsonParam.getString("devInstDate"))
    			.append(";设备经度:").append(jsonParam.getString("devLng"))
    			.append(";设备纬度:").append(jsonParam.getString("devlat"))
    			.append(";设备位置:").append(jsonParam.getString("pnlAddr"))
    			.append(";设备安装单位:").append(jsonParam.getString("instUnit"))
    			.append(";备注:").append(jsonParam.getString("fMemo"))
    			.append(";设备登录用户名:").append(jsonParam.getString("devLoginName"))
    			.append(";设备登录密码:").append(jsonParam.getString("devLoginPwd"))
    			.append(";tutkID:").append(jsonParam.getString("devTUTKID"))
    			.append(";流转服务:").append(jsonParam.getString("videoServer"))   		    			
    			.append(")").toString();
    	return content;
    }
    
    private String userContent(JSONObject jsonParam){
    	StringBuffer stringBuffer = new StringBuffer();
    	String content=stringBuffer.append("用户帐号:").append(jsonParam.getString("userAccount"))
				.append(";用户名称:").append(jsonParam.getString("userName"))
				.append(";用户密码:").append(jsonParam.getString("userPwd"))
				.append(";创建日期:").append(jsonParam.getString("createDate"))
				.append(";用户类型:").append(jsonParam.getString("userType"))
				.append(";用户地址:").append(jsonParam.getString("userAddr"))
				.append(";用户属性:").append(jsonParam.getString("userProperty"))
				.append(";用户行业id:").append(jsonParam.getString("businessId"))
				.append(";用户行业名称:").append(jsonParam.getString("businessName"))
				.append(";所属分中心id:").append(jsonParam.getString("centerId"))
				.append(";所属分中心（名称）:").append(jsonParam.getString("centerName"))
				.append(";口令:").append(jsonParam.getString("payNO"))
				.append(";用户服务类型:").append(jsonParam.getString("userServerType"))
				.append(";用户服务类型名称:").append(jsonParam.getString("userServerTypeName"))
				.append(";单位负责人:").append(jsonParam.getString("contact"))
				.append(";负责人口令:").append(jsonParam.getString("contactPayNO"))
				.append(";负责人家庭电话:").append(jsonParam.getString("cHmPhone"))
				.append(";负责人电话:").append(jsonParam.getString("cPhone"))
				.append(";负责人手机:").append(jsonParam.getString("cMobile"))
				.append(";定期撤布防用户:").append(jsonParam.getString("nomRpt"))
				.append(";定期测试用户:").append(jsonParam.getString("engageTest"))
				.append(";紧急按钮用户:").append(jsonParam.getString("nomTest"))
				.append(";短信转发:").append(jsonParam.getString("isVideoCheck"))
				.append(";区域id:").append(jsonParam.getString("areaId"))
				.append(";区域名称:").append(jsonParam.getString("areaName"))
				.append(";投保:").append(jsonParam.getString("isInsurance"))
				.append(";是否来电正常:").append(jsonParam.getString("hasBak"))
				.append(";缴费状态:").append(jsonParam.getString("isPay"))
				.append(";处警等级:").append(jsonParam.getString("usrAlmType"))
				.append(";处警注释:").append(jsonParam.getString("uMem"))
				.append(";录入人:").append(jsonParam.getString("operName"))
				.append(";暂停时间:").append(jsonParam.getString("define2"))
				.append(";故障提示:").append(jsonParam.getString("badMem"))
				.append(";道路标志:").append(jsonParam.getString("road"))
				.append(";布防时间:").append(jsonParam.getString("define3"))
				.append(";子行业:").append(jsonParam.getString("define1"))
				.append(";中心号:").append(jsonParam.getString("define6"))
				.append(";备注:").append(jsonParam.getString("fMemo"))
				.append(";备注4:").append(jsonParam.getString("define4"))
				.append(";安装日期:").append(jsonParam.getString("instDate"))
				.append(";入网日期:").append(jsonParam.getString("liveDate"))
				.append(";入网类型:").append(jsonParam.getString("pnlTelType"))
				.append(";角色Id:").append(jsonParam.getString("roleId"))
				.append(";用户级别:").append(jsonParam.getString("usrAlmType"))
				.append(")").toString();
    	return content;
    }
    
    private String operatorUserContent(OperatorPojo obj){
    	StringBuffer stringBuffer = new StringBuffer();
    	String content=stringBuffer.append("用户帐号:").append(obj.getUserAccount())
				.append(";用户名称:").append(obj.getUserName())
				.append(";用户密码:").append(obj.getUserPwd())
				.append(";创建日期:").append(obj.getCreateDate())
				.append(";用户类型:").append(obj.getUserType())
				.append(";所属分中心id:").append(obj.getCenterId())    
				.append(";所属分中心（名称）:").append(obj.getCenterName())   
				.append(";过期时间:").append(obj.getOverDateTime())
				.append(";操作员ip:").append(obj.getAcctIP())
				.append(";操作员性别:").append(obj.getSex())
				.append(";操作员电话:").append(obj.getTelephone())
				.append(";邮箱:").append(obj.getEmail())
				.append(";操作员学历:").append(obj.getEducation())
				.append(";操作员职务:").append(obj.getOffice())
				.append(";密码提示:").append(obj.getUserPWDhint())
				.append(";区域id:").append(obj.getAreaId())
				.append(";区域名称:").append(obj.getAreaName())
				.append(";订阅:").append(obj.getAcctDY())
				.append(";备注:").append(obj.getFMemo())
				.append(";角色Id:").append(obj.getRoleId())
				.append(")").toString();
    	return content;
    }
}