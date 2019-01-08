/**
 * @author Ahao
 *
 * @createTime 2017年2月21日
 */
package com.znyw.tool;

public enum ErrorcodeEnum {

    /**通用错误码*/
    SUCCESS(1000, "成功"),
    PARAMS_ERROR(1001, "参数错误"),
    UNKNOWN_ERROR(1002, "未知错误"),
    ACTIVEMQ_ERROR(1003, "activemq错误"),
    UNLOGIN_ERROR(1004, "未登陆，请登陆后重试"),
    MYSQL_ERROR(1005, "数据库操作错误"),
    OCCUPIED_ERROR(1006, "正在使用中，不可删除"),
    NOEXIST_ERROR(1007, "不存在"),
    NOEXISTcf_ERROR(1008, "通道号或监控点编号重复了"),
    LACK_ERROR(1009, "参数不全"),
    ChannlMorl_ERROR(1009, "监控点数量已为最大值"),
    QueryNull_ERROR(1010, "监控点查询为空"),
    
    /**自定义错误码*/
    
    ;
    
    private Integer errorcode;
    
    private String describe;
    
    private ErrorcodeEnum(Integer errorcode, String describe) {
        this.errorcode = errorcode;
        this.describe = describe;
    }

    public Integer getErrorcode() {
        return errorcode;
    }

    public void setErrorcode(Integer errorcode) {
        this.errorcode = errorcode;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    };
    
}
