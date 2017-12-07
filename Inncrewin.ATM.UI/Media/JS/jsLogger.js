var jsLog = function (type, message, hasBrowserLog) {
    if (hasBrowserLog)
        console.log(message);

    //data to send.
    var data = {
        l: 0,
        m: message,
        n: type,
        t: (new Date()).toISOString()
    }

    var OnSucess = function (a, b, c, d) {
     
    };
    var OnError = function (a, b, c, d) {
       
    };

    new ServiceProxy().
        invoke(
            "jsLogging/Post",
            "POST",
            data,
            OnSucess,
            OnError,
            "application/json",
            true);


}

$.fn.Logger = {
    type: {
        trace: { Ordinal: 1000, Name: "Trace" },
        debug: { Ordinal: 2000, Name: "Debug" },
        info: { Ordinal: 3000, Name: "Info" },
        warn: { Ordinal: 4000, Name: "Warn" },
        error: { Ordinal: 5000, Name: "Error" }
    },

    debug: function (message, hasBrowserLog) {
        jsLog($().Logger.type.debug,
            message,
            hasBrowserLog);
    },

    info: function (message, hasBrowserLog) {
        jsLog($().Logger.type.info,
            message,
            hasBrowserLog);
    },

    warn: function (message, hasBrowserLog) {
        jsLog($().Logger.type.warn,
            message,
            hasBrowserLog);
    },

    error: function (message, hasBrowserLog) {
        jsLog($().Logger.type.error,
            message,
            hasBrowserLog);
    }
};