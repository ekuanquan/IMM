package com.znyw.ctrl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.AbstractCasFilter;
import org.jasig.cas.client.validation.Assertion;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/openLoad")
public class OpenLoad {
	private static final Logger LOGGER = org.slf4j.LoggerFactory
			.getLogger(OpenLoad.class);

	@Resource
	private RoleAreaService roleAreaService;

	// 获取登录用户名与登录时间
	@RequestMapping("/getLoginUserNameAndTime")
	@ResponseBody
	public JSONObject getLoginUserName(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		JSONObject userInfoJson = null;
		try {
			String sysuserID = GetSysInfoUtil.getUserName(request);
			String loginTime = GetSysInfoUtil.getSysTime(request);
			String userId = GetSysInfoUtil.getUserId(request);
			/* String userId = GetSysInfoUtil.get */
			userInfoJson = new JSONObject();
			userInfoJson.put("sysuserID", sysuserID);
			userInfoJson.put("loginTime", loginTime);
			userInfoJson.put("userId", userId);
			userInfoJson.put("roleinfo",
					roleAreaService.getRoleInfoByUserId(userInfoJson));
			return userInfoJson;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}

	}

	// 退出登录
	@RequestMapping("/exitSystem")
	@ResponseBody
	public ResponseEntity<String> exitSystem(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		ResultPojo result = new ResultPojo();
		try {
			request.getSession(true).invalidate();
			result.setResult("200", "success");
		} catch (Exception e) {
			result.setResult("400", "fail");
			result.setPojo("userInfo", null);
			result.setPojo("detail", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}

	/*
	 * 获取当前登陆用户信息
	 */
	@RequestMapping("HeartBeat")
	@ResponseBody
	public JSONObject HeartBeat(HttpServletRequest request,
			HttpServletResponse response) {
		String UserName = null, SysTime = null;
		JSONObject jsonObject = new JSONObject();
		try {
			Assertion assertion = (Assertion) request.getSession()
					.getAttribute(AbstractCasFilter.CONST_CAS_ASSERTION);
			if (null != assertion) {
				AttributePrincipal principal = assertion.getPrincipal();
				if (null != principal) {
					UserName = principal.getName();
					Map<String, Object> attributes = principal.getAttributes();
					Object loginTime = attributes.get("loginTime");
					if (loginTime != null) {
						SysTime = loginTime.toString();
					}
				}
			}
			jsonObject.put("UserName", UserName);
			jsonObject.put("SysTime", SysTime);
			return jsonObject;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}
}
