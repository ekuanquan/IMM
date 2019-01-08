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
import com.znyw.service.CarloadService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultJson;

@Controller
@RequestMapping("/CarloadCtrl")
public class CarloadCtrl {
	
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	CarloadService carload;
	
	/**
	 * 周亚鹏组校车管理系统 获取车载设备分组
	 * 
	 * @return
	 */
	@RequestMapping("/QueryTerGroup")
	@ResponseBody
	public JSONObject QueryTerGroup() {
		try {
			JSONObject result = carload.queryTerGroup();
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 周亚鹏组校车管理系统 根据角色编号和分组ID获取用户可以查看的组内车载设备
	 */
	@RequestMapping("/QueryCarloadInfo")
	@ResponseBody
	public JSONObject QueryCarloadInfo(HttpServletRequest request,HttpServletResponse response
			,@ModelAttribute("json") String json){
		JSONObject jsonParam = null;
		JSONObject result = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			result = carload.QueryCarloadInfoSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 周亚鹏组校车管理系统 获取车载摄像机设备
	 */
	@RequestMapping("/QueryCamerInfo")
	@ResponseBody
	public JSONObject QueryCamerInfo(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){		
		JSONObject jsonParam = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			return carload.QueryCamerInfoSer(jsonParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 添加车载设备
	 */
	@RequestMapping("/AddCarloadInfo")
	@ResponseBody
	public JSONObject AddCarloadInfo(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){
		JSONObject jsonParam = HttpTool.readJSONParam(request);
		try {
			if(!jsonParam.containsKey("dataFrom")||"".equals(jsonParam.get("dataFrom"))){
				jsonParam.put("dataFrom", ConfigUtil.getPlatformId());
			}
			return carload.AddCarloadInfoSer(jsonParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 删除车载设备
	 */
	@RequestMapping("/DeelCarloadInfo")
	@ResponseBody
	public JSONObject DeelCarloadInfo(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json) {
		JSONObject jsonParam = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			return carload.DeelCarloadInfoSer(jsonParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 周亚鹏组校车管理系统 根据角色编号，查询车载设备列表
	 */
	@RequestMapping("/QueryDevIdOrderByRoleId")
	@ResponseBody
	public JSONObject QueryDevIdOrderByRoleId(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){
		JSONObject jsonParam = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			return carload.QueryDevIdOrderByRoleIdSer(jsonParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 修改车载设备
	 */
	@RequestMapping("/UpdateCarloadInfo")
	@ResponseBody
	public JSONObject UpdateCarloadInfo(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){
		JSONObject jsonParam = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			return carload.UpdateCarloadInfoSer(jsonParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 查询终端类型列表
	 * 
	 * @return
	 */
	@RequestMapping("/QueryTertype")
	@ResponseBody
	public JSONObject QueryTertype(){
			return carload.QueryTertypeSer();
	}
	
	/**
	 * 查询车牌颜色列表
	 * 
	 * @return
	 */
	@RequestMapping("/QueryPlateColor")
	@ResponseBody
	public JSONObject QueryPlateColor(){
		try {
			JSONObject result = carload.QueryPlateColorSer();
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 查询车载设备详细信息
	 * 
	 * @return
	 */
	@RequestMapping("/QueryCarload")
	@ResponseBody
	public JSONObject QueryCarload(HttpServletRequest request,HttpServletResponse response){
		JSONObject jsonParam = null;
		try {
			jsonParam = HttpTool.readJSONParam(request);
			JSONObject result = carload.QueryCarloadSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 查询车载设备信息列表
	 * 
	 * @return
	 */
	@RequestMapping("/QueryCarloadList")
	@ResponseBody
	public JSONObject QueryCarloadList(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			JSONObject queryTond = jsonParam.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			if (areaId.equals(ConfigUtil.getRoot())) {
				String userId = GetSysInfoUtil.getUserId(request);
				JSONObject resultAll = carload.QueryCarloadListSerAll(
						jsonParam, userId); // 查询所有设备
				return resultAll;
			}
			JSONObject result = carload.QueryCarloadListSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
	
	/**
	 * 根据车牌号码获取车辆分组列表
	 * 
	 * @return
	 */
	@RequestMapping("/QueryCarGroup")
	@ResponseBody
	public JSONObject QueryCarGroup(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("json") String json){
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			JSONObject result = carload.QueryCarGroupSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}
}