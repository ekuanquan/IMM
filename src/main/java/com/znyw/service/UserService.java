package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ContactPojo;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.ResultPojo;

public interface UserService {

	public JSONObject getControlDevsByUserId(String ownerId);

	public String getControlDevIdByownerId(String type, String ownerId)
			throws Exception;

	public ResultPojo getUserInfoByUserId(String userId) throws Exception;

	/**
	 * 
	 * @param userId
	 *            需要查询的用户编号
	 * @param login
	 *            当前登录的用户编号
	 * @return
	 */
	public ResultPojo getBasicUserInfoByUserId(String userId, String login);

	public ResultPojo getContactByUserId(String userId);

	public ResultPojo updateContactInfo(ContactPojo contactPojo)
			throws Exception;

	public ResultPojo addContactInfo(ContactPojo contactPojo) throws Exception;

	public ResultPojo updateUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception;

	public ResultPojo addUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception;

	public ResultPojo updateGeneralUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception;

	public ResultPojo addGeneralUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception;

	public ResultPojo delOwnerUserInfo(String tuserName, String tuserId,
			String userId) throws Exception;

	public ResultPojo delGeneralUserInfo(String tuserName, String tuserId,
			String userId) throws Exception;

	public ResultPojo getRoleByUserId(String userId) throws Exception;

	public ResultPojo getGeneralUserInfoByUserId(String userId)
			throws Exception;

	public ResultPojo getOperatorInfoByUserId(String userId);

	public ResultPojo updateOperatorUserInfo(String userName, String userId,
			OperatorPojo operatorPojo) throws Exception;

	public ResultPojo addOperatorUserInfo(String userName, String userId,
			OperatorPojo operatorPojo) throws Exception;

	public ResultPojo delOperatorUserInfo(String tuserName, String tuserId,
			String userId) throws Exception;

	public ResultPojo getOperatorsInfoByAreaId(String areaId,
			String userId_name, String pageSize, String currentPage,
			String orderBy, String userId) throws Exception;

	public ResultPojo getCustomerInfoByAreaId(String areaId,
			String userId_name, String pageSize, String currentPage,
			String orderBy, String userId) throws Exception;

	public ResultPojo getOwnerInfoByAreaId(String areaId, String userId_name,
			String pageSize, String currentPage, String orderBy, String userId)
			throws Exception;

	public int DeleteContact(String userId, JSONArray contId);

	public int DeleteUserZone(String roleId, String roleZoneName);

	public int deleteUserZoneBatch(String ownerId, List<String> ownerZoneName);

	/**
	 * 修改机主用户编号
	 * 
	 * @param jsonObject
	 *            {"oldUserId":"旧编号","newUserId":"新编号"}
	 * @return
	 */
	public JSONObject modifyOwnerId(String operator, String operatorName,
			JSONObject jsonObject);

	/**
	 * 机主添加关联设备
	 * 
	 * @param jsonObject
	 * 
	 *            {
	 * 
	 *            "data":{
	 * 
	 *            "ownerId":"机主编号",
	 * 
	 *            "correlateDevIds":[ "关联设备编号1", "关联设备编号2", "..." ]
	 * 
	 *            }
	 * 
	 *            }
	 * @return
	 */
	public JSONObject correlateDevicesAdd(JSONObject jsonObject);

	/**
	 * 机主删除关联设备
	 * 
	 * @param jsonObject
	 * 
	 *            {
	 * 
	 *            "data":{
	 * 
	 *            "ownerId":"机主编号",
	 * 
	 *            "correlateDevIds":[ "关联设备编号1", "关联设备编号2", "..." ]
	 * 
	 *            }
	 * 
	 *            }
	 * @return
	 */
	public JSONObject correlateDevicesDelete(JSONObject jsonObject);

	/**
	 * 设置远程控制设备
	 * 
	 * @param jsonObject
	 * 
	 *            {
	 * 
	 *            "data":{ "newRemoteDevId":"新远程设备编号", "OldRemoteDevId":"旧远程设备编号" }
	 * 
	 *            }
	 * 
	 * @return
	 */
	public JSONObject updateRemoteDevice(JSONObject jsonObject);

	/**
	 * 设置主控设备
	 * 
	 * @param jsonObject
	 * 
	 *            {
	 * 
	 *            "data":{ "newMasterDevId":"新主设备编号", "OldMasterDevId":"旧主设备编号" }
	 * 
	 *            }
	 * 
	 * @return
	 */
	public JSONObject updateMasterDevice(JSONObject jsonObject);
}
