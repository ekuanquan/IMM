package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.znyw.pojo.BasicUserInfoPojo;
import com.znyw.pojo.ContactPojo;
import com.znyw.pojo.GeneralUserPojo;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.RolePojo;

public interface UserInfoDao {

	public BasicUserInfoPojo findBasicUserInfoByUserId(String userId,
			List<String> areaIds) throws Exception;

	public List<ContactPojo> findContactByUserId(String userId)
			throws Exception;

	public boolean insertContactInfo(ContactPojo contactPojo) throws Exception;

	public boolean updateContactInfo(ContactPojo contactPojo) throws Exception;

	public boolean deleteContactInfosByUserId(String userId) throws Exception;

	public List<RolePojo> findRoleByUserId(String userId) throws Exception;

	public boolean insertOwnerUserInfo(OwnerPojo ownerPojo) throws Exception;

	public boolean updateOwnerUserInfo(OwnerPojo ownerPojo) throws Exception;

	public boolean insertGeneralUserInfo(OwnerPojo ownerPojo) throws Exception;

	public boolean updateGeneralUserInfo(OwnerPojo ownerPojo) throws Exception;

	public boolean deleteUserInfo(String userId) throws Exception;

	public boolean deleteCustomerattr(String userId) throws Exception;

	public boolean deleteOperatorattr(String userId) throws Exception;

	public GeneralUserPojo findGeneralUserByUserId(String userId)
			throws Exception;

	public OperatorPojo findOperatorByUserId(String userId) throws Exception;

	public boolean insertOperatorUserInfo(OperatorPojo operatorPojo)
			throws Exception;

	public boolean updateOperatorUserInfo(OperatorPojo operatorPojo)
			throws Exception;

	public List<OperatorPojo> findOperatorByAreaId(String areaId,
			String userId_name, int pageSize, int currentPage, String orderBy)
			throws Exception;

	/**
	 * 查询一般客户或机主客户信息
	 * 
	 * @param areaId
	 * @param userId_name
	 * @param userType
	 *            用户类型，"0":一般用户 ,"1":机主客户
	 * @param pageSize
	 * @param currentPage
	 * @param orderBy
	 * @return
	 * @throws Exception
	 */
	public List<OwnerPojo> findUserByAreaId(String areaId, String userId_name,
			String userType, int pageSize, int currentPage, String orderBy)
			throws Exception;

	public int countOperatorByAreaId(String areaId, String userId_name)
			throws Exception;

	public int countUserByAreaId(String areaId, String userId_name,
			String userType) throws Exception;

	public String findCenterById(String centerId) throws Exception;// 获取分中心名称

	/**
	 * 是否存在与指定的 userId 和 contId 对应的记录
	 * 
	 * @param userId
	 * @param contId
	 * @return
	 */
	boolean hasRecord(String userId, String contId) throws Exception;

	String getRoleIdByUserId(String userId) throws Exception;

	List<String> getUserIdsByRoleIds(List<String> roleIds) throws Exception;

	/**
	 * 根据负责人电话查找设备编号
	 * 
	 * @param phoneNo
	 * @return
	 * @throws Exception
	 */
	public List<String> getUserIdsByPhoneNo(String phoneNo) throws Exception;

	// 查询所有机主用户编号
	public List<Map<String, Object>> getOwnerInfoImpl();
}
