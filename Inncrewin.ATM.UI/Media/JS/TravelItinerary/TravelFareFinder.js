var FFSliderLenthCnt = 3;
$(function () {

    try {
        $('#footer').load('footer.html');
        var Requestno;
        var requestType;
        var obj = getUrlVars();
        $("#header_FareFinder").load('header.html', function () {
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetUserInfo",
                "POST",
            null,
            function (response) {

                if (response != null && response.ISEXPENSE) {
                    $('#ExpenseReports_header').hide();
                }

                if ($('#ExpenseReports_header').length > 0) {
                    FFSliderLenthCnt = 2;
                }
                GetLoggedInUserName(response)
                if (sessionStorage.SavedTR != undefined) {
                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                    if (SavedTR != '') {
                        $.each(SavedTR, function (key, value) {
                            var ul = document.getElementById("myTab");
                            var li = document.createElement("li");
                            var a = document.createElement("a");
                            var ReqNo = key.split("//")[0];
                            Requestno = key.split("//")[0];
                            var RequestType = key.split("//")[1];
                            requestType = key.split("//")[1];
                            li.setAttribute("id", "element_" + ReqNo + "_" + RequestType);
                            li.setAttribute("onclick", "getActiveTabDetail(event,this);");
                            ul.appendChild(li);
                            document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>TR' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            if ($("#myTab").children().length > FFSliderLenthCnt) {
                                $(".slider").attr("id", "slider1");
                                if ($('#ExpenseReports_header').length > 0) {
                                    $('#slider1 .viewport').addClass('expense');
                                }
                                $('#slider1').tinycarousel();
                                var slider1 = $("#slider1").data("plugin_tinycarousel");
                                slider1.update();
                            }
                        });

                        if (!$("#myTab li").hasClass("active")) {
                            $('#myNavbar li.active').each(function () {
                                $(this).removeClass("active");
                            });

                            if (Requestno > 0)
                                LoadRequestDetails(Requestno, requestType);
                            $('#TravelRequestFareFinder').attr('class', 'active in');
                            $('#FFTravelRequestNo').html(obj.RequestNo);

                        }
                    }
                }
                if (sessionStorage.SavedER != undefined) {
                    SavedER = $.parseJSON(sessionStorage.SavedER);
                    if (SavedER != '') {
                        $.each(SavedER, function (key, value) {
                            var ul = document.getElementById("myTab");
                            var li = document.createElement("li");
                            var a = document.createElement("a");
                            var ReqNo = key.split("//")[0];
                            var RequestType = key.split("//")[1];
                            li.setAttribute("id", "elementExp_" + ReqNo + "_" + RequestType);
                            li.setAttribute("onclick", "getActiveExpTabDetail(this);");
                            ul.appendChild(li);
                            if (ReqNo.indexOf("NewExp") == -1)
                                document.getElementById('elementExp_' + ReqNo + '_' + RequestType).innerHTML = '<a>Exp' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            else
                                document.getElementById('elementExp_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closeExpTab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';

                            if ($("#myTab").children().length > FFSliderLenthCnt) {
                                $(".slider").attr("id", "slider1");
                                if ($('#ExpenseReports_header').length > 0) {
                                    if (!$('#slider1').hasClass('expense')) {
                                        $('#slider1 .viewport').addClass('expense');
                                    }
                                }
                                $('#slider1').tinycarousel();
                                var slider1 = $("#slider1").data("plugin_tinycarousel");
                                slider1.update();
                            }

                        });
                    }

                }
                $('#myNavbar li.active').each(function () {
                    $(this).removeClass("active");
                });
                $("a[href='/TravelFareFinder.html']").parent().attr('class', 'active');
            });

            if (obj.RequestNo == undefined) {
                $('#TravelRequestFareFinder').attr('class', 'active in');
                $('#TravelRequestDetails').attr('class', 'hide');
            }
            else {
                $('#IsFareFinderAssociated').val(true);
                FindReSubmitItinerary(obj.RequestNo);
            }
            $("#header_FareFinder").click(function (event) {
                if ($('#IsFareFinderAssociated').val() == "true") {
                    var target = event.target.innerText.trim();
                    if (target.toLowerCase() == "requests" || target.toLowerCase() == "travel" || target.toLowerCase() == "dashboard") {
                        event.preventDefault();
                        $('#dialog-ff').html('Travel Request data will be lost. Do you wish to continue?');
                        $('#dialog-ff').removeClass('hidden');
                        $("#dialog-ff").dialog({
                            modal: true,
                            open: function (event, ui) {
                                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                            },
                            buttons: {
                                "Yes": function () {
                                    $(this).dialog("close");
                                    $('#dialog-ff').addClass('hidden');
                                    $('#IsFareFinderAssociated').val(false);
                                    if (target.toLowerCase() == "requests")
                                        window.location.href = "/TravelRequest.html";
                                    else if (target.toLowerCase() == "travel")
                                        window.location.href = "/TravelFareFinder.html";
                                    else if (target.toLowerCase() == "dashboard")
                                        window.location.href = "/Dashboard.html";
                                    else
                                        window.location.href = "/Dashboard.html";
                                },
                                "No": function () {
                                    $(this).dialog("close");
                                    $('#dialog-ff').addClass('hidden');
                                    $("#fixedDashboardItem").find('li a').removeAttr('href');
                                }
                            }
                        });
                        return false;
                    }
                }
            });

            for (var i = 1; i < 10 ; i++) {
                setTimeout(function () {
                    if ($("#txtFlightFrom").length == 1) {
                        $("#ui-datepicker-div").css("display", "none");
                        $("#txtFlightFrom").focus();
                        $("#txtFlightFrom").click();
                    }
                }, i * 50);
                if (i == -1) {
                    break;
                }
            }
        });
    } catch (error) {
        $().Logger.error("TravelfareFinder.js function()-->" + error)
    }
});


function LoadRequestDetails(RequestNo, RequestType) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetTravelRequestById/" + RequestNo + "/" + RequestType,
            "Get",
        null,
        function (response) {
            $('#FFTravelRequestReason').html(response.TravelRequestReason);
            $('#FFTravelRequestedDate').html(response.TravelRequestStartDate);
            $('#FFTravelRequestedEndDate').html(response.TravelRequestEndDate);
            $('#FFTravelDestinationCity').html(response.TravelRequestCityValue);
            $('#FFFlightBudget').html(response.FlightPrice + '&nbsp;' + 'IDR');
            $('#FFHotelBudget').html(response.HotelPrice + '&nbsp;' + 'IDR');
            $.unblockUI();

        }, function (XMLHttpRequest, textStatus, errorThrown) { },
            "json"
        );
    } catch (error) {
        $().Logger.error("TravelfareFinder.js LoadRequestDetails()-->" + error)
    }
}

function FindReSubmitItinerary(RequestNo) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/FindReSubmitItinerary/" + RequestNo,
            "Get",
        null,
        function (response) {
            if (response != null) {
                if (response.IsHotelAdded && response.IsFlightAdded) {
                    if (response.IsFlightReSubmitted && !response.IsHotelReSubmitted) {
                        $('#HotelTab').attr('class', 'disabled');
                        $('#HotelTab a').removeAttr('href');
                        $('#HotelTab a').removeAttr('data-toggle');
                        $('#HotelTab a').removeAttr('tabindex');
                        $('#HotelTab a').removeAttr('data-target');
                        $('#ProceedToHotel').hide()
                        $('#TravelRequestFareFinder').append('<input type="hidden" id="IsFareFinderFlightReSubmittedHdn" value="' + response.IsFlightReSubmitted + '"/>');
                        $.unblockUI();
                    }
                    else if (response.IsHotelReSubmitted && !response.IsFlightReSubmitted) {
                        $('#FlightTab').attr('class', 'disabled');
                        $('#HotelTab').attr('class', 'active');
                        $.get('/b2e-hotel.html', function (data) {
                            $('#HotelSection').html(data);
                            $.unblockUI();
                        });
                        $('#HotelSection').attr('class', 'tab-pane fade in active');
                        $('#FlightSection').attr('class', 'tab-pane fade');
                        $('#FlightTab a').removeAttr('href');
                        $('#FlightTab a').removeAttr('data-toggle');
                        $('#FlightTab a').removeAttr('tabindex');
                        $('#TravelRequestFareFinder').append('<input type="hidden" id="IsFareFinderFlightReSubmittedHdn" value="' + response.IsFlightReSubmitted + '"/>');
                    }
                }
                $.unblockUI();
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
            "json"
        );
    } catch (error) {
        $().Logger.error("TravelfareFinder.js FindReSubmitItinerary()-->" + error)
    }
}

function GetLoggedInUserName(response) {
    try {
        if (response != null) {
            $('.rze-loginname').html(response.UserName);
            $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
            $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
            $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
            if (response.Role != "TMCAdmin" && response.Role != "TMCUser") {
                $("#tmcProfile_headerBD").remove();
                $("#tmcProfile_headerSD").remove();
                $("#myProfile_headerBD").css("display", "");
                $("#myProfile_headerSD").css("display", "");
            }
            else {
                $("#myProfile_headerBD").remove();
                $("#myProfile_headerSD").remove();
                $("#tmcProfile_headerBD").css("display", "");
                $("#tmcProfile_headerSD").css("display", "");
            }
        }

    } catch (error) {
        $().Logger.error("TravelfareFinder.js GetLoggedInUserName()-->" + error)
    }
}

function getActiveTabDetail(event, tab) {
    try {
        if ($('#IsFareFinderAssociated').val() == "true") {
            event.preventDefault();
            $('#dialog-ff').html('Travel Request data will be lost. Do you wish to continue?');
            $('#dialog-ff').removeClass('hidden');
            $("#dialog-ff").dialog({
                modal: true,
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                },
                buttons: {
                    "Yes": function () {
                        $(this).dialog("close");
                        $('#dialog-ff').addClass('hidden');
                        $('#IsFareFinderAssociated').val(false);
                        $('#myNavbar li.active').each(function () {
                            $(this).removeClass("active");
                        });
                        $(tab).attr('class', 'active');
                        var ReqNo = tab.id.split("_")[1];
                        var RequestType = tab.id.split("_")[2];
                        if (ReqNo > 0)
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;
                    },
                    "No": function () {
                        $(this).dialog("close");
                        $('#dialog-ff').addClass('hidden');
                    }
                }
            });
            return false;
        }
        else {
            $('#myNavbar li.active').each(function () {
                $(this).removeClass("active");
            });
            $(tab).attr('class', 'active');
            var ReqNo = tab.id.split("_")[1];
            var RequestType = tab.id.split("_")[2];
            if (ReqNo > 0)
                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;
        }
    } catch (error) {
        $().Logger.error("TravelfareFinder.js getActiveTabDetail()-->" + error)
    }
}


function LoadTravelRequest(RequestNo, RequestType) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        //setTimeout($.unblockUI, 2000);
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetTravelRequestById/" + RequestNo + "/" + RequestType,
            "Get",
        null,
        function (response) {
            if (response.TravelRequestStatus == "Travel Request Draft" || response.TravelRequestStatus == "Travel Request Rejected") {
                if (RequestType == 'Associate' && response.TravelRequestStatus == "Travel Request Rejected") {
                    $('#SubmittedTravelRequest').attr('class', 'active in');
                    $('#SavedTravelRequest').attr('class', 'hide');
                    var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                    $('#SubmittedTravelRequest').append(row);
                    LoadSubmittedTravelRequest(response);
                    $.unblockUI();
                }
                else {
                    $('#SubmittedTravelRequest').attr('class', 'hide');
                    $('#SavedTravelRequest').attr('class', 'active in');
                    $('#TravelRequest').attr('class', 'active in');
                    var row = '<input type="hidden" id="sav_' + RequestNo + '" name="sav_' + RequestNo + '" value="' + RequestType + '"/>';
                    $('#SavedTravelRequest').append(row);
                    LoadSavedTravelRequest(response);
                    $.unblockUI();
                }
            }
            else {
                $('#SubmittedTravelRequest').attr('class', 'active in');
                $('#SavedTravelRequest').attr('class', 'hide');
                var row = '<input type="hidden" id="sub_' + RequestNo + '" name="sub_' + RequestNo + '" value="' + RequestType + '"/>';
                $('#SubmittedTravelRequest').append(row);
                //$('#TravelRequest').attr('class', 'tab-pane fade active in');
                LoadSubmittedTravelRequest(response);
                $.unblockUI();
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
            "json"
        );
    } catch (error) {
        $().Logger.error("TravelfareFinder.js LoadTravelRequest()-->" + error)
    }
}


function LoadSubmittedTravelRequest(response) {
    try {
        $('#SubmittedTravelRequestNo').html(response.TravelRequestId);
        $("#SubmittedTravelRequestProject").html(response.CorporateProjectName);
        //$("#hdnProjectId").val(response.CorporateProjectId);
        $('#SubmittedTravelTripName').html(response.TravelRequestName);
        $('#SubmittedTravelRequestedDate').html(response.TravelRequestedDate);
        $('#SubmittedTravelDestinationCity').html(response.TravelRequestCityValue);
        $('#SubmittedTravelRequestType').html(response.TravelRequestTypeValue);
        $('#SubmittedTravelRequestAction').html(response.TravelRequestAction);
        $('#SubmittedTravelRequestStatus').html(response.TravelRequestStatus);
        $("#SubmittedTravelRequestStartDate").html(response.TravelRequestStartDate);
        $("#SubmittedTravelRequestEndDate").html(response.TravelRequestEndDate);
        $('#SubmittedTravelRequestReason').html(response.TravelRequestReason);
        //$('#SubmittedTravelRequestComments').html(response.TravelRequestComments);
        $('#SubmittedTravelRequestFlight').html(response.FlightPrice);
        $('#SubmittedTravelRequestHotel').html(response.HotelPrice);
        $("#SubmittedTraveller").empty();
        $("#SubmittedTraveller").append("<span>Travel Type:</span>");
        var cnt = parseFloat('1');
        $.each(response.TravellersDetails, function (key, value) {
            $("#SubmittedTraveller").append("&nbsp;<span class='vreq-tname'>" + cnt + ". " + value.employeeName + "</span> &nbsp; &nbsp;");
            cnt = cnt + 1;
        });
        var loadRight = true;
        $("#SubmittedTravelRequestComments").empty();
        $("#SubmittedTravelRequestComments").append("<h4 class='margin-bot20'>Review History</h4>");
        $.each(response.TravelRequestComments, function (key, value) {
            var comments = '';
            var status = '';
            var cls = 'rze-revhiswrap reviewright';
            if (value.Comments != null)
                comments = value.Comments;
            if (value.employeeName != "My Self") {
                status = value.Status;
                cls = 'rze-revhiswrap';
                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcombot'><span>" + value.employeeName + "</span></div></div>");
            }
            else {
                status = value.Status;
                $("#SubmittedTravelRequestComments").append("<div class='" + cls + "'><div class='row'><div class='col-xs-12 col-sm-2 col-md-2 col-lg-2 rze-tcomtop'><span>" + value.employeeName + "</span></div><div disabled class='col-xs-12 col-sm-10 col-md-10 col-lg-10'>" + comments + "( " + status + " " + value.CommentDate + " " + (value.CommentTime) + " )</div></div>");
            }
        });
        $("#SubmittedTravelRequestCreateItinerary").empty();
        var createitenary = '<a class="btn btn-primary" onclick="OpenTravelFareFinder(\'' + response.TravelRequestId + '\')">Add Itinerary Items</a>'
        $("#SubmittedTravelRequestCreateItinerary").append(createitenary);

        if (response.IsApprover == "true") {
            $('#ApproverComments').html('');
            $('#ApproverComments').css("display", "block");
            $('#CreateItinerary').css("display", "block");
            switch (response.TravelRequestStatusValue) {
                case 2: // submitted
                    {
                        $('#btnApprove').css("display", "block");
                        $('#btnReject').css("display", "block");
                        return;
                    }
                case 3: // Approved
                    {
                        $('#btnReject').css("display", "block");
                        return;
                    }
                case 4:// rejected
                    {
                        $('#SubmittedTravelRequestFlight').prop("disabled", true);
                        $('#SubmittedTravelRequestHotel').prop("disabled", true);
                        $('#ApproverComments').css("display", "none");
                        return;
                    }
            }
        }
        else {//only approved

            if (response.TravelRequestStatus == 3) {
                $('#CreateItinerary').css("display", "block");
            }
        }
        $.unblockUI();
    } catch (error) {
        $().Logger.error("TravelfareFinder.js LoadSubmittedTravelRequest()-->" + error)
    }
}

function closetab(e, req, RequestType) {
    try {
        if ($('#IsFareFinderAssociated').val() == "true") {
            e.preventDefault();
            if (e.stopPropagation != undefined)
                e.stopPropagation();
            else
                e.cancelBubble = true;
            $('#dialog-ff').html('Travel Request data will be lost. Do you wish to continue?');
            $('#dialog-ff').removeClass('hidden');
            $("#dialog-ff").dialog({
                modal: true,
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                },
                buttons: {
                    "Yes": function () {
                        $(this).dialog("close");
                        $('#dialog-ff').addClass('hidden');
                        $('#IsFareFinderAssociated').val(false);
                        $('#element_' + req + '_' + RequestType).attr('class', 'active');
                        if (req > 0) {
                            closetab(e, req, RequestType);
                        }
                    },
                    "No": function () {
                        $(this).dialog("close");
                        $('#dialog-ff').addClass('hidden');
                    }
                }
            });
            return false;
        }
        else {
            var ShouldCloseRequest = CloseRequest(req);
            if (ShouldCloseRequest) {
                if (sessionStorage.SavedTR != undefined) {
                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                    if (SavedTR != '') {
                        var presentKey = req + "//" + RequestType;
                        var keys = Object.keys(SavedTR),
                        idIndex = keys.indexOf(presentKey),
                        nextIndex = idIndex += 1;
                        var nextKey = keys[nextIndex]
                        var idNewIndex = keys.indexOf(presentKey);
                        prevIndex = idNewIndex -= 1;
                        var prevKey = keys[prevIndex]
                        delete SavedTR[req + "//" + RequestType];
                        var id = "element_" + req + "_" + RequestType;
                        if ($("#myTab .active").attr('id') == id) {
                            if (nextKey != undefined) {
                                sessionStorage.SavedTR = JSON.stringify(SavedTR);
                                var reqNo = nextKey.split("//")[0];
                                sessionStorage.nextTab = JSON.stringify(nextKey);
                                window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;
                                if (e.stopPropagation != undefined)
                                    e.stopPropagation();
                                else
                                    e.cancelBubble = true;
                                return false;
                            }
                            else if (prevKey != undefined) {
                                sessionStorage.SavedTR = JSON.stringify(SavedTR);
                                var reqNo = prevKey.split("//")[0];
                                sessionStorage.prevTab = JSON.stringify(prevKey);
                                window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;
                                if (e.stopPropagation != undefined)
                                    e.stopPropagation();
                                else
                                    e.cancelBubble = true;
                                return false;
                            }
                            else {
                                sessionStorage.SavedTR = JSON.stringify(SavedTR);
                                window.location = "Dashboard.html";
                                if (e.stopPropagation != undefined)
                                    e.stopPropagation();
                                else
                                    e.cancelBubble = true;
                                return false;
                            }
                        }
                        else {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            $("#myTab li.active").each(function () {
                                var ReqNumber = $(this).attr('id').split("_")[1];
                                var RequestType = $(this).attr('id').split("_")[2];
                                var presentKey = ReqNumber + "//" + RequestType;
                                sessionStorage.nextTab = JSON.stringify(presentKey);
                                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNumber;
                            });
                            if (sessionStorage.nextTab == undefined)
                                window.location = "Dashboard.html";
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            return false;
                        }
                    }
                    return false;
                }
            }
        }
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js closetab()-->" + error);
    }
}

function CloseRequest(req) {
    try {
        if (req == undefined || req != "NewTR") {
            if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                $(window).scrollTop(0);
                event.preventDefault();
                return false;
            }
            else
                return true;
        }
        else
            return true;
    } catch (error) {
        $().Logger.error("TravelRequestDetail.js CloseRequest()-->" + error);
    }
}