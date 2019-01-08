package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.AddDevice;
import com.znyw.dao.CarloadDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.CarloadInfo;
import com.znyw.service.AreaService;
import com.znyw.service.CarloadService;
import com.znyw.tool.ErrorAbnormal;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.PropertyConfigUtil;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

@Repository("CarloadService")
public class CarloadServiceImp implements CarloadService {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	
	@Resource
	CarloadDao carload;
	
	@Resource
	AddDevice adddevice;
	
	@Resource
	private AreaService areaService;
	
	@Resource
	private UserDaoImp userDaoImp;
	
	private static PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");
	
	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject queryTerGroup(){
		try {
			List list = carload.queryTerGroupCtrl();
			JSONObject JSON = new JSONObject();
			JSONObject result = new JSONObject();
			if(list.size()>0){
				result.put("Message", "成功");
				result.put("Code", "0");
				JSON.put("result", result);
				JSON.put("groupList",list );
			}else {
				result.put("Message", "失败");
				result.put("Code", "1");
				JSON.put("result", result);
				JSON.put("groupList",list);
			}
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		
	}
	
	@Override
	public JSONObject QueryCamerInfoSer(JSONObject jsonParam){
		try {
			String devId = jsonParam.getString("devId"); 
			List list = carload.queryCamerInfoCtrl(devId);
			JSONObject JSON = new JSONObject();
			JSONObject result = new JSONObject();
			if(list.size()>0){
				result.put("Message", "成功");
				result.put("Code", "0");
				JSON.put("result", result);
				JSON.put("groupList",list );
			}else {
				result.put("Message", "失败");
				result.put("Code", "1");
				JSON.put("result", result);
				JSON.put("groupList",list);
			}
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
	}
	
	@Override
	public JSONObject QueryCarloadInfoSer(JSONObject jsonParam){
		try {
			String groupId = jsonParam.getString("groupId"); 
			String roleId = jsonParam.getString("roleId"); 
			
			List list = carload.queryCarloadInfoCtrl(groupId,roleId);
			
			
			JSONObject JSON = new JSONObject();
			JSONObject result = new JSONObject();
			if(list.size()>0){
				result.put("Message", "成功");
				result.put("Code", "0");
				JSON.put("result", result);
				JSON.put("groupList",list );
			}else {
				result.put("Message", "成功");
				result.put("Code", "1");
				JSON.put("result", result);
				JSON.put("groupList",list);
			}
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject AddCarloadInfoSer(JSONObject jsonParam) {
		try {
			//查询是否已经存在该设备
			int deviceNum = adddevice.queryDeviceNum(jsonParam.getString("devId"));
			if (deviceNum>0) {
				LOGGER.info("数据库已经存在该设备编号！{}",deviceNum);
				return ResultJson.Resultimage();
			}
			
			JSONObject cameraNames = jsonParam.getJSONObject("cameraNames");	//判断传进来的通道数和摄像机名字数目是否相等
			int cameraSize = cameraNames.size();
			int channelNumInt = Integer.parseInt(jsonParam.getString("channelNum"));
			for(int i=0;i<cameraSize;i++){
				System.out.println(cameraNames.getString(""+i));
			}
			if(channelNumInt!=cameraSize){
				return ResultJson.errorNum();
			}
			
			
			// 核定载人数 字段有效性验证，int(11),最大值为: 2147483647
			try {
				if (jsonParam.getInteger("loadNum") > 2147483647) {
					return ResultJson.insertFail("loadNum");
				}
			} catch (NumberFormatException e) {
				return ResultJson.insertFail("loadNum");
			}

			int result = carload.addCarloadInfoCtrl(jsonParam);		//添加车载设备基本信息和属性表
			
			
			int choon = Integer.parseInt(jsonParam.getString("channelNum"));	//添加摄像机基本信息和属性表信息
			long cameraId;
			String devChannelId,devMonitorId,cameraName;
			for(int i=0;i<choon;i++){
				cameraId = ErrorAbnormal.timeToTen()+i;								//利用时间戳产生摄像机编号
			//	cameraName="CH"+i;
				devChannelId = i+"";
				devMonitorId = "";
				if(i<10){devMonitorId="000"+i;}else if (i<100) {devMonitorId="00"+i;}else if (i<1000) {devMonitorId="0"+i;}else if (i==1000) {devMonitorId=""+i;}
				carload.addCamereInfoCtrl(jsonParam,cameraId+"",cameraNames.getString(""+i),devChannelId,devMonitorId); //devMonitorId设备监控点编号
			}
			//sendAddCarLoad(jsonParam);
			return ResultJson.insertSuccess();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "添加失败", e.getMessage());
		}
	}
	
	@Override
	public JSONObject DeelCarloadInfoSer(JSONObject jsonParam) {
		try {
			String devId = jsonParam.getString("devId");
			//查询是否已经存在该设备
			int deviceNum = adddevice.queryDeviceNum(devId);
			if (deviceNum == 0) {
				LOGGER.info("数据库不存在该设备编号！{}",deviceNum);
				return ResultJson.queryNo();
			}
			
			int resultInfo = carload.delCarloadInfoCtrl(devId);		//删除车载设备基本信息和属性表
			
			int resultCam = carload.delCamInfoCtrl(devId);		//删除车载设备的摄像机基本信息和属性表
			
			return ResultJson.insertSuccess();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "删除失败", e.getMessage());
		}
	}
	
	@Override
	public JSONObject QueryDevIdOrderByRoleIdSer(JSONObject jsonParam) {
		try {
			String roleId = jsonParam.getString("roleId");
			List devIdList = carload.queryDevIdOrderByRoleIdCtrl(roleId);		//根据角色编号，查询车载设备列表
			
			JSONObject Userjosn = new JSONObject();
			JSONObject result = new JSONObject();

			 result.put("code", "200");
			 result.put("message", "success");
			 Userjosn.put("result", result);
			 Userjosn.put("devIdList", devIdList);
		
		    return Userjosn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		
	}
	
	@Override
	public JSONObject UpdateCarloadInfoSer(JSONObject jsonParam) {
		try {
			String channelNumStr = jsonParam.getString("channelNum");
			int channelNumInt = Integer.parseInt(channelNumStr);		//修改后的通道数
			
			JSONObject cameraNames = jsonParam.getJSONObject("cameraNames");	//判断传进来的通道数和摄像机名字数目是否相等
			int cameraSize = cameraNames.size();
			if(channelNumInt!=cameraSize){
				return ResultJson.errorNum();
			}
			
			int channelNum = carload.querychannelNum(jsonParam.getString("devId"));//查询数据库通道数
			
			int updateold ;							//获取需要更新旧的摄像机名称
			if(channelNumInt>=channelNum){
				updateold=channelNum;
			}else {
				updateold=channelNumInt;
			}
			
			int resultUpdate = carload.updateCarloadInfoCtrl(jsonParam);	//更新车载设备
			
			if(channelNumInt>channelNum){									//增加摄像机
				long cameraId;
				String devChannelId,devMonitorId/*cameraName,*/;
				for(int i=0;i<(channelNumInt-channelNum);i++){
					int i1 = i+channelNum;
					cameraId = ErrorAbnormal.timeToTen()+i;								//利用时间戳产生摄像机编号
//					cameraName="CH"+i1;
					devChannelId = i1+"";
					devMonitorId = "";
					if(i1<10){devMonitorId="000"+i1;}else if (i1<100) {devMonitorId="00"+i1;}else if (i1<1000) {devMonitorId="0"+i1;}else if (i1==1000) {devMonitorId=""+i1;}
					carload.addCamereInfoCtrl(jsonParam,cameraId+"",cameraNames.getString(""+i1),devChannelId,devMonitorId); //devMonitorId设备监控点编号
				}
			}else if(channelNumInt<channelNum){								//减少摄像机
				int devChannelId = channelNum-channelNumInt;					//减少数
				int delResult = carload.delCamereInfoCtrl(channelNumInt,jsonParam.getString("devId"));
			}
			
			
			for(int i=0;i<updateold;i++){
				carload.updateCameraNameCtrl(cameraNames.getString(""+i),jsonParam.getString("devId"), i);	//更新旧的摄像机名称
			}
			
			JSONObject Userjosn = new JSONObject();
			JSONObject result = new JSONObject();

			 result.put("code", "200");
			 result.put("message", "success");
			 Userjosn.put("result", result);
		
		    return Userjosn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject QueryTertypeSer(){
		try {
			List list = carload.queryTertypeCtrl();
			
			JSONObject JSON = new JSONObject();
			JSONObject result = new JSONObject();
			if(list.size()>0){
				result.put("Message", "成功");
				result.put("Code", "0");
				JSON.put("result", result);
				JSON.put("TertypeList",list );
			}else {
				result.put("Message", "失败");
				result.put("Code", "1");
				JSON.put("result", result);
				JSON.put("TertypeList",list);
			}
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		
	}
	
	@Override
	public JSONObject QueryPlateColorSer(){
		try {
			List list = carload.queryPlateColorCtrl();
			
			JSONObject JSON = new JSONObject();
			JSONObject result = new JSONObject();
			if(list.size()>0){
				result.put("Message", "成功");
				result.put("Code", "0");
				JSON.put("result", result);
				JSON.put("TertypeList",list );
			}else {
				result.put("Message", "失败");
				result.put("Code", "1");
				JSON.put("result", result);
				JSON.put("PlatecolorList",list);
			}
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject QueryCarloadSer(JSONObject jsonParam) {
		try {
			String devId = jsonParam.getString("devId");
			List list = carload.queryCarloadCtrl(devId);
			List cameraNames = carload.querycameraNamesCtrl(devId);
			if(list.size() != 1){
				return ResultJson.queryErrorJSON();
			}
			
			JSONObject Carload = new JSONObject();
			JSONObject result = new JSONObject();
			
			result.put("message", "成功");
			result.put("code", "0");
			Carload.put("result", result);
			Carload.put("carload", list.get(0));
			Carload.put("cameraNames", cameraNames);
			
			return Carload;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject QueryCarloadListSer(JSONObject jsonParam) {
		try {
			JSONObject queryTond =jsonParam.getJSONObject("queryTond");			
			String areaId = "a.areaId='"+queryTond.getString("areaId")+"'";
			String queryId = queryTond.getString("queryId");
			String isowner = queryTond.getString("isowner");
			
			JSONObject pageInfoPojo =jsonParam.getJSONObject("pageInfoPojo");
			String sort = pageInfoPojo.getString("sort");
			String currentPage = pageInfoPojo.getString("currentPage");
			String pageSize = pageInfoPojo.getString("pageSize");
			int pageSizeInt = Integer.parseInt(pageSize);
			int currentPageInt = Integer.parseInt(currentPage);

			sort = sort.equals("devId|DESC") ? "DESC" : "ASC";
			
			int totalNum = carload.queryCarloadNumCtrl(queryId, areaId, isowner);
			int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSizeInt);

			while ((currentPageInt - 1) * pageSizeInt > totalNum) {
				currentPageInt--;
			}

			List CarloadList = carload.queryCarloadListCtrl(queryId,areaId, pageSizeInt, currentPageInt ,isowner, sort);

			JSONObject nvrResult = new JSONObject();
			JSONObject result = new JSONObject();
			JSONObject pageInfo = new JSONObject();
			
			result.put("message", "成功");
			result.put("code", 0);
			
			pageInfo.put("totalNum", totalNum);
			pageInfo.put("pageSize", pageSize);
			pageInfo.put("currentPage", currentPage);
			pageInfo.put("totalPage", totalPages);
			
			nvrResult.put("result", result);
			nvrResult.put("json", CarloadList);
			nvrResult.put("pageInfoPojo", pageInfo);
			

			return nvrResult;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public JSONObject QueryCarloadListSerAll(JSONObject jsonParam ,String userId) {
		try {
			JSONObject userInfo = userDaoImp.getUser(userId);
			String id = (String) userInfo.get("areaId");				//获取用户所属区域id
			JSONArray jsonCorrelation = areaService.getAreaAllById(id);
			
			StringBuffer areaId = new StringBuffer();
			areaId.append(" ( ");
			for(int i=0;i<jsonCorrelation.size();i++){
				Map<String, String> map = (Map<String, String>) jsonCorrelation.get(i);
				String ChildareaId = map.get("id");
				areaId.append("a.areaId='"+ChildareaId+"' OR ");
			}
			areaId.append(" a.areaId='"+id+"' ) ");
			
			JSONObject queryTond =jsonParam.getJSONObject("queryTond");			
			String queryId = queryTond.getString("queryId");
			String isowner = queryTond.getString("isowner");
			
			JSONObject pageInfoPojo =jsonParam.getJSONObject("pageInfoPojo");	
			String sort = pageInfoPojo.getString("sort");
			String currentPage = pageInfoPojo.getString("currentPage");
			String pageSize = pageInfoPojo.getString("pageSize");
			int pageSizeInt = Integer.parseInt(pageSize);
			int currentPageInt = Integer.parseInt(currentPage);

			sort = sort.contains("DESC") ? " DESC " : " ASC ";
			
			int totalNum = carload.queryCarloadNumCtrl(queryId, areaId.toString(), isowner);
			int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSizeInt);

			while ((currentPageInt - 1) * pageSizeInt > totalNum) {
				currentPageInt--;
			}

			List CarloadList = carload.queryCarloadListCtrl(queryId,areaId.toString(), pageSizeInt, currentPageInt ,isowner, sort);

			JSONObject nvrResult = new JSONObject();
			JSONObject result = new JSONObject();
			JSONObject pageInfo = new JSONObject();
			
			result.put("message", "成功");
			result.put("code", 0);
			
			pageInfo.put("totalNum", totalNum);
			pageInfo.put("pageSize", pageSize);
			pageInfo.put("currentPage", currentPage);
			pageInfo.put("totalPage", totalPages);
			
			nvrResult.put("result", result);
			nvrResult.put("json", CarloadList);
			nvrResult.put("pageInfoPojo", pageInfo);
			

			return nvrResult;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject QueryCarGroupSer(JSONObject jsonParam) {
		try {
			String roleId = jsonParam.getString("roleId");
			String carno = jsonParam.getString("carno");
			
			List<CarloadInfo> TerGroup = carload.queryCarloadOrderByRoleIdCarnoCtrl(roleId,carno);//根据角色编号，车牌号查询设备信息
			List Schools ;
			if("".equals(carno)){
				Schools=carload.queryTerGroupCtrl1();
			}else {
				Schools = carload.queryTergroupOrderByRoleIdCarnoCtrl(roleId,carno);//根据角色编号，车牌号查询一堆设备所属学校
			}
			
			List<Map<String, String>> groupList= new ArrayList<Map<String, String>>();
			for(int i=0;i<TerGroup.size();i++){
				CarloadInfo carload = TerGroup.get(i);
				Map<String, String> map = new HashMap<String, String>();
				map.put("id", carload.getId());
				map.put("name", carload.getName());
				map.put("type", "car");
				map.put("pId", carload.getTerGroupId());
				groupList.add(map);
			}
			for(int i=0;i<Schools.size();i++){
				CarloadInfo carload = (CarloadInfo) Schools.get(i);
				Map<String, String> map = new HashMap<String, String>();
				map.put("id", carload.getId());
				map.put("name", carload.getName());
				map.put("type", "school");
				map.put("pId","0");
				groupList.add(map);
			}
			
			JSONObject Carload = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("Message", "成功");
			result.put("Code", "0");
			Carload.put("result", result);
			Carload.put("result", groupList);
			
			return Carload;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}	
	}
	
	public String sendAddCarLoad(JSONObject jsonParam){
		String dString = "bylc=%s&c=%s&carno=%s&cjh=%s&clpp=%s&etime=%s&group=%s&mobile=%s&name=%s&remark=%s&stime=%s&tid_tel=%s&ttype=%s&zdid=%s&zlc=%s&userId=%s&userIp=%s";
		//String dString = "bylc=%s&c=%s";
		String dd = String.format(dString, "0","add2",jsonParam.get("carno"),"",jsonParam.get("pinpai"),jsonParam.get("etime"),"147",jsonParam.get("tel")
				,jsonParam.get("czxm"),"",jsonParam.get("stime"),jsonParam.get("ter_id"),"61027","DFG41654","0","61129","10.0.10.249");
		String result = HttpClientTool.get(propertyconfigUtil.getValue("carLoadUrl"),propertyconfigUtil.getValue("addcarLoad"), dd);
		LOGGER.info("sendAddCarLoad:{}", result);
		return result;
	}
}
