package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.UserService;

@Controller
@RequestMapping("/RDAcenterUserCtrl")
public class RDAcenterUserCtrl {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	private UserService userService;

	@RequestMapping("/getBasicUserInfoByUserId")
	@ResponseBody
	public JSONObject getBasicUserInfoByUserId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		ResultPojo resultPojo = null;
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String login = jsonParam.getString("login");// 联网报警登录用户编号
			String userId = jsonParam.getString("userId");
			resultPojo = userService.getBasicUserInfoByUserId(userId, login);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			resultPojo.setResult("1", "参数异常", e.getMessage());
		}
		return resultPojo.getReturnVal();
	}
}
