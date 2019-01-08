package com.znyw.tool;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;

public class HttpClientTool {
	private static Logger log = Logger.getLogger(HttpClientTool.class);

	private static PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");

	public static String post(String interfaceName, String strQueryJson) {
		String targetProjectUrl = propertyconfigUtil
				.getValue("targetProjectUrl");
		return post(targetProjectUrl, interfaceName, strQueryJson);
	}

	public static String postTrans(String interfaceName, String strQueryJson) {
		String targetProjectUrl = propertyconfigUtil
				.getValue("abutmentServerURL");
		return post(targetProjectUrl, interfaceName, strQueryJson);
	}

	public static String postGeneratorGBID(String interfaceName, String json) {
		String targetProjectUrl = propertyconfigUtil
				.getValue("urlDeviceGeneratorGB");
		return post(targetProjectUrl, interfaceName, json);

	}

	/**
	 * 无body参数post请求
	 * 
	 * @param requestUrl
	 * @return
	 */
	public static String post(String requestUrl) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String resp = new String();
		try {
			// 创建HttpPost.
			HttpPost httppost = new HttpPost(requestUrl);
			httppost.setHeader("Accept-Encoding", "gzip, deflate");
			httppost.setHeader("Accept-Language", "zh-CN");
			httppost.setHeader("Accept",
					"application/json, application/xml, text/html, text/*, image/*, */*");
			httppost.setHeader("Content-Type",
					"application/json; charset=UTF-8");// 发送的格式，内容
			HttpEntity sendEntity;
			sendEntity = new StringEntity("", "UTF-8");
			httppost.setEntity(sendEntity);
			log.info("executing request " + httppost.getURI());
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				// 获取响应实体
				HttpEntity entity = response.getEntity();
				log.info("--------------------------------------");
				// 打印响应状态
				log.info(response.getStatusLine());
				if (entity != null) {
					// 打印响应内容长度
					log.info("Response content length: "
							+ entity.getContentLength());
					// 打印响应内容
					resp = EntityUtils.toString(entity);
					log.info("Response content: " + resp);
				}
				log.info("------------------------------------");
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			log.info("post catch_ClientProtocolException");
		} catch (ParseException e) {
			e.printStackTrace();
			log.info("post catch_ParseException");
		} catch (IOException e) {
			e.printStackTrace();
			log.info("post catch_IOException");
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return resp;
	}

	public static String post(String targetProjectUrl, String interfaceName,
			String strQueryJson) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String requestUrl = targetProjectUrl + interfaceName;
		String resp = new String();
		//requestConfig设置请求和传输超时时间
		RequestConfig requestConfig=RequestConfig.custom().setSocketTimeout(500).setConnectTimeout(500).build();
		try {
			// 创建HttpPost.
			HttpPost httppost = new HttpPost(requestUrl);
			httppost.setHeader("Accept-Encoding", "gzip, deflate");
			httppost.setHeader("Accept-Language", "zh-CN");
			httppost.setHeader("Accept",
					"application/json, application/xml, text/html, text/*, image/*, */*");
			httppost.setHeader("Content-Type",
					"application/json; charset=UTF-8");// 发送的格式，内容
			
			httppost.setConfig(requestConfig);
			
			HttpEntity sendEntity;
			sendEntity = new StringEntity(strQueryJson, "UTF-8");
			httppost.setEntity(sendEntity);
			log.info("executing request " + httppost.getURI());
			log.info("param:" + strQueryJson);
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				// 获取响应实体
				HttpEntity entity = response.getEntity();
				log.info("--------------------------------------");
				// 打印响应状态
				log.info(response.getStatusLine());
				if (entity != null) {
					// 打印响应内容长度
					log.info("Response content length: "
							+ entity.getContentLength());
					// 打印响应内容
					resp = EntityUtils.toString(entity);
					log.info("Response content: " + resp);
				}
				log.info("------------------------------------");
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			log.error(e.getMessage(), e);
		} catch (ParseException e) {
			log.error(e.getMessage(), e);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}
		return resp;
	}

	public static String get(String interfaceName, String strQueryJson) {
		String targetProjectUrl = propertyconfigUtil
				.getValue("targetProjectUrl");
		return get(targetProjectUrl, interfaceName, strQueryJson);
	}

	public static String get(String requestUrl) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String resp = "";
		try {
			// 创建httpget.
			HttpGet httpget = new HttpGet(requestUrl);
			httpget.setHeader("Accept-Language", "zh-CN");
			httpget.setHeader("Content-Type", "application/json; charset=UTF-8");
			// httpget.setURI(new URI(httpget.getURI().toString() + "?" +
			// strQueryJson));

			log.info("executing request " + httpget.getURI());
			// 执行get请求.
			CloseableHttpResponse response = httpclient.execute(httpget);
			try {
				// 获取响应实体
				HttpEntity entity = response.getEntity();
				log.info("--------------------------------------");
				// 打印响应状态
				log.info(response.getStatusLine());
				if (entity != null) {
					// 打印响应内容长度
					log.info("Response content length: "
							+ entity.getContentLength());
					// 打印响应内容
					resp = EntityUtils.toString(entity);
					log.info("Response content: " + resp);
				}
				log.info("------------------------------------");
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			log.info("get catch_ClientProtocolException");
		} catch (ParseException e) {
			e.printStackTrace();
			log.info("get catch_ParseException");
		} catch (IOException e) {
			e.printStackTrace();
			log.info("get catch_IOException");
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return resp;
	}

	public static String get(String targetProjectUrl, String interfaceName,
			String strQueryJson) {
		String requestUrl = targetProjectUrl + interfaceName;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String resp = "";
		try {
			// 创建httpget.
			HttpGet httpget = new HttpGet(requestUrl);
			StringEntity strEntity = new StringEntity(strQueryJson,
					ContentType.APPLICATION_JSON);
			String str = java.net.URLEncoder.encode(
					EntityUtils.toString(strEntity), "UTF-8");
			httpget.setURI(new URI(httpget.getURI().toString() + "?"
					+ str.toString()));
			// httpget.setURI(new URI(httpget.getURI().toString() + "?" +
			// strQueryJson));

			log.info("executing request " + httpget.getURI());
			log.info("param:" + strQueryJson);
			// 执行get请求.
			CloseableHttpResponse response = httpclient.execute(httpget);
			try {
				// 获取响应实体
				HttpEntity entity = response.getEntity();
				log.info("--------------------------------------");
				// 打印响应状态
				log.info(response.getStatusLine());
				if (entity != null) {
					// 打印响应内容长度
					log.info("Response content length: "
							+ entity.getContentLength());
					// 打印响应内容
					resp = EntityUtils.toString(entity);
					log.info("Response content: " + resp);
				}
				log.info("------------------------------------");
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			log.info("get catch_ClientProtocolException");
		} catch (ParseException e) {
			e.printStackTrace();
			log.info("get catch_ParseException");
		} catch (IOException e) {
			e.printStackTrace();
			log.info("get catch_IOException");
		} catch (URISyntaxException e) {
			e.printStackTrace();
			log.info("get catch_URISyntaxException");
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return resp;
	}

	public static String put(String interfaceName, String strQueryJson) {
		String targetProjectUrl = propertyconfigUtil
				.getValue("targetProjectUrl");
		return put(targetProjectUrl, interfaceName, strQueryJson);
	}

	public static String put(String targetProjectUrl, String interfaceName,
			String strQueryJson) {

		CloseableHttpClient httpclient = HttpClients.createDefault();
		String requestUrl = targetProjectUrl + interfaceName;
		String resp = "";
		try {
			// 创建HttpPut.
			HttpPut httpput = new HttpPut(requestUrl);
			httpput.setHeader("Accept-Encoding", "gzip, deflate");
			httpput.setHeader("Accept-Language", "zh-CN");
			httpput.setHeader("Accept",
					"application/json, application/xml, text/html, text/*, image/*, */*");
			HttpEntity sendEntity;
			sendEntity = new StringEntity(strQueryJson, "UTF-8");
			httpput.setEntity(sendEntity);
			log.info("executing request " + httpput.getURI());
			log.info("param:" + strQueryJson);

			CloseableHttpResponse response = httpclient.execute(httpput);
			try {
				// 获取响应实体
				HttpEntity entity = response.getEntity();
				log.info("--------------------------------------");
				// 打印响应状态
				log.info(response.getStatusLine());
				if (entity != null) {
					// 打印响应内容长度
					log.info("Response content length: "
							+ entity.getContentLength());
					// 打印响应内容
					resp = EntityUtils.toString(entity);
					log.info("Response content: " + resp);
				}
				log.info("------------------------------------");
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			log.info("put catch_ClientProtocolException");
		} catch (ParseException e) {
			e.printStackTrace();
			log.info("put catch_ParseException");
		} catch (IOException e) {
			e.printStackTrace();
			log.info("put catch_IOException");
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return resp;
	}

	public static String postTOCas(String interFaceName, Map<String, String> map) {
		CloseableHttpClient httpclient = HttpClients.createDefault();

		String caseCluesuri = propertyconfigUtil.getValue("casProjectUrl");

		String resp = "";
		String requestUri = caseCluesuri + interFaceName;
		HttpPost httppost = new HttpPost(requestUri);
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		if (map != null) {
			for (Map.Entry<String, String> entry : map.entrySet()) {
				formparams.add(new BasicNameValuePair(entry.getKey(), entry
						.getValue()));
			}
		}
		UrlEncodedFormEntity uefEntity;
		try {
			uefEntity = new UrlEncodedFormEntity(formparams, "UTF-8");
			httppost.setEntity(uefEntity);

			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity entity = response.getEntity();
				if (entity != null) {
					resp = EntityUtils.toString(entity, "UTF-8");
				}
			} finally {
				response.close();
			}
		} catch (ClientProtocolException e) {
			log.error(e.getMessage(), e);
		} catch (UnsupportedEncodingException e) {
			log.error(e.getMessage(), e);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}
		return resp;
	}

	public static String SendToShiWu(String targetProjectUrl,
			String interfaceName, String json) {
		String httpUrl = targetProjectUrl + interfaceName;
		CloseableHttpClient httpclient = HttpClients.createDefault();

		String strRes = null;
		try {
			Map<String, ContentBody> bodyMap = null;
			bodyMap = new HashMap<String, ContentBody>();
			bodyMap.put("json", new StringBody(json,
					ContentType.APPLICATION_JSON));

			String requestUri = httpUrl;
			HttpPost httppost = new HttpPost(requestUri);
			RequestConfig requestConfig = RequestConfig.custom()
					.setSocketTimeout(30000).setConnectTimeout(30000).build();// 设置请求和传输超时时间
			httppost.setConfig(requestConfig);
			MultipartEntityBuilder entityBuilder = MultipartEntityBuilder
					.create();
			for (Map.Entry<String, ContentBody> entry : bodyMap.entrySet()) {
				String name = entry.getKey();
				ContentBody body = entry.getValue();
				entityBuilder.addPart(name, body);
			}
			HttpEntity reqEntity = entityBuilder.build();
			httppost.setEntity(reqEntity);
			CloseableHttpResponse response = httpclient.execute(httppost);

			try {
				int statusCode = response.getStatusLine().getStatusCode();
				if (statusCode != 200) {
					throw new IOException();
				}
				HttpEntity resEntity = response.getEntity();
				if (resEntity != null) {
					// 打印响应内容
					strRes = EntityUtils.toString(resEntity);
				}
				EntityUtils.consume(resEntity);
			} finally {
				response.close();
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return null;
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error(e.getMessage(), e);
				return null;
			}
		}
		return strRes;
	}

	public static String sendPost(String targetProjectUrl,
			String interfaceName, String param) {
		String url = targetProjectUrl + interfaceName;
		return sendPost(url, param);
	}

	public static String sendPost(String url, String param) {
		PrintWriter out = null;
		BufferedReader in = null;
		String result = "";
		try {
			URL realUrl = new URL(url);
			// 打开和URL之间的连接
			URLConnection conn = realUrl.openConnection();
			// 设置通用的请求属性
			conn.setRequestProperty("accept", "*/*");
			conn.setRequestProperty("connection", "Keep-Alive");
			conn.setRequestProperty("user-agent",
					"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 获取URLConnection对象对应的输出流
			out = new PrintWriter(conn.getOutputStream());
			// 发送请求参数
			out.print(param);
			// flush输出流的缓冲
			out.flush();
			// 定义BufferedReader输入流来读取URL的响应
			in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += "/n" + line;
			}
		} catch (Exception e) {
			System.out.println("发送POST请求出现异常！" + e);
			e.printStackTrace();
		}
		// 使用finally块来关闭输出流、输入流
		finally {
			try {
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return result;
	}

	public static String sendGet(String targetProjectUrl, String interfaceName,
			String param) {
		String url = targetProjectUrl + interfaceName;
		return sendGet(url, param);
	}

	public static String sendGet(String url, String param) {
		String result = "";
		BufferedReader in = null;
		try {
			String urlName = url + "?" + param;
			URL realUrl = new URL(urlName);
			// 打开和URL之间的连接
			URLConnection conn = realUrl.openConnection();
			// 设置通用的请求属性
			conn.setRequestProperty("accept", "*/*");
			conn.setRequestProperty("connection", "Keep-Alive");
			conn.setRequestProperty("user-agent",
					"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
			// 建立实际的连接
			conn.connect();
			// 获取所有响应头字段
			Map<String, List<String>> map = conn.getHeaderFields();
			// 遍历所有的响应头字段
			for (String key : map.keySet()) {
				System.out.println(key + "--->" + map.get(key));
			}
			// 定义BufferedReader输入流来读取URL的响应
			in = new BufferedReader(
					new InputStreamReader(conn.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += "/n" + line;
			}
		} catch (Exception e) {
			System.out.println("发送GET请求出现异常！" + e);
			e.printStackTrace();
		}
		// 使用finally块来关闭输入流
		finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return result;
	}

}
