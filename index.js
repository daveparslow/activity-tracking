

var ref = require('ref');
var refStruct = require('ref-struct');
var refArray = require('ref-array');
//var ffi = require('ffi-atom-shell');
var ffi = require('ffi');


var intPtr = null;
var boolPtr = null;
var LASTINPUTINFO = null;
var OSVERSIONINFO = null;
var pOSVERSIONINFO = null;
var pLASTINPUTINFO = null;
var shell32 = null;
var user32 = null;
var dwmApi = null;
var kernel32 = null;


//node-system-idle-time

var setupWindowsLibs = function() {

  intPtr = intPtr || ref.refType(ref.types.int32);
  boolPtr = boolPtr || ref.refType(ref.types.bool);

  LASTINPUTINFO = LASTINPUTINFO || refStruct({
    cbSize: ref.types.int32,
    dwTime: ref.types.uint32,
  });

  pLASTINPUTINFO = pLASTINPUTINFO || ref.refType(LASTINPUTINFO);

  user32 = user32 || ffi.Library('user32', {
    'GetLastInputInfo': [ 'int', [ pLASTINPUTINFO ] ],
    'GetForegroundWindow': ['int', []],
    'GetWindowThreadProcessId': ['int', [ref.types.int32, intPtr]],
  });

  kernel32 = kernel32 || ffi.Library('kernel32', {
     'GetTickCount': [ref.types.uint32, []],
   });

};

exports = {
  'win32': {
    getIdleTimeInMs: function () {
      setupWindowsLibs();

      var result = new LASTINPUTINFO();
      result.cbSize = LASTINPUTINFO.size;

      var failed = (user32.GetLastInputInfo(result.ref()) === 0);

      if (failed) {
        throw new Error("Couldn't get idle time");
      }
      var ret = kernel32.GetTickCount() - result.dwTime;
      return ret;
    },

    getForegroundWindow: function () {
      return user32.GetForegroundWindow();
    },

    getWindowThreadProcessId: function (hwnd) {
      console.log(intPtr.prototype)
      var outNumber = ref.alloc(ref.types.int32);
      var result = user32.GetWindowThreadProcessId(hwnd, outNumber);
      return {
        result: result,
        processId: outNumber.deref()
      };
    },
  },

  'darwin': {

    getIdleTimeInMs: function () {
      // TODO: Replace with a call to CGEventSourceCounterForEventType
      return 100000000;
    },

  },

  'linux': {
    getIdleTimeInMs: function () {
      return 100000000;
    },
  }
};

module.exports = exports[process.platform];
