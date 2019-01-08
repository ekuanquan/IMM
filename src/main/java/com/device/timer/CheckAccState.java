package com.device.timer;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.Session;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.context.ContextLoader;

public class CheckAccState {
	private static Logger log = Logger.getLogger(CheckAccState.class);
	
	private static int Max_AccSevNum = 10000;
	private static JmsTemplate jmsTemplate=null;
	private static String activemqPath;
	
	private static Map<String, Destination> destinations = new HashMap<String, Destination>();
	private static Map<String, Destination> destinationHears = new HashMap<String, Destination>();
	
	
	private static ReadWriteLock DestinationL = new ReentrantReadWriteLock();  
	
	
    private static ApplicationContext appContext = null;
    	
	public CheckAccState()
	{		
	
		String path=this.getClass().getResource("/").getPath();
		log.info("【=======CheckAccState:path="+path); 
		String websiteURL = (path.replace("/build/classes", "").replace("%20"," ").replace("classes/", "") + "cas.properties");
		log.info("【=======CheckAccState:websiteURL="+websiteURL); 
		File file = new File(websiteURL);
		if (!file.exists()) {
			websiteURL = path + "properties/jms.properties";
			log.info("【=======CheckAccState:2.websiteURL="+websiteURL); 
		}
		String str = ReadPropertiesFile(websiteURL,"brokerUrl");//读取MQ路径
		int size1 = str.indexOf("(");
		int size2 = str.indexOf(")");
		activemqPath = str.substring(size1+1,size2);
		log.info("【=======CheckAccState:activemqPath="+activemqPath);  
		
	}
	
	public static void setAppContext(ApplicationContext wac){
		if(wac!=null){
			appContext=wac;
		}
		else{
			log.info("===err=== appContext=null");
		}
	}
	
	public static ApplicationContext getAppContext(){
		while(appContext==null){
			log.info("get = ContextLoader.getCurrentWebApplicationContext");
			try{
				appContext = ContextLoader.getCurrentWebApplicationContext();
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				log.error(e.getMessage(), e);
			}
		}
		return appContext;
	}
	
	
	private String ReadPropertiesFile(String strfilePath,String strProperty) {
		String strRes = "";
		Properties prop = new Properties();
		try {
			InputStream in = new BufferedInputStream(new FileInputStream(
					strfilePath));
			prop.load(in); // /加载属性列表
			strRes = prop.getProperty(strProperty);
			System.out.println(strRes);
			in.close();

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			strRes = "";
		}
		return strRes;
	}
	
	public static void setMaxAccNum(int num){
		Max_AccSevNum=num;
	}
	
	public static int getMaxAccNum(){
		return Max_AccSevNum;
	}
	
	public static boolean SplitMid(String mId,String[] id){
		int n = mId.indexOf("***");
	    if (n >= 0) {
			String[] tempid={"",""};
			tempid=mId.split("\\*\\*\\*"); 
			id[0]=tempid[0];
			id[1]=tempid[1];
			return true;
	    }
	    else
	    	return false;
	}
	
	public static JmsTemplate getJmsTemplate(){
        if(appContext==null){
            getAppContext();
        }
        jmsTemplate = (JmsTemplate)appContext.getBean("jmsTemplate");
        return jmsTemplate;
    }
	
	public static void setDestination(String mid,boolean IsSid){	
		DestinationL.writeLock().lock();// 取到写锁      
		String[] tempid={"",""};
		if(!SplitMid(mid,tempid)){
			log.info("=====err=====setDestination:SplitMid:messageIdRsp="+mid);   
		}
		if(!destinations.containsKey(tempid[0])){
			Destination destination = null,destinationHear = null;
			ConnectionFactory connectionFactory = null;
			Connection connection = null;
			Session session;
			connectionFactory = new ActiveMQConnectionFactory(
	                ActiveMQConnection.DEFAULT_USER,
	                ActiveMQConnection.DEFAULT_PASSWORD,
	                activemqPath);
	        try {
	            connection = connectionFactory.createConnection();
	            connection.start();
	            session = connection.createSession(Boolean.TRUE,
	                    Session.AUTO_ACKNOWLEDGE);
	            destination = session.createQueue(tempid[0]);	
	            if(!IsSid)
	            	destinationHear = session.createQueue(tempid[0]+"-HeartBeatRsp");
	            session.commit();
	        } catch (Exception e) {
				log.error(e.getMessage(), e);
	        } finally {
	            try {
	                if (null != connection)
	                    connection.close();
	            } catch (Throwable ignore) {
	            }
	        }
	        destinations.put(tempid[0],destination);
	        if(!IsSid)
	        	destinationHears.put(tempid[0],destinationHear);
		}
		DestinationL.writeLock().unlock();// 释放写锁  
	}
	
	public static Destination getdestination(String mid){
		String[] tempid={"",""};
		if(!SplitMid(mid,tempid)){
			log.info("=====err=====getdestination:SplitMid:messageIdRsp="+mid); 
		}
		if(destinations.containsKey(tempid[0])){	
			return destinations.get(tempid[0]);
		}
		return null;
	}
	
	public static Destination getdestinationHear(String mid){
		String[] tempid={"",""};
		if(!SplitMid(mid,tempid)){
			log.info("=====err=====getdestinationHear:SplitMid:messageIdRsp="+mid); 
		}
		if(destinationHears.containsKey(tempid[0])){	
			return destinationHears.get(tempid[0]);
		}
		return null;
	}
}
