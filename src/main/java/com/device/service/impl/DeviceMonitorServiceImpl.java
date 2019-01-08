package com.device.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.Resource;
import javax.jms.Destination;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.device.dao.IDeviceMonitorDao;
import com.device.pojo.DeviceInfoPojo;
import com.device.service.IDeviceMonitorService;
import com.device.service.IProducerService;
import com.device.timer.CheckAccState;
import com.znyw.pojo.DeviceDataPojo;
import com.znyw.tool.ErrorcodeEnum;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class DeviceMonitorServiceImpl implements IDeviceMonitorService {
	Logger logger = LoggerFactory.getLogger(getClass());
	@Resource
	private IDeviceMonitorDao iDeviceMonitorDao;
	IProducerService iProducerService = new ProducerServiceImpl();
	@Autowired
	@Qualifier("accessDev")
	private Destination accessDev;
	@Autowired
	@Qualifier("accessHeartBeatRsp")
	private Destination accessHeartBeatRsp;
	@Resource
	JmsTemplate accessJMSTemplate;

	private ExecutorService pool;

	public DeviceMonitorServiceImpl() {
		super();
		pool = Executors.newFixedThreadPool(9);
	}

	@Override
	public JSONObject getDeviceListByUserId(JSONObject jsonParam) {
		String devName = jsonParam.getString("devName");
		String userId = jsonParam.getString("userId");
		if (null == userId || "".equals(userId)) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.UNLOGIN_ERROR.getErrorcode(),
					ErrorcodeEnum.UNLOGIN_ERROR.getDescribe(), false);
		}

		List<DeviceDataPojo> deviceList = new ArrayList<DeviceDataPojo>();
		Set<DeviceDataPojo> areaList = new HashSet<DeviceDataPojo>();

		try {
			deviceList = iDeviceMonitorDao.getDeviceListByUserId(userId, devName);

			if (Objects.isNotNullString(devName)) {
				areaList = iDeviceMonitorDao.getAreaList();
			} else {
				final List<String> areaIDs = new ArrayList<>();
				for (int i = 0; i < deviceList.size(); i++) {
					areaIDs.add(deviceList.get(i).getParentId());
				}
				areaList = iDeviceMonitorDao.getAreaListByAreaIDs(areaIDs);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		deviceList.addAll(areaList);

		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				deviceList);
	}

	@Override
	public JSONObject getDeviceInfoById(JSONObject jsonParam) {
		String deviceId = jsonParam.getString("deviceId");

		if (Objects.isNullString(deviceId)) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.PARAMS_ERROR.getErrorcode(),
					ErrorcodeEnum.PARAMS_ERROR.getDescribe(), false);
		}

		try {
			DeviceInfoPojo deviceInfo = iDeviceMonitorDao.getDeviceInfoById(deviceId);
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					deviceInfo);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject getUrlByDeviceId(JSONObject jsonParam) {
		String deviceId = jsonParam.getString("deviceId");

		if (Objects.isNullString(deviceId)) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.PARAMS_ERROR.getErrorcode(),
					ErrorcodeEnum.PARAMS_ERROR.getDescribe(), false);
		}
		try {
			String playUrl = iDeviceMonitorDao.getUrlByDeviceId(deviceId);
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					playUrl);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject getUrlListByDeviceIds(JSONObject jsonParam) {
		String deviceIds = jsonParam.getString("deviceIds");
		if (Objects.isNullString(deviceIds)) {
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.PARAMS_ERROR.getErrorcode(),
					ErrorcodeEnum.PARAMS_ERROR.getDescribe(), false);
		}

		try {
			JSONObject jsonResult = iDeviceMonitorDao.getUrlListByDeviceIds(deviceIds);
			return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
					jsonResult);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public void resolveAccMessage(String messageIdRsp, String cmdType, String msg) {
		JSONObject jsonObject = JSONObject.parseObject(msg);
		if (cmdType.equals("GetDevList"))// 获取设备列表
		{
			getDeviceListMessage(messageIdRsp, accessDev, accessJMSTemplate);
		} else if (cmdType.equals("HeartBeat"))// 心跳
		{
			String messageId = jsonObject.getString("jsonObject");
			String messageText = "{\"messageId\":\"" + messageId + "\"," + "\"cmdType\":\"HeartBeatRsp\"}";
			iProducerService.sendMessage(accessHeartBeatRsp, messageText, accessJMSTemplate);
		} else {
		}

	}

	private void getDeviceListMessage(String messageIdRsp, Destination sendTopicDestination, JmsTemplate jmsTemplate) {
		logger.info("getDeviceListMessage--**获取设备列表开始**");
		int[] arr = { CheckAccState.getMaxAccNum(), 0 };
		String messageParam = iDeviceMonitorDao.getDeviceListByMaxAcc(messageIdRsp, /* uuid.toString() */messageIdRsp,
				arr);

		String[] tempid = { "", "" };
		if (!CheckAccState.SplitMid(messageIdRsp, tempid)) {
			logger.info("getDeviceListMessage==err:SplitMid:messageIdRsp={}", messageIdRsp);
		}
		String messageText = "{\"messageId\":\"" + tempid[0] + "\"," + "\"cmdType\":\"GetDevListRsp\","
				+ "\"queuesName\":\"" + messageIdRsp + "\"," + "\"messageParam\":[" + messageParam + "]}";

		logger.info("getDeviceListMessage--**从mq发送出去的信息是{}, mq队列是{}**", messageText, sendTopicDestination);
		iProducerService.sendMessage(sendTopicDestination, messageText, jmsTemplate);
	}
}
