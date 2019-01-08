package com.znyw.ctrl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
public class GbCtrl {

	private final static Logger LOGER = LoggerFactory.getLogger(GbCtrl.class);

	@RequestMapping("/generateDeviceId")
	@ResponseBody
	public JSONObject generateDeviceId(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);

		try {
			String rspStr = HttpClientTool.postGeneratorGBID(
					"device/generateDeviceId.do", jsonStr);
			JSONObject json = JSON.parseObject(rspStr);

			return json;
		} catch (Exception e) {
			LOGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "系统错误", e.getMessage());
		}
	}
}
