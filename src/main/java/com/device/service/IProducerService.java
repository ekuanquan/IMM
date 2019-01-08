package com.device.service;

import java.io.Serializable;
import java.util.Map;

import javax.jms.Destination;

import org.springframework.jms.core.JmsTemplate;


public interface IProducerService {
	public void sendMessage(Destination destination, 
			final Serializable message);
	public void sendMessage(Destination destination,
			final String message,JmsTemplate jmsTemplate);
	public void sendMessage(Destination destination,
			final Map<String, Object> message);
}
