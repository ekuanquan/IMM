package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.VideoDao;
import com.znyw.pojo.NVRVideoPojo;
import com.znyw.service.VideoService;

@Service("VideoService")
public class VideoServiceImp implements VideoService {

	private Logger log = Logger.getLogger(getClass());

	@Resource
	VideoDao videoDao;

	@Override
	public JSONObject getNVRVideoUrl(String cameraIdList) {
		// TODO Auto-generated method stub
		JSONObject json = new JSONObject();// 结果
		JSONObject result = new JSONObject();// 结果
		List<NVRVideoPojo> nvrVideoPojo = null;
		String[] cameraIdArry = cameraIdList.split(";");
		try {
			nvrVideoPojo = videoDao.findNVRVideoByUserId(cameraIdArry);
			if (null == nvrVideoPojo) {
				result.put("code", "1");
				result.put("message", "查询为null");
				json.put("result", result);
			} else {
				result.put("code", "0");
				result.put("message", "查询成功");
				json.put("NVRVideoPojo", nvrVideoPojo);
				json.put("result", result);
			}
			return json;
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			result.put("code", "2");
			result.put("message", "查询异常");
			json.put("result", result);
			json.put("detail", e.getMessage());
			return json;
		}
	}

	@Override
	public JSONObject getCameraIdList(String userId, String zoneCHValue,
			String zoneCHFlag) {
		// TODO Auto-generated method stub
		JSONObject json = new JSONObject();// 结果
		JSONObject result = new JSONObject();// 结果
		try {
			String list = videoDao.getCameraIdList(userId, zoneCHValue,
					zoneCHFlag);
			if (null == list) {
				result.put("code", "1");
				result.put("message", "查询为null");
				json.put("result", result);
			} else {
				result.put("code", "0");
				result.put("message", "查询成功");
				json.put("cameraIdList", list);
				json.put("result", result);
			}
			return json;
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			result.put("code", "2");
			result.put("message", "查询异常");
			json.put("result", result);
			json.put("detail", e.getMessage());
			return json;
		}
	}

}
