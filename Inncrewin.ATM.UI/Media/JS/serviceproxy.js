function ServiceProxy() {
    var Url = "";
    this.invoke = function (url, method, data, OnSuccessCallback,OnErrorCallback, datatype, isAsync, isFileUpload) {
        if (sessionStorage.getItem("RezCBTB2E") == null) {
            if (url != "Login/Login" && url != "Login/ChangePassword" && url != "Login/GetTenantCode") {
                window.location.href = "/Login.html";
                return false;
            }
        }
        if (isAsync == null || isAsync == "undefined")
            isAsync = true;
        //contentType: default ->"application/x-www-form-urlencoded; charset=UTF-8";   for file upload ->false
        //processData: default ->true;                                                 for file upload ->false
        if (isFileUpload == true) {
            $.ajaxSetup({
                contentType: false,
                processData: false
            });
        }
        else if (isFileUpload == false || isFileUpload == null || isFileUpload == "undefined") {
            $.ajaxSetup({
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: true
            });
        }

        if (sessionStorage != null && sessionStorage != undefined && sessionStorage.CultureMaskFormat != null && sessionStorage.CultureMaskFormat != undefined) {
            var newDateFormat = sessionStorage.CultureDateFormat;
            if (newDateFormat != null && newDateFormat != "" && newDateFormat != undefined) {
                newDateFormat = (newDateFormat.replace("yy", "YYYY")).toUpperCase();
                var dateValue = (moment("31/12/2017", "DD/MM/YYYY")).format(newDateFormat);
                var maskvalue = sessionStorage.CultureMaskFormat;
                var emptyDate = maskvalue.replace(/[0-9]/g, "_")
                var regexp = new RegExp("([^0-9])", "g");
                var separator = (regexp.exec(dateValue))[0];
                var dateStringArray = dateValue.split(separator);
                var datePattern = "[0-9]{" + dateStringArray[0].length + "}" + separator + "[0-9]{" + dateStringArray[1].length + "}" + separator + "[0-9]{" + dateStringArray[2].length + "}";
                var regExpDatePattern = new RegExp(datePattern, "g");
                if (datatype != null && datatype != "" && datatype != undefined && data != null && data != "" && datatype.toLowerCase() == "json" ) {
                    var jsonString = JSON.stringify(data);
                    if (jsonString != null && jsonString != "") {
                        var dateCount = jsonString.match(regExpDatePattern)
                        if (dateCount != null && dateCount.length > 0) {

                            for (var i = 0; i < dateCount.length; i++) {
                                if (dateCount[i] != emptyDate) {
                                    newDate = (moment(dateCount[i], newDateFormat)).format("MM/DD/YYYY");
                                    jsonString = jsonString.replace(dateCount[i], newDate)
                                }
                                else if (dateCount[i] === emptyDate) {
                                    jsonString = jsonString.replace(dateCount[i], "")
                                }

                            }
                            data = JSON.parse(jsonString);
                        }
                    }
                }
                if (url.match("=")) {
                    var dateCount = url.match(regExpDatePattern)
                    if (dateCount != null && dateCount.length > 0) {
                        for (var i = 0; i < dateCount.length; i++) {
                            newDate = (moment(dateCount[i], newDateFormat)).format("MM/DD/YYYY");
                            url = url.replace(dateCount[i], newDate)
                        }
                    }
                }
            }
        }

        $.ajax({
           // url: "http://localhost:64159/api/v1/" + url,
            url: "http://bdtrunk-expb2eapi.rezopiatest.net/api/v1/" + url,
            data: data,
            type: method,
            timeout: 600000,
            beforeSend: setHeader,
            success: OnSuccessCallback,
            async: isAsync,
            error: GlobalErrorHandling,
            dataType: datatype
        }).then(function (data, status, xhr) {
            if (xhr.getResponseHeader("AuthToken") != undefined && xhr.getResponseHeader("AuthToken") != null && url != "Login/Login") {
                sessionStorage.RezCBTB2E = xhr.getResponseHeader("AuthToken");
               // alert("sessionStorage.RezCBTB2E at " + url + "  == " + sessionStorage.RezCBTB2E);
            }
        });
    }
}

//Adding the Token to all service calls
function setHeader(xhr, settings) {
    Url = settings.url;
    if (typeof (Storage) !== "undefined" && sessionStorage.RezCBTB2E)
        xhr.setRequestHeader('Authorization', "bearer " + sessionStorage.RezCBTB2E);
    else
        return null;
}

// Handling the Error/Token Expires 
function GlobalErrorHandling(XMLHttpRequest)
{
    $.unblockUI();
    //alertmsg("Error occurs in this url : "+Url );
    if (XMLHttpRequest.status === 403) {
        if (XMLHttpRequest.statusText === "Access Token Expired.") {
            window.location.href = "/Login.html";
            return false;
        }
        else
            window.location.href = "/Error.html";
    }
    else
        window.location.href = "/Error.html";

    //Occurs only when cross domain issue
    if (XMLHttpRequest.status === 0) {
        window.location.href = "/Error.html";
    }
}

function ExpServiceProxy() {
    var Url = "";
    this.invoke = function (url, method, data, OnSuccessCallback, OnErrorCallback, datatype, isAsync, isFileUpload) {
        if (sessionStorage.getItem("RezCBTB2E") == null) {
            if (url != "Login/Login" && url != "Login/ChangePassword") {
                window.location.href = "/Login.html";
                return false;
            }
        }
        if (isAsync == null || isAsync == "undefined")
            isAsync = true;
        //contentType: default ->"application/x-www-form-urlencoded; charset=UTF-8";   for file upload ->false
        //processData: default ->true;                                                 for file upload ->false
        if (isFileUpload == true) {
            $.ajaxSetup({
                contentType: false,
                processData: false
            });
        }
        else if (isFileUpload == false || isFileUpload == null || isFileUpload == "undefined") {
            $.ajaxSetup({
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: true
            });
        }

        if (sessionStorage != null && sessionStorage != undefined && sessionStorage.CultureMaskFormat != null && sessionStorage.CultureMaskFormat != undefined) {
            var newDateFormat = sessionStorage.CultureDateFormat;
            if (newDateFormat != null && newDateFormat != "" && newDateFormat != undefined) {
                newDateFormat = (newDateFormat.replace("yy", "YYYY")).toUpperCase();
                var dateValue = (moment("31/12/2017", "DD/MM/YYYY")).format(newDateFormat);
                var maskvalue = sessionStorage.CultureMaskFormat;
                var emptyDate = maskvalue.replace(/[0-9]/g, "_")
                var regexp = new RegExp("([^0-9])", "g");
                var separator = (regexp.exec(dateValue))[0];
                var dateStringArray = dateValue.split(separator);
                var datePattern = "[0-9]{" + dateStringArray[0].length + "}" + separator + "[0-9]{" + dateStringArray[1].length + "}" + separator + "[0-9]{" + dateStringArray[2].length + "}";
                var regExpDatePattern = new RegExp(datePattern, "g");
                if (datatype != null && datatype != "" && datatype != undefined && data != null && data != "" && datatype.toLowerCase() == "json") {
                    var jsonString = JSON.stringify(data);
                    if (jsonString != null && jsonString != "") {
                        var dateCount = jsonString.match(regExpDatePattern)
                        if (dateCount != null && dateCount.length > 0) {

                            for (var i = 0; i < dateCount.length; i++) {
                                if (dateCount[i] != emptyDate) {
                                    newDate = (moment(dateCount[i], newDateFormat)).format("MM/DD/YYYY");
                                    jsonString = jsonString.replace(dateCount[i], newDate)
                                }
                                else if (dateCount[i] === emptyDate) {
                                    jsonString = jsonString.replace(dateCount[i], "")
                                }

                            }
                            data = JSON.parse(jsonString);
                        }
                    }
                }
                if (url.match("=")) {
                    var dateCount = url.match(regExpDatePattern)
                    if (dateCount != null && dateCount.length > 0) {
                        for (var i = 0; i < dateCount.length; i++) {
                            newDate = (moment(dateCount[i], newDateFormat)).format("MM/DD/YYYY");
                            url = url.replace(dateCount[i], newDate)
                        }
                    }
                }
            }
        }

        $.ajax({
            //url: "http://localhost:64199/api/v1/" + url,
            url: "http://bdtrunk-expexpenseb2eapi.rezopiatest.net/api/v1/" + url,
            data: data,
            type: method,
            timeout: 600000,
            beforeSend: setHeader,
            success: OnSuccessCallback,
            async: isAsync,
            error: GlobalErrorHandling,
            dataType: datatype
        }).then(function (data, status, xhr) {
            // alert(xhr.getAllResponseHeaders());
            //  alert("Refresh Token == " + xhr.getResponseHeader("AuthToken"));
            if (xhr.getResponseHeader("AuthToken") != undefined && xhr.getResponseHeader("AuthToken") != null && url != "Login/Login")
                sessionStorage.RezCBTB2E = xhr.getResponseHeader("AuthToken");
            //   alert("sessionStorage.RezCBTB2E == " + sessionStorage.RezCBTB2E);
        });
    }
}