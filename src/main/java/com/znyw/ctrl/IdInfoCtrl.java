package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.IdInfoService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultJson;

/**
 * 本类提供对编号表的操作的对外接口
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/identifier")
public class IdInfoCtrl {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(IdInfoCtrl.class);
	@Resource
	private IdInfoService idInfoService;

	/**
	 * 获取最新可用的编号
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/queryLatestId")
	@ResponseBody
	public JSONObject queryLatestId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			return idInfoService.queryLatestId();
		} catch (Exception e) {
			LOGGER.error("queryLatestId error:{},{}", e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 获取最新可用的编号
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/queryIdByLike")
	@ResponseBody
	public JSONObject queryIdByLike(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String value = jsonParam.getString("value");
			String type = jsonParam.getString("type");
			return idInfoService.queryIdByLike(value, type);
		} catch (Exception e) {
			LOGGER.warn("queryIdByLike error:{},{}", e.getMessage(), e);
			JSONObject message = new JSONObject();
			JSONObject errorResult = new JSONObject();
			errorResult.put("message", e.getMessage());
			errorResult.put("code", 201);
			message.put("result", errorResult);
			return message;
		}
	}
}
