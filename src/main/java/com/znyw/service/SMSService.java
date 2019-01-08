package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface SMSService {
	/**
	 * 传入短信格式,须发号码,发送短信
	 * 
	 * @param message
	 * @param phones
	 * @return
	 */
	public JSONObject sendSMS(String message, String phones) throws Exception;

	/**
	 * 通过设备id给机主发送消息
	 * @param message
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public JSONObject sendSMSByDevId(String message, String devId) throws Exception;
}
