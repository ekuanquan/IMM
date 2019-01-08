package com.znyw.tool;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jms.Message;

import com.alibaba.fastjson.JSONObject;


public class ResultJson {
	
	/**
	 * 参数为空
	 * @return
	 */
	public static JSONObject papmisNull(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "参数为空！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * TUTK已经存在
	 * @return
	 */
	public static JSONObject aldeayTUTKID(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "P2P ID 已经存在！");
		errorResult.put("code", "250");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 查询数据无结果
	 * @return
	 */
	public static JSONObject Resultimage(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "数据库已经存在该设备编号！");
		errorResult.put("code", "201");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 通道号数和通道号名字数不相等
	 * @return
	 */
	public static JSONObject errorNum(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "通道号数和通道号名字数不相等！");
		errorResult.put("code", "201");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 查询数据无结果
	 * @return
	 */
	public static JSONObject queryNo(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "查询数据无结果！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 信息不全添加失败
	 * @return
	 */
	public static JSONObject insertFaler(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "信息不全添加失败！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 服务器错误，Controller 抛出的最外层错误
	 * 
	 * @return
	 */
	public static JSONObject serverErro() {
		JSONObject message = new JSONObject();
		JSONObject errorResult = new JSONObject();
		errorResult.put("message", "服务器错误！");
		errorResult.put("code", "500");
		message.put("result", errorResult);
		return message;
	}
	
	/**
	 * Controller 抛出的最外层错误
	 * 
	 * @return
	 */
	public static JSONObject serverErro(String detail) {
		JSONObject message = new JSONObject();
		JSONObject errorResult = new JSONObject();
		errorResult.put("message", "服务器错误！");
		errorResult.put("detail", detail);
		errorResult.put("code", "500");
		message.put("result", errorResult);
		return message;
	}
	
	/**
	 * 添加失败
	 * 
	 * @return
	 */
	public static JSONObject insertFail(String key) {
		JSONObject message = new JSONObject();
		JSONObject errorResult = new JSONObject();
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", String.format("添加失败！字段：%s 不合法 ...", key));
		errorResult.put("code", "500");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}

	/**
	 * 添加成功
	 * 
	 * @return
	 */
	public static JSONObject insertSuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "添加成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 删除成功
	 * @return
	 */
	public static JSONObject deleteSuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "删除成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);
		return message;
	}
	/**
	 * 删除失败
	 * @return
	 */
	public static JSONObject deleteFailier(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "删除失败！");
		errorResult.put("code", "100");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);
		return message;
	}
	
	/**
	 * NVR有线添加成功
	 * @return
	 */
	public static JSONObject insertNVRSuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "NVR有线添加成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * NVR无线添加成功
	 * @return
	 */
	public static JSONObject insertNVRnoSuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "NVR无线添加成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 更新报警主机信息不全
	 * @return
	 */
	public static JSONObject updateFaler(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "更新报警主机信息不全！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 找不到该设备编号
	 * @return
	 */
	public static JSONObject updateNoFind(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "找不到该设备编号！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 设备编号数不是1
	 * @return
	 */
	public static JSONObject updateFull(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "设备编号数不是1！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 查询信息编号为空
	 * @return
	 */
	public static List queryPerNo(){
		List list = new ArrayList();
		Map<String, String> map = new HashMap<String, String>();
		map.put("message", " 查询信息编号为空");
		map.put("code", "200");
		list.add(map);
		return list;
	}
	
	/**
	 * 查询異常
	 * @return
	 */
	public static List queryList(String detail){
		List list = new ArrayList();
		Map<String, String> map = new HashMap<String, String>();
		map.put("message", " 查询信息编号为空");
		map.put("code", "200");
		map.put("detail", detail);
		list.add(map);
		return list;
	}
	
	/**
	 * 查询成功
	 * @return
	 */
	public static JSONObject querySuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "查询成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 查询到的结果小于1或大于1
	 * @return
	 */
	public static List  queryError(){
		List list = new ArrayList();
		Map<String, String> map = new HashMap<String, String>();
		map.put("message", " 查询到的结果小于1或大于1");
		map.put("code", "200");
		list.add(map);
		return list;
	}
	
	/**
	 * 查询到的结果小于1或大于1
	 * @return
	 */
	public static JSONObject  queryErrorJSON(){
		JSONObject message = new JSONObject() ;
		Map<String, String> map = new HashMap<String, String>();
		map.put("message", " 查询到的结果小于1或大于1");
		map.put("code", "201");
		message.put("result", map);
		return message;
	}
	
	/**
	 * 添加失败
	 * @return
	 */
	public static JSONObject fail(String msg) {
		JSONObject message = new JSONObject();
		JSONObject errorResult = new JSONObject();
		errorResult.put("message", msg);
		errorResult.put("code", "500");
		message.put("result", errorResult);
		return message;
	}

	/**
	 * 添加失败
	 * 
	 * @return
	 */
	public static JSONObject addFail(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "添加失败！设备防区编号重复");
		errorResult.put("code", "500");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
	
	/**
	 * 更新失败
	 * 
	 * @return
	 */
	public static JSONObject updateFail() {
		JSONObject message = new JSONObject();
		JSONObject errorResult = new JSONObject();
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "更新失败！");
		errorResult.put("code", "100");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}

	/**
	 * 更新成功
	 * 
	 * @return
	 */
	public static JSONObject updateSuccess(){
		JSONObject message = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "更新成功！");
		errorResult.put("code", "200");
		message.put("result", errorResult);
		message.put("userInformation", errorUserInformation);

		return message;
	}
}