package com.znyw.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.AddDevice;
import com.znyw.tool.ResultJson;

@Service
public class UpdateDeviceService {
	
	@Resource
	AddDevice adddevice;
	
	public JSONObject updateAlarmhost(JSONObject json){
		
		int num = adddevice.queryDeviceNum(json.getString("devId"));
		if(num == 0){
			return ResultJson.updateNoFind();
		}else if (num > 1) {
			return ResultJson.updateFull();
		}
		
		return new JSONObject();
		
	}
	
}
