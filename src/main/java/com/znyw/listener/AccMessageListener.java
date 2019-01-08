package com.znyw.listener;

import java.io.UnsupportedEncodingException;

import javax.annotation.Resource;
import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.device.service.IDeviceMonitorService;
/*
 * 与新接入、sip服务器的MQ
 * */
@Component
public class AccMessageListener implements MessageListener {
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	
	
	public AccMessageListener() {
		super();
	}

	@Resource
	IDeviceMonitorService iDeviceMonitorService;
			
	@Override
	public void onMessage(Message message) {
		//log.info("[收到activeMQ消息:AccessClient]。。。。。。。。。。。。。");
		if (message instanceof TextMessage) {
			TextMessage textMsg = (TextMessage) message;
			try {
				//log.info("[收到消息:AccessClient]   " + textMsg.getText());
				String messageResult = textMsg.getText();
				if(messageResult!=""&&messageResult.length()!=0){
					JSONObject jsonMessageResult = (JSONObject) JSONObject.parse(messageResult);
					String cmdType = jsonMessageResult.getString("cmdType");
					String queuesName = jsonMessageResult.getString("messageId");
					String accessId = jsonMessageResult.getString("accessId");
					String messageIdRsp = queuesName+"***"+accessId;
					/*if(!cmdType.equals("HeartBeat"))
						log.info("[收到消息:AccessClient]   " + textMsg.getText());*/
															
					//System.out.println("[AccessClient] cmdType="+cmdType+", messageIdRsp="+messageIdRsp);
					log.info("[AccessClient] cmdType="+cmdType+", messageIdRsp="+messageIdRsp);
					iDeviceMonitorService.resolveAccMessage(messageIdRsp,cmdType,messageResult);
				}
			} catch (JMSException e) {
				log.error(e.getMessage(), e);
			}
		} else if (message instanceof MapMessage) {
			String readxml=null;
			try {
				readxml = ((MapMessage) message).getString("message");
			} catch (JMSException e) {
				log.error(e.getMessage(), e);
			}
		} else if (message instanceof BytesMessage){
			BytesMessage bytesmessage=(BytesMessage)message; 
        	byte dataBuf[];
        	try {
				dataBuf = new byte[new Long(bytesmessage.getBodyLength()).intValue()];
				bytesmessage.readBytes(dataBuf);
				log.info("=====Access==== {}", bytesmessage.getStringProperty("type"));
				String readxml = new String(dataBuf, "GBK");
				
			} catch (JMSException e) {
				log.error(e.getMessage(), e);
			} catch (UnsupportedEncodingException e) {
				log.error(e.getMessage(), e);
			}
			
		}
		
	}

}
