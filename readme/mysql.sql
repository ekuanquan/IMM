/******************************新增编号表*************************************/
DROP TABLE IF EXISTS identifier_info;
CREATE TABLE identifier_info(
id varchar(9) PRIMARY KEY,
userUsed int(1) NOT NULL DEFAULT 0 COMMENT '用户表是否使用了此编号,0为未使用,1为使用中',
devUsed int(1) NOT NULL DEFAULT 0 COMMENT '设备是否使用了此编号,0为未使用,1为使用中'
);
ALTER TABLE identifier_info COMMENT='编号表,存储本单元可以使用的编号';  

/*编号表初始导入存储过程,调用: CALL pro_idcreate(前缀);  */
DROP PROCEDURE IF EXISTS pro_idcreate;
CREATE PROCEDURE pro_idcreate(IN title varchar(5))
BEGIN
    DECLARE _size int;
    DECLARE i int;
    DECLARE val varchar(9);
    SET _size = 65535;
    SET i = 0;
    WHILE (i <= _size) DO
        INSERT INTO identifier_info(id) values(CONCAT(title,LPAD(CONV(i,10,16),4,'0')));
        set i=i+1;
   END WHILE;
END;
;


/*******************************用户表*******************************/
/*用户表增加操作触发器*/
DROP TRIGGER IF EXISTS t_afterinsert_on_userinfo;
CREATE TRIGGER t_afterinsert_on_userinfo 
AFTER INSERT ON imm_userinfo
FOR EACH ROW
BEGIN
     UPDATE identifier_info SET userUsed = 1 WHERE id = NEW.userId;
END; 
;
/*用户表删除操作触发器*/
DROP TRIGGER IF EXISTS t_afterdelete_on_userinfo;
CREATE TRIGGER t_afterdelete_on_userinfo 
AFTER DELETE ON imm_userinfo
FOR EACH ROW
BEGIN
     UPDATE identifier_info SET userUsed = 0 WHERE id = OLD.userId;
END;
;

/********************************设备子系统布撤防状态表(旧)--设备子系统状态表(新)************************************/
ALTER TABLE mcs_devstatus  drop index idx_mcs_devstatus;
drop table mcs_devstatus;
create table mcs_devstatus (
 devId varchar(9) NOT NULL COMMENT  '子系统id',
 subSysId varchar(9) NOT NULL  COMMENT '设备编号Id',	
 ownId varchar(9)  COMMENT '设备所属用户',
 devStatus int(1)  COMMENT '设备状态,0撤防,1布防,2旁路',
 updateTime timestamp  COMMENT '更新时间'
);
ALTER TABLE mcs_devstatus ADD unique idx_mcs_devstatus (devId,subSysId);
/*设备子系统布撤防状态表变更为设备子系统状态表需要更新的字段*/
ALTER TABLE mcs_devstatus CHANGE isBF devStatus int(1) COMMENT '设备状态,0撤防,1布防,2旁路';
/*新增事件发送时间,以判断事件是否过期*/
ALTER TABLE mcs_devstatus ADD eventTime bigint COMMENT '事件发送时间(精确毫秒级别)' default 20180101000000000;
/*设备布撤防状态视图*/
drop VIEW IF EXISTS mcs_devstatus_view;
CREATE VIEW mcs_devstatus_view(devId,ownId,devStatus,updateTime) AS 
SELECT devId devId,MAX(ownId) ownId,CASE WHEN MIN(devStatus) = 0 THEN 0 ELSE (CASE WHEN MAX(devStatus) = 2 THEN 2 ELSE 1 END) END AS devStatus,MAX(updateTime) updateTime from mcs_devstatus GROUP BY devId

/*设备子系统表插入触发器,触发后插入一条数据到子系统布撤防状态表*/
drop trigger IF EXISTS tri_imm_sub_sys_ins;
create trigger tri_imm_sub_sys_ins 
after insert on imm_sub_sys_of_alarm_host 
for each row
begin
declare c varchar(255);
set c = (select ownerId from imm_devinfo where devId =new.devId);
insert into mcs_devstatus(devId,subSysId,ownId,devStatus,updateTime) value(new.devId,new.subSysId,c,new.bf,now());
end;

/*设备子系统表删除触发器,触发后删除一条子系统布撤防状态表的相应数据*/
drop trigger IF EXISTS tri_imm_sub_sys_dele;
create trigger tri_imm_sub_sys_dele 
after delete on imm_sub_sys_of_alarm_host 
for each row
begin
delete from mcs_devstatus where devId = OLD.devId and subSysId = OLD.subSysId;
end;




/********************************设备表********************************/
/*设备表新增索引*/
alter table imm_devinfo add index idx_imm_devinfo_2(controlType)

/********************************用户设备状态表********************************/
create table mcs_customer_status (
devId varchar(9) PRIMARY KEY COMMENT '设备id',
userId varchar(9) COMMENT '用户id',
isAlarm int(1) COMMENT '是否报警',
alarmSyscode varchar(4) COMMENT '报警编码',
alarmTime varchar(19) COMMENT '报警检查时间',
isBF int(1) COMMENT '是否布防',
bcfSyscode varchar(4) COMMENT '布撤防编号',
bcfTime varchar(19) COMMENT '布撤防时间',
isBYpass int(4) COMMENT '旁路',
isTimeout int(1) COMMENT '是否离线',
timeoutTime varchar(19) COMMENT '离线时间',
isActivation int(1) COMMENT '是否激活',
updateTime  varchar(19) COMMENT '更新时间'
)



/*用户信息表视图*/
create view userinfo_view(userId,userName,cMobile) AS
SELECT i.userId userId,i.userName userName ,c.cMobile cMobile FROM imm_userinfo i 
LEFT JOIN imm_customerattr c ON c.userId = i.userId 
WHERE i.userType = '1' AND i.areaId IS NOT NULL ORDER BY i.userId ASC

/*用户主设备视图*/
create view masterdevinfo_view(ownerId,devId) AS
SELECT ownerId,devId FROM imm_devinfo where controlType ='master' UNION ALL SELECT ownerId,devId FROM imm_devinfo where controlType ='both' 

/*用户主设备状态视图*/
create view devinfostatus_view(ownerId,devId,devStatus,isActivation,isTimeout) AS
SELECT dev.ownerId ownerId,dev.devId devId,bcf.devStatus devStatus,m.isActivation isActivation,m.isTimeout isTimeout
FROM
masterdevinfo_view dev
LEFT JOIN mcs_devstatus_view  bcf 
ON bcf.devId=dev.devId
 LEFT JOIN mcs_customer_status m
ON dev.devId = m.devId 
