package com.device.pojo;

public class DeviceInfoPojo {
    private String devId; //设备编号
    private String devName; //设备名称
    private String pnlActID; //设备关联编号
    private String areaId; //设备所属区域编号
    private String devType; //设备类型编号
    private String devModelId; //设备型号编号
    private String userId; //机主编号（用户编号）
    private String userName; //机主名称（用户名称）
    private String userAddr; //机主地址（用户地址）
    private String contact; //机主负责人姓名（用户负责人）
    private String cPhone; //机主负责人电话（用户负责人电话）
    private double devLng; //设备经度
    private double devlat; //设备纬度
    private String pnlAddr; //设备位置
    private String instMan; //设备安装员
    private String devInstDate; //设备安装时间
    private String instUnit; //设备安装单位
    private int devState; //设备状态（0不在线；1在线；2未知）
    private String serverId; //服务器编号
    private String mapId; //防区图编号
    private String fMemo; //备注
    private String updatetime; //更新时间
    private String syncTime; //同步时间
    public String getDevId() {
        return devId;
    }
    public void setDevId(String devId) {
        this.devId = devId;
    }
    public String getDevName() {
        return devName;
    }
    public void setDevName(String devName) {
        this.devName = devName;
    }
    public String getPnlActID() {
        return pnlActID;
    }
    public void setPnlActID(String pnlActID) {
        this.pnlActID = pnlActID;
    }
    public String getAreaId() {
        return areaId;
    }
    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }
    public String getDevType() {
        return devType;
    }
    public void setDevType(String devType) {
        this.devType = devType;
    }
    public String getDevModelId() {
        return devModelId;
    }
    public void setDevModelId(String devModelId) {
        this.devModelId = devModelId;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getUserAddr() {
        return userAddr;
    }
    public void setUserAddr(String userAddr) {
        this.userAddr = userAddr;
    }
    public String getContact() {
        return contact;
    }
    public void setContact(String contact) {
        this.contact = contact;
    }
    public String getcPhone() {
        return cPhone;
    }
    public void setcPhone(String cPhone) {
        this.cPhone = cPhone;
    }
    public double getDevLng() {
        return devLng;
    }
    public void setDevLng(double devLng) {
        this.devLng = devLng;
    }
    public double getDevlat() {
        return devlat;
    }
    public void setDevlat(double devlat) {
        this.devlat = devlat;
    }
    public String getPnlAddr() {
        return pnlAddr;
    }
    public void setPnlAddr(String pnlAddr) {
        this.pnlAddr = pnlAddr;
    }
    public String getInstMan() {
        return instMan;
    }
    public void setInstMan(String instMan) {
        this.instMan = instMan;
    }
    public String getDevInstDate() {
        return devInstDate;
    }
    public void setDevInstDate(String devInstDate) {
        this.devInstDate = devInstDate;
    }
    public String getInstUnit() {
        return instUnit;
    }
    public void setInstUnit(String instUnit) {
        this.instUnit = instUnit;
    }
    public int getDevState() {
        return devState;
    }
    public void setDevState(int devState) {
        this.devState = devState;
    }
    public String getServerId() {
        return serverId;
    }
    public void setServerId(String serverId) {
        this.serverId = serverId;
    }
    public String getMapId() {
        return mapId;
    }
    public void setMapId(String mapId) {
        this.mapId = mapId;
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
    public String getSyncTime() {
        return syncTime;
    }
    public void setSyncTime(String syncTime) {
        this.syncTime = syncTime;
    }
    @Override
    public String toString() {
        return "DeviceInfoPojo [devId=" + devId + ", devName=" + devName + ", pnlActID=" + pnlActID + ", areaId="
                + areaId + ", devType=" + devType + ", devModelId=" + devModelId + ", userId=" + userId + ", userName="
                + userName + ", userAddr=" + userAddr + ", contact=" + contact + ", cPhone=" + cPhone + ", devLng="
                + devLng + ", devlat=" + devlat + ", pnlAddr=" + pnlAddr + ", instMan=" + instMan + ", devInstDate="
                + devInstDate + ", instUnit=" + instUnit + ", devState=" + devState + ", serverId=" + serverId
                + ", mapId=" + mapId + ", fMemo=" + fMemo + ", updatetime=" + updatetime + ", syncTime=" + syncTime
                + "]";
    }
    
}
