package com.device.dao.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.device.dao.IModDevDao;
import com.znyw.service.impl.AddDeviceService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.ErrorAbnormal;
import com.znyw.tool.Objects;

@Repository
public class ModDevDaoImpl implements IModDevDao {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Resource
	JdbcTemplate jdbcTemplate;

	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Resource
	AddDeviceService adddeviceService;

	@Override
	public boolean modDevInfo(String devId, JSONObject json) {

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devinfo SET devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=? WHERE devId = ?");
		Object[] params = new Object[] { json.getString("devName"),
				json.getString("pnlActID"), json.getString("areaId"),
				json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"),
				json.getString("devLng"), json.getString("devlat"),
				json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), devId };
		try {
			int rs = jdbcTemplate.update(sb.toString(), params); // 受影响的记录条数，失败则返回-1
			if (rs > 0) {
				logger.info("modDevInfo suc,rs={},devId={}", rs, devId);
				return true;
			}
			logger.error("modDevInfo fail,rs={},devId={}", rs, devId);
			return false;
		} catch (DataAccessException e) {
			logger.error(e.getMessage(), e);
			return false;
		}
	}

	/**
	 * 更新设备，机主
	 */
	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public boolean modAlarmhostInfo(String devId, JSONObject json)
			throws Exception {

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devinfo SET devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=?,manufacturer=? WHERE devId = ?");
		Object[] params = new Object[] { json.getString("devName"),
				json.getString("pnlActID"), json.getString("areaId"),
				json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"),
				json.getString("devLng"), json.getString("devlat"),
				json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), json.getString("manufacturer"), devId };

		StringBuffer sb2 = new StringBuffer(
				" UPDATE imm_alarmhostattr SET telAddr=?,pnlTel=?,keyboardAddr=?,pnlPowerAddr=?,pnlHdTel=?,RegexPWD=? WHERE devId=?");
		Object[] params2 = new Object[] { json.getString("telAddr"),
				json.getString("pnlTel"), json.getString("keyboardAddr"),
				json.getString("pnlPowerAddr"), json.getString("pnlHdTel"),
				json.getString("RegexPWD"), devId };
		try {
			jdbcTemplate.update(sb.toString(), params);
			jdbcTemplate.update(sb2.toString(), params2);
			return true;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public boolean modWirenvrInfo(String devId, JSONObject json)
			throws Exception {

		// 修改imm_devinfo表
		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devinfo SET devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=?,manufacturer=?,define5=? WHERE devId = ?");
		Object[] params = new Object[] { json.getString("devName"),
				json.getString("pnlActID"), json.getString("areaId"),
				json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"),
				json.getString("devLng"), json.getString("devlat"),
				json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), json.getString("manufacturer"),
				json.getString("gbId"), devId };

		// 修改imm_wirenvrattr表
		StringBuffer sb2 = new StringBuffer(
				" UPDATE imm_wirenvrattr SET devLoginName=?,devLoginPwd=?,devIp=?,videoServer=?,devPort=? WHERE devId=?");
		Object[] params2 = new Object[] { json.getString("devLoginName"),
				json.getString("devLoginPwd"), json.getString("devIp"),
				json.getString("videoServer"), json.getString("devPort"), devId };
		try {
			jdbcTemplate.update(sb.toString(), params);
			jdbcTemplate.update(sb2.toString(), params2); // 受影响的记录条数，失败则返回-1
			jdbcTemplate.update(
					"update imm_devinfo set manufacturer=? where relateNVR=?",
					json.getString("manufacturer"), devId);
		} catch (DataAccessException e) {
			throw e;
		}
		// 修改摄像机
		String strSQL = "SELECT b.* FROM imm_devinfo a INNER JOIN imm_camera b ON a.devId=b.devId WHERE a.relateNVR=?";

		List<Map<String, Object>> list;
		try {
			list = jdbcTemplate.queryForList(strSQL, devId);
		} catch (DataAccessException e) {
			throw e;
		}
		int size = list.size();
		String videoServer = json.getString("videoServer");
		for (int i = 0; i < size; i++) {
			Map<String, Object> map = list.get(i);
			String cammerId = (String) map.get("devId");
			int nChannel = Integer.valueOf(map.get("devChannelId").toString());

			// int vPort = 9000 + nChannel;
			int vPort = 9000;
			// :9000/60.217.243.147:8000:HIK:0:0:admin:admin12345/av_stream
			String videoUrlSuf = (String) map.get("videoUrlSuf");
			StringBuffer stringBuffer = new StringBuffer();
			String url = stringBuffer
					.append(":")
					.append(vPort)
					.append("/")
					.append(json.getString("devIp"))
					.append(":")
					.append(json.getString("devPort"))
					.append(":")
					.append(adddeviceService.getManufacturerSymbol(json
							.getString("manufacturer"))).append(":")
					.append(nChannel).append(":0:")
					.append(json.getString("devLoginName")).append(":")
					.append(json.getString("devLoginPwd")).append("/av_stream")
					.toString();

			StringBuffer sb3 = new StringBuffer(
					"UPDATE imm_camera SET videoServer=?,videoUrlSuf=? WHERE devId = ?");
			Object[] params3 = new Object[] { videoServer, url, cammerId };
			try {
				jdbcTemplate.update(sb3.toString(), params3); // 受影响的记录条数，失败则返回-1
			} catch (DataAccessException e) {
				throw e;
			}
		}
		return true;
	}

	@Override
	public boolean qudapeCameraDevInfo(JSONObject json) throws Exception {
		String sql = "  UPDATE imm_devinfo SET manufacturer=? WHERE relateNVR=? ";
		Object[] params = new Object[] { json.getString("manufacturer"),
				json.getString("devId") };
		try {
			jdbcTemplate.update(sql.toString(), params); // 受影响的记录条数，失败则返回-1
		} catch (DataAccessException e) {
			logger.error("qudapeCameraDevInfo err,relateNVR={},e={}",
					json.getString("devId"), e.toString());
			return false;
		}
		return true;
	}

	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public boolean modNetnvrInfo(String devId, JSONObject json)
			throws Exception {

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devInfo SET devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=?,manufacturer=?,define5=? WHERE devId = ?");
		Object[] params = new Object[] { json.getString("devName"),
				json.getString("pnlActID"), json.getString("areaId"),
				json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"),
				json.getString("devLng"), json.getString("devlat"),
				json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), json.getString("manufacturer"),
				json.getString("gbId"), devId };

		StringBuffer sb2 = new StringBuffer(
				" UPDATE imm_netnvrattr SET devLoginName=?,devLoginPwd=?,devTUTKID=?,videoServer=? WHERE devId=?");
		Object[] params2 = new Object[] { json.getString("devLoginName"),
				json.getString("devLoginPwd"), json.getString("devTUTKID"),
				json.getString("videoServer"), devId };
		try {
			jdbcTemplate.update(sb.toString(), params);
			jdbcTemplate.update(sb2.toString(), params2); // 受影响的记录条数，失败则返回-1
			jdbcTemplate.update(
					"update imm_devinfo set manufacturer=? where relateNVR=?",
					json.getString("manufacturer"), devId);
		} catch (DataAccessException e) {
			throw e;
		}

		// 修改摄像机
		String strSQL = "SELECT b.* FROM imm_devinfo a INNER JOIN imm_camera b ON a.devId=b.devId WHERE a.relateNVR=?";
		List<Map<String, Object>> list;

		try {
			list = jdbcTemplate.queryForList(strSQL, devId);
		} catch (DataAccessException e) {
			throw e;
		}
		int size = list.size();
		logger.info("queryCammerInfoByNvrId Netnvr suc,relateNVR={},size={}",
				devId, size);
		String videoServer = json.getString("videoServer");
		for (int i = 0; i < size; i++) {
			Map<String, Object> map = list.get(i);
			String cammerId = (String) map.get("devId");
			int nChannel = Integer.valueOf(map.get("devChannelId").toString());
			// int vPort = 9000 + nChannel;
			int vPort = 9000;
			// :9000/43534534246420:0:P2P_TUTK_CLIENT:0:0:admin:123/av_stream
			// String videoUrlSuf =(String) map.get("videoUrlSuf");

			String manufacturer = json.getString("manufacturer");

			StringBuffer stringBuffer = new StringBuffer();
			String url = stringBuffer.append(":").append(vPort).append("/")
					.append(json.getString("devTUTKID"))
					.append(":0:" + manufacturer + ":").append(nChannel)
					.append(":0:").append(json.getString("devLoginName"))
					.append(":").append(json.getString("devLoginPwd"))
					.append("/av_stream").toString();

			StringBuffer sb3 = new StringBuffer(
					"UPDATE imm_camera SET videoServer=?,videoUrlSuf=? WHERE devId = ?");
			Object[] params3 = new Object[] { videoServer, url, cammerId };
			try {
				jdbcTemplate.update(sb3.toString(), params3); // 受影响的记录条数，失败则返回-1
			} catch (DataAccessException e) {
				throw e;
			}
		}

		logger.info("modNetnvrInfo [end] suc ,devId={}", devId);
		return true;
	}

	@Override
	public boolean modChannelNumByModelId(int devModelId, int ChannelNum) {

		String strSQL = "UPDATE imm_devmodel SET ChannelNum = ?  WHERE devModelId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, ChannelNum, devModelId);
			if (rs > 0) {
				logger.info(
						"modChannelNumByModelId suc,rs={},devModelId={},ChannelNum={}",
						rs, devModelId, ChannelNum);
				return true;
			}
			logger.error(
					"modChannelNumByModelId fail,rs={},devModelId={},ChannelNum={}",
					rs, devModelId, ChannelNum);
			return false;
		} catch (DataAccessException e) {
			logger.error(
					"modChannelNumByModelId err,devModelId={},ChannelNum={},e={}",
					devModelId, ChannelNum, e.toString());
			return false;
		}
	}

	@Override
	public boolean modifyDevzone(String devId, String devZoneId, JSONObject json)
			throws Exception {

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devzone SET snModeId=?,atPos=?,instDate=?,wantDo=?,almType=?,snNum=?,"
						+ "snType=?,fMemo=? WHERE devId = ? AND devZoneId = ?");
		Object[] params = new Object[] { json.getString("snModeId"),
				json.getString("atPos"), json.getString("instDate"),
				json.getString("wantDo"), json.getString("almType"),
				json.getString("snNum"), json.getString("snType"),
				json.getString("fMemo"), devId, devZoneId };
		try {
			jdbcTemplate.update(sb.toString(), params); // 受影响的记录条数，失败则返回-1
			return true;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public boolean modifyCamera(String devId, JSONObject json) throws Exception {

		Date date = new Date();
		String updatetime = sdf.format(date);

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_camera a,imm_devinfo b SET a.devChannelId=?,a.cameraName=?,a.atPos=?,a.instDate=?,a.wantDo=?,a.almType=?,"
						+ "a.cameraModeId=?,a.cameraType=?,a.fMemo=?,a.updatetime=?,a.devMonitorId=?,b.devName=?,b.define5=? WHERE a.devId=b.devId  AND a.devId = ?");
		Object[] params = new Object[] { json.getString("devChannelId"),
				json.getString("cameraName"), json.getString("atPos"),
				json.getString("instDate"), json.getString("wantDo"),
				json.getString("almType"), json.getString("cameraModeId"),
				json.getString("cameraType"), json.getString("fMemo"),
				updatetime, json.getString("devMonitorId"),
				json.getString("cameraName"), json.getString("gbId"), devId };
		try {
			int rs = jdbcTemplate.update(sb.toString(), params); // 受影响的记录条数，失败则返回-1
			return rs > 0;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int queryAlalmhostcha(String devId) throws Exception { // 查询摄像机是否存在
		try {
			String sqldevinfo = " SELECT count(*) FROM imm_camera WHERE devId = ? ";
			int num = jdbcTemplate.queryForInt(sqldevinfo, devId);
			return num;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int queryNVRCamerNum(String devId) throws Exception { // 根据监控点编号查询这个摄像机的NVR已经存在多少条摄像机记录
																	// ，
		try {
			String sqldevinfo = " SELECT COUNT(*) FROM imm_devinfo WHERE relateNVR=?  AND (devType ='11' OR devType ='12') ";
			int num = jdbcTemplate.queryForInt(sqldevinfo,
					new Object[] { devId });
			return num;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List queryNVRCamerInfo(String devId) throws Exception { // 查询这个摄像机的NVR下的监控点信息
																	// ，
																	// 修改为：根据nvr编号查询监控点信息
		try {
			String sqldevinfo = " SELECT b.* FROM imm_devinfo a,imm_camera b WHERE a.devId=b.devId AND b.relateNVR=? AND (devType ='11' OR devType ='12')  ";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(
					sqldevinfo, new Object[] { devId });
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int queryNVRCamerNumZone(String devId) throws Exception { // 查询这个摄像机的NVR可以存在多少条摄像机
		try {
			String sqldevinfo = " SELECT ChannelNum FROM imm_devmodel WHERE devModelId = (SELECT devModelId FROM imm_devinfo WHERE devId=? ) ";
			int num = jdbcTemplate.queryForInt(sqldevinfo,
					new Object[] { devId });
			return num;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List queryCammer(String devId) { // 通过某个摄像机编号拿到某个摄像机信息
		List<Map<String, Object>> list = null;
		String sqldevinfo = "SELECT a.*,b.videoUrlSuf,b.videoServer FROM imm_devinfo a LEFT JOIN imm_camera b ON a.devId=b.devId "
				+ " WHERE a.devId=? ";
		list = jdbcTemplate.queryForList(sqldevinfo, new Object[] { devId });
		return list;
	}

	@SuppressWarnings("deprecation")
	@Override
	public int queryNVRCammer(String devId) { // 查询某个摄像机的NVR是有线的还是无线的
		String sqldevinfo = " SELECT devType FROM imm_devinfo WHERE devId = (SELECT relateNVR FROM imm_devinfo WHERE devId = ?) ";
		int type = jdbcTemplate.queryForInt(sqldevinfo, new Object[] { devId });
		return type;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public void addNVRCammer(List list, JSONObject json) { // 添加摄像机
		Map<String, String> map = (Map<String, String>) list.get(0);
		long num = ErrorAbnormal.timeToTen();

		String videoServer = map.get("videoServer");
		String videoUrlSufString = map.get("videoUrlSuf");
		Object devTypeO = map.get("devType");
		Integer devType = (Integer) devTypeO;
		// String videoUrlSufString =
		// ":9002/10.2.2.34:19031:HIK:232:0:admin:admin/av_stream";
		String[] urlList = videoUrlSufString.split("\\/");
		String[] urlList2 = urlList[1].split("\\:");
		String devChannelId = json.getString("devChannelId");
		int devChannelIdInt = Integer.valueOf(devChannelId);
		String IP = urlList2[0];
		String port = urlList2[1];
		String flag = urlList2[2];
		String loginName = urlList2[5];
		String loginPws = urlList2[6];

		videoUrlSufString = ":9000/" + IP + ":" + port + ":" + flag + ":"
				+ devChannelIdInt + ":0:" + loginName + ":" + loginPws
				+ "/av_stream";
		String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,instMan,"
				+ "devInstDate,devLng,devlat,relateNVR,pnlAddr,instUnit,fMemo)"
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
		jdbcTemplate.update(
				sqldevinfo,
				new Object[] { num, json.getString("cameraName"),
						map.get("pnlActID"), map.get("areaId"),
						map.get("devType"), map.get("devModelId"),
						map.get("instMan"), map.get("devInstDate"),
						map.get("devLng"), map.get("devlat"),
						map.get("relateNVR"), map.get("pnlAddr"),
						map.get("instUnit"), map.get("fMemo") });

		String sqlalarmhostattr = " INSERT INTO imm_camera (devId,devChannelId,cameraName,atPos,instDate,wantDo,almType"
				+ ",cameraModeId,cameraType,fMemo,devMonitorId,videoUrlSuf,videoServer) "
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ";
		jdbcTemplate.update(
				sqlalarmhostattr,
				new Object[] { num, json.getString("devChannelId"),
						json.getString("cameraName"), json.getString("atPos"),
						json.getString("instDate"), json.getString("wantDo"),
						json.getString("almType"),
						json.getString("cameraModeId"),
						json.getString("cameraType"), json.getString("fMemo"),
						json.getString("devMonitorId"), videoUrlSufString,
						videoServer });
	}

	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public void addNVRHaveCammer(JSONObject info, JSONObject json,
			String cameraDevId, int xitNum) throws Exception { // 添加摄像机

		String videoServer = info.getString("videoServer");
		Integer devType = 11;
		int vPort = 9000;
		String videoUrlSufString = ":" + vPort + "/" + info.getString("devIp")
				+ ":" + info.getString("devPort") + ":"
				+ info.getString("manufacturer") + ":"
				+ json.getString("devChannelId") + ":0:"
				+ info.getString("devLoginName") + ":"
				+ info.getString("devLoginPwd") + "/av_stream";

		String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,define5,pnlActID,ownerId,areaId,devType,devModelId,instMan,"
				+ "devInstDate,devLng,devlat,relateNVR,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

		String sqlalarmhostattr = " INSERT INTO imm_camera (devId,devChannelId,cameraName,relateNVR,atPos,instDate,wantDo,almType"
				+ ",cameraModeId,cameraType,fMemo,devMonitorId,videoUrlSuf,videoServer,dataFrom) "
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

		try {
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { cameraDevId, json.getString("cameraName"),
							json.getString("gbId"), info.getString("pnlActID"),
							info.getString("ownerId"),
							info.getString("areaId"), devType,
							info.getString("devModelId"),
							info.getString("instMan"),
							info.getString("devInstDate"),
							info.getString("devLng"), info.getString("devlat"),
							info.getString("devId"), info.getString("pnlAddr"),
							info.getString("instUnit"),
							json.getString("fMemo"),
							info.getString("manufacturer"),
							json.getString("dataFrom"),
							ConfigUtil.getPlatformId() });
			jdbcTemplate.update(
					sqlalarmhostattr,
					new Object[] { cameraDevId, json.getString("devChannelId"),
							json.getString("cameraName"),
							info.getString("devId"), json.getString("atPos"),
							json.getString("instDate"),
							json.getString("wantDo"),
							json.getString("almType"),
							json.getString("cameraModeId"),
							json.getString("cameraType"),
							json.getString("fMemo"),
							json.getString("devMonitorId"), videoUrlSufString,
							videoServer, json.getString("dataFrom") });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public void addNVRNoCammer(JSONObject info, JSONObject json,
			String cameraDevId, int xitNum) throws Exception { // 添加无线摄像机

		String videoServer = info.getString("videoServer");
		Integer devType = 12;
		// int vPort = 9000 + xitNum;
		int vPort = 9000;

		String manufacturer = info.getString("manufacturer");

		String videoUrlSufString = ":" + vPort + "/"
				+ info.getString("devTUTKID") + ":0:" + manufacturer + ":"
				+ json.getString("devChannelId") + ":0:"
				+ info.getString("devLoginName") + ":"
				+ info.getString("devLoginPwd") + "/av_stream";

		String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,define5,pnlActID,ownerId,areaId,devType,devModelId,instMan,"
				+ "devInstDate,devLng,devlat,relateNVR,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

		String sqlalarmhostattr = " INSERT INTO imm_camera (devId,devChannelId,cameraName,relateNVR,atPos,instDate,wantDo,almType"
				+ ",cameraModeId,cameraType,fMemo,devMonitorId,videoUrlSuf,videoServer,dataFrom) "
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

		try {
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { cameraDevId, json.getString("cameraName"),
							json.getString("gbId"), info.getString("pnlActID"),
							info.getString("ownerId"),
							info.getString("areaId"), devType,
							info.getString("devModelId"),
							info.getString("instMan"),
							info.getString("devInstDate"),
							info.getString("devLng"), info.getString("devlat"),
							info.getString("devId"), info.getString("pnlAddr"),
							info.getString("instUnit"),
							json.getString("fMemo"),
							info.getString("manufacturer"),
							json.getString("dataFrom"),
							ConfigUtil.getPlatformId() });

			jdbcTemplate.update(
					sqlalarmhostattr,
					new Object[] { cameraDevId, json.getString("devChannelId"),
							json.getString("cameraName"),
							info.getString("devId"), json.getString("atPos"),
							json.getString("instDate"),
							json.getString("wantDo"),
							json.getString("almType"),
							json.getString("cameraModeId"),
							json.getString("cameraType"),
							json.getString("fMemo"),
							json.getString("devMonitorId"), videoUrlSufString,
							videoServer, json.getString("dataFrom") });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean delAlarmhostInfo(String devId) {
		String deleteFromDevInfo = "delete from imm_devinfo where devId=?";
		String deleteFromAlarmhostrattr = "delete from imm_alarmhostattr where devId=?";
		String deleteFromDevZone = "delete from imm_devzone where devId=?";

		try {
			int deleted = 0;
			deleted += jdbcTemplate.update(deleteFromDevInfo, devId);
			deleted += jdbcTemplate.update(deleteFromAlarmhostrattr, devId);
			deleted += jdbcTemplate.update(deleteFromDevZone, devId);

			// 设备基本信息表和报警主机属性表必须各有一条记录，至于设备防区，则不一定有
			return deleted >= 2;

		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return false;
		}
	}

	@Override
	public boolean delWirenvrInfo(String devId) {
		String strSQL = "DELETE a,b FROM imm_devinfo a INNER JOIN imm_wirenvrattr b ON a.devId=b.devId WHERE a.devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			if (rs > 0) {
				logger.info("delWirenvrInfo suc,rs={},devId={}", rs, devId);
				return true;
			}
			logger.error("delWirenvrInfo fail,rs={},devId={}", rs, devId);
			return false;
		} catch (DataAccessException e) {
			logger.error("delWirenvrInfo err,devId={},e={}", devId,
					e.toString());
			return false;
		}
	}

	@Override
	public boolean delNetnvrInfo(String devId) {
		String strSQL = "DELETE a,b FROM imm_devinfo a INNER JOIN imm_netnvrattr b ON a.devId=b.devId WHERE a.devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			if (rs > 0) {
				logger.info("delNetnvrInfo suc,rs={},devId={}", rs, devId);
				return true;
			}
			logger.error("delNetnvrInfo fail,rs={},devId={}", rs, devId);
			return false;
		} catch (DataAccessException e) {
			logger.error("delNetnvrInfo err,devId={},e={}", devId, e.toString());
			return false;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List queryCammerIdByNvrId(String devId) {
		String strSQL = " SELECT devId FROM imm_devinfo WHERE relateNVR=?";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(strSQL,
					devId);
			logger.info("queryCammerIdByNvrId suc,devId={},size={}", devId,
					list.size());
			return list;
		} catch (DataAccessException e) {
			logger.error("queryCammerIdByNvrId err,devId={},e={}", devId,
					e.toString());
			return null;
		}
	}

	@Override
	public boolean delCameraInfo(String devId) {
		String strSQL = "DELETE a,b FROM imm_devinfo a INNER JOIN imm_camera b ON a.devId=b.devId WHERE a.devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			if (rs > 0) {
				logger.info("delCameraInfo suc,rs={},devId={}", rs, devId);
				return true;
			}
			logger.error("delCameraInfo fail,rs={},devId={}", rs, devId);
			return false;
		} catch (DataAccessException e) {
			logger.error("delCameraInfo err,devId={},e={}", devId, e.toString());
			return false;
		}
	}

	@Override
	public boolean delRoledevByDevId(String devId) {
		String strSQL = "DELETE FROM imm_roledev WHERE devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			if (rs > 0) {
				logger.info("delRoledevByDevId suc,rs={},devId={}", rs, devId);
				return true;
			}
			logger.error("delRoledevByDevId fail,rs={},devId={}", rs, devId);
			return false;
		} catch (DataAccessException e) {
			logger.error("delRoledevByDevId err,devId={},e={}", devId,
					e.toString());
			return false;
		}
	}

	@Override
	public int delRolemonitorByDevId(String devId) { // 清空角色监控点表
		String strSQL = "DELETE FROM imm_rolemonitor WHERE devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			logger.info("delRoledevByDevId suc,rs={},devId={}", rs, devId);
			return rs;
		} catch (DataAccessException e) {
			logger.error("delRoledevByDevId err,devId={},e={}", devId,
					e.toString());
			return 0;
		}
	}

	@Override
	public int delRolezoneByDevId(String devId) {
		String strSQL = "DELETE FROM imm_ownerzone WHERE devId = ?";
		try {
			int rs = jdbcTemplate.update(strSQL, devId);
			logger.info("delRoledevByDevId suc,rs={},devId={}", rs, devId);
			return rs;
		} catch (DataAccessException e) {
			logger.error("delRoledevByDevId err,devId={},e={}", devId,
					e.toString());
			return 0;
		}
	}

	@Override
	@Transactional(readOnly = false, timeout = -1, isolation = Isolation.REPEATABLE_READ)
	public boolean copyDevice(List<String> deviceList, JSONObject json)
			throws Exception {

		StringBuffer sb = new StringBuffer(
				" UPDATE imm_devinfo SET devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=?,manufacturer=? WHERE ownerId is null and  devId in ('" + 
						Objects.Joiner("','", deviceList) + "')");
		Object[] params = new Object[] { json.getString("devName"), json.getString("pnlActID"),
				json.getString("areaId"), json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"), json.getString("devLng"),
				json.getString("devlat"), json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), json.getString("manufacturer") };
		
		//有主设备
		StringBuffer sbhad = new StringBuffer(
				" UPDATE imm_devinfo SET devName=?,pnlActID=?,devType=?,devModelId=?,instMan=?,devInstDate=?,"
						+ "devLng=?,devlat=?,pnlAddr=?,instUnit=?,fMemo=?,manufacturer=? WHERE ownerId is not null and devId in ('" + 
						Objects.Joiner("','", deviceList) + "')");
		Object[] paramshad = new Object[] { json.getString("devName"), json.getString("pnlActID"),
				json.getString("devType"), json.getString("devModelId"),
				json.getString("instMan"), json.getString("devInstDate"), json.getString("devLng"),
				json.getString("devlat"), json.getString("pnlAddr"), json.getString("instUnit"),
				json.getString("fMemo"), json.getString("manufacturer") };

		StringBuffer sb2 = new StringBuffer(
				" UPDATE imm_alarmhostattr SET telAddr=?,pnlTel=?,keyboardAddr=?,pnlPowerAddr=?,pnlHdTel=?,RegexPWD=? WHERE devId in ('"
						+ Objects.Joiner("','", deviceList) + "')");
		
		Object[] params2 = new Object[] { json.getString("telAddr"),
				json.getString("pnlTel"), json.getString("keyboardAddr"),
				json.getString("pnlPowerAddr"), json.getString("pnlHdTel"),
				json.getString("regexPWD") };
		try {
			jdbcTemplate.update(sb.toString(), params);
			jdbcTemplate.update(sbhad.toString(), paramshad);
			jdbcTemplate.update(sb2.toString(), params2);
			return true;
		} catch (DataAccessException e) {
			throw e;
		}
	}
}
