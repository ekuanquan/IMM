package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.DropDownDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.pojo.DropDownPojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.service.DropDownService;

@Service("DropDownService")
public class DropDownServiceImpl implements DropDownService {
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	@Resource
	DropDownDao dropDownDao;
	@Resource
	UserInfoDao userInfoDao;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ResultPojo getOwnerDropDown(String dropDownName) {
		List<DropDownPojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();

		try {
			if (dropDownName.equals("business")) {
				list = dropDownDao.findBusinessInfo();
			} else if (dropDownName.equals("userServerType")) {
				list = dropDownDao.findUserServerType();
			} else {

			}
			for (int i = 0; list != null && i < list.size(); i++) {
				jsonList.add(list.get(i));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			returnVal.setResult("1", "查询失败", e.toString());
		}
		returnVal.setPojo("dropDownPojo", jsonList);
		return returnVal;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ResultPojo getDevIdDropDown(String roleid) {
		List<RoleZonePojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();
		try {
			list = dropDownDao.findDevId(roleid);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(list.get(i));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "查询失败", e.getMessage());
		}
		returnVal.setPojo("dropDownPojo", jsonList);
		return returnVal;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public ResultPojo getAlarmDevIdDropByOwnerId(String ownerId) {
		List<RoleZonePojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();
		try {
			list = dropDownDao.findAlarmDevId(ownerId);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(list.get(i));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			returnVal.setResult("1", "查询失败", e.toString());
		}
		returnVal.setPojo("dropDownPojo", jsonList);
		return returnVal;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ResultPojo getNVRDevIdDropByRoleId(String roleid) {
		List<RoleZonePojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();
		try {
			list = dropDownDao.findNVRDevId(roleid);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(list.get(i));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			returnVal.setResult("1", "查询失败", e.toString());
		}
		returnVal.setPojo("dropDownPojo", jsonList);
		return returnVal;
	}

	@Override
	public ResultPojo getMonitorByDevId(String devId) {
		List<RoleZonePojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		try {
			list = dropDownDao.findMonitorByDevId(devId);

			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			returnVal.setResult("1", "查询失败", e.toString());
		}
		returnVal.setPojo("dropDownPojo", list);
		return returnVal;
	}

}
