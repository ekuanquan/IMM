package com.znyw.tool;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;


public class SetField {
	private static final Logger LOGGER = Logger.getLogger(SetField.class);

	 //遍历实体类 为属性值为null的 属性添加空字符串
	public static void reflect(Object e) {
		Class<? extends Object> cls = e.getClass();
	        Field[] fields = cls.getDeclaredFields();  
	        for(int i=0; i<fields.length; i++){  
	            Field f = fields[i];  
	            f.setAccessible(true);  
			try {
				if (f.get(e) == null) {
					f.set(e, "");
				}
			} catch (IllegalArgumentException e1) {
				LOGGER.error(e1.getMessage(), e1);
			} catch (IllegalAccessException e1) {
				LOGGER.error(e1.getMessage(), e1);
			}
	        }   
	    }  
	 
	public static List<Map<String, Object>> removeNull(List<Map<String, Object>> list) {
		List<Map<String, Object>> listPojo = new ArrayList<Map<String, Object>>();
			for (int i = 0; i < list.size(); i++) {
				Map<String, Object> mepPojo = new HashMap<String, Object>();
				Map<String, Object> map2 = list.get(i);
				for (Map.Entry<String, Object> entry : map2.entrySet()) {
					mepPojo.put(entry.getKey(), entry.getValue());
					if(entry.getValue()==null){
						mepPojo.put(entry.getKey(), "");
					}
				}
				listPojo.add(mepPojo);
			}
			return listPojo;
	 }
}
