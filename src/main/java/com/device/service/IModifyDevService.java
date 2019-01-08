package com.device.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;

public interface IModifyDevService {

	public JSONObject modifyAlarmhost(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject modifyWirenvr(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject modifyNetnvr(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject modifyDevzone(JSONObject jsonParam);
    
    public JSONObject delAlarmhost(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject delWirenvr(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject delNetnvr(String userName,String userId,JSONObject jsonParam);
    
    public JSONObject addHaveCamera(JSONObject jsonParam);
    
    public JSONObject addNoCamera(JSONObject jsonParam);

	JSONObject modifyCamera1(JSONObject jsonParam);

	public JSONObject copyDevice(String devId,List<String> deviceList);

}