package com.znyw.tool;

public class ConfigUtil {
	public final static PropertyConfigUtil propertyconfig=PropertyConfigUtil.getInstance("properties/config.properties");
	private static String ROOT = "0310";

	public static void setRoot(String id) {
		if (id != null) {
			ROOT = id;
		}
	}

	/**
	 * 
	 * 获取本平台ID（区域树的根节点）
	 * 
	 * @return
	 */
	public static String getRoot() {
		return ROOT;
	}

	/**
	 * 获取本平台ID
	 * 
	 * @return
	 */
	public static String getPlatformId() {
		return ROOT;
	}
}
