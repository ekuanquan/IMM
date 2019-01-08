package com.znyw.pojo;

public class Eventclass {
	int evtWat ;
	String evtWatName;
	String impotWat;
	public int getEvtWat() {
		return evtWat;
	}
	public void setEvtWat(int evtWat) {
		this.evtWat = evtWat;
	}
	public String getEvtWatName() {
		return evtWatName;
	}
	public void setEvtWatName(String evtWatName) {
		this.evtWatName = evtWatName;
	}
	public String getImpotWat() {
		return impotWat;
	}
	public void setImpotWat(String impotWat) {
		this.impotWat = impotWat;
	}
	@Override
	public String toString() {
		return "Eventclass [evtWat=" + evtWat + ", evtWatName=" + evtWatName
				+ ", impotWat=" + impotWat + "]";
	}
	public Eventclass() {	
	}
}
