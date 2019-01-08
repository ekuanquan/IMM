package com.znyw.service.impl;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.znyw.dao.IdInfoDao;
import com.znyw.dao.RoleDao;
import com.znyw.dao.ValidateDao;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.ValidateService;

@Service("ValidateService")
public class ValidateServiceImpl implements ValidateService {
	private Logger log = Logger.getLogger(getClass());
	@Resource
	ValidateDao validateDao;

	@Resource
	private IdInfoDao idInfoDao;
	
	@Resource
	private RoleDao roleDao;

	public ResultPojo isCanUse(String validateName, String validateValue) {

		try {
			ResultPojo returnVal = new ResultPojo();// 结果
			// boolean result = false;
			if (validateName.equals("userId")) {
				// 用户表中是否已存在该ID？
				boolean isCanUseInUserInfo = validateDao
						.isUserIdCanUse(validateValue);
				// 在编号库中是否已存在？
				boolean isExistInIdentifier = idInfoDao
						.checkUsed(validateValue);

				if (isCanUseInUserInfo == false) {
					// 在用户信息表中已存在该ID
					returnVal.setResult("1", "用户编号已存在");
				} else if (isExistInIdentifier == false) {
					// 在编号库中不存在，说明该ID不符合规定
					returnVal.setResult("2", "用户编号格式有误");
				} else {
					// 该ID在用户信息表中不存在同时又是编号库中的编号，所以这个ID是可以使用的
					returnVal.setResult("0", "校验通过");
				}

			} else if (validateName.equals("userAccount")) {
				boolean isCanUse = validateDao
						.isUserAccountCanUse(validateValue);
				if (isCanUse == true) {
					returnVal.setResult("0", "校验通过");
				} else {
					returnVal.setResult("1", "用户账号已存在");
				}
			} else if (validateName.equals("devId")) {
				// 设备表中是否已存在该ID？
				boolean isCanUseInDevInfo = validateDao
						.isDevIdCanUse(validateValue);
				// 在编号库中是否已存在？
				boolean isExistInIdentifier = idInfoDao
						.checkUsed(validateValue);

				if (isCanUseInDevInfo == false) {
					// 在设备表中已存在该ID
					returnVal.setResult("1", "设备编号已存在");
				} else if (isExistInIdentifier == false) {
					// 在编号库中不存在，说明该ID不符合规定
					returnVal.setResult("2", "设备编号格式有误");
				} else {
					// 该ID在设备表中不存在同时又是编号库中的编号，所以这个ID是可以使用的
					returnVal.setResult("0", "校验通过");
				}
			} else if (validateName.equals("roleId")) {
				// 用户表中是否已存在该ID？
				int isCanUseInUserInfo = roleDao.getRoleInfo(validateValue);
					
				// 在编号库中是否已存在？
				boolean isExistInIdentifier = idInfoDao
						.checkUsed(validateValue);

				if (isCanUseInUserInfo == 1 || isCanUseInUserInfo==3) {
					// 在用户信息表中已存在该ID
					returnVal.setResult("1", "用户已存在");
				} else if (isExistInIdentifier == false) {
					// 在编号库中不存在，说明该ID不符合规定
					returnVal.setResult("2", "用户格式有误");
				} else {
					// 该ID在用户信息表中不存在同时又是编号库中的编号，所以这个ID是可以使用的
					returnVal.setResult("0", "校验通过");
				}

			}
			return returnVal;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean hasRecordForModify(String validateName, String validateValue) {

		if (validateName.equals("userId")) {
			// 用户表中是否已存在该ID？
			boolean isCanUseInUserInfo = validateDao
					.isUserIdCanUse(validateValue);

			return !isCanUseInUserInfo;
		} else if (validateName.equals("devId")) {
			boolean isCanUseInDevInfo = validateDao
					.isDevIdCanUse(validateValue);
			return !isCanUseInDevInfo;
		}
		return false;
	}

}
