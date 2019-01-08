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
import com.device.service.IRDAService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/")
public class RDAcenterCtrl {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource
	IRDAService iRDAService;
	
	 /**
     * 根据用户编号、角色防区名称、系统码查出相关设备、相关用户的信息
     * */
    @ResponseBody
    @RequestMapping("GetDevUserInfoByUidRzoneCid")
    public JSONObject GetDevUserInfoByUidRzoneCid(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
        return iRDAService.getDevUserInfoByUidRzoneCid(jsonParam);
    }
    
    
    /**
     * 根据用户id获取摄像机列表
     */  
    @ResponseBody
    @RequestMapping("GetCameraListByUid")
    public JSONObject GetCameraListByUid(HttpServletRequest request, HttpServletResponse response) {
        String stringParam = HttpTool.readJSONString(request); 
        JSONObject jsonParam = null;
	    try {
	    	jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
        return iRDAService.getCameraListByUid(jsonParam);
    }
}