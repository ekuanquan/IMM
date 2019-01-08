package com.znyw.pojo;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Area {
	private String areaId;
	private String areaName;
	private String fMemo;
	private List<Area> childs = new ArrayList<Area>();

	@Override
	public String toString() {
		return String.format("areaId:%s areaName:%s fMome:%s childs:%s", areaId, areaName, fMemo, childs.toString());

	}

	public Set<String> getAreaIds() {
		Set<String> areaIds = new HashSet<String>();

		for (Area area : childs) {
			areaIds.add(area.getAreaId());
			areaIds.addAll(area.getAreaIds());
		}
		areaIds.add(getAreaId());

		return areaIds;
	}

	public Area(Map<String, Object> areaMap) {
		areaId = areaMap.get("areaId").toString();
		areaName = areaMap.get("areaName") == null ? "" : areaMap.get("areaName").toString();
		fMemo = areaMap.get("fMemo") == null ? "" : areaMap.get("fMemo").toString();
	}

	public Area(String areaId) {
		this.areaId = areaId;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	public List<Area> getChilds() {
		return childs;
	}

	public void setChilds(List<Area> childs) {
		this.childs = childs;
	}
}
