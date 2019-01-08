package com.znyw.dao.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.CarloadDao;
import com.znyw.pojo.Camera;
import com.znyw.pojo.Carload;
import com.znyw.pojo.CarloadInfo;
import com.znyw.pojo.TergroupPojo;
import com.znyw.pojo.TertypePojo;
import com.znyw.tool.IJdbcTemplate;

@Repository("/CarloadDao")
public class CarloadDaoImp implements CarloadDao {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Resource
	IJdbcTemplate ijdbcTemplate;
	
	Date d = new Date();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	String updatetime = sdf.format(d);

	@Override
	public List<TergroupPojo> queryTerGroupCtrl(){
		String sql = " SELECT terGroupId id,terGroupName name FROM imm_tergroup ";
		try {
			List<TergroupPojo> list = ijdbcTemplate.query(sql,
					new BeanPropertyRowMapper<TergroupPojo>(TergroupPojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<Camera> queryCamerInfoCtrl(String devId){
		String sql = " SELECT b.devId id,b.devChannelId channel,b.cameraName name FROM imm_devinfo a,imm_camera b WHERE a.devId=b.devId AND a.relateNVR = ? ";
		List<Camera> list = new ArrayList<Camera>();
		try {
			return list = ijdbcTemplate.query(sql, new Object[] { devId }, new BeanPropertyRowMapper<Camera>(Camera.class));
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<CarloadInfo> queryCarloadInfoCtrl(String groupId,String roleId){
		String sql = " SELECT b.devId id,b.carno name FROM imm_roledev a,imm_tgpscarattr b WHERE a.roleId = ? AND b.terGroupId=? AND a.devId=b.devId  ";
		List<CarloadInfo> list = new ArrayList<CarloadInfo>();
		try {
		return list = ijdbcTemplate.query(sql, new Object[] { roleId, groupId },
				new BeanPropertyRowMapper<CarloadInfo>(CarloadInfo.class));
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int addCarloadInfoCtrl(JSONObject jsonParam){
		try {
			String sqlDev = " INSERT INTO imm_devinfo (devId,devName,areaId,devType,devInstDate,devState,updatetime,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?,?) ";
			int resultdevinfo = ijdbcTemplate.update(sqlDev,
					new Object[] { jsonParam.getString("devId"), jsonParam.getString("devName"),
							jsonParam.getString("areaId"), 13, jsonParam.getString("devInstDate"), 2, updatetime, jsonParam.getString("dataFrom") });

			String sqlAttr = " INSERT INTO imm_tgpscarattr (devId,ter_id,sim,channelNum,terGroupId,plateColorId,carno,"
					+ " pinpai,color,carType,stime,etime,loadNum,czxm,tel,updatetime,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			int resultAttr = ijdbcTemplate.update(sqlAttr,
					new Object[] { jsonParam.getString("devId"), jsonParam.getString("ter_id"),
							jsonParam.getString("sim"), jsonParam.getString("channelNum"),
							jsonParam.getString("terGroupId"), jsonParam.getString("plateColorId"),
							jsonParam.getString("carno"), jsonParam.getString("pinpai"), jsonParam.getString("color"),
							jsonParam.getString("carType"), jsonParam.getString("stime"), jsonParam.getString("etime"),
							jsonParam.getString("loadNum"), jsonParam.getString("czxm"), jsonParam.getString("tel"),
							updatetime , jsonParam.getString("dataFrom")});

			return (resultAttr + resultdevinfo);
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int addCamereInfoCtrl(JSONObject jsonParam,String cameraId,String cameraName,String devChannelId,String devMonitorId){
		try {
			String sqlDev = " INSERT INTO imm_devinfo (devId,devName,devType,devInstDate,updatetime,relateNVR,areaId,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?,?) ";
			int resultdevinfo = ijdbcTemplate.update(sqlDev,
					new Object[] { cameraId, cameraName, 14, jsonParam.getString("devInstDate"), updatetime,
							jsonParam.getString("devId"), jsonParam.getString("areaId"), jsonParam.getString("dataFrom") });

			String sqlCam = " INSERT INTO imm_camera (devId,devChannelId,cameraName,instDate,updatetime,devMonitorId,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?) ";
			int resultCaminfo = ijdbcTemplate.update(sqlCam, new Object[] { cameraId, devChannelId, cameraName,
					jsonParam.getString("devInstDate"), updatetime, devChannelId , jsonParam.getString("dataFrom")});

			return (resultdevinfo + resultCaminfo);
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int delCarloadInfoCtrl(String devId){
		String sqlDev = " DELETE a,b FROM imm_devinfo a,imm_tgpscarattr b WHERE a.devId = ? AND a.devType='13' AND a.devId=b.devId ";
		try {
			int delInfo = ijdbcTemplate.update(sqlDev, new Object[] { devId });
			return delInfo;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int delCamInfoCtrl(String devId){
		String sqlDev = " DELETE a,b FROM imm_devinfo a,imm_camera b WHERE a.relateNvr = ? AND a.devType='14' And a.devId=b.devId ";
		try {
			int delInfo = ijdbcTemplate.update(sqlDev, new Object[] { devId });
			return delInfo;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<Map<String, Object>> queryDevIdOrderByRoleIdCtrl(String roleId){
		String sqlDev = " SELECT a.devId FROM imm_devinfo a,imm_roledev b WHERE a.devType='13' AND a.devId=b.devId AND b.roleId=? ";
		List<Map<String, Object>> devIdlist = new ArrayList<Map<String, Object>>();
		try {
			devIdlist = ijdbcTemplate.queryForList(sqlDev, new Object[] { roleId });
			return devIdlist;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public int querychannelNum(String devId){
		String sqlDev = " SELECT channelNum FROM imm_tgpscarattr WHERE devId = ? ";
		try {
			int delInfo = ijdbcTemplate.queryForInt(sqlDev, new Object[] { devId });
			return delInfo;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int updateCarloadInfoCtrl(JSONObject jsonParam){
		try {
			String sql = " UPDATE imm_devinfo SET devName=?,areaId=?,devType=?,devInstDate=?,updatetime=? WHERE devId = ?";
			Object[] params = new Object[] { jsonParam.getString("devName"), jsonParam.getString("areaId"), 13,
					jsonParam.getString("devInstDate"), jsonParam.getString("updatetime"),
					jsonParam.getString("devId") };
			int rs = ijdbcTemplate.update(sql, params);

			sql = " UPDATE imm_tgpscarattr SET ter_id=?,sim=?,channelNum=?,terGroupId=?,"
					+ "plateColorId=?,carno=?,pinpai=?,color=?,carType=?,stime=?,etime=?,loadNum=?,czxm=?,tel=?,updatetime=? WHERE devId = ? ";
			Object[] paramsTgp = new Object[] { jsonParam.getString("ter_id"), jsonParam.getString("sim"),
					jsonParam.getString("channelNum"), jsonParam.getString("terGroupId"),
					jsonParam.getString("plateColorId"), jsonParam.getString("carno"), jsonParam.getString("pinpai"),
					jsonParam.getString("color"), jsonParam.getString("carType"), jsonParam.getString("stime"),
					jsonParam.getString("etime"), jsonParam.getString("loadNum"), jsonParam.getString("czxm"),
					jsonParam.getString("tel"), jsonParam.getString("updatetime"), jsonParam.getString("devId") };
			int rsTgp = ijdbcTemplate.update(sql, paramsTgp);
			return (rs + rsTgp);
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int delCamereInfoCtrl(int devChannelId , String devId){
		String sql = "DELETE a,b FROM imm_devinfo a,imm_camera b WHERE a.devId=b.devId AND a.relateNvr = ? AND a.devType = '14' AND b.devChannelId>=? ";
		try {
			int rs = ijdbcTemplate.update(sql, new Object[] { devId, devChannelId });
			return rs;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<TertypePojo> queryTertypeCtrl(){
		String sql = " SELECT terTypeId,terTypeName FROM imm_tertype ";
		List<TertypePojo> list = new ArrayList<TertypePojo>();
		try {
			list = ijdbcTemplate.query(sql, new BeanPropertyRowMapper<TertypePojo>(TertypePojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<TergroupPojo> queryPlateColorCtrl(){
		String sql = " SELECT plateColorId id,plateColorName name FROM imm_platecolor ";
		List<TergroupPojo> list = new ArrayList<TergroupPojo>();
		try {
			list = ijdbcTemplate.query(sql, new BeanPropertyRowMapper<TergroupPojo>(TergroupPojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int updateCameraNameCtrl(String ameraName,String devId ,int channel){
		String sql = "UPDATE imm_devinfo a LEFT JOIN imm_camera b ON a.devId=b.devId SET a.devName=?,b.cameraName=? WHERE a.relateNvr=? AND devChannelId = ?";
		Object[] params = new Object[] { ameraName, ameraName, devId, channel };
		try {
			int rs = ijdbcTemplate.update(sql, params);
			return rs;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<Carload> queryCarloadCtrl(String devId){
		String strSQL = " SELECT a.devId,a.devName,a.devInstDate,a.areaId,"
				+ " b.ter_id,b.sim,b.channelNum,b.plateColorId,b.carno,b.color,b.pinpai,b.carType,b.stime,b.etime,b.loadNum,b.czxm,b.terGroupId,b.tel,"
				+ " c.terTypeName," + " d.plateColorName," + " e.terGroupName," + " f.areaName"
				+ " FROM imm_devinfo a,imm_tgpscarattr b,imm_tertype c ,imm_platecolor d,imm_terGroup e,imm_area f"
				+ " WHERE a.devId='" + devId
				+ "' AND a.devId=b.devId AND a.devType = '13' AND b.ter_id=c.terTypeId AND b.plateColorId=d.plateColorId AND b.terGroupId=e.terGroupId and a.areaId=f.areaId";
		List<Carload> carload = new ArrayList<Carload>();
		try {
			carload = ijdbcTemplate.query(strSQL, new BeanPropertyRowMapper<Carload>(Carload.class));
			return carload;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<Map<String, Object>> querycameraNamesCtrl(String devId){
		String strSQL = "  SELECT b.devChannelId,b.cameraName FROM imm_devinfo a,imm_camera b WHERE a.relateNvr = ? AND a.devId=b.devId";
		List<Map<String, Object>> carload = new ArrayList<Map<String, Object>>();
		try {
			carload = ijdbcTemplate.queryForList(strSQL, new Object[] { devId });
			return carload;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<Map<String, Object>> queryCarloadListCtrl(String queryId,String areaId,int pageSizeInt,int currentPageInt ,String isowner,String sort){
		
		if(isowner.equals("have")){
			isowner = "";
		}else if(isowner.equals("on")){
			isowner = "AND (a.userId='' OR a.userId IS NULL)";
		}
		String strSQL = " SELECT a.devId,a.devName,a.devInstDate,"
				+ " b.ter_id,b.sim,b.channelNum,b.plateColorId,b.carno,b.color,b.pinpai,b.carType,b.stime,b.etime,b.loadNum,b.czxm,b.terGroupId,b.tel,"
				+ " c.terTypeName,"
				+ " d.plateColorName,"
				+ " e.terGroupName"
				+ " FROM imm_devinfo a,imm_tgpscarattr b,imm_tertype c ,imm_platecolor d,imm_terGroup e"
				+ " WHERE a.devId=b.devId AND a.devType = '13' AND b.ter_id=c.terTypeId AND b.plateColorId=d.plateColorId AND b.terGroupId=e.terGroupId "
				+ " AND " + areaId + " AND (a.devId LIKE ? OR a.devName LIKE ? ) " + isowner + " ORDER BY a.devId "
				+ sort + " LIMIT ?,? ";
		List<Map<String, Object>> carload = new ArrayList<Map<String, Object>>();
		try {
			carload = ijdbcTemplate.queryForList(strSQL, new Object[] { "%" + queryId + "%", "%" + queryId + "%",
					(currentPageInt - 1) * pageSizeInt, pageSizeInt });
			return carload;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public int queryCarloadNumCtrl(String queryId,String areaId,String isowner){
		if(isowner.equals("have")){
			isowner = "";
		}else if(isowner.equals("on")){
			isowner = "AND (a.userId='' OR a.userId IS NULL)";
		}
		String strSQL = " SELECT COUNT(*)"
				+ " FROM imm_devinfo a,imm_tgpscarattr b,imm_tertype c ,imm_platecolor d,imm_terGroup e"
				+ " WHERE a.devId=b.devId AND a.devType = '13' AND b.ter_id=c.terTypeId AND b.plateColorId=d.plateColorId AND b.terGroupId=e.terGroupId "
				+ " AND "+areaId+" AND (a.devId LIKE ? OR a.devName LIKE ? ) "+isowner+" ";
		
		try {
			int num = ijdbcTemplate.queryForInt(strSQL, new Object[] { "%" + queryId + "%", "%" + queryId + "%" });
			return num;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<CarloadInfo> queryCarloadOrderByRoleIdCarnoCtrl(String roleId,String carno){
		
		String strSQL = " SELECT b.devId id,b.carno NAME,terGroupId FROM imm_roledev a,imm_tgpscarattr b "
				+ " WHERE a.roleId = ? AND a.devId=b.devId AND b.carno LIKE ? ";
		List<CarloadInfo> carload = new ArrayList<CarloadInfo>();
		try {
			carload = ijdbcTemplate.query(strSQL, new Object[] { roleId, "%" + carno + "%" },
					new BeanPropertyRowMapper<CarloadInfo>(CarloadInfo.class));
			return carload;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<CarloadInfo> queryTergroupOrderByRoleIdCarnoCtrl(String roleId,String carno){
		String strSQL = " SELECT c.terGroupId id,c.terGroupName NAME FROM imm_tergroup c,(SELECT DISTINCT b.terGroupId FROM imm_roledev a,imm_tgpscarattr b "
				+ " WHERE a.roleId = ? AND a.devId=b.devId AND b.carno LIKE ?) d WHERE c.terGroupId=d.terGroupId ";
		List<CarloadInfo> carload = new ArrayList<CarloadInfo>();
		try {
			carload = ijdbcTemplate.query(strSQL, new Object[] { roleId, "%" + carno + "%" },
					new BeanPropertyRowMapper<CarloadInfo>(CarloadInfo.class));
			return carload;
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public List<CarloadInfo> queryTerGroupCtrl1(){
		String sql = " SELECT terGroupId id,terGroupName name FROM imm_tergroup ";
		List<CarloadInfo> list = new ArrayList<CarloadInfo>();
		try {
			list = ijdbcTemplate.query(sql, new BeanPropertyRowMapper<CarloadInfo>(CarloadInfo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}
	
}
