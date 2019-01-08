package com.znyw.dao;

import java.util.List;

public interface DeleteDevice {
	public int DeleteZone(String devId) throws Exception;

	public int DeleteSpay(String devId, String devZoneId) throws Exception;

	public int DeleteBatchSpay(String devId, List<String> devZoneIds)
			throws Exception;

	public int DeleteZoneBatch(List<String> devIds) throws Exception;
}
