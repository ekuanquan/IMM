package com.datasync.dao;

public interface IQueryByIdDao {

	QueryPojo queryForImm_dealway(String ownerId, String dealWayId);
	QueryPojo queryForImm_devInfo(String devId);
	QueryPojo queryForImm_wirenvrattr(String devId);
	QueryPojo queryFormm_netnvrattr(String devId);
	QueryPojo queryForImm_devzone(String devId,String devZoneId);
	QueryPojo queryForImm_camera(String devId);
	QueryPojo queryForImm_area(String areaId);
	QueryPojo queryForImm_tgpscarattr(String devId);
	QueryPojo queryForImm_ownermonitor(String ownerMonitorId,String ownerId);
	QueryPojo queryForImm_ownerevtrecord(String UserEvtId);
	QueryPojo queryForImm_roleinfo(String roleId);
	QueryPojo queryForImm_syscode(String codeId);
	QueryPojo queryForImm_systemconfig(String dataName);
	QueryPojo queryForImm_usercont(String userId,String contId);
	QueryPojo queryForImm_userinfo(String userId);
	QueryPojo queryForImm_userplanevent(String userId);
	QueryPojo queryForImm_ownerzone(String ownerId,String devZoneId);
	QueryPojo queryForImm_ownerzoneByOwnerZoneName(String ownerId,String ownerZoneName);
	QueryPojo queryForImm_oneClickDev(String devId);
	QueryPojo queryForImm_assemble(String id);

}
