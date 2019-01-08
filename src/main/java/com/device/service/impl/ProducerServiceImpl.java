package com.device.service.impl;

import java.io.Serializable;
import java.util.Map;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Component;

import com.device.service.IProducerService;

@Component
public class ProducerServiceImpl implements IProducerService {
	public void sendMessage(Destination destination, Serializable message) {
		// jmsTemplate.convertAndSend(destination, message);
	}

	public void sendMessage(Destination destination,final String message,JmsTemplate jmsTemplate) {
		jmsTemplate.send(destination, new MessageCreator() {  
            public Message createMessage(Session session) throws JMSException {  
                TextMessage textMessage = session.createTextMessage(message); 
                return textMessage;  
            }  
        });
	}

	public void sendMessage(Destination destination, final Map<String, Object> message) {
		/*jmsTemplate.send(destination, new MessageCreator() {  
            public Message createMessage(Session session) throws JMSException {  
                TextMessage textMessage = session.create(message); 
                return textMessage;  
            }  
        });*/
	}
}
