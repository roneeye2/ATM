$.postifyData = function (value) {
    var result = {};

    var buildResult = function (object, prefix) {
        var regExpDatePattern = "";
        var newDateFormat = "";
        var emptyDate = ""
        if (sessionStorage != null && sessionStorage != undefined && sessionStorage.CultureMaskFormat != null && sessionStorage.CultureMaskFormat != undefined) {
            var newDateFormat = sessionStorage.CultureDateFormat;
            if (newDateFormat != null && newDateFormat != "") {
                newDateFormat = (newDateFormat.replace("yy", "YYYY")).toUpperCase();
                var dateValue = (moment("31/12/2017", "DD/MM/YYYY")).format(newDateFormat);
                var maskvalue = sessionStorage.CultureMaskFormat;
                emptyDate = maskvalue.replace(/[0-9]/g, "_")
                var regexp = new RegExp("([^0-9])", "g");
                var separator = (regexp.exec(dateValue))[0];
                var dateStringArray = dateValue.split(separator);
                if (value != null) {
                    var datePattern = "[0-9]{" + dateStringArray[0].length + "}" + separator + "[0-9]{" + dateStringArray[1].length + "}" + separator + "[0-9]{" + dateStringArray[2].length + "}";
                    regExpDatePattern = new RegExp(datePattern, "g");
                }
            }
        }
        for (var key in object) {

            var postKey = isFinite(key)
    ? (prefix != "" ? prefix : "") + "[" + key + "]"
    : (prefix != "" ? prefix + "." : "") + key;

            switch (typeof (object[key])) {
                case "number": case "string": case "boolean":
                    if (object[key] != null && object[key] != undefined && typeof (object[key]) != "number" && typeof (object[key]) != "boolean") {
                        var datePart = (object[key]).match(regExpDatePattern)
                        if (datePart != null && datePart.length > 0 && newDateFormat != "") {
                            if (object[key] != emptyDate) {
                                result[postKey] = (moment(object[key], newDateFormat)).format("MM/DD/YYYY");
                            }
                            else {
                                result[postKey] = "";
                            }
                        }
                        else {
                            result[postKey] = object[key];
                        }
                    }
                    else {
                        result[postKey] = object[key];
                    }
                    break;

                case "object":
                    if (object[key] != null) {
                        if (object[key].toUTCString) result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                        else buildResult(object[key], postKey != "" ? postKey : key);
                    }
            }
        }
    };

    buildResult(value, "");
    return result;
}
