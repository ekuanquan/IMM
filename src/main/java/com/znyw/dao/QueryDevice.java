package com.znyw.dao;

import java.util.List;

public interface QueryDevice {
	public List<?> QueryNVRhaveNatuno(String queryId, String areaId, String sort, int pageSize, int currentPage,
			String isowner,String platformId);
	public List<?> QueryNVRheveNat(String queryId, String areaId, String sort, int pageSize, int currentPage,
			String isowner,String platformId );
	public int QueryNVRhaveNatunoNum(String queryId,String areaId,String isowner,String platformId );
	public int QueryNVRheveNatNum(String queryId,String areaId,String isowner,String platformId );
	public List<?> Queryrelated(String devTutkID ,String channelNum ,String sysCode);
	public List<?> QueryUserId(String devId);
	public List<?> QueryEventclass();
	public String QueryDevId(String cameraId);
	public List<?> queryDevBasicDao(String devId);
	public List<?> queryDevOrderbyUser(String userId);

}
