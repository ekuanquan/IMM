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
import com.znyw.service.IMMForwardingService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultJson;

/**
 * 这是给转发机制服务器的接口 By lc
 */

@Controller
@RequestMapping("/Forwarding")
public class IMMForwardingCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	IMMForwardingService iMMForwardingService;

	/**
	 * 根据用户名、防区编号查询事件配置数据
	 * 
	 * @param
	 */

	@RequestMapping("/getEvtSetting")
	@ResponseBody
	public JSONObject getEvtSetting(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = jsonParam.getString("userId");
			String ZoneCHFlag = jsonParam.getString("ZoneCHFlag");
			String ZoneCHValue = jsonParam.getString("ZoneCHValue");
			JSONObject josn = iMMForwardingService.getEvtSettingService(userId,
					ZoneCHFlag, ZoneCHValue);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 根据摄像机id查询播放串
	 * 
	 * @param
	 */

	@RequestMapping("/getUrl")
	@ResponseBody
	public JSONObject getUrl(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String cameraId = jsonParam.getString("cameraId");
			JSONObject josn = iMMForwardingService.getUrlService(cameraId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 返回录像时长
	 * 
	 * @param
	 */

	@RequestMapping("/getTimeLength")
	@ResponseBody
	public JSONObject getTimeLength(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject josn = iMMForwardingService.getTimeLengthService();
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 返回是否启动录像
	 * 
	 * @param
	 */

	@RequestMapping("/getIsRecordShoot")
	@ResponseBody
	public JSONObject getIsRecordShoot(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject josn = iMMForwardingService.getIsRecordShootService();
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 返回系统设置的联动事件类型
	 * 
	 * @param
	 */

	@RequestMapping("/getLinkage")
	@ResponseBody
	public JSONObject getLinkage(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject josn = iMMForwardingService.getLinkageService();
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 根据用户id和电话id返回电话号码
	 * 
	 * @param
	 */

	@RequestMapping("/getMobile")
	@ResponseBody
	public JSONObject getMobile(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = jsonParam.getString("userId");
			String contId = jsonParam.getString("contId");
			JSONObject josn = iMMForwardingService.getMobileService(userId,
					contId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

}
