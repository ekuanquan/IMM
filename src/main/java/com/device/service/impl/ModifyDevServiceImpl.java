package com.device.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.device.AOP.LogAnnotation;
import com.device.dao.IModDevDao;
import com.device.dao.IQueryDevDao;
import com.device.service.IModifyDevService;
import com.znyw.dao.AddDevice;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.VideoDao;
import com.znyw.pojo.AlarmhostPojo;
import com.znyw.tool.ErrorcodeEnum;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class ModifyDevServiceImpl implements IModifyDevService {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	IModDevDao iModDevDao;
	@Resource
	IQueryDevDao iQueryDevDao;
	@Resource
	private AddDevice addDevice;
	@Resource
	private DeviceDao deviceDao;
	@Resource
	private VideoDao videoDao;

	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject modifyAlarmhost(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			iModDevDao.modAlarmhostInfo(devId, jsonParam);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				null);
	}

	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject modifyWirenvr(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");
		//
		// Map<String, Object> map =
		// addDevice.findNVRByGbId(jsonParam.getString("gbId"));
		//
		// if (Objects.isNotNullMapWithObject(map) &&
		// !devId.equals(map.get("devId").toString())) {
		// return ResultUtil.simpleResponse("500", "国标ID重复");
		// }
		//

		boolean rel = false;
		try {
			rel = iModDevDao.modWirenvrInfo(devId, jsonParam);
			iModDevDao.qudapeCameraDevInfo(jsonParam); // 修改监控点devInfo表信息
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
		if (!rel) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				null);
	}

	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject modifyNetnvr(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		// Map<String, Object> map =
		// addDevice.findNVRByGbId(jsonParam.getString("gbId"));
		//
		// if (Objects.isNotNullMapWithObject(map) &&
		// !devId.equals(map.get("devId").toString())) {
		// return ResultUtil.simpleResponse("500", "国标ID重复");
		// }

		boolean rel = false;

		try {
			rel = iModDevDao.modNetnvrInfo(devId, jsonParam);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}

		if (!rel) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				null);
	}

	@Override
	public JSONObject modifyDevzone(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");
		String devZoneId = jsonParam.getString("devZoneId");

		boolean rel = false;

		try {
			rel = iModDevDao.modifyDevzone(devId, devZoneId, jsonParam);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
		if (!rel) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				null);
	}

	@Override
	public JSONObject modifyCamera1(JSONObject jsonParam) {
		String devId = jsonParam.getString("devId"); // 拿到监控点编号

		try {
			int num = iModDevDao.queryAlalmhostcha(devId); // nvr编号

			if (num == 1) {
				// Map<String, Object> map =
				// addDevice.findNVRByGbId(jsonParam.getString("gbId"));
				// if (Objects.isNotNullMapWithObject(map)) {
				// return ResultUtil.simpleResponse("500", "国标ID重复");
				// }

				String nvrId = jsonParam.getString("nvrId");

				if (Objects.isNullString(nvrId)) {
					return ResultUtil.simpleResponse("500", "修改失败", "缺少字段 nvrId,NVR设备编号");

				}

				// 检查对应的通道号和监控点编号是否已经存在
				List<?> camaList = iModDevDao.queryNVRCamerInfo(nvrId);
				String newChannelId = jsonParam.getString("devChannelId");
				String devMonitorId = jsonParam.getString("devMonitorId");
				for (int i = 0; i < camaList.size(); i++) {
					Map<?, ?> map = (Map<?, ?>) camaList.get(i);
					String devChannelId = map.get("devChannelId") + "";
					
					if (devChannelId.equals(newChannelId) && !devMonitorId.equals(map.get("devMonitorId").toString())) {
						return ResultUtil.simpleResponse("500", "通道号已经存在");
					}
				}
				if (jsonParam.getString("devMonitorId").equals("") || jsonParam.getString("cameraName").equals("")
						|| jsonParam.getString("devChannelId").equals("") || jsonParam.getString("atPos").equals("")
						|| jsonParam.getString("instDate").equals("")) {
					return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
							ErrorcodeEnum.LACK_ERROR.getDescribe(), null);
				}

				iModDevDao.modifyCamera(devId, jsonParam);
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
						ErrorcodeEnum.SUCCESS.getDescribe(), null);
			}

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}

		return ResultUtil.jsonResultBasic(ErrorcodeEnum.QueryNull_ERROR.getErrorcode(),
				ErrorcodeEnum.QueryNull_ERROR.getDescribe(), null);
	}

	@Override
	public JSONObject addHaveCamera(JSONObject jsonParam) { // 添加有线nvr监控点

		String devId = jsonParam.getString("devId");
		String cameraDevId = jsonParam.getString("cameraDevId");
		List<?> camaList;
		int existNum = 0;
		try {
			existNum = iModDevDao.queryNVRCamerNum(devId); // 已经存在数
			camaList = iModDevDao.queryNVRCamerInfo(devId); // 监控点信息
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		// 检查对应的通道号和监控点编号是否已经存在
		String addChanne = jsonParam.getString("devChannelId");
		String addMonitor = jsonParam.getString("devMonitorId");
		for (int i = 0; i < camaList.size(); i++) {
			Map<?, ?> map = (Map<?, ?>) camaList.get(i);
			String channe = map.get("devChannelId") + "";
			String monitor = map.get("devMonitorId") + "";
			if (channe.equals(addChanne) || monitor.equals(addMonitor)) {
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.NOEXISTcf_ERROR.getErrorcode(),
						ErrorcodeEnum.NOEXISTcf_ERROR.getDescribe(), null);
			}
		}
		if (jsonParam.getString("devMonitorId").equals("") || jsonParam.getString("cameraName").equals("")
				|| jsonParam.getString("devChannelId").equals("") || jsonParam.getString("atPos").equals("")
				|| jsonParam.getString("instDate").equals("")) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.LACK_ERROR.getDescribe(), null);
		}

		try {
			// Map<String, Object> map =
			// addDevice.findNVRByGbId(jsonParam.getString("gbId"));
			//
			// if (Objects.isNotNullMapWithObject(map)) {
			// return ResultUtil.simpleResponse("500", "国标ID重复");
			// }
			//
			JSONObject info = iQueryDevDao.queryWirenvrInfo(devId);
			iModDevDao.addNVRHaveCammer(info, jsonParam, cameraDevId, existNum);
			
			// 关联NVR监控点
			String ownerMonitorId = getNextDevMonitorId(info.getString("ownerId"));

			deviceDao.addOwnermonitor(info.getString("ownerId"),devId,
					(String)jsonParam.getString("devMonitorId"),ownerMonitorId,
					(String)jsonParam.get("dataFrom"));
			
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					null);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	@SuppressWarnings({ "unused", "rawtypes" })
	@Override
	public JSONObject addNoCamera(JSONObject jsonParam) { // 添加无线nvr监控点

		String devId = jsonParam.getString("devId");
		String cameraDevId = jsonParam.getString("cameraDevId");
		int alreadyExistNum = 0;
		int canExistNum = 0;
		List camaList;

		try {
			alreadyExistNum = iModDevDao.queryNVRCamerNum(devId); // 已经存在数
			canExistNum = iModDevDao.queryNVRCamerNumZone(devId); // 可以存在数
			camaList = iModDevDao.queryNVRCamerInfo(devId); // 监控点信息
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		// 检查对应的通道号和监控点编号是否已经存在
		String addChanne = jsonParam.getString("devChannelId");
		String addMonitor = jsonParam.getString("devMonitorId");
		for (int i = 0; i < camaList.size(); i++) {
			Map map = (Map) camaList.get(i);
			String channe = map.get("devChannelId") + "";
			String monitor = map.get("devMonitorId") + "";
			if (channe.equals(addChanne) || monitor.equals(addMonitor)) {
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.NOEXISTcf_ERROR.getErrorcode(),
						ErrorcodeEnum.NOEXISTcf_ERROR.getDescribe(), null);
			}
		}
		if (jsonParam.getString("devMonitorId").equals("") || jsonParam.getString("cameraName").equals("")
				|| jsonParam.getString("devChannelId").equals("") || jsonParam.getString("atPos").equals("")) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.LACK_ERROR.getDescribe(), null);
		}

		try {
			JSONObject info = iQueryDevDao.queryNetnvrInfo(devId);

			// Map<String, Object> map =
			// addDevice.findNVRByGbId(jsonParam.getString("gbId"));
			//
			// if (Objects.isNotNullMapWithObject(map)) {
			// return ResultUtil.simpleResponse("500", "国标ID重复");
			// }
			

			iModDevDao.addNVRNoCammer(info, jsonParam, cameraDevId, alreadyExistNum);
			
			// 关联NVR监控点
			String ownerMonitorId = getNextDevMonitorId(info.getString("ownerId"));

			deviceDao.addOwnermonitor(info.getString("ownerId"),devId,
					(String)jsonParam.getString("devMonitorId"),ownerMonitorId,
					(String)jsonParam.get("dataFrom"));
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					null);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	private String getNextDevMonitorId(String ownerId) throws Exception {

		String maxMonitorId = videoDao.getCurrentMaxOwnerMonitorId(ownerId);

		String ownerMonitorId = String.valueOf(Integer.valueOf(maxMonitorId) + 1);

		while (ownerMonitorId.length() < 4) {
			ownerMonitorId = "0" + ownerMonitorId;
		}
		
		return ownerMonitorId;
	}
	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject delAlarmhost(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			JSONObject info = iQueryDevDao.queryDevInfo(devId);
			if (info == null) {
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.NOEXIST_ERROR.getErrorcode(),
						ErrorcodeEnum.NOEXIST_ERROR.getDescribe(), null);
			} else if (info.getString("ownerId") != null && !"".equals(info.getString("ownerId"))) {
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.OCCUPIED_ERROR.getErrorcode(),
						ErrorcodeEnum.OCCUPIED_ERROR.getDescribe(), null);
			}
			deviceDao.deleteByDevId(devId);
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					null);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject delWirenvr(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			JSONObject info = iQueryDevDao.queryDevInfo(devId);
			if (info == null) {
				log.error("delWirenvr devId={},return code=1007", devId);
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.NOEXIST_ERROR.getErrorcode(),
						ErrorcodeEnum.NOEXIST_ERROR.getDescribe(), null);
			} else if (info.getString("ownerId") != null && !"".equals(info.getString("ownerId"))) {
				log.error("delWirenvr devId={},return code=1006", devId);
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.OCCUPIED_ERROR.getErrorcode(),
						ErrorcodeEnum.OCCUPIED_ERROR.getDescribe(), null);
			}
			deviceDao.deleteByDevId(devId);

			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					null);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	@LogAnnotation(whitelog = "1000")
	@Override
	public JSONObject delNetnvr(String userName, String userId, JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			JSONObject info = iQueryDevDao.queryDevInfo(devId); // 查询设备信息
			if (info == null) {
				log.error("delNetnvr devId={},return code=1007", devId);
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.NOEXIST_ERROR.getErrorcode(),
						ErrorcodeEnum.NOEXIST_ERROR.getDescribe(), null);
			} else if (info.getString("ownerId") != null && !"".equals(info.getString("ownerId"))) { // 判断是否有机主在用，如果有就不允许删除
				log.error("delNetnvr devId={},return code=1006", devId);
				return ResultUtil.jsonResultBasic(ErrorcodeEnum.OCCUPIED_ERROR.getErrorcode(),
						ErrorcodeEnum.OCCUPIED_ERROR.getDescribe(), null);
			}
			deviceDao.deleteByDevId(devId);

			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					null);

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	@Override
	public JSONObject copyDevice(String devId,List<String> deviceList){
		AlarmhostPojo info;
		try {
			info = iQueryDevDao.queryAlarmhostInfo(devId);
			if (info == null) {
				return ResultUtil.jsonResultBasic(
						ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
						ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
			}else {
				iModDevDao.copyDevice(deviceList,JSONObject.parseObject(JSON.toJSONString(info)));
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "复制失败", e.getMessage());
		}

		return ResultUtil.simpleResponse("200", "复制成功", "");
	}
}
