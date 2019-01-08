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
import com.znyw.service.VideoService;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/video")
public class VideoCtrl {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(VideoCtrl.class);

	@Resource
	private VideoService videoService;

	@RequestMapping("/getNVRVideoUrl")
	@ResponseBody
	public JSONObject getNVRVideoUrl(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			System.out.println(jsonParam.toString());
			String cameraIdList = jsonParam.getString("cameraIdList");
			JSONObject JOSN = videoService.getNVRVideoUrl(cameraIdList);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getCameraIdList")
	@ResponseBody
	public JSONObject getCameraIdList(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject userPojo = jsonParam.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			String zoneCHValue = userPojo.getString("zoneCHValue");
			String zoneCHFlag = userPojo.getString("zoneCHFlag");
			JSONObject JOSN = videoService.getCameraIdList(userId, zoneCHValue,
					zoneCHFlag);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

}
