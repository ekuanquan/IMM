DELIMITER $$

ALTER TABLE identifier_info ADD roleUsed INT DEFAULT 0 $$

DROP TRIGGER IF EXISTS tr_role_insert $$

CREATE TRIGGER tr_role_insert 
 AFTER INSERT ON imm_roleinfo 
 FOR EACH ROW 
 update identifier_info set roleUsed=1 where id=new.roleId
$$

DROP TRIGGER IF EXISTS tr_roleinfo_delete $$
 
CREATE TRIGGER tr_roleinfo_delete 
BEFORE DELETE ON imm_roleinfo 
FOR EACH ROW 
update identifier_info set roleUsed=0 where id=old.roleId
$$

DELIMITER ;