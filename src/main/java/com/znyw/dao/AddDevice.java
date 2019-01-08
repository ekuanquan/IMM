package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface AddDevice {
	public List getDevinfoDao(String devId);

	public List getOwnerCorrelateDevDao(String ownerId);

	public boolean ownerAddAlarmhostImp(JSONObject json, int deviceNum);

	public int queryDeviceNum(String devId);

	public int queryDevicePlayNum(String devModelId);

	public void addAlarmhostImp(JSONObject json, int deviceNum);

	public List<Map<String, Object>> getDevModelService(String devType);

	public void addNVRhave(JSONObject json);

	public void addNVRhavEnature(int channNum, JSONObject json, String url,
			String time);

	public void addNVRno(JSONObject json);

	public void addNVRnoEnature(int channNum, JSONObject json, String url,
			String time);

	public int queryZoneNum(String devId);

	public int queryZoneNumOld(String devId);

	public JSONObject addAlarmhostArea(JSONObject json);

	public List queryAlalmhostcha(String devId);

	public void updaAlarmhostArea(JSONObject json);

	public List queryAlalmhosPlay(String devId);

	public List queryAlalmhosPlay(String devId, String devZoneId);

	public int queryTUTKID(String devTUTKID);

	public boolean addOneClickDev(JSONObject jsonObject);

	/**
	 * 根据设备编号
	 * 
	 * （厂商提供的设备编号，非我们数据表 imm_devinfo
	 * 
	 * 里面的 devId,而是一键式报警属性表imm_one_click_dev_attr的devSn属性）
	 * 
	 * 查找一键式报警设备信息
	 * 
	 * @param devSn
	 * @return
	 */
	public Map<String, Object> findOneClikDevByDevSn(String devSn);

	public boolean updateOneClickDev(JSONObject jsonObject);

	public boolean deleteOneClickDev(String devId);

	/**
	 * 根据国标ID查找NVR设备信息
	 * 
	 * @param gbId
	 * @return
	 */
	public Map<String, Object> findNVRByGbId(String gbId);

}
