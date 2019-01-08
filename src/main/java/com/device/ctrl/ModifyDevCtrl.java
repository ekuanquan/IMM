package com.device.ctrl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.service.IModifyDevService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;


@Controller
@RequestMapping("/")
public class ModifyDevCtrl {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource
	IModifyDevService iModifyDevService;
	
	 /**
     * 修改报警主机信息
     * */
    @ResponseBody
    @RequestMapping("ModifyAlarmhostattr")
    public JSONObject ModifyAlarmhostattr(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request);
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
	    if(userName==null){
			userName=jsonParam.getString("userName");
		}
		if(userId==null){
			userId=jsonParam.getString("userId");
		}
        return iModifyDevService.modifyAlarmhost(userName,userId,jsonParam);
    }
    
    /**
     * 修改有线NVR信息
     * */
    @ResponseBody
    @RequestMapping("ModifyWirenvrattr")
    public JSONObject ModifyWirenvrattr(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
		if(userName==null){
			userName=jsonParam.getString("userName");
		}
		if(userId==null){
			userId=jsonParam.getString("userId");
		}
        return iModifyDevService.modifyWirenvr(userName,userId,jsonParam);
    }
    
    /**
     * 修改互联网NVR信息
     * */
    @ResponseBody
    @RequestMapping("ModifyNetnvrattr")
    public JSONObject ModifyNetnvrattr(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
		if(userName==null){
			userName=jsonParam.getString("userName");
		}
		if(userId==null){
			userId=jsonParam.getString("userId");
		}
        return iModifyDevService.modifyNetnvr(userName,userId,jsonParam);
    }
    
    /**
     * 修改报警主机设备防区
     * */
    @ResponseBody
    @RequestMapping("ModifyDevzone")
    public JSONObject ModifyDevzone(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
        return iModifyDevService.modifyDevzone(jsonParam);
    }
    
    /**
     * 修改摄像机信息
     * */
    @ResponseBody
    @RequestMapping("ModifyCamera")
    public JSONObject ModifyCamera(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
        return iModifyDevService.modifyCamera1(jsonParam);
    }
    
	/**
	 * 添加有线摄像机信息
	 */
	@ResponseBody
	@RequestMapping("addHaveCamera")
	public JSONObject addHaveCamera(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		if (!jsonParam.containsKey("dataFrom") || "".equals(jsonParam.getString("dataFrom"))) {
			jsonParam.put("dataFrom", ConfigUtil.getPlatformId());
		}
		return iModifyDevService.addHaveCamera(jsonParam);
	}
	
	/**
	 * 添加无线摄像机信息
	 */
	@ResponseBody
	@RequestMapping("addNoCamera")
	public JSONObject addNoCamera(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		if (!jsonParam.containsKey("dataFrom") || "".equals(jsonParam.getString("dataFrom"))) {
			jsonParam.put("dataFrom", ConfigUtil.getPlatformId());
		}
		return iModifyDevService.addNoCamera(jsonParam);
	}
    
    /**
     * 删除报警主机
     * */
    @ResponseBody
    @RequestMapping("DelAlarmhost")
    public JSONObject DelAlarmhost(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
        return iModifyDevService.delAlarmhost(userName,userId,jsonParam);
    }
    
    /**
     * 删除有线NVR
     * */
    @ResponseBody
    @RequestMapping("DelWirenvr")
    public JSONObject DelWirenvr(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
		if(userName==null){
			userName=jsonParam.getString("userName");
		}
		if(userId==null){
			userId=jsonParam.getString("userId");
		}
        return iModifyDevService.delWirenvr(userName,userId,jsonParam);
    }
    
    /**
     * 删除互联网NVR
     * */
    @ResponseBody
    @RequestMapping("DelNetnvr")
    public JSONObject DelNetnvr(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	    String userName = GetSysInfoUtil.getUserName(request);
	    String userId = GetSysInfoUtil.getUserId(request);
		if(userName==null){
			userName=jsonParam.getString("userName");
		}
		if(userId==null){
			userId=jsonParam.getString("userId");
		}
        return iModifyDevService.delNetnvr(userName,userId,jsonParam);
    }

	/**
	 * 复制设备基本信息
	 */
	@ResponseBody
	@RequestMapping("copyDevice")
	public JSONObject copyDevice(HttpServletRequest request, HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		String devId=jsonParam.getString("devId");
		JSONArray addDeviceList = jsonParam.getJSONArray("addDeviceList");
		List<String> deviceList = (List<String>) JSON.parse(addDeviceList.toJSONString());
		
		return iModifyDevService.copyDevice(devId,deviceList);
	}
}
