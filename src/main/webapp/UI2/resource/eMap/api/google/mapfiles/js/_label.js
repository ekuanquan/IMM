/*
文件说明：第三方文件
*/
function Label(opt_options) {
	this.setValues(opt_options);
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position: relative; left:-45px; top: -24px; ' + 'white-space: nowrap;solid #ADAEAC;  border: 1px solid #808080;font-family:arial;' + 'padding:2px 3px 2px 3px; background-color: #F4F4F4;';
	var div = this.div_ = document.createElement('div');
	div.id = "google_label";
	div.appendChild(span);
	div.style.cssText = 'position: absolute; display: none';
}
Label.prototype = new google.maps.OverlayView;
Label.prototype.onAdd = function () {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);
	var me = this;
	this.listeners_ = [google.maps.event.addListener(this, 'position_changed', function () {
			me.draw();
		}), google.maps.event.addListener(this, 'text_changed', function () {
			me.draw();
		})];
};
Label.prototype.onRemove = function () {
	this.div_.parentNode.removeChild(this.div_);
	var i = 0;
	for (i = 0, i = this.listeners_.length; i < i; ++i) {
		google.maps.event.removeListener(this.listeners_[i]);
	}
};
Label.prototype.draw = function () {
	var projection = this.getProjection(),
	position = projection.fromLatLngToDivPixel(this.get('position')),
	div = this.div_;
	div.style.left = position.x + 'px';
	div.style.top = position.y + 'px';
	div.style.display = 'block';
	this.span_.innerHTML = this.get('text').toString();
};