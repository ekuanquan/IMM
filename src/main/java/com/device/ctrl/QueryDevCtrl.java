package com.device.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.device.service.IQueryDevService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/")
public class QueryDevCtrl {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource
	IQueryDevService iQueryDevService;

	/**
	 * 查询报警主机列表
	 */
	@ResponseBody
	@RequestMapping("QueryAlarmhostList")
	public JSONObject QueryAlarmhostList(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		Pagepojo pageInfoPojo = JSON.parseObject(jsonParam.getString("pageInfoPojo"), Pagepojo.class);
		pageInfoPojo.setOrderBy(jsonParam.getJSONObject("pageInfoPojo").getString("sort"));
		JSONObject queryTond = JSONObject.parseObject(jsonParam.getString("queryTond"));
		String userId = GetSysInfoUtil.getUserId(request);

		JSONObject result = iQueryDevService.queryAlarmhostList(pageInfoPojo, queryTond, userId);

		return result;
	}

	/**
	 * 根据设备id、设备防区id查询报警主机设备防区详细信息
	 */
	@ResponseBody
	@RequestMapping("QueryAlarmhostZoneInfo")
	public JSONObject QueryAlarmhostZoneInfo(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryAlarmhostZoneInfo(jsonParam);
	}

	/**
	 * 根据设备id查询报警主机设备防区列表
	 */
	@ResponseBody
	@RequestMapping("QueryAlarmhostZoneList")
	public JSONObject QueryAlarmhostZoneList(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryAlarmhostZoneList(jsonParam);
	}

	/**
	 * 根据设备id查询报警主句详细信息
	 */
	@ResponseBody
	@RequestMapping("QueryAlarmhostInfo")
	public JSONObject QueryAlarmhostInfo(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryAlarmhostInfo(jsonParam);
	}

	/**
	 * 根据设备id查询nvr有线详细信息
	 */
	@ResponseBody
	@RequestMapping("QueryWirenvrInfo")
	public JSONObject QueryWirenvrInfo(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryWirenvrInfo(jsonParam);
	}

	/**
	 * 根据设备id查询互联网NVR详细信息
	 */
	@ResponseBody
	@RequestMapping("QueryNetnvrInfo")
	public JSONObject QueryNetnvrInfo(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryNetnvrInfo(jsonParam);
	}

	/**
	 * 根据设备id查询NVR摄像机列表
	 */
	@ResponseBody
	@RequestMapping("QueryCameraList")
	public JSONObject QueryCameraList(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryCameraList(jsonParam);
	}

	/**
	 * 根据NVR和通道号查询设备Id
	 */
	@ResponseBody
	@RequestMapping("QueryDeviceIdByNVR")
	public JSONObject QueryIdByNVR(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryDeviceId(jsonParam);
	}

	/**
	 * 根据摄像机id查询摄像机详细信息
	 */
	@ResponseBody
	@RequestMapping("QueryCameraInfo")
	public JSONObject QueryCameraInfo(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return iQueryDevService.queryCameraInfo(jsonParam);
	}


	/**
	 * 查询警情类型表
	 */
	@ResponseBody
	@RequestMapping("QueryAlmtypeList")
	public JSONObject QueryCameraUrl(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.queryAlmtypeList();
	}

	/**
	 * 查询反应类型表
	 */
	@ResponseBody
	@RequestMapping("QueryWanttoList")
	public JSONObject QueryWanttoList(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.queryWanttoList();
	}

	/**
	 * 查询摄像机型号表
	 */
	@ResponseBody
	@RequestMapping("QueryCameraLists")
	public JSONObject QueryCameraLists(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.queryCameraModelList();
	}

	/**
	 * 查询摄像机类型表
	 */
	@ResponseBody
	@RequestMapping("queryCameraTypeList")
	public JSONObject queryCameraTypeList(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.queryCameraTypeList();
	}

	/**
	 * 根据指定id 【cameraType】 获取对应摄像机信息
	 */
	@ResponseBody
	@RequestMapping("queryCameraTypeById")
	public JSONObject queryCameraTypeById(HttpServletRequest request, HttpServletResponse response) {

		String stringParam = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSON.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		String cameraType = json.getString("cameraType");
		return iQueryDevService.queryCameraTypeById(cameraType);
	}

	/**
	 * 查询探测器型号表
	 */
	@ResponseBody
	@RequestMapping("QuerySnmodelList")
	public JSONObject QuerySnmodelList(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.querySnmodelList();
	}

	/**
	 * 查询探测器类型表
	 */
	@ResponseBody
	@RequestMapping("QuerySntypeList")
	public JSONObject QuerySntypeList(HttpServletRequest request, HttpServletResponse response) {
		return iQueryDevService.querySntypeList();
	}
}