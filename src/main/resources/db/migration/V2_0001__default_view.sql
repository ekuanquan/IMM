DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `masterdevinfo_view` AS 
SELECT
  `imm_devinfo`.`ownerId` AS `ownerId`,
  `imm_devinfo`.`devId`   AS `devId`
FROM `imm_devinfo`
WHERE (`imm_devinfo`.`controlType` = 'master')UNION ALL SELECT
                                                          `imm_devinfo`.`ownerId`  AS `ownerId`,
                                                          `imm_devinfo`.`devId`    AS `devId`
                                                        FROM `imm_devinfo`
                                                        WHERE (`imm_devinfo`.`controlType` = 'both')$$

DELIMITER ;

DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `mcs_devstatus_view` AS 
SELECT
  `mcs_devstatus`.`devId` AS `devId`,
  MAX(`mcs_devstatus`.`ownId`) AS `ownId`,
  (CASE WHEN (MIN(`mcs_devstatus`.`devStatus`) = 0) THEN 0 ELSE (CASE WHEN (MAX(`mcs_devstatus`.`devStatus`) = 2) THEN 2 ELSE 1 END) END) AS `devStatus`,
  MAX(`mcs_devstatus`.`updateTime`) AS `updateTime`
FROM `mcs_devstatus`
GROUP BY `mcs_devstatus`.`devId`$$

DELIMITER ;


DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `devinfostatus_view` AS 
SELECT
  `dev`.`ownerId`    AS `ownerId`,
  `dev`.`devId`      AS `devId`,
  `bcf`.`devStatus`  AS `devStatus`,
  `m`.`isActivation` AS `isActivation`,
  `m`.`isTimeout`    AS `isTimeout`
FROM ((`masterdevinfo_view` `dev`
    LEFT JOIN `mcs_devstatus_view` `bcf`
      ON ((`bcf`.`devId` = CONVERT(`dev`.`devId` USING utf8))))
   LEFT JOIN `mcs_customer_status` `m`
     ON ((CONVERT(`dev`.`devId` USING utf8) = `m`.`devId`)))$$

DELIMITER ;



DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `imm_alarmmainframe` AS 
SELECT
  `imm_devinfo`.`devId`              AS `devId`,
  `imm_devinfo`.`devName`            AS `devName`,
  `imm_devinfo`.`pnlActID`           AS `pnlActID`,
  `imm_devinfo`.`areaId`             AS `areaId`,
  `imm_area`.`areaName`              AS `areaName`,
  `imm_devinfo`.`devType`            AS `devType`,
  `imm_devtype`.`devTypeName`        AS `devTypeName`,
  `imm_devinfo`.`devModelId`         AS `devModelId`,
  `imm_devmodel`.`devModelName`      AS `devModelName`,
  `imm_alarmhostattr`.`devIndex`     AS `devIndex`,
  `imm_alarmhostattr`.`telAddr`      AS `telAddr`,
  `imm_devinfo`.`instMan`            AS `instMan`,
  `imm_devinfo`.`devInstDate`        AS `devInstDate`,
  `imm_devinfo`.`devLng`             AS `devLng`,
  `imm_devinfo`.`devlat`             AS `devlat`,
  'devlat'                           AS `My_exp_devlat`,
  `imm_alarmhostattr`.`keyboardAddr` AS `keyboardAddr`,
  `imm_devinfo`.`pnlAddr`            AS `pnlAddr`,
  `imm_alarmhostattr`.`pnlPowerAddr` AS `pnlPowerAddr`,
  `imm_devinfo`.`instUnit`           AS `instUnit`,
  `imm_alarmhostattr`.`passCode`     AS `passCode`,
  `imm_alarmhostattr`.`pnlTel`       AS `pnlTel`,
  `imm_devinfo`.`fMemo`              AS `fMemo`
FROM ((((`imm_devinfo`
      LEFT JOIN `imm_area`
        ON ((`imm_devinfo`.`areaId` = `imm_area`.`areaId`)))
     LEFT JOIN `imm_devtype`
       ON ((`imm_devinfo`.`devType` = `imm_devtype`.`devType`)))
    LEFT JOIN `imm_devmodel`
      ON ((`imm_devinfo`.`devModelId` = `imm_devmodel`.`devModelId`)))
   LEFT JOIN `imm_alarmhostattr`
     ON ((`imm_devinfo`.`devId` = `imm_alarmhostattr`.`devId`)))$$

DELIMITER ;





DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `imm_associateddevice` AS 
SELECT
  `imm_userinfo`.`userId`       AS `userId`,
  `imm_devinfo`.`devId`         AS `devId`,
  `imm_devinfo`.`devName`       AS `devName`,
  `imm_devinfo`.`devType`       AS `devType`,
  `imm_devtype`.`devTypeName`   AS `devTypeName`,
  `imm_devinfo`.`devModelId`    AS `devModelId`,
  `imm_devmodel`.`devModelName` AS `devModelName`,
  `imm_devinfo`.`areaId`        AS `areaId`,
  `imm_area`.`areaName`         AS `areaName`,
  `imm_devinfo`.`devState`      AS `devState`
FROM (((((`imm_roledev`
       LEFT JOIN `imm_userinfo`
         ON ((`imm_userinfo`.`roleId` = `imm_roledev`.`roleId`)))
      LEFT JOIN `imm_devinfo`
        ON ((`imm_devinfo`.`devId` = `imm_roledev`.`devId`)))
     LEFT JOIN `imm_devtype`
       ON ((`imm_devinfo`.`devType` = `imm_devtype`.`devType`)))
    LEFT JOIN `imm_devmodel`
      ON ((`imm_devinfo`.`devModelId` = `imm_devmodel`.`devModelId`)))
   LEFT JOIN `imm_area`
     ON ((`imm_devinfo`.`areaId` = `imm_area`.`areaId`)))$$

DELIMITER ;


DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `imm_editowner` AS 
SELECT
  `imm_userinfo`.`roleId`                   AS `roleId`,
  `imm_userinfo`.`userAccount`              AS `userAccount`,
  `imm_userinfo`.`userPwd`                  AS `userPwd`,
  `imm_userinfo`.`createDate`               AS `createDate`,
  `imm_userinfo`.`userId`                   AS `userId`,
  `imm_userinfo`.`userName`                 AS `userName`,
  `imm_userinfo`.`userType`                 AS `userType`,
  `imm_customerattr`.`userAddr`             AS `userAddr`,
  `imm_customerattr`.`userProperty`         AS `userProperty`,
  `imm_customerattr`.`businessId`           AS `businessId`,
  `imm_business`.`businessName`             AS `businessName`,
  `imm_userinfo`.`centerId`                 AS `centerId`,
  `imm_center`.`centerName`                 AS `centerName`,
  `imm_customerattr`.`payNO`                AS `payNO`,
  `imm_customerattr`.`userServerType`       AS `userServerType`,
  `imm_userservertype`.`userServerTypeName` AS `userServerTypeName`,
  `imm_customerattr`.`contact`              AS `contact`,
  `imm_customerattr`.`contactPayNO`         AS `contactPayNO`,
  `imm_customerattr`.`cHmPhone`             AS `cHmPhone`,
  `imm_customerattr`.`cPhone`               AS `cPhone`,
  `imm_customerattr`.`cMobile`              AS `cMobile`,
  `imm_customerattr`.`nomRpt`               AS `nomRpt`,
  `imm_customerattr`.`engageTest`           AS `engageTest`,
  `imm_customerattr`.`nomTest`              AS `nomTest`,
  `imm_customerattr`.`isVideoCheck`         AS `isVideoCheck`,
  `imm_userinfo`.`areaId`                   AS `areaId`,
  `imm_area`.`areaName`                     AS `areaName`,
  `imm_customerattr`.`isInsurance`          AS `isInsurance`,
  `imm_customerattr`.`hasBak`               AS `hasBak`,
  `imm_customerattr`.`isPay`                AS `isPay`,
  `imm_customerattr`.`usrAlmType`           AS `usrAlmType`,
  `imm_customerattr`.`uMem`                 AS `uMem`,
  `imm_customerattr`.`operName`             AS `operName`,
  `imm_customerattr`.`define2`              AS `define2`,
  `imm_customerattr`.`badMem`               AS `badMem`,
  `imm_customerattr`.`road`                 AS `road`,
  `imm_customerattr`.`define3`              AS `define3`,
  `imm_customerattr`.`define1`              AS `define1`,
  `imm_customerattr`.`define6`              AS `define6`,
  `imm_userinfo`.`fMemo`                    AS `fMemo`,
  `imm_customerattr`.`define4`              AS `define4`,
  `imm_customerattr`.`instDate`             AS `instDate`,
  `imm_customerattr`.`liveDate`             AS `liveDate`,
  `imm_customerattr`.`pnlTelType`           AS `pnlTelType`
FROM (((((`imm_userinfo`
       LEFT JOIN `imm_customerattr`
         ON ((`imm_userinfo`.`userId` = `imm_customerattr`.`userId`)))
      LEFT JOIN `imm_area`
        ON ((`imm_userinfo`.`areaId` = `imm_area`.`areaId`)))
     LEFT JOIN `imm_center`
       ON ((`imm_userinfo`.`centerId` = `imm_center`.`centerId`)))
    LEFT JOIN `imm_userservertype`
      ON ((`imm_customerattr`.`userServerType` = `imm_userservertype`.`userServerType`)))
   LEFT JOIN `imm_business`
     ON ((`imm_customerattr`.`businessId` = `imm_business`.`businessId`)))$$

DELIMITER ;



DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `userinfo_view` AS 
SELECT
  `i`.`userId`   AS `userId`,
  `i`.`userName` AS `userName`,
  `c`.`cMobile`  AS `cMobile`
FROM (`imm_userinfo` `i`
   LEFT JOIN `imm_customerattr` `c`
     ON ((`c`.`userId` = `i`.`userId`)))
WHERE ((`i`.`userType` = '1')
       AND (`i`.`areaId` IS NOT NULL))
ORDER BY `i`.`userId`$$

DELIMITER ;


DELIMITER $$

CREATE OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_mcs_member` AS 
SELECT
  `mcs_group`.`groupId`                AS `groupId`,
  `mcs_group`.`groupName`              AS `groupName`,
  `mcs_group`.`areaId`                 AS `areaId`,
  `mcs_group_user`.`userId`            AS `userId`,
  `mcs_customer_status`.`isAlarm`      AS `isAlarm`,
  `mcs_customer_status`.`isBF`         AS `isBF`,
  `mcs_customer_status`.`isBYpass`     AS `isBYpass`,
  `mcs_customer_status`.`isTimeout`    AS `isTimeout`,
  `mcs_customer_status`.`isActivation` AS `isActivation`,
  `imm_customerattr`.`userAddr`        AS `userAddr`,
  `imm_customerattr`.`cPhone`          AS `cPhone`,
  `imm_customerattr`.`businessId`      AS `businessId`,
  `imm_customerattr`.`businessName`    AS `businessName`,
  `imm_userinfo`.`userName`            AS `userName`,
  `mcs_customer_status`.`updateTime`   AS `updateTime`
FROM ((((`mcs_customer_status`
      JOIN `mcs_group_user`
        ON ((`mcs_group_user`.`userId` = CONVERT(`mcs_customer_status`.`userId` USING utf8))))
     JOIN `mcs_group`
       ON ((`mcs_group`.`groupId` = `mcs_group_user`.`groupId`)))
    JOIN `imm_userinfo`
      ON ((`mcs_customer_status`.`userId` = CONVERT(`imm_userinfo`.`userId` USING utf8))))
   JOIN `imm_customerattr`
     ON ((`mcs_customer_status`.`userId` = CONVERT(`imm_customerattr`.`userId` USING utf8))))$$

DELIMITER ;
