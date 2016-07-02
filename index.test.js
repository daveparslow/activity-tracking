var activity = require("./index");

setInterval(function () {
  console.log(activity.getIdleTimeInMs());
  var hwnd = activity.getForegroundWindow()
  console.log("hwnd %s", activity.getForegroundWindow());
  console.log("pid %s", activity.getWindowThreadProcessId(hwnd).processId);
}, 5000);
