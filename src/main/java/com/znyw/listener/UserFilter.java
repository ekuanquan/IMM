package com.znyw.listener;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.apache.log4j.MDC;
import com.znyw.tool.GetSysInfoUtil;

public class UserFilter implements Filter {
	private static final Logger logger = Logger.getLogger(UserFilter.class);
    private final static String DEFAULT_USERID="anonymous";//默认名称
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req=(HttpServletRequest)request;
        HttpSession session= req.getSession();
        if (session==null){
            MDC.put("userId",DEFAULT_USERID);  
        }
        else{
        	String sysuserID = GetSysInfoUtil.getUserName(req);//获取用户名，可以是其他
            if (sysuserID==null){
                MDC.put("userId",DEFAULT_USERID);
            }
            else{
                MDC.put("userId",sysuserID);
            }
        }
        chain.doFilter(request,response);
    }

    public void init(FilterConfig fc) throws ServletException {
    }
    
    public void destroy() {
    }
}
