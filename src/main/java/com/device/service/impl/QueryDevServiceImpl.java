package com.device.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IQueryDevDao;
import com.device.service.IQueryDevService;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.AlarmhostPojo;
import com.znyw.pojo.Pagepojo;
import com.znyw.service.AreaService;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.ErrorcodeEnum;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;
import com.znyw.tool.SetField;

@Service
public class QueryDevServiceImpl implements IQueryDevService {

	private final Logger log = LoggerFactory.getLogger(this.getClass());
	@Resource
	IQueryDevDao iQueryDevDao;

	@Resource
	private AreaService areaService;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private UserDaoImp userDaoImp;

	@Override
	public JSONObject queryAlarmhostList(Pagepojo pagepojo,
			JSONObject queryTond, String userId) {
		String areaId = queryTond.getString("areaId");
		String key = queryTond.getString("key");
		String queryId = queryTond.getString("queryId");
		String isowner = queryTond.getString("isowner");
		String platformId = queryTond.containsKey("platformId")?queryTond.getString("platformId"):"";
		String outDevId = queryTond.containsKey("outDevId")?queryTond.getString("outDevId"):"";

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" and a.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" and a.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		if (queryId == null) {
			queryId = "";
		}
		if (key == null) {
			key = "";
		}

		int totalNum = 0;

		try {
			totalNum = iQueryDevDao.queAlarmhostListTotalNum(areaId, key,
					queryId, isowner,platformId,outDevId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (totalNum == 0) {
			pagepojo.setTotalNum(0);
			pagepojo.setTotalPage(1);
			return ResultUtil.jsonResultList2(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), null,
					(JSONObject) JSON.toJSON(pagepojo));
		} else {
			int pageSize = pagepojo.getPageSize();
			int currentPage = pagepojo.getCurrentPage();

			int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSize);

			currentPage = currentPage > totalPages ? totalPages : currentPage;
			currentPage = currentPage <= 0 ? 1 : currentPage;

			String sort = pagepojo.getOrderBy().indexOf("DESC") > 0 ? " DESC "
					: " ASC ";

			List<AlarmhostPojo> list;

			try {
				list = iQueryDevDao.queAlarmhostList(isowner, areaId, key,
						queryId, sort,platformId,outDevId, (currentPage - 1) * pageSize, pageSize);
			} catch (Exception e) {
				log.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
			}

			if (list == null) {
				return ResultUtil.jsonResultBasic(
						ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
						ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
			}
			pagepojo.setTotalNum(totalNum);
			pagepojo.setTotalPage(totalPages);
			pagepojo.setCurrentPage(currentPage);
			int listsize = list.size();
			for (int i = 0; i < listsize; i++) {
				SetField.reflect(list.get(i));
			}

			return ResultUtil.jsonResultList2(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), list,
					(JSONObject) JSON.toJSON(pagepojo));
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject queryAlarmhostAllList(Pagepojo pagepojo,
			JSONObject queryTond, String userId) throws Exception { // 如果是点击主目录，查询所有设备信息
		String key = queryTond.getString("key");
		String queryId = queryTond.getString("queryId");
		String isowner = queryTond.getString("isowner");

		JSONObject userInfo = userDaoImp.getUser(userId);
		String id = (String) userInfo.get("areaId"); // 获取用户所属区域id
		JSONArray jsonCorrelation = areaService.getAreaAllById(id);

		StringBuffer areaId = new StringBuffer();
		areaId.append("AND ( ");
		for (int i = 0; i < jsonCorrelation.size(); i++) {
			Map<String, String> map = (Map<String, String>) jsonCorrelation
					.get(i);
			String ChildareaId = map.get("id");
			areaId.append("a.areaId='" + ChildareaId + "' OR ");
		}
		areaId.append(" a.areaId='" + id + "' ) ");

		if (queryId == null) {
			queryId = "";
		}
		if (key == null) {
			key = "";
		}

		int totalNum = 0;

		try {
			totalNum = iQueryDevDao.queAlarmhostListTotalNum(areaId.toString(),
					key, queryId, isowner,"","");
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		int pageSize = pagepojo.getPageSize();
		int currentPage = pagepojo.getCurrentPage();
		int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSize);

		if (totalNum == 0) {
			pagepojo.setTotalNum(0);
			pagepojo.setTotalPage(1);
			return ResultUtil.jsonResultList2(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), null,
					(JSONObject) JSON.toJSON(pagepojo));
		} else {

			while ((currentPage - 1) * pageSize > totalNum) {
				currentPage--;
			}

			String sort = pagepojo.getOrderBy().contains("DESC") ? " DESC "
					: " ASC ";
			List<AlarmhostPojo> list;
			try {
				list = iQueryDevDao.queAlarmhostList(isowner,
						areaId.toString(), key, queryId, sort,"","",
						(currentPage - 1) * pageSize, pageSize);
			} catch (Exception e) {
				log.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
			}
			if (list == null) {
				log.error(
						"queryAlarmhostList areaId={},key={},pagepojo={},return code=1005",
						areaId, key, pagepojo);
				return ResultUtil.jsonResultBasic(
						ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
						ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
			}
			pagepojo.setTotalNum(totalNum);
			pagepojo.setTotalPage(totalPages);

			int listsize = list.size();
			for (int i = 0; i < listsize; i++) {
				SetField.reflect(list.get(i));
			}
			return ResultUtil.jsonResultList2(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), list,
					(JSONObject) JSON.toJSON(pagepojo));
		}
	}

	@Override
	public JSONObject queryAlarmhostZoneList(JSONObject jsonParam) {

		String devId = jsonParam.getString("DevId");
		JSONArray list;

		try {
			list = iQueryDevDao.queryAlarmhostZoneList(devId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			log.error("queryAlarmhostZoneList devId={} ,return code=1005",
					devId);
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}

	@Override
	public JSONObject queryAlarmhostZoneInfo(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");
		String devZoneId = jsonParam.getString("devZoneId");
		JSONObject info;
		try {
			info = iQueryDevDao.queryAlarmhostZoneInfo(devId, devZoneId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (info == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}

		int snModeId = info.getIntValue("snModeId");
		if (snModeId != -1) {
			String snModelName;
			try {
				snModelName = iQueryDevDao.queSnmodelNameByDid(snModeId);
			} catch (Exception e) {
				log.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
			}
			info.put("snModelName", snModelName);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), info);
	}

	@Override
	public JSONObject queryAlarmhostInfo(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		AlarmhostPojo info;

		try {
			info = iQueryDevDao.queryAlarmhostInfo(devId);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (info == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), info);
	}

	@Override
	public JSONObject queryWirenvrInfo(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			JSONObject info = iQueryDevDao.queryWirenvrInfo(devId);
			if (info == null) {
				return ResultUtil.jsonResultBasic(
						ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
						ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
			}
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), info);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject queryNetnvrInfo(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");

		try {
			JSONObject info = iQueryDevDao.queryNetnvrInfo(devId);
			if (info == null) {
				return ResultUtil.jsonResultBasic(
						ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
						ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
			}
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), info);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject queryCameraList(JSONObject jsonParam) {

		String relateNVR = jsonParam.getString("devId");
		JSONArray list;

		try {
			list = iQueryDevDao.queryCameraListByRelateNVR(relateNVR);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		} else if (list.size() == 0) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), null);
		} else {
			JSONArray rel = new JSONArray();
			int size = list.size();
			for (int i = 0; i < size; i++) {
				JSONObject json = list.getJSONObject(i);
				String devId = json.getString("devId");
				try {
					JSONObject info = iQueryDevDao.queryCameraInfoByDevId(
							devId, "alowNull");
					if (info != null) {
						rel.add(info);
					}
				} catch (Exception e) {
					log.error(e.getMessage(), e);
					return ResultUtil.simpleResponse("500", "查询失败",
							e.getMessage());
				}
			}
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), rel);
		}
	}

	@Override
	public JSONObject queryDeviceId(JSONObject jsonParam) {

		String relateNVR = jsonParam.getString("relateNVR");
		String channelNo = jsonParam.getString("channelNo");
		JSONArray list = null;

		try {
			list = iQueryDevDao.queryDeviceId(relateNVR, channelNo);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		} else if (list.size() == 0) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), null);
		} else {
			JSONArray rel = new JSONArray();
			int size = list.size();
			for (int i = 0; i < size; i++) {
				JSONObject json = list.getJSONObject(i);
				String devId = json.getString("devId");

				try {
					JSONObject info = iQueryDevDao.queryCameraInfoByDevId(
							devId, "alowNull");
					if (info != null) {
						rel.add(info);
					}
				} catch (Exception e) {
					log.error(e.getMessage(), e);
					return ResultUtil.simpleResponse("500", "查询失败",
							e.getMessage());
				}
			}
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.SUCCESS.getErrorcode(),
					ErrorcodeEnum.SUCCESS.getDescribe(), rel);
		}
	}

	@Override
	public JSONObject queryCameraInfo(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");
		JSONObject info = null;
		try {
			info = iQueryDevDao.queryCameraInfoByDevId(devId, "");
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (info == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), info);
	}

	@Override
	public JSONObject queryCameraUrl(JSONObject jsonParam) {

		String devId = jsonParam.getString("devId");
		JSONObject info = null;

		try {
			info = iQueryDevDao.queryCameraInfoByDevId(devId, "");
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (info == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		// rtsp://10.0.10.113:9000/43534534246420:0:P2P_TUTK_CLIENT:0:0:admin:123/av_stream"
		String url = "rtsp://" + info.getString("videoServer")
				+ info.getString("videoUrlSuf");
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), url);
	}

	@Override
	public JSONObject queryAlmtypeList() {

		JSONArray list = null;
		try {
			list = iQueryDevDao.queryAlmtypeList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}

	@Override
	public JSONObject queryWanttoList() {

		JSONArray list = null;
		try {
			list = iQueryDevDao.queryWanttoList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}

	@Override
	public JSONObject queryCameraModelList() {

		JSONArray list = null;
		try {
			list = iQueryDevDao.queryCameraModelList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}

	@Override
	public JSONObject queryCameraTypeList() {

		JSONArray list = null;
		try {
			list = iQueryDevDao.queryCameraTypeList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);

	}

	@Override
	public JSONObject queryCameraTypeById(String cameraType) {

		JSONObject object;
		try {
			object = iQueryDevDao.queryCameraTypeById(cameraType);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (object == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), object);

	}

	@Override
	public JSONObject querySnmodelList() {

		JSONArray list;
		try {
			list = iQueryDevDao.querySnmodelList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}

	@Override
	public JSONObject querySntypeList() {

		JSONArray list;
		try {
			list = iQueryDevDao.querySntypeList();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list == null) {
			return ResultUtil.jsonResultBasic(
					ErrorcodeEnum.MYSQL_ERROR.getErrorcode(),
					ErrorcodeEnum.MYSQL_ERROR.getDescribe(), null);
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(),
				ErrorcodeEnum.SUCCESS.getDescribe(), list);
	}
	

}