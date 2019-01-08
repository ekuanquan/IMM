DELIMITER $$

DROP PROCEDURE IF EXISTS `resetCustomerAlarmStatus`$$

CREATE DEFINER=`root`@`%` PROCEDURE `resetCustomerAlarmStatus`()
BEGIN
	UPDATE mcs_customer_status SET isAlarm=0,alarmSyscode='',alarmTime='';
    END$$
    
DROP PROCEDURE IF EXISTS `snoquery`$$

CREATE DEFINER=`root`@`%` PROCEDURE `snoquery`(IN NO INT)
BEGIN DECLARE s_no INT; SET s_no=NO; SELECT * FROM imm_devinfo WHERE devType = s_no ;  END$$    
    
DROP PROCEDURE IF EXISTS `snoquery1`$$

CREATE DEFINER=`root`@`%` PROCEDURE `snoquery1`(IN NO CHAR)
BEGIN DECLARE s_no CHAR; SET s_no=NO; SELECT * FROM imm_devinfo WHERE imm_devinfo.relateNVR IN (SELECT devId FROM imm_devinfo WHERE imm_devinfo.devName=s_no) ;  END$$

DELIMITER ;

