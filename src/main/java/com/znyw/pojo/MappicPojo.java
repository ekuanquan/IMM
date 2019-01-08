package com.znyw.pojo;

public class MappicPojo implements Comparable<MappicPojo> {
	private String roleId;
	private String mapId;
	private String mapName;
	private String mapPath;
	private String fMemo;
	private String updatetime;
	private String define1;
	private String define2;
	private String define3;
	private String define4;
	private String define5;
	private String define6;

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getMapId() {
		return mapId;
	}
	public void setMapId(String mapId) {
		this.mapId = mapId;
	}
	public String getMapName() {
		return mapName;
	}
	public void setMapName(String mapName) {
		this.mapName = mapName;
	}
	public String getMapPath() {
		return mapPath;
	}
	public void setMapPath(String mapPath) {
		this.mapPath = mapPath;
	}
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	public String getUpdatetime() {
		return updatetime;
	}
	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}
	public String getDefine1() {
		return define1;
	}
	public void setDefine1(String define1) {
		this.define1 = define1;
	}
	public String getDefine2() {
		return define2;
	}
	public void setDefine2(String define2) {
		this.define2 = define2;
	}
	public String getDefine3() {
		return define3;
	}
	public void setDefine3(String define3) {
		this.define3 = define3;
	}
	public String getDefine4() {
		return define4;
	}
	public void setDefine4(String define4) {
		this.define4 = define4;
	}
	public String getDefine5() {
		return define5;
	}
	public void setDefine5(String define5) {
		this.define5 = define5;
	}
	public String getDefine6() {
		return define6;
	}
	public void setDefine6(String define6) {
		this.define6 = define6;
	}

	@Override
	public String toString() {
		return "MappicPojo [mapId=" + mapId + ", mapName=" + mapName
				+ ", mapPath=" + mapPath + ", fMemo=" + fMemo + ", updatetime="
				+ updatetime + ", define1=" + define1 + ", define2=" + define2
				+ ", define3=" + define3 + ", define4=" + define4
				+ ", define5=" + define5 + ", define6=" + define6 + "]";
	}

	@Override
	public int compareTo(MappicPojo o) {
		return Integer.valueOf(this.getMapName().substring(3))
				- Integer.valueOf(((MappicPojo) o).getMapName().substring(3));
	}
	
}
