package com.znyw.ctrl;

/**
 * 系统配置相关操作
 */
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
import com.znyw.pojo.SystemConfigPojo;
import com.znyw.service.SystemConfigService;
import com.znyw.tool.HttpTool;

@Controller
@RequestMapping("/systemConfig")
public class SystemConfigCtrl {
	private static Logger LOGGER = LoggerFactory
			.getLogger(SystemConfigCtrl.class);

	@Resource
	SystemConfigService systemConfigService;

	@RequestMapping("/getSystemConfig")
	// 获取系统配置
	@ResponseBody
	public ResponseEntity<String> getSystemConfig(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String types = json.getString("types");
			ResultPojo result = systemConfigService.getSystemConfig(types);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/updateSystemConfig")
	// 修改联动的事件类型
	@ResponseBody
	public ResponseEntity<String> updateSystemConfig(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String systemConfig = json.getString("systemConfig");
			SystemConfigPojo pojo = JSONObject.parseObject(systemConfig,
					SystemConfigPojo.class);
			ResultPojo result = systemConfigService.updateSystemConfig(pojo);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}
}
