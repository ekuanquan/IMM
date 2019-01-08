-- `未知`的字段改成空白
-- 2018-04-18 谭炳健
UPDATE imm_almtype SET almTypeName=' ' WHERE almType=-1;
UPDATE imm_cameratype SET cameraTypeName=' ' WHERE cameraType=-1;
UPDATE imm_cameramodel SET cameraModelName=' ' WHERE cameraModelId=-1;
UPDATE imm_sntype SET snTypeName=' ' WHERE snType=-1;
UPDATE imm_wantdo SET wantDoName=' ' WHERE wantDo=-1;
UPDATE imm_devmodel SET devModelName=' ' WHERE devModelId=-1;
UPDATE imm_snmodel SET snModelName=' ' WHERE snModelId=-1;
