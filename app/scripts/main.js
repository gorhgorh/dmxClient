console.log("dmx web V0.0.3");
var socket = io('http://localhost:8080');
var appRoot = $('#app');
socket.on('news', function (data) {
console.log(data);
socket.emit('yo', { my: 'data' });
});
socket.emit('yo', { my: 'data' });

var knob = $('#slider1');
console.log(knob.val());

knob.change(function() {
  console.log(knob.val());
});

var dmx = {
	// base dmx chan id
	chanId : 1,
	//sliderTmpl : _.template('<div class="sliderCont col-md-4" id="sl<%= chan %>"><div class="funcLabel"></div><div class="chanIdCont"><label>chan <input type="text" value=" <%= chan %> " name="chan" class="chanIn"></label><br /></div><div class="chanValCont"><input type="range" min="0" max="255" step="1" value="<%= val %> name="val" class="valIn"/><br><label>value <input type="text" value="1" class="valText"/></label><br /></div></div>'),
	sliderTmpl : _.template('<div class="sliderCont col-md-4" id="sl<%=chan %>"> <div><label class="funcLabel"></label></div><input type="range" min="0" max="255" step="1" value="<%=val %>" name="val" class="valIn"/> <div class="row"> <div class="chanIdCont col-md-6"><label>chan <input type="text" value=" <%=chan %> " name="chan" class="chanIn"></label><br/></div><div class="chanValCont col-md-6"> <label>value <input type="text" value="1" class="valText"/></label><br/></div></div></div>'),
	msgTmpl : _.template('<%= chan %>c<%= val %>w'),
	init:function(){
		$('.addChan').click(function(){
			var ch = $('.chanInVal').val();
		});
	},

	createChan:function  (chanId) {
		var chan = chanId;
		
		var val = 0;
		// console.log(sliderTmpl({ 'chan': chan,'val':val }));
		var slider = $(dmx.sliderTmpl({ 'chan': chan,'val':val }));
		appRoot.append(slider);
		var selector = '';
		var curSlider = $('#sl'+chan);
		var chanIn = curSlider.find('.chanIn');
		var valIn = curSlider.find('.valIn');
		var valTxt = curSlider.find('.valText');
		chanIn.change(function() {
			chan = chanIn.val();
			console.log('channel changed to :',chan);
		});
		valIn.change(function() {
			val = valIn.val();
			valTxt.val(val);
			console.log('val changed to :',val);
			dmx.sendDmx(chan,val);
		});
		valTxt.change(function() {
			val = valTxt.val();
			vatIn.val(val);
			console.log('val changed to :',val);
			dmx.sendDmx(chan,val);
		});

		++dmx.chanId;
		$('.chanInVal').val(dmx.chanId);
	},
	sendDmx:function(chan,val){
		var message = dmx.msgTmpl({ 'chan': chan,'val':val });
		socket.emit('dmx:out', { msg: message ,c:chan,v:val});
		console.log(message);
	}
};
dmx.init();

var powerLight = {
	pan:1,
	tilt:3,
	variation:6,
	r:8,
	v:9,
	b:10,
	w:11
};

_.each(powerLight,function(v,k){
	dmx.createChan(v);
	var curSlider = $('#sl'+v).find('.funcLabel').html(k);
});

