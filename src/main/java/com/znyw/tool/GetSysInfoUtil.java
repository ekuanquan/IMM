package com.znyw.tool;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.AbstractCasFilter;
import org.jasig.cas.client.validation.Assertion;

public class GetSysInfoUtil {
	
	/************************************
	 * @desc 获取登录的用户名 ****
	 * @time 2016-8-12 08:55:54 ahao****
	 * @return String userName ****
	 * ********************************/
	public static String getUserName(HttpServletRequest request){
	    Assertion assertion = (Assertion) request.getSession().getAttribute(
	    		AbstractCasFilter.CONST_CAS_ASSERTION);
	    String userName = null;
		if (null != assertion) {
			AttributePrincipal principal = assertion.getPrincipal();
			if (null != principal) {
				userName = principal.getName();
			}
		}
		return userName;
	}
	
	/************************************
	 * @desc 获取登录的时间 ****
	 * @time 2016-8-12 08:56:12 ahao****
	 * @return String sysTime ****
	 * ********************************/
	public static String getSysTime(HttpServletRequest request){
	    Assertion assertion = (Assertion) request.getSession().getAttribute(
	    		AbstractCasFilter.CONST_CAS_ASSERTION);
	    String sysTime = null;
	    if (null != assertion) {
			AttributePrincipal principal = assertion.getPrincipal();
			Map<String, Object> attributes = principal.getAttributes();
			Object loginTime = attributes.get("loginTime");
			if (loginTime != null) {
				sysTime = loginTime.toString();
			}

		}
		return sysTime;
	}
	
	/************************************
	 * @desc 获取登录的用户编号 ****
	 * @time 2016-8-12 08:55:54 ahao****
	 * @return String userId ****
	 * ********************************/
	public static String getUserId(HttpServletRequest request){
		    Assertion assertion = (Assertion) request.getSession().getAttribute(
		    		AbstractCasFilter.CONST_CAS_ASSERTION);
		    String userId = null;
		    if (null != assertion) {
				AttributePrincipal principal = assertion.getPrincipal();
				Map<String, Object> attributes = principal.getAttributes();
				Object loginUserId = attributes.get("userId");
				if (loginUserId != null) {
					userId = loginUserId.toString();
				}
			}
		return userId;
		}
	
	/************************************
	 * @desc 获取登录的用户所属区域 ****
	 * @time 2016-8-12 08:55:54 ahao****
	 * @return String userId ****
	 * ********************************/
	public static String getAreaId(HttpServletRequest request){
		    Assertion assertion = (Assertion) request.getSession().getAttribute(
		    		AbstractCasFilter.CONST_CAS_ASSERTION);
		    String areaId = null;
		    if (null != assertion) {
				AttributePrincipal principal = assertion.getPrincipal();
				Map<String, Object> attributes = principal.getAttributes();
				Object loginAreaId = attributes.get("areaId");
				if (loginAreaId != null) {
					areaId = loginAreaId.toString();
				}
			}
			return areaId;
		}
}
