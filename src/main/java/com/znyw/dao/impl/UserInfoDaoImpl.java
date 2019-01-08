package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.UserInfoDao;
import com.znyw.pojo.BasicUserInfoPojo;
import com.znyw.pojo.ContactPojo;
import com.znyw.pojo.GeneralUserPojo;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.RolePojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Transactional
@Repository("UserInfoDao")
public class UserInfoDaoImpl implements UserInfoDao {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;
	@Resource
	private UserDaoImp userDaoImp;

	@Override
	public List<ContactPojo> findContactByUserId(String userId) {
		String sql = "SELECT * FROM imm_usercont WHERE userId= ? ORDER BY contId ASC";
		List<ContactPojo> list = null;
		try {
			list = jdbcTemplate.query(sql, new String[] { userId },
					new BeanPropertyRowMapper<ContactPojo>(ContactPojo.class));

			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 添加机主信息
	 */
	@Override
	public boolean insertOwnerUserInfo(OwnerPojo ownerPojo) throws Exception {
		/*
		 * String devIds = Objects.Joiner("','",
		 * ownerPojo.getDevIds()).replaceAll("'", ""); String relatedInsertSQL =
		 * "call owner_add_userinfo_customerattr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		 * ; Object[] userDeviceParam = new Object[] {
		 * ownerPojo.getUserAccount(), ownerPojo.getUserPwd(),
		 * ownerPojo.getCreateDate(), ownerPojo.getUserId(),
		 * ownerPojo.getUserName(), ownerPojo.getUserType(),
		 * ownerPojo.getCenterId(), ownerPojo.getAreaId(), ownerPojo.getfMemo(),
		 * ownerPojo.getRoleId(), ownerPojo.getDataFrom(),
		 * ownerPojo.getPlatformId(), ownerPojo.isSwitchUser(),
		 * ownerPojo.getServeEndTime(), ownerPojo.getUserAddr(),
		 * ownerPojo.getUserProperty(), ownerPojo.getBusinessId(),
		 * ownerPojo.getBusinessName(), ownerPojo.getPayNO(),
		 * ownerPojo.getContact(),
		 * 
		 * ownerPojo.getContactPayNO(), ownerPojo.getCHmPhone(),
		 * ownerPojo.getCPhone(), ownerPojo.getCMobile(), ownerPojo.getPnlTel(),
		 * ownerPojo.getPnlHdTel(), ownerPojo.getNomRpt(),
		 * ownerPojo.getEngageTest(), ownerPojo.getNomTest(),
		 * ownerPojo.getIsVideoCheck(),
		 * 
		 * ownerPojo.getIsInsurance(), ownerPojo.getHasBak(),
		 * ownerPojo.getIsPay(), ownerPojo.getUsrAlmType(), ownerPojo.getuMem(),
		 * ownerPojo.getOperName(), ownerPojo.getDefine2(),
		 * ownerPojo.getBadMem(), ownerPojo.getRoad(), ownerPojo.getDefine3(),
		 * 
		 * ownerPojo.getDefine1(), ownerPojo.getDefine6(),
		 * ownerPojo.getDefine4(), ownerPojo.getInstDate(),
		 * ownerPojo.getLiveDate(), ownerPojo.getPnlTelType(),
		 * ownerPojo.getUserServerType(), devIds }; try {
		 * jdbcTemplate.update(relatedInsertSQL, userDeviceParam); return true;
		 * } catch (Exception e) { return false; }
		 */

		String insertUserSQL = "INSERT INTO imm_userinfo (userAccount,userPwd,createDate,userId,userName,userType,centerId,areaId,fMemo,roleId,dataFrom,platformId,switchUser,serveEndTime)"
				+ "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		String insertUserAttrSql = "INSERT INTO imm_customerattr"
				+ "(userId,userAddr,userProperty,businessId,businessName,payNO,contact,contactPayNO,"
				+ "cHmPhone,cPhone,cMobile,pnlTel,pnlHdTel,nomRpt,engageTest,nomTest,isVideoCheck,isInsurance,hasBak,isPay,usrAlmType,uMem,operName,define2,"
				+ "badMem,road,define3,define1,define6,define4,instDate,liveDate,pnlTelType,userServerType,dataFrom)"
				+ "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		Object[] userParam = new Object[] { ownerPojo.getUserAccount(),
				ownerPojo.getUserPwd(), ownerPojo.getCreateDate(),
				ownerPojo.getUserId(), ownerPojo.getUserName(),
				ownerPojo.getUserType(), ownerPojo.getCenterId(),
				ownerPojo.getAreaId(), ownerPojo.getfMemo(),
				ownerPojo.getRoleId(), ownerPojo.getDataFrom(),
				ownerPojo.getPlatformId(), ownerPojo.isSwitchUser(),
				ownerPojo.getServeEndTime() };
		Object[] userAttrParam = new Object[] { ownerPojo.getUserId(),
				ownerPojo.getUserAddr(), ownerPojo.getUserProperty(),
				ownerPojo.getBusinessId(), ownerPojo.getBusinessName(),
				ownerPojo.getPayNO(), ownerPojo.getContact(),
				ownerPojo.getContactPayNO(), ownerPojo.getCHmPhone(),
				ownerPojo.getCPhone(), ownerPojo.getCMobile(),
				ownerPojo.getPnlTel(), ownerPojo.getPnlHdTel(),
				ownerPojo.getNomRpt(), ownerPojo.getEngageTest(),
				ownerPojo.getNomTest(), ownerPojo.getIsVideoCheck(),
				ownerPojo.getIsInsurance(), ownerPojo.getHasBak(),
				ownerPojo.getIsPay(), ownerPojo.getUsrAlmType(),
				ownerPojo.getuMem(), ownerPojo.getOperName(),
				ownerPojo.getDefine2(), ownerPojo.getBadMem(),
				ownerPojo.getRoad(), ownerPojo.getDefine3(),
				ownerPojo.getDefine1(), ownerPojo.getDefine6(),
				ownerPojo.getDefine4(), ownerPojo.getInstDate(),
				ownerPojo.getLiveDate(), ownerPojo.getPnlTelType(),
				ownerPojo.getUserServerType(), ownerPojo.getDataFrom() };

		try {
			int resultInsertUser = jdbcTemplate
					.update(insertUserSQL, userParam);
			int resultInsertUserAttr = jdbcTemplate.update(insertUserAttrSql,
					userAttrParam);
			if ((resultInsertUser + resultInsertUserAttr) == 2) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public boolean updateOwnerUserInfo(OwnerPojo ownerPojo) {

		try {
			SetField.reflect(ownerPojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		/*
		 * String relatedInsertSQL =
		 * "call owner_update_userinfo_customerattr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		 * ; Object[] userDeviceParam = new Object[] { ownerPojo.getUserPwd(),
		 * ownerPojo.getCreateDate(), ownerPojo.getUserName(),
		 * ownerPojo.getCenterId(), ownerPojo.getAreaId(), ownerPojo.getfMemo(),
		 * ownerPojo.getRoleId(), ownerPojo.getPlatformId(),
		 * ownerPojo.isSwitchUser(), ownerPojo.getServeEndTime(),
		 * ownerPojo.getUserId(),
		 * 
		 * ownerPojo.getUserAddr(), ownerPojo.getUserProperty(),
		 * ownerPojo.getBusinessId(), ownerPojo.getBusinessName(),
		 * ownerPojo.getPayNO(), ownerPojo.getUserServerType(),
		 * ownerPojo.getContact(), ownerPojo.getContactPayNO(),
		 * ownerPojo.getCHmPhone(), ownerPojo.getCPhone(),
		 * 
		 * ownerPojo.getCMobile(), ownerPojo.getPnlTel(),
		 * ownerPojo.getPnlHdTel(), ownerPojo.getNomRpt(),
		 * ownerPojo.getEngageTest(), ownerPojo.getNomTest(),
		 * ownerPojo.getIsVideoCheck(), ownerPojo.getIsInsurance(),
		 * ownerPojo.getHasBak(), ownerPojo.getIsPay(),
		 * 
		 * ownerPojo.getUsrAlmType(), ownerPojo.getuMem(),
		 * ownerPojo.getOperName(), ownerPojo.getDefine2(),
		 * ownerPojo.getBadMem(), ownerPojo.getRoad(), ownerPojo.getDefine3(),
		 * ownerPojo.getDefine1(), ownerPojo.getDefine6(),
		 * ownerPojo.getDefine4(),
		 * 
		 * ownerPojo.getInstDate(), ownerPojo.getLiveDate(),
		 * ownerPojo.getPnlTelType() };
		 * 
		 * try { jdbcTemplate.update(relatedInsertSQL, userDeviceParam); return
		 * true; } catch (Exception e) { return false; }
		 */

		String updateUserSQL = "UPDATE imm_userinfo SET userPwd=?,createDate=?,userName=?,centerId=?,areaId=?,fMemo=?,roleId=?,platformId=?,switchUser=?,serveEndTime=?"
				+ "WHERE userId=?";
		String updateUserAttrSql = "UPDATE imm_customerattr SET userAddr=?,userProperty=?,businessId=?,businessName=?,payNO=?,userServerType=?,"
				+ "contact=?,contactPayNO=?,cHmPhone=?,cPhone=?,cMobile=?,pnlTel=?,pnlHdTel=?,nomRpt=?,engageTest=?,nomTest=?,isVideoCheck=?,isInsurance=?,hasBak=?,"
				+ "isPay=?,usrAlmType=?,uMem=?,operName=?,define2=?,badMem=?,road=?,define3=?,define1=?,define6=?,define4=?,"
				+ "instDate=?,liveDate=?,pnlTelType=?,pnlHdTel=?"
				+ " WHERE userId=?";
		String updateDevSQL = "UPDATE imm_devinfo SET areaId=? "
				+ "WHERE ownerId=?";
		Object[] userParam = new Object[] { ownerPojo.getUserPwd(),
				ownerPojo.getCreateDate(), ownerPojo.getUserName(),
				ownerPojo.getCenterId(), ownerPojo.getAreaId(),
				ownerPojo.getfMemo(), ownerPojo.getRoleId(),
				ownerPojo.getPlatformId(), ownerPojo.isSwitchUser(),
				ownerPojo.getServeEndTime(), ownerPojo.getUserId() };
		Object[] userAttrParam = new Object[] { ownerPojo.getUserAddr(),
				ownerPojo.getUserProperty(), ownerPojo.getBusinessId(),
				ownerPojo.getBusinessName(), ownerPojo.getPayNO(),
				ownerPojo.getUserServerType(), ownerPojo.getContact(),
				ownerPojo.getContactPayNO(), ownerPojo.getCHmPhone(),
				ownerPojo.getCPhone(), ownerPojo.getCMobile(),
				ownerPojo.getPnlTel(), ownerPojo.getPayNO(),
				ownerPojo.getNomRpt(), ownerPojo.getEngageTest(),
				ownerPojo.getNomTest(), ownerPojo.getIsVideoCheck(),
				ownerPojo.getIsInsurance(), ownerPojo.getHasBak(),
				ownerPojo.getIsPay(), ownerPojo.getUsrAlmType(),
				ownerPojo.getuMem(), ownerPojo.getOperName(),
				ownerPojo.getDefine2(), ownerPojo.getBadMem(),
				ownerPojo.getRoad(), ownerPojo.getDefine3(),
				ownerPojo.getDefine1(), ownerPojo.getDefine6(),
				ownerPojo.getDefine4(), ownerPojo.getInstDate(),
				ownerPojo.getLiveDate(), ownerPojo.getPnlTelType(),
				ownerPojo.getPnlHdTel(), ownerPojo.getUserId() };
		Object[] devParam = new Object[] { ownerPojo.getAreaId(),ownerPojo.getUserId() };
		try {
			int resultUpdateUser = jdbcTemplate
					.update(updateUserSQL, userParam);
			int resultUpdateUserAttr = jdbcTemplate.update(updateUserAttrSql,
					userAttrParam);
			int resultUpdateDev = jdbcTemplate
					.update(updateDevSQL, devParam);
			if ((resultUpdateUser + resultUpdateUserAttr) == 2) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public List<RolePojo> findRoleByUserId(String userId) {
		String sql = "SELECT imm_roleinfo.roleId,imm_roleinfo.roleType,imm_roleinfo.roleName,imm_roleinfo.fMemo "
				+ " FROM imm_userinfo,imm_roleinfo WHERE imm_userinfo.roleId=imm_roleinfo.roleId AND imm_userinfo.userId=?";
		List<RolePojo> list = null;

		try {
			list = jdbcTemplate.query(sql, new String[] { userId },
					new BeanPropertyRowMapper<RolePojo>(RolePojo.class));
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public GeneralUserPojo findGeneralUserByUserId(String userId)
			throws Exception {

		Map<String, Object> map = userDaoImp.getCustomerInfo("ASC", 1, 1,
				" 1=1 ", "all", "all", "all", "", "", "userId", userId);

		List<Map<String, Object>> result = (List<Map<String, Object>>) map
				.get("list");

		if (result.size() > 0) {
			GeneralUserPojo generalUserPojo = JSONObject.parseObject(
					JSON.toJSONString(result.get(0)), GeneralUserPojo.class);
			return generalUserPojo;
		}

		return null;
	}

	@Override
	public boolean insertGeneralUserInfo(OwnerPojo ownerPojo) {
		String insertUserSQL = "INSERT INTO imm_userinfo (userAccount,userPwd,createDate,userId,userName,userType,centerId,areaId,roleId,dataFrom,platformId) "
				+ "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
		String insertUserAttrSql = "INSERT INTO imm_customerattr"
				+ " (userId,userAddr,userProperty,businessId,businessName,payNO,userServerType,contact,contactPayNO,"
				+ "cHmPhone,cPhone,cMobile, isPay,isVideoCheck,operName,instDate,dataFrom)"
				+ " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		Object[] userParam = new Object[] { ownerPojo.getUserAccount(),
				ownerPojo.getUserPwd(), ownerPojo.getCreateDate(),
				ownerPojo.getUserId(), ownerPojo.getUserName(),
				ownerPojo.getUserType(), ownerPojo.getCenterId(),
				ownerPojo.getAreaId(), ownerPojo.getRoleId(),
				ownerPojo.getDataFrom(), ownerPojo.getPlatformId() };
		Object[] userAttrParam = new Object[] { ownerPojo.getUserId(),
				ownerPojo.getUserAddr(), ownerPojo.getUserProperty(),
				ownerPojo.getBusinessId(), ownerPojo.getBusinessName(),
				ownerPojo.getPayNO(), ownerPojo.getUserServerType(),
				ownerPojo.getContact(), ownerPojo.getContactPayNO(),
				ownerPojo.getCHmPhone(), ownerPojo.getCPhone(),
				ownerPojo.getCMobile(), ownerPojo.getIsPay(),
				ownerPojo.getIsVideoCheck(), ownerPojo.getOperName(),
				ownerPojo.getInstDate(), ownerPojo.getDataFrom() };

		try {
			int resultInsertUser = jdbcTemplate
					.update(insertUserSQL, userParam);
			int resultInsertUserAttr = jdbcTemplate.update(insertUserAttrSql,
					userAttrParam);
			if ((resultInsertUser + resultInsertUserAttr) == 2) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateGeneralUserInfo(OwnerPojo ownerPojo) {
		SetField.reflect(ownerPojo);

		String updateUserSQL = "UPDATE imm_userinfo SET userPwd=?,createDate=?,userName=?,centerId=?,areaId=?,roleId=?,platformId=?"
				+ "WHERE userId=?";
		String updateUserAttrSql = "UPDATE imm_customerattr SET userAddr=?,userProperty=?,businessId=?,businessName=?,payNO=?,"
				+ " contact=?,contactPayNO=?,cHmPhone=?,cPhone=?,cMobile=?,isPay=?,isVideoCheck=?,instDate=?"
				+ " WHERE userId=?";
		Object[] userParam = new Object[] { ownerPojo.getUserPwd(),
				ownerPojo.getCreateDate(), ownerPojo.getUserName(),
				ownerPojo.getCenterId(), ownerPojo.getAreaId(),
				ownerPojo.getRoleId(), ownerPojo.getPlatformId(),
				ownerPojo.getUserId() };
		Object[] userAttrParam = new Object[] { ownerPojo.getUserAddr(),
				ownerPojo.getUserProperty(), ownerPojo.getBusinessId(),
				ownerPojo.getBusinessName(), ownerPojo.getPayNO(),
				ownerPojo.getContact(), ownerPojo.getContactPayNO(),
				ownerPojo.getCHmPhone(), ownerPojo.getCPhone(),
				ownerPojo.getCMobile(), ownerPojo.getIsPay(),
				ownerPojo.getIsVideoCheck(), ownerPojo.getInstDate(),
				ownerPojo.getUserId() };

		try {
			int resultUpdateUser = jdbcTemplate
					.update(updateUserSQL, userParam);
			int resultUpdateUserAttr = jdbcTemplate.update(updateUserAttrSql,
					userAttrParam);
			if ((resultUpdateUser + resultUpdateUserAttr) == 2) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public OperatorPojo findOperatorByUserId(String userId) throws Exception {

		Map<String, Object> map = userDaoImp.getOperatorsInfo("ASC", 1, 1,
				"1=1", "all", "", "", "userId", userId);

		List<Map<String, Object>> result = (List<Map<String, Object>>) map
				.get("list");

		if (result.size() > 0) {
			OperatorPojo operatorPojo = JSONObject.parseObject(
					JSON.toJSONString(result.get(0)), OperatorPojo.class);

			return operatorPojo;
		}

		return null;

	}

	@Override
	public boolean insertOperatorUserInfo(OperatorPojo operatorPojo) {
		String insertUserSQL = "INSERT INTO imm_userinfo (userAccount,userPwd,createDate,userId,userName,userType,areaId,centerId,userPWDhint,fMemo,roleId,dataFrom,platformId)"
				+ " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
		String insertUserAttrSql = "INSERT INTO imm_operatorattr (userId,overDateTime,acctIP,sex,telephone,email,education,office,acctDY,operName,operTime,acctType,dataFrom)"
				+ "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";

		try {
			int resultInsertUser = jdbcTemplate.update(
					insertUserSQL,
					new Object[] { operatorPojo.getUserAccount(),
							operatorPojo.getUserPwd(),
							operatorPojo.getCreateDate(),
							operatorPojo.getUserId(),
							operatorPojo.getUserName(),
							operatorPojo.getUserType(),
							operatorPojo.getAreaId(),
							operatorPojo.getCenterId(),
							operatorPojo.getUserPWDhint(),
							operatorPojo.getFMemo(), operatorPojo.getRoleId(),
							operatorPojo.getDataFrom(),
							operatorPojo.getPlatformId() });

			int resultInsertUserAttr = jdbcTemplate.update(
					insertUserAttrSql,
					new Object[] { operatorPojo.getUserId(),
							operatorPojo.getOverDateTime(),
							operatorPojo.getAcctIP(), operatorPojo.getSex(),
							operatorPojo.getTelephone(),
							operatorPojo.getEmail(),
							operatorPojo.getEducation(),
							operatorPojo.getOffice(), operatorPojo.getAcctDY(),
							operatorPojo.getOperName(),
							operatorPojo.getOperTime(),
							operatorPojo.getUserType(),
							operatorPojo.getDataFrom() });
			if ((resultInsertUser + resultInsertUserAttr) == 2) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateOperatorUserInfo(OperatorPojo operatorPojo) {

		SetField.reflect(operatorPojo);

		String updateUserSQL = "UPDATE imm_userinfo SET userPwd=?,createDate=?,userName=?,areaId=?,centerId=?,userPWDhint=?,fMemo=?,roleId=?,platformId=?"
				+ " WHERE userId=?";

		String updateUserAttrSql = "UPDATE imm_operatorattr SET overDateTime=?,acctIP=?,sex=?,telephone=?,email=?,education=?,office=?,acctDY=? "
				+ " ,operName=?,operTime=? WHERE userId=?";
		int resultUpdateUser = jdbcTemplate.update(
				updateUserSQL,
				new Object[] { operatorPojo.getUserPwd(),
						operatorPojo.getCreateDate(),
						operatorPojo.getUserName(), operatorPojo.getAreaId(),
						operatorPojo.getCenterId(),
						operatorPojo.getUserPWDhint(), operatorPojo.getFMemo(),
						operatorPojo.getRoleId(), operatorPojo.getPlatformId(),
						operatorPojo.getUserId() });
		int resultUpdateUserAttr = jdbcTemplate.update(
				updateUserAttrSql,
				new Object[] { operatorPojo.getOverDateTime(),
						operatorPojo.getAcctIP(), operatorPojo.getSex(),
						operatorPojo.getTelephone(), operatorPojo.getEmail(),
						operatorPojo.getEducation(), operatorPojo.getOffice(),
						operatorPojo.getAcctDY(), operatorPojo.getOperName(),
						operatorPojo.getOperTime(), operatorPojo.getUserId() });
		if ((resultUpdateUser + resultUpdateUserAttr) == 2) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public List<OperatorPojo> findOperatorByAreaId(String areaId,
			String userId_name, int pageSize, int currentPage, String orderBy)
			throws Exception {
		userId_name = "%" + userId_name + "%";
		String[] orderByArray = orderBy.split("\\|");
		String orderByVlue = orderByArray[0];
		String order = orderByArray[1];
		currentPage = pageSize * (currentPage - 1);
		String sql = "SELECT * FROM imm_OperatorUser WHERE "
				+ areaId
				+ " AND(userId LIKE ?  OR userName LIKE ? OR telephone LIKE ? ) AND (userType='2' OR userType='3') ORDER BY ? ? LIMIT "
				+ currentPage + "," + pageSize;
		List<OperatorPojo> list = null;
		Object[] param = new String[] { userId_name, userId_name, userId_name,
				orderByVlue, order };
		try {
			list = jdbcTemplate
					.query(sql, param, new BeanPropertyRowMapper<OperatorPojo>(
							OperatorPojo.class));
		} catch (Exception e) {
			LOGGER.info("findOperatorByAreaId Exception:" + e.toString());
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public int countOperatorByAreaId(String areaId, String userId_name) {
		String sql = "SELECT COUNT(userId) as num FROM imm_OperatorUser WHERE "
				+ areaId + " AND (userType='2' OR userType='3') ";

		if (userId_name != null && !"".equals(userId_name)) {
			String FuzzyString = "AND(userId LIKE ?  OR userName LIKE ? OR telephone LIKE ? )";
			sql += FuzzyString;
			userId_name = "%" + userId_name + "%";
			Object[] param = new String[] { userId_name, userId_name,
					userId_name };
			/*
			 * Number number = jdbcTemplate.queryForObject(sql, param,
			 * Integer.class); int totalNum = (number != null ?
			 * number.intValue() : 0);
			 */
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					param);
			return Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
			// return totalNum;
		} else {
			/*
			 * Number number = jdbcTemplate.queryForObject(sql, Integer.class);
			 * int totalNum = (number != null ? number.intValue() : 0); return
			 * totalNum;
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql);
			return Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
		}

	}

	@Override
	public boolean insertContactInfo(ContactPojo contactPojo) {

		SetField.reflect(contactPojo);

		String insertContactSQL = "INSERT INTO imm_usercont(userId,contId,cName,contPwd,cphone1,cphone2,hmPhone,hdPhone,fMemo,dataFrom) VALUES(?,?,?,?,?,?,?,?,?,?)";
		Object[] param = new Object[] { contactPojo.getUserId(),
				contactPojo.getContId(), contactPojo.getCName(),
				contactPojo.getContPwd(), contactPojo.getCphone1(),
				contactPojo.getCphone2(), contactPojo.getHmPhone(),
				contactPojo.getHdPhone(), contactPojo.getfMemo(),
				contactPojo.getDataFrom() };

		try {
			int resultInsertContact = jdbcTemplate.update(insertContactSQL,
					param);

			if (resultInsertContact == 1) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateContactInfo(ContactPojo contactPojo) {
		try {
			SetField.reflect(contactPojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		}

		String updateContactSQL = "UPDATE imm_usercont SET cName=?,contPwd=?,cphone1=?,cphone2=?,hmPhone=?,hdPhone=?,fMemo=?"
				+ " WHERE userId=? AND contId=?";
		Object[] param = new Object[] { contactPojo.getCName(),
				contactPojo.getContPwd(), contactPojo.getCphone1(),
				contactPojo.getCphone2(), contactPojo.getHmPhone(),
				contactPojo.getHdPhone(), contactPojo.getfMemo(),
				contactPojo.getUserId(), contactPojo.getContId() };

		try {
			int resultUpdateContact = jdbcTemplate.update(updateContactSQL,
					param);

			if (resultUpdateContact == 1) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<OwnerPojo> findUserByAreaId(String areaId, String userId_name,
			String userType, int pageSize, int currentPage, String orderBy)
			throws Exception {

		String query = " 1=1 ";

		if (Objects.isNullString(areaId)) {
			areaId = " 1=1 ";
		}

		if (userId_name != null && !"".equals(userId_name)) {
			query = String
					.format(" ( locate('%s',userId)>0 or locate('%s',userName)>0 or locate('%s',cHmPhone)>0 or locate('%s',cPhone)>0 or locate('%s',cMobile)>0 ) ",
							userId_name, userId_name, userId_name, userId_name,
							userId_name);
		}

		String order = orderBy.indexOf("DESC") > 0 ? " DESC " : "ASC";

		currentPage = pageSize * (currentPage - 1);

		String sql = "SELECT * FROM imm_editOwner WHERE " + areaId + " AND "
				+ query + " AND userType='" + userType + "' ORDER BY userId "
				+ order + " LIMIT " + currentPage + "," + pageSize;

		List<OwnerPojo> list = null;
		try {
			list = jdbcTemplate.query(sql,
					new BeanPropertyRowMapper<OwnerPojo>(OwnerPojo.class));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public int countUserByAreaId(String areaId, String userId_name,
			String userType) {

		String query = " 1=1 ";

		if (Objects.isNullString(areaId)) {
			areaId = " 1=1 ";
		}

		if (userId_name != null && !"".equals(userId_name)) {
			query = String
					.format(" ( locate('%s',userId)>0 or locate('%s',userName)>0 or locate('%s',cHmPhone)>0 or locate('%s',cPhone)>0 or locate('%s',cMobile)>0 ) ",
							userId_name, userId_name, userId_name, userId_name,
							userId_name);
		}

		String sql = "SELECT COUNT(*) as num FROM imm_editOwner WHERE "
				+ areaId + " AND userType='" + userType + "'  AND " + query;

		/*
		 * Number number = jdbcTemplate.queryForObject(sql, Integer.class);
		 * 
		 * int totalNum = (number != null ? number.intValue() : 0); return
		 * totalNum;
		 */

		List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql);
		return Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
				.get("num").toString());
	}

	// 根据用户id 删除用户基本信息
	@Override
	public boolean deleteUserInfo(String userId) {
		try {
			String sql = "DELETE  FROM imm_userinfo WHERE userId = ?";
			Object[] param = new String[] { userId };
			int totalNum = jdbcTemplate.update(sql, param);
			if (totalNum > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	// 根据用户id 删除客户属性
	@Override
	public boolean deleteCustomerattr(String userId) {
		try {
			String sql = "DELETE  FROM imm_customerattr WHERE userId = ?";
			Object[] param = new String[] { userId };
			int totalNum = jdbcTemplate.update(sql, param);
			if (totalNum > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	// 根据用户id 删除操作员属性
	@Override
	public boolean deleteOperatorattr(String userId) {
		try {
			String sql = "DELETE  FROM imm_operatorattr WHERE userId = ?";
			Object[] param = new String[] { userId };
			int totalNum = jdbcTemplate.update(sql, param);
			if (totalNum > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	// 根据用户id 删除所有联系人
	@Override
	public boolean deleteContactInfosByUserId(String userId) {
		try {
			String sql = "DELETE FROM imm_usercont WHERE userId  = ?";
			Object[] param = new String[] { userId };
			jdbcTemplate.update(sql, param);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public BasicUserInfoPojo findBasicUserInfoByUserId(String userId,
			List<String> areaIds) {
		String sql = "SELECT userId, userName FROM imm_userinfo WHERE  userId = '%s' and areaId in ('%s') and userType=1 ";
		List<BasicUserInfoPojo> list = null;

		try {
			list = jdbcTemplate.query(String.format(sql, userId,
					Objects.Joiner("','", areaIds)),
					new BeanPropertyRowMapper<BasicUserInfoPojo>(
							BasicUserInfoPojo.class));
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	@Override
	public String findCenterById(String centerId) {
		String sql = "SELECT centerName FROM imm_center WHERE centerId=?";
		Object[] param = new Object[] { centerId };
		try {
			/*
			 * String centerName = jdbcTemplate.queryForObject(sql, param,
			 * String.class); return centerName;
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					param);
			return Objects.isNull(lists) ? null : lists.get(0)
					.get("centerName").toString();
		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public boolean hasRecord(String userId, String contId) {
		String sql = "select count(*) as num from imm_usercont where userId=? AND contId=?";
		Object[] param = new Object[] { userId, contId };
		try {
			/*
			 * Number number = jdbcTemplate.queryForObject(sql, param,
			 * Integer.class); int row = (number != null ? number.intValue() :
			 * 0);
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					param);
			int row = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
			if (row > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public String getRoleIdByUserId(String userId) {
		String sql = "select roleId from imm_userinfo where userId=?";

		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					userId);
			if (result != null && !result.isEmpty()) {
				return (String) result.get(0).get("roleId");
			}
			return null;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getUserIdsByRoleIds(List<String> roleIds) {

		String sql = "select userId from imm_userinfo where roleId in ('%s')";
		List<String> userIds = new ArrayList<String>();
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(String
					.format(sql, Objects.Joiner("','", roleIds)));
			for (Map<String, Object> map : result) {
				userIds.add(map.get("userId").toString());
			}
			return userIds;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<String> getUserIdsByPhoneNo(String phoneNo) throws Exception {

		String sql = "select distinct(userId) from  imm_customerattr customerattr where locate('%s',customerattr.cPhone)>0 ";

		List<Map<String, Object>> list = jdbcTemplate.queryForList(String
				.format(sql, phoneNo));

		List<String> userIds = new ArrayList<String>();

		if (Objects.isNotNull(list)) {

			for (Map<String, Object> map : list) {
				userIds.add(map.get("userId").toString());
			}
		}
		return userIds;
	}

	// 查询所有机主用户编号用户
	public List<Map<String, Object>> getOwnerInfoImpl() {
		String sql = "SELECT userId  FROM imm_userinfo WHERE userType = '1'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
	}
}
