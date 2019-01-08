package com.device.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.device.service.IDeviceMonitorService;
import com.device.service.IQueryDevService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/DeviceMonitor/")
public class DeviceMonitorCtrl {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource
	private IDeviceMonitorService iDeviceMonitorService;
	@Resource
	IQueryDevService iQueryDevService;

	/**
	 * 根据用户ID以及设备名称查询设备列表
	 * 
	 * @param devName
	 *            设备名称(此参数可以不传，不传的时候表示获取全部的设备列表)
	 * @create 2017-6-21 11:59:14 ywzn081
	 */
	@ResponseBody
	@RequestMapping("GetDeviceListByUserId")
	public JSONObject getDeviceListByUserId(HttpServletRequest request) {
		JSONObject jsonParam = HttpTool.readJSONParam(request);
		return iDeviceMonitorService.getDeviceListByUserId(jsonParam);
	}

	/**
	 * 根据设备ID获取设备详细信息
	 * 
	 * @param deviceId
	 *            设备ID
	 * @create 2017-6-22 16:56:29 yqzn081
	 */
	@ResponseBody
	@RequestMapping("GetDeviceInfoById")
	public JSONObject getDeviceInfoById(HttpServletRequest request) {
		JSONObject jsonParam;
		try {
			jsonParam = HttpTool.readJSONParam(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());

		}
		return iDeviceMonitorService.getDeviceInfoById(jsonParam);
	}

	/**
	 * 根据设备ID获取设备播放串
	 * 
	 * @param deviceId
	 *            设备ID
	 * @create 2017-6-22 19:52:43 yqzn081
	 */
	@ResponseBody
	@RequestMapping("GetUrlByDeviceId")
	public JSONObject getUrlByDeviceId(HttpServletRequest request) {
		JSONObject jsonParam;
		try {
			jsonParam = HttpTool.readJSONParam(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iDeviceMonitorService.getUrlByDeviceId(jsonParam);
	}

	/**
	 * 根据多个设备ID获取多个设备的播放串
	 * 
	 * @param deviceIds
	 *            设备ID(字符串，设备ID之间用逗号区分)
	 * @create 2017-6-22 20:29:11 yqzn081
	 */
	@ResponseBody
	@RequestMapping("GetUrlListByDeviceIds")
	public JSONObject getUrlListByDeviceIds(HttpServletRequest request) {
		JSONObject jsonParam;
		try {
			jsonParam = HttpTool.readJSONParam(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iDeviceMonitorService.getUrlListByDeviceIds(jsonParam);
	}

	/**
	 * 根据摄像机id查询摄像机信息(用户名、密码、TUTK、通道)
	 */
	@ResponseBody
	@RequestMapping("QueryCameraInfoNew")
	public JSONObject QueryCameraInfoNew(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		JSONObject json = iQueryDevService.queryCameraInfo(jsonParam);

		JSONObject result = json.getJSONObject("result");
		String videoUrlSuf = result.getString("videoUrlSuf");
		result = new JSONObject();
		if (Objects.isNotNullString(videoUrlSuf)) {
			String str = videoUrlSuf.substring(videoUrlSuf.indexOf("/") + 1, videoUrlSuf.lastIndexOf("/"));
			String[] list = str.split(":");
			result.put("TUTK", list[0]);
			result.put("channelNo", list[4]);
			result.put("userName", list[5]);
			result.put("password", list[6]);
		} else {
			result.put("TUTK", "");
			result.put("channelNo", "");
			result.put("userName", "");
			result.put("password", "");
		}
		json.put("result", result);

		return json;
	}
}
