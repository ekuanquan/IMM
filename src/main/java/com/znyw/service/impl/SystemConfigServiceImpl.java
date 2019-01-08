package com.znyw.service.impl;

import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.SystemConfigDao;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.SysConfigUnitPojo;
import com.znyw.pojo.SystemConfigPojo;
/**
 * 系统配置相关操作
 */
import com.znyw.service.SystemConfigService;

@Service
public class SystemConfigServiceImpl implements SystemConfigService {
	private static Logger logger = LoggerFactory
			.getLogger(SystemConfigServiceImpl.class);

	@Resource
	SystemConfigDao systemConfigDao;

	@Override
	public ResultPojo getSystemConfig(String types) {
		ResultPojo result = new ResultPojo();
		if (types == null || "".equals(types)) {
			result.setResult("201", "参数异常");
			result.setPojo("SystemConfig", null);
			return result;
		}
		List<SysConfigUnitPojo> list = null;
		try {
			list = systemConfigDao.getSystemConfig();// 获取所有的配置
		} catch (Exception e) {
			throw e;
		}
		if (list == null) {
			result.setResult("201", "数据库异常");
			result.setPojo("SystemConfig", null);
			return result;
		}
		String[] typeArr = types.split(";");
		JSONObject SystemConfig = new JSONObject();
		for (int i = 0; i < typeArr.length; i++) {
			String type = typeArr[i];
			if ("".equals(type)) {
				continue;
			}
			if ("forward110".equals(type) || "linkage".equals(type)) {
				SystemConfig.put(type, getArr(list, type));
			} else {
				SystemConfig.put(type, getValue(list, type));
			}
		}
		result.setResult("200", "成功");
		result.setPojo("SystemConfig", SystemConfig);

		return result;
	}

	private String getValue(List<SysConfigUnitPojo> list, String key) {
		Iterator<SysConfigUnitPojo> ite = list.iterator();
		while (ite.hasNext()) {
			SysConfigUnitPojo pojo = ite.next();
			String dataName = pojo.getDataName();
			if (dataName.equals(key)) {
				return pojo.getDataValue();
			}
		}
		return "";
	}

	private JSONArray getArr(List<SysConfigUnitPojo> list, String key) {
		Iterator<SysConfigUnitPojo> ite = list.iterator();
		JSONArray arr = new JSONArray();
		while (ite.hasNext()) {
			SysConfigUnitPojo pojo = ite.next();
			String dataName = pojo.getDataName();
			if (dataName.equals(key)) {
				arr.add(pojo.getDataValue());
			}
		}

		return arr;
	}

	@Override
	public ResultPojo updateSystemConfig(SystemConfigPojo pojo) {
		String isRecordShoot = pojo.getIsRecordShoot();// 是否启动设备录像
		String recordShootLen = pojo.getRecordShootLen();// 存储时长（s）
		String isScreenshots = pojo.getIsScreenshots();// 是否启动联动抓图
		String isPreset = pojo.getIsPreset();// 是否启动预置位跳转
		String fileType = pojo.getFileType();// 截图的文件类型
		String recordShootIP = pojo.getRecordShootIP();// 视频录像存储的服务器IP
		String recordShootPort = pojo.getRecordShootPort();// 视频录像存储的服务器Port
		String forward110 = pojo.getForward110();// 事件转发110预案的事件类型（多个，分号隔开）
		String linkage = pojo.getLinkage();// 事件联动方案的事件类型（多个，分号隔开）
		// 是否启动设备录像
		if (isRecordShoot != null && !"".equals(isRecordShoot)) {
			int row = updateString("isRecordShoot", isRecordShoot);
			logger.info("updateString is {},param is isRecordShoot and {}",
					row, isRecordShoot);
		}
		// 存储时长（s）
		if (recordShootLen != null && !"".equals(recordShootLen)) {
			int row = updateString("recordShootLen", recordShootLen);
			logger.info("updateString is {} . param is recordShootLen and {}",
					row, recordShootLen);
		}
		// 是否启动联动抓图
		if (isScreenshots != null && !"".equals(isScreenshots)) {
			int row = updateString("isScreenshots", isScreenshots);
			logger.info("updateString is {} . param is recordShootLen and {}",
					row, recordShootLen);
		}
		// 是否启动预置位跳转
		if (isPreset != null && !"".equals(isPreset)) {
			int row = updateString("isPreset", isPreset);
			logger.info("updateString is " + row + ". param is isPreset and "
					+ isPreset);
		}

		// 截图的文件类型
		if (fileType != null && !"".equals(fileType)) {
			int row = updateString("fileType", fileType);
			logger.info("updateString is {} param is fileType and {}", row,
					fileType);
		}

		// 视频录像存储的服务器IP
		if (recordShootIP != null && !"".equals(recordShootIP)) {
			int row = updateString("recordShootIP", recordShootIP);
			logger.info("updateString is {}. param is recordShootIP and {}",
					row, recordShootIP);
		}

		// 视频录像存储的服务器Port
		if (recordShootPort != null && !"".equals(recordShootPort)) {
			int row = updateString("recordShootPort", recordShootPort);
			logger.info("updateString is {}. param is recordShootPort and {}",
					row, recordShootPort);
		}

		// 事件转发110预案的事件类型（多个，分号隔开）
		if (forward110 != null && !"".equals(forward110)) {
			int row = updateList("forward110", forward110);
			logger.info("updateList is " + row + ". param is forward110 and "
					+ forward110);
		}

		// 事件联动方案的事件类型（多个，分号隔开）
		if (linkage != null && !"".equals(linkage)) {
			int row = updateList("linkage", linkage);
			logger.info("updateList is {}. param is linkage and {}", row,
					linkage);
		}
		ResultPojo result = new ResultPojo();
		result.setResult("200", "成功");
		return result;
	}

	private int updateString(String dataName, String value) {
		int row = systemConfigDao.updateSystemConfig(dataName, value);
		return row;
	}

	private int updateList(String dataName, String values) {
		if (values == null || "".equals(values)) {
			return -1;
		} else if ("-1".equals(values)) {
			// 删除全部信息
			int delRow = systemConfigDao.delAllSystemConfig(dataName);
			logger.info("delAllSystemConfig is {} bar. param is {}", delRow,
					dataName);
		}
		List<String> list = systemConfigDao.getListFromSystemConfig(dataName);// 原来的
		String[] typeArr = values.split(";");// 现在的
		int len = typeArr.length;
		// 如果不为空表示原来有值，就要进行比较了，如果是为空的表示原来没有，直接添加就好了
		if (list != null && !list.isEmpty()) {
			StringBuffer delSbf = new StringBuffer();// 要移除
			Iterator<String> ite = list.iterator();
			// 遍历后，delSbf是要移除的，typeArr剩下的是要添加的
			while (ite.hasNext()) {
				String type = ite.next();
				int i = 0;
				for (; i < len; i++) {
					String type2 = typeArr[i];
					if (type.equals(type2)) {
						typeArr[i] = "";
						break;
					}
				}
				// 遍历了一轮没有找到相同的，就代表这个是要删除的
				if (i >= len) {
					delSbf.append("'");
					delSbf.append(type);
					delSbf.append("',");
				}
			}
			String delStr = delSbf.toString();
			// 判断是否要删除
			if ("".equals(delStr)) {

			} else {
				delStr = delStr.substring(0, delStr.length() - 1);
				int delRow = systemConfigDao.delSystemConfig(dataName, delStr);
				logger.info("delSystemConfig is {} bar. param is {} and {}",
						delRow, dataName, delStr);
			}
		}

		// 判断是否要添加
		for (int i = 0; i < len; i++) {
			String type2 = typeArr[i];
			if ("".equals(type2)) {
				continue;
			} else {
				int row = systemConfigDao.addSystemConfig(dataName, type2);
				logger.info("addSystemConfig is {} bar. param is {} and {}",
						row, dataName, row, type2);
			}
		}
		return 1;
	}

}
