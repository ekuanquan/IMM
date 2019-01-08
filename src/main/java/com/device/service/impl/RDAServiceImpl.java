package com.device.service.impl;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IRDADao;
import com.device.service.IRDAService;
import com.znyw.tool.ErrorcodeEnum;
import com.znyw.tool.ResultUtil;

@Service
public class RDAServiceImpl implements IRDAService {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	IRDADao iRDADao;

	@Override
	public JSONObject getDevUserInfoByUidRzoneCid(JSONObject jsonParam) {

		String userId = jsonParam.getString("userId");
		String roleZoneName = jsonParam.getString("roleZoneName");
		String codeId = jsonParam.getString("codeId");

		JSONObject info;
		try {
			info = iRDADao.getDevUserInfoByUidRzoneCid(userId, roleZoneName, codeId);

			if (info == null) {
				JSONObject info0 = iRDADao.getDevUserInfoByUidRzoneCid(userId, null, codeId);
				if (info0 == null) {
					String codeId2 = "000";
					JSONObject infoa = iRDADao.getDevUserInfoByUidRzoneCid(userId, roleZoneName, codeId2);
					if (infoa == null) {
						JSONObject infob = iRDADao.getDevUserInfoByUidRzoneCid(userId, null, codeId2);
						if (infob == null) {
							JSONObject infoc = iRDADao.getDevUserInfoByUidRzoneCid(userId, roleZoneName, codeId2);
							if (infoc == null) {
								log.error(
										"getDevUserInfoByUidRzoneCid userId={},roleZoneName={},codeId={} ,return code=1005",
										userId, roleZoneName, codeId);
								return ResultUtil.jsonResultBasic(ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
										ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
							}
							infoc.put("eventDesc", "接收到未定义的代码(" + codeId + ")");
							return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
									ErrorcodeEnum.SUCCESS.getDescribe(), infoc);
						}
						infob.put("accountZone", "0000");
						infob.put("devZoneId", "0000");
						infob.put("eventDesc", "接收到未定义的代码(" + codeId + ")");
						return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
								ErrorcodeEnum.SUCCESS.getDescribe(), infob);
					}
					infoa.put("eventDesc", "接收到未定义的代码(" + codeId + ")");
					return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
							ErrorcodeEnum.SUCCESS.getDescribe(), infoa);
				}
				info0.put("accountZone", "0000");
				info0.put("devZoneId", "0000");
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
						ErrorcodeEnum.SUCCESS.getDescribe(), info0);
			}
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					info);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject getCameraListByUid(JSONObject jsonParam) {

		String ownerId = jsonParam.getString("ownerId");

		JSONArray list;
		try {
			list = iRDADao.getCameraListByUid(ownerId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				list);
	}

}