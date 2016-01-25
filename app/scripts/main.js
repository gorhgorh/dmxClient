console.log('dmx web V0.0.3');
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
    // 
    setupMonsta16();
    // setup interface bt
    $('.btAnim').click(function(){
      musax();
    });
    $('.btStop').click(function(){
      stopTimers();
    });
    $('.btReset').click(function(){
      stopTimers();
      resetMonsta16();
    });

  },

  createChan:function  (chanId) {
    var chan = chanId;
    
    var val = 0;

    var slider = $(dmx.sliderTmpl({ 'chan': chan,'val':val }));
    appRoot.append(slider);
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
      valIn.val(val);
      console.log('val changed to :',val);
      dmx.sendDmx(chan,val);
    });
    valTxt.focus(function() {
      var curVal = $(this).val();
      console.log(( 'focused val', curVal));

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


var powerLight = {
  pan:1,
  tilt:3,
  variation:6,
  r:8,
  v:9,
  b:10,
  w:11
};
var bigMonsta19 = {
  pan:1,
  tilt:3,
  panTiltSpeed:5,
  dimmer:6,
  fineDimmer:7,
  shutter:8,
  color:9,
  gobo1:10,
  gobo1rotate:11,
  gobo2:12,
  focus:13
};
var bigMonsta16 = {
  pan:1,
  finePan:2,
  tilt:3,
  fineTilt:4,
  panTiltSpeed:5,
  dimmer:6,
  shutter:7,
  color:8,
  gobo1:9,
  gobo1rotate:10,
  gobo2:11,
  focus:12,
  prism:13,
  prismRotate:14,
  iris:15,
  control:16
};


function setupMonsta16(){
  _.each(bigMonsta16,function(v,k){
    dmx.createChan(v);
    var curSlider = $('#sl'+v).find('.funcLabel').html(k);
  });
  $('input[type='range']').rangeslider();
}

function resetMonsta16(){
  var i = 1;                     //  set your counter to 1
  var initConfMsg = [
            '1c125w', // pan (center)
            '3c125w', // tilt (center)
            '6c255w', // dimmer (max)
            '7c255w', // shutter (max (no blink))
            '8c52w', // shutter (max (no blink))

  ];
  console.log('initlength',initConfMsg.length);
  var arrL = initConfMsg.length;
  console.log('setup monsta 16 chan');        
  var  myLoop = function () {
    setTimeout(function () {    
      var arrIt = i-1;
      console.log('i',i, initConfMsg[arrIt]);
      socket.emit('dmx:out', { msg: initConfMsg[arrIt] });
      i++ ;                     
      if (i <= arrL) {           
        myLoop();             
      }                        
    }, 500);
  };

  myLoop();  

}

function stopTimers(){
  var highestTimeoutId = setTimeout(';');
  for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i); 
  }
}

function musax(){
  var tune = [
                
                '3c80w','3c100w',
                '3c80w','3c100w',
                '3c80w','3c100w',
                '3c80w','3c100w',
                '3c80w','3c100w',
                '3c80w','3c120w',
                '3c80w','3c100w',
                '3c80w','3c120w',
  ];
  var tune2 = [
                
                '1c80w','1c100w',
                '1c80w','1c100w',
                '1c80w','1c100w',
                '1c80w','1c100w',
                '1c80w','1c100w',
                '1c80w','1c120w',
                '1c80w','1c100w',
                '1c80w','1c120w',
  ];


  var i = 1;
  var  tuneLoop = function () {
    console.log('tune length',tune.length);
    setTimeout(function () {    
      var arrIt = i-1;
      console.log('i',i, tune[arrIt]);
      socket.emit('dmx:out', { msg: tune[arrIt] });
      socket.emit('dmx:out', { msg: tune2[arrIt] });
      i++ ;                     
      if (i <= tune.length) {           
        tuneLoop();             
      }else{
        i = 1;
        tuneLoop();             
      }                     
    }, 500);
  };
  tuneLoop(); 
}

dmx.init();
