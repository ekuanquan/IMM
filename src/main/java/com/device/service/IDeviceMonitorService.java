package com.device.service;

import com.alibaba.fastjson.JSONObject;

public interface IDeviceMonitorService {

    JSONObject getDeviceListByUserId(JSONObject jsonParam);

    JSONObject getDeviceInfoById(JSONObject jsonParam);

    JSONObject getUrlByDeviceId(JSONObject jsonParam);

    JSONObject getUrlListByDeviceIds(JSONObject jsonParam);

    void resolveAccMessage(String messageIdRsp, String cmdType, String msg);

}
