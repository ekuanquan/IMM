package com.device.dao;

import java.util.List;
import java.util.Set;

import com.alibaba.fastjson.JSONObject;
import com.device.pojo.DeviceInfoPojo;
import com.znyw.pojo.DeviceDataPojo;

public interface IDeviceMonitorDao {

	List<DeviceDataPojo> getDeviceListByUserId(String userId, String devName) throws Exception;

	Set<DeviceDataPojo> getAreaList() throws Exception;

	Set<DeviceDataPojo> getAreaListByAreaIDs(List<String> areaIDs) throws Exception;

	DeviceInfoPojo getDeviceInfoById(String deviceId) throws Exception;

	String getUrlByDeviceId(String deviceId) throws Exception;

	JSONObject getUrlListByDeviceIds(String deviceIds) throws Exception;

    String getDeviceListByMaxAcc(String AccID, String conSerID, int[] serNum);

}
