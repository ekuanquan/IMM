-- 2018-04-25 何龙
ALTER TABLE imm_userinfo CHANGE  define14 switchUser TINYINT(1) COMMENT '是否启用';
ALTER TABLE imm_userinfo CHANGE  define15 serveEndTime  VARCHAR(32) COMMENT '服务到期时间';
