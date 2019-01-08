package com.znyw.dao;

import java.util.List;

import com.znyw.pojo.DropDownPojo;
import com.znyw.pojo.RoleZonePojo;

public interface DropDownDao {
	public List<DropDownPojo> findBusinessInfo();
	public List<DropDownPojo> findUserServerType();
	public List<RoleZonePojo> findDevId(String roleId);

	public List<RoleZonePojo> findAlarmDevId(String roleId) throws Exception;
	public List<RoleZonePojo> findNVRDevId(String roleId) throws Exception;
	public List<RoleZonePojo> findMonitorByDevId(String devId) throws Exception;
}
