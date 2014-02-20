//===========================================================================================
//
// THE TESTS.
//
describe("'Register' as first message in the connection test ...", function(){

	describe("OWD-29732 - Register_fake()", function(){
		resetSettings();
		doRegister_fake({channels:'1234'});
		checkMessage(true, ['[sendWS]', '"channelID":"1234"', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]', '"messageType":"register"', '"status":459', '"reason":"No UAID found for this connection!"']);
	});

});

describe("'Register' tests ...", function(){

	describe("OWD-29725 and OWD-29724 - Register()", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		checkMessage(true, ['[sendWS]', '"channelID":"1234"', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"status":200', '"channelID":"1234"', '"messageType":"register"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"status":200', '"channelID":"1234"', '"messageType":"register"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("OWD-29727 -Register() null", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels: null});	
		checkMessage(true, ['[sendWS]', '"channelID":null', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		//doUnRegister(true, {channels:'1234'});
	});
	
	describe("OWD-29726 - Register() invalid", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels: ''});
		checkMessage(true, ['[sendWS]', '"channelID":""', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"',]);
		checkMessage(true, ['[onRegisterWAMessage]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
	});

	describe("OWD-29723 - Register() objectId", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:1234});
		checkMessage(true, ['[sendWS]', '"channelID":1234', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
	});
	
	describe("OWD-29724 - Register() several channels", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		doRegister({channels:'4321'});
		checkMessage(true, ['[sendWS]', '"channelID":"4321"', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"status":200', '"channelID":"4321"', '"messageType":"register"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"status":200', '"channelID":"4321"', '"messageType":"register"']);
		doUnRegister(true, {channels:'1234'});
	});
});


describe("'Un-register' tests ...", function(){

	describe("OWD-29720 and OWD-29719 - Unregister()", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, {channels:'1234'});
		checkMessage(true, ['[sendWS]', '"channelID":"1234"', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"channelID":"1234"', '"status":202', '"messageType":"unregister"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("OWD-29722 - Unregister() null", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, { channels: null });
		checkMessage(true, ['[sendWS]', '"channelID":null', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":457', '"reason":"Not valid channelID sent"', '"messageType":"unregister"']);
	});
	
	describe("OWD-29721 - Unregister() invalid", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, { channels: '' });
		checkMessage(true, ['[sendWS]', 'Preparing to send', '"channelID":""', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":457', '"reason":"Not valid channelID sent"', '"messageType":"unregister"']);
	});
	
	describe("OWD-29717 - Unregister() objectId", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, { channels: 1234 });
		checkMessage(true, ['[sendWS]', 'Preparing to send', '"channelID":1234', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":457', '"reason":"Not valid channelID sent"', '"messageType":"unregister"']);
	});

});


describe("'Hello' tests ...", function(){

	describe("OWD-29707 - Hello() with wakeup", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello(); // First one is always a 'hello'.
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"214"','"mnc":"007"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-29708 - Hello()", function(){
		resetSettings();
		doHello(); // First one is always a 'hello'.
		checkMessage(true, ['[sendWS]', '"uaid":_UAID', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29736 - Hello() null uaid", function(){
		resetSettings();
		doHello({uaid:null});
		checkMessage(true, ['[sendWS]', '"uaid":null', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29735 - Hello() invalid uaid", function(){
		resetSettings();
		doHello({uaid:''});
		checkMessage(true, ['[sendWS]', '"uaid":""', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29703 - Hello() no channel ID", function(){
		resetSettings();
		doHello({channels:null});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":null', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-29700 - Hello() empty channel ID array", function(){
		resetSettings();
		doHello({channels:[]});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29702 - Hello() one channel ID", function(){
		resetSettings();
		doHello({channels:['1234']});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":["1234"]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29701 - Hello() several channel IDs", function(){
		resetSettings();
		doHello({channels:['1234','4321']});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":["1234","4321"]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-29699 - Hello() objectId as channel ID", function(){
		resetSettings();
		doHello({channels: 1234});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":1234', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29716 - Hello() invalid IP, valid PORT", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({ip:'256.256.256.256'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"ip":"256.256.256.256"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29715 - Hello() valid IP, invalid PORT", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({port:80000});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"port":80000']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29713 - Hello() valid IP, valid PORT", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29714 - Hello() invalid IP, invalid PORT", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({ip:'256.256.256.256',port:80000});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"ip":"256.256.256.256"','"port":80000']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29711 - Hello() invalid mcc, valid mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({mcc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"hola"','"mnc":"007"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29712 - Hello()  valid mcc, invalid mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({mnc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"214"','"mnc":"hola"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29709 - Hello()  valid mcc, valid mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"214"','"mnc":"007"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
	describe("OWD-29710 - Hello()  invalid mcc, invalid mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello({mcc:'hola',mnc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mobilenetwork"','"mcc":"hola"','"mnc":"hola"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25994 - Hello()  change IP", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({ip:'10.95.30.174'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"ip":"10.95.30.174"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25993 - Hello()  change port", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({port:8081});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"port":8081']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25992 - Hello()  change IP and port", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({ip:'10.95.30.174',port:8081});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"ip":"10.95.30.174"','"port":8081']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25997 - Hello()  change mcc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({mcc:'215'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"215"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25996 - Hello()  change mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({mnc:'01'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mnc":"01"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});

	describe("OWD-25995 - Hello()  change mcc and mnc", function(){
		resetSettings();
		setTrue("wakeup_enabled");
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		waits(61000);
		doHello({mcc:'234',mnc:'02'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"','"wakeup_hostport"','"mcc":"234"','"mnc":"02"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
	});
	
});


describe("Keepalive tests (these pause for > 1 minute) ...", function(){

	describe("OWD-29704 - Set {} to true", function(){
		resetSettings();
		setTrue("ping");
		doHello();
		waits(61000);
		checkMessage(true, ['[Websocket Keepalive]', 'Sending keepalive message', '{}']);
		checkMessage(true, ['[onMessageWebsocket]', 'Message received', '{}']);
		doUnRegister(true);
	});
	
	describe("OWD-29706 - Set {'hello'} to true", function(){
		resetSettings();
		setTrue("pong");
		doHello();
		waits(61000);
		checkMessage(true, ['[Websocket Keepalive]', 'Sending keepalive message', '{"hello"}']);
		checkMessage(true, ['[onMessageWebsocket]','"status":450','"reason":"Data received is not a valid JSON package"']);
	});

	describe("OWD-29705 - Set {'verylongmessage'} to true", function(){
		resetSettings();
		setTrue("other");
		doHello();
		waits(61000);
		checkMessage(true, ['[Websocket Keepalive]', 'Sending keepalive message']);
		checkMessage(true, ['[onMessageWebsocket]','"status":450','"reason":"Data received is not a valid JSON package"']);
	});
});


describe("'ACK' tests (these pause for > 1 minute) ...", function(){

	describe("OWD-29783 - Set 'ack' to true", function(){
		resetSettings();
		setTrue("ack");
		doHello();
                doUpdateVersion({channels: '1234'},"1");
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"channelID":"1234","version":"1"}]']);
		doUnRegister(true);
	});
	
	describe("OWD-29788 - Set 'ack_null_updates' to true", function(){
		resetSettings();
		setTrue("ack_null_updates");
		doHello();
                doUpdateVersion({channels: '1234'},"1");
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"ack"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true);
	});
	
	describe("OWD-29787 - Set 'ack_invalid_channelID' to true", function(){
		resetSettings();
		setTrue("ack_invalid_channelID");
		doHello();
                doUpdateVersion({channels: '1234'},"1");
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"ack"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true);
	});
	
	describe("OWD-29786 - Set 'ack_null_channelID' to true", function(){
		resetSettings();
		setTrue("ack_null_channelID");
		doHello();
		doUpdateVersion({channels: '1234'},"1");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"ack"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true);
	});
	
	describe("OWD-29785 - Set 'ack_null_version' to true", function(){
		resetSettings();
		setTrue("ack_null_version");
		doHello();
		doUpdateVersion({channels: '1234'},"1");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"ack"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true);
	});
	
	describe("OWD-29784 - Set 'ack_invalid_version' to true", function(){
		resetSettings();
		setTrue("ack_invalid_version");
		doHello();
		doUpdateVersion({channels: '1234'},"1");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"ack"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true);
	});

	describe("OWD-29774 - Set 'no_ack' to true", function(){
		resetSettings();
		setTrue("no_ack");
		doHello();
		doUpdateVersion({channels: '1234'},"1");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"channelID":"1234","version":"1"}]']);
		doUnRegister(true);
	});
});

describe("PUT tests (these pause for > 1 minute) ...", function(){
	describe("OWD-29778 - Notification with correct version", function(){
		resetSettings();
		doHello();
		doUpdateVersion({channels: '1234'},"1");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"channelID":"1234","version":"1"}]']);
		doUnRegister(true);
	});

	describe("OWD-29780 - Notification with no version", function(){
		resetSettings();
		doHello();
		doUpdateVersion({channels: '1234'});		
		waits(1000);
		//checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"channelID":"1234","version":"1"}]']);
		doUnRegister(true);
	});

	describe("OWD-29779 - Notification with incorrect version", function(){
		resetSettings();
		doHello();
		doUpdateVersion({channels: '1234'},"hello");		
		waits(1000);
		//checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"channelID":"1234","version":"1"}]']);
		doUnRegister(true);
	});

	describe("OWD-29773 - Notification with highest accepted version", function(){
		resetSettings();
		doHello();
		doUpdateVersion({channels: '1234'},"9007199254740991");		
		waits(1000);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"notification"', '"updates"', '[{"version":"9007199254740991"},"channelID":"1234"]']);
		doUnRegister(true);
	});

});
	

