DELIMITER $$

DROP TRIGGER IF EXISTS tr_devinfo_insert $$

CREATE TRIGGER tr_devinfo_insert 
 AFTER INSERT ON imm_devinfo 
 FOR EACH ROW 
 update identifier_info set devUsed=1 where id=new.devId
$$


DROP TRIGGER IF EXISTS tr_devinfo_update $$
 
CREATE TRIGGER tr_devinfo_update
 AFTER UPDATE ON imm_devinfo 
 FOR EACH ROW BEGIN
 UPDATE identifier_info SET devUsed=0 WHERE id = old.devId;
 UPDATE identifier_info SET devUsed=1 WHERE id =new.devId;
 END$$


DROP TRIGGER IF EXISTS tr_devinfo_delete $$
 
CREATE TRIGGER tr_devinfo_delete 
BEFORE DELETE ON imm_devinfo 
FOR EACH ROW 
update identifier_info set devUsed=0 where id=old.devId$$

DROP TRIGGER IF EXISTS tri_imm_sub_sys_ins $$

CREATE TRIGGER tri_imm_sub_sys_ins 
AFTER INSERT ON imm_sub_sys_of_alarm_host 
FOR EACH ROW 
INSERT INTO mcs_devstatus(devId,subSysId,ownId,devStatus,updateTime) VALUE(new.devId,new.subSysId,(SELECT ownerId FROM imm_devinfo WHERE devId =new.devId),new.bf,NOW());
$$

DROP TRIGGER IF EXISTS tri_imm_sub_sys_dele $$

CREATE TRIGGER tri_imm_sub_sys_dele 
AFTER DELETE ON imm_sub_sys_of_alarm_host 
FOR EACH ROW begin 
delete from mcs_devstatus where devId = OLD.devId and subSysId = OLD.subSysId;
end$$

DROP TRIGGER IF EXISTS t_afterinsert_on_userinfo $$

CREATE TRIGGER t_afterinsert_on_userinfo 
AFTER INSERT ON imm_userinfo 
FOR EACH ROW 
BEGIN 
UPDATE identifier_info SET userUsed = 1 WHERE id = NEW.userId;
END $$

DROP TRIGGER IF EXISTS tr_userinfo_update $$

CREATE TRIGGER tr_userinfo_update 
AFTER UPDATE ON imm_userinfo 
FOR EACH ROW BEGIN
 UPDATE identifier_info SET userUsed=0 WHERE id = old.userId;
 UPDATE identifier_info SET userUsed=1 WHERE id =new.userId;
 END$$

DROP TRIGGER IF EXISTS t_afterdelete_on_userinfo $$
 
CREATE TRIGGER t_afterdelete_on_userinfo 
AFTER DELETE ON imm_userinfo 
FOR EACH ROW BEGIN
     UPDATE identifier_info SET userUsed = 0 WHERE id = OLD.userId;
END$$

DELIMITER ;