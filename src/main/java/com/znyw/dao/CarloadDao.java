package com.znyw.dao;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.CarloadInfo;
import com.znyw.pojo.Camera;
import com.znyw.pojo.TergroupPojo;
import com.znyw.pojo.TertypePojo;
import com.znyw.pojo.AlarmhostPojo;

public interface CarloadDao {

	public List<TergroupPojo> queryTerGroupCtrl();

	public List<Camera> queryCamerInfoCtrl(String devId);

	public List<CarloadInfo> queryCarloadInfoCtrl(String groupId, String roleId);

	public int addCarloadInfoCtrl(JSONObject jsonParam);

	public int addCamereInfoCtrl(JSONObject jsonParam, String cameraId,
			String cameraName, String devChannelId, String devMonitorId);

	public int delCarloadInfoCtrl(String devId);

	public int delCamInfoCtrl(String devId);

	public List queryDevIdOrderByRoleIdCtrl(String roleId);

	public int querychannelNum(String devId);

	public int updateCarloadInfoCtrl(JSONObject jsonParam);

	public int delCamereInfoCtrl(int deleteNum, String devId);

	public List<TertypePojo> queryTertypeCtrl();

	public List<TergroupPojo> queryPlateColorCtrl();

	public int updateCameraNameCtrl(String CameraName, String devId,int channel);

	public List queryCarloadCtrl(String devId);

	public List querycameraNamesCtrl(String devId);

	public List queryCarloadListCtrl(String queryId, String areaId, int pageSizeInt,
			int currentPageInt, String isowner,String sort);

	public int queryCarloadNumCtrl(String queryId, String areaId, String isowner);

	public List<CarloadInfo> queryCarloadOrderByRoleIdCarnoCtrl(String roleId, String carno);

	public List queryTergroupOrderByRoleIdCarnoCtrl(String roleId, String carno);

	public List<CarloadInfo> queryTerGroupCtrl1();

}
