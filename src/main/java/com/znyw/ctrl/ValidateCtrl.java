package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.ValidateService;
import com.znyw.tool.HttpTool;

@Controller()
@RequestMapping("/validate")
public class ValidateCtrl {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(ValidateCtrl.class);

	@Resource
	private ValidateService validateService;

	@RequestMapping("/isCanUse")
	// 判断userId 是否可以作为主键插入数据库 是否重复
	@ResponseBody
	public ResponseEntity<String> isCanUse(HttpServletRequest request,
			HttpServletResponse response) {

		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String validateName = json.getString("validateName");
			String validateValue = json.getString("validateValue");
			ResultPojo result = validateService.isCanUse(validateName,
					validateValue);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}

	}

}
