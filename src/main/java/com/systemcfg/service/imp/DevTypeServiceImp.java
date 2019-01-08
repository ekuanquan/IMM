package com.systemcfg.service.imp;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.DevTypeDao;
import com.systemcfg.service.DevTypeService;
import com.znyw.tool.ResultUtil;

@Service
public class DevTypeServiceImp implements DevTypeService {
	private static final Logger LOGGER = LoggerFactory.getLogger(DevTypeServiceImp.class);

	@Resource
	private DevTypeDao devTypeDao;

	@Override
	public JSONObject listDevType() {

		List<Map<String, Object>> list = devTypeDao.listDevType();

		if (list == null) {
			ResultUtil.simpleResponse(204, "查询无结果");
		}
		return ResultUtil.jsonResultList(200, "查询成功", list);
	}

}
