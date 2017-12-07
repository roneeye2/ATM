var intervals = [];
var timerCnt = parseFloat('0');
var PageIndex = 1;
var CurrentCount;
var ReqTabSliderLenthCnt = 3;
var IsCBTSonata = false;
$(function () {
    try {
        $('#footer').load('footer.html', function () { });
        //to make scrollbar  visible
        var docHeight = $(document).height();
        var winHeight = $(window).height();
        if (docHeight == winHeight) {
            $("html").height("101%");
        }

        $("#TravelRequest_header").load('header.html', function () {
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetUserInfo",
                "POST",
            null,
            function (response) {
                IsCBTSonata = response.ISCBTSONATA;
                if (IsCBTSonata) {
                    $('#header_TravelFareFinder').addClass('hide');
                    $('#ApprRequestStatusDiv').addClass('hide');
                    $('#RequestorRequestStatusDiv').addClass('hide');
                    $('#AdminRequestStatusDiv').addClass('hide');
                }
                if (!response.ISEXPENSE) {
                    $('#ExpenseReports_header').hide();
                }
                FindAdminOrEmployee(response);
                if ($('#ExpenseReports_header').length > 0) {
                    ReqTabSliderLenthCnt = 2;
                }
                if (sessionStorage.SavedTR != undefined) {
                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                    if (SavedTR != '') {
                        $.each(SavedTR, function (key, value) {
                            var ul = document.getElementById("myTab");
                            var li = document.createElement("li");
                            var a = document.createElement("a");
                            var ReqNo = key.split("//")[0];
                            var RequestType = key.split("//")[1];
                            li.setAttribute("id", "element_" + ReqNo + "_" + RequestType);
                            li.setAttribute("onclick", "getActiveTabDetail(this);");
                            ul.appendChild(li);
                            if (ReqNo.indexOf("NewTR") == -1)
                                document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>TR' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            else
                                document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closetab(event,\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';

                            if ($("#myTab").children().length > ReqTabSliderLenthCnt) {
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

                            if ($("#myTab").children().length > ReqTabSliderLenthCnt) {
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
                $("a[href='/TravelRequest.html']").parent().attr('class', 'active');
            });

        });

        $("#MyReq_RequestStartDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyReq_RequestStartDate")
            },
            onSelect: function () {
                $("#MyReq_RequestEndDate").prop('disabled', false);
                $("#MyReq_RequestEndDate").css('background', '#fff');
                $("#MyReq_RequestEndDateLbl .btn").css('background', '#fff');
                $('#MyReq_RequestEndDate').datepicker('option', 'minDate', this.value);
                $("#MyReq_RequestStartDate").focus();
            }
        });
        $("#MyReq_RequestStartDate").mask(sessionStorage.CultureMaskFormat);

        $("#MyReq_RequestEndDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyReq_RequestEndDate")
            }, onSelect: function () { $("#MyReq_RequestEndDate").focus(); }
        });
        $("#MyReq_RequestEndDate").mask(sessionStorage.CultureMaskFormat);
        $("#MyReq_RequestEndDate").prop('disabled', true);
        $("#MyReq_RequestEndDate").css('background', '#e0dcdc');
        $("#MyReq_RequestEndDateLbl .btn").css('background', '#e0dcdc');

        $("#MyReq_RequestedDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyReq_RequestedDate")
            }, onSelect: function () { $("#MyReq_RequestedDate").focus(); }
        });
        $("#MyReq_RequestedDate").mask(sessionStorage.CultureMaskFormat);
        $("#MyAssociates_RequestStartDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyAssociates_RequestStartDate")
            },
            onSelect: function () {
                $("#MyAssociates_RequestEndDate").prop('disabled', false);
                $("#MyAssociates_RequestEndDate").css('background', '#fff');
                $("#MyAssociates_RequestEndDateLbl .btn").css('background', '#fff');
                $('#MyAssociates_RequestEndDate').datepicker('option', 'minDate', this.value);
                $("#MyAssociates_RequestStartDate").focus();
            }
        });
        $("#MyAssociates_RequestStartDate").mask(sessionStorage.CultureMaskFormat);

        $("#MyAssociates_RequestEndDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyAssociates_RequestEndDate")
            }, onSelect: function () { $("#MyAssociates_RequestEndDate").focus(); }
        });
        $("#MyAssociates_RequestEndDate").mask(sessionStorage.CultureMaskFormat);
        $("#MyAssociates_RequestEndDate").prop('disabled', true);
        $("#MyAssociates_RequestEndDate").css('background', '#e0dcdc');
        $("#MyAssociates_RequestEndDateLbl .btn").css('background', '#e0dcdc');

        $("#MyAssociates_RequestedDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "MyAssociates_RequestedDate")
            }, onSelect: function () { $("#MyAssociates_RequestedDate").focus(); }
        });
        $("#MyAssociates_RequestedDate").mask(sessionStorage.CultureMaskFormat);
        $("#RequestStartDate_Admin").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestStartDate_Admin")
            },
            onSelect: function () {
                $("#RequestEndDate_Admin").prop('disabled', false);
                $("#RequestEndDate_Admin").css('background', '#fff');
                $("#RequestEndDate_AdminLbl .btn").css('background', '#fff');
                $('#RequestEndDate_Admin').datepicker('option', 'minDate', this.value);
                $("#RequestStartDate_Admin").focus();
            }
        });
        $("#RequestStartDate_Admin").mask(sessionStorage.CultureMaskFormat);

        $("#RequestEndDate_Admin").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestEndDate_Admin")
            }, onSelect: function () { $("#RequestEndDate_Admin").focus(); }
        });
        $("#RequestEndDate_Admin").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate_Admin").prop('disabled', true);
        $("#RequestEndDate_Admin").css('background', '#e0dcdc');
        $("#RequestEndDate_AdminLbl .btn").css('background', '#e0dcdc');

        $("#RequestedDate_Admin").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestedDate_Admin")
            }, onSelect: function () { $("#RequestedDate_Admin").focus(); }
        });
        $("#RequestedDate_Admin").mask(sessionStorage.CultureMaskFormat);
        $(".rzf_addemp .rza-emp-actbtns").click(function (e) {
            if ($(e.currentTarget).parent().prev().find(":input").first().val() != '') {
                $('#IsEditFlow').val("false");
                $('#lblTravellerError').html('');
                if (parseInt($("#hdnTravellerType").val()) < 7) {
                    $("#hdnTravellerType").val(parseInt($("#hdnTravellerType").val()) + 1);
                    $("#hdnTravellerTypeCount").val(parseInt($("#hdnTravellerTypeCount").val()) + 1);
                    TravellerName(parseInt($("#hdnTravellerTypeCount").val()));
                }
            }
            else {
                $('#lblTravellerError').html('Please Search valid travller');
            }
        });

        // Set date picker for start date.
        $("#TravelRequestStartDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "TravelRequestStartDate")
            },
            minDate: moment().format(sessionStorage.DateFormatForMoment),
            changeMonth: true,
            changeYear: true,
            onSelect: function () {
                $('#TravelRequestEndDate').datepicker('option', 'minDate', this.value);
            }
        });
        $("#TravelRequestStartDate").mask(sessionStorage.CultureMaskFormat);
        // Date picker for end date.
        $("#TravelRequestEndDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "TravelRequestEndDate")
            },
            minDate: moment().format(sessionStorage.DateFormatForMoment), changeMonth: true,
            changeYear: true
        });
        $("#TravelRequestEndDate").mask(sessionStorage.CultureMaskFormat);

        //Date Picker for TravelKnownDate
        $("#TravelRequestTravelKnownDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "TravelRequestTravelKnownDate")
            },
            changeMonth: true,
            changeYear: true
        });
        $("#TravelRequestStartDate").mask(sessionStorage.CultureMaskFormat);

        // Search traveller when press enter.
        $('#SearchEmployeeCode').keypress(function (event) {
            // Enter key press
            if (event.keyCode == 13) {
                $('#btnSearch').click();
            }
        });

        // Search traveller when press enter.
        $('#SearchEmployeeName').keypress(function (event) {
            // Enter key press
            if (event.keyCode == 13) {
                $('#btnSearch').click();
            }
        });

        // By default focus on trip name.
        $("#TravelRequestName").focus();

        // Sho search traveller when press enter.
        $('#textTravellerName1').keypress(function (event) {
            // Enter key press.
            if (event.keyCode == 13) {
                ShowModel(1);
            }
        });

        // Close popup on esc key press.
        $(document).keydown(function (e) {
            // ESCAPE key pressed
            if (e.keyCode == 27) {
                $('#tremp-search').modal('hide');
                $('#textTravellerName' + parseInt($("#hdnTravellerId").val())).focus();
            }
        });

        // Numeric validation.
        $("#TravelRequestFlight").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        // Numeric validation.
        $("#TravelRequestHotel").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $("#ApprActualPricetxt").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        // Drop down to show on tab change.
        $('#Select').on('change', function (e) {
            $('#Tab li a').eq($(this).val()).tab('show');
        });

        // projects.
        LoadProjects();
        LoadStatus();
        $('#MyRequest').click(function () {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").html('');
            ResetStatusFilter('Clear');
            PageIndex = 1;
            skipCount = 0;
            $('#hdnIsScroll').val("false");
            LoadNonApproverTravelRequest();
        });
        $('#MyAssociate').click(function () {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").html('');
            ResetStatusFilterAssociates('Clear');
            PageIndex = 1;
            skipCount = 0;
            $('#hdnIsScroll').val("false");
            LoadApproverTravelRequest();
        });

        var nonApprovalArrayOriginalSelfLowerCase = '';
        var approvalArrayOriginalLowerCase = '';
        var arrOriginalAdminLowerCase = '';
        $('#MyReq_RequestGridheadings th i[id!="filter"]').click(function () {
            // need to get data from DB for sorting
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            PageIndex = 1;
            $("#hdnIsFilterApplied").val(false);
            $('#hdnIsScroll').val("false")
            var invokingColumnId = $(this).parent().parent().attr("id");
            $("#lastSortedColumn").remove();
            var $lastSortedColumn = $('<input/>', { type: 'hidden', id: 'lastSortedColumn', value: invokingColumnId });
            $lastSortedColumn.appendTo("#header_Dashboard");
            LoadNonApproverTravelRequest(invokingColumnId);

        });

        $('#MyAssociates_RequestGridheadings th i[id!="filter"]').click(function () {
            // need to get data from DB for sorting
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            PageIndex = 1;
            $("#hdnIsFilterApplied").val(false);
            $('#hdnIsScroll').val("false")
            var invokingColumnId = $(this).parent().parent().attr("id");
            $("#lastSortedColumn").remove();
            var $lastSortedColumn = $('<input/>', { type: 'hidden', id: 'lastSortedColumn', value: invokingColumnId });
            $lastSortedColumn.appendTo("#header_Dashboard");
            LoadApproverTravelRequest(invokingColumnId);
        });

        $('#AdminRequestGridheadings th i[id!="filter"]').click(function () {
            // need to get data from DB for sorting
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            PageIndex = 1;
            $("#hdnIsFilterApplied").val(false);
            $('#hdnIsScroll').val("false")
            var invokingColumnId = $(this).parent().parent().attr("id");
            $("#lastSortedColumn").remove();
            var $lastSortedColumn = $('<input/>', { type: 'hidden', id: 'lastSortedColumn', value: invokingColumnId });
            $lastSortedColumn.appendTo("#header_Dashboard");
            LoadAdminRequest('AdminDasboard', invokingColumnId);
        });

        $("#rze-wrapMyrequests").keypress(function (e) {
            if (e.which == 13) {
                FilterRequest('Myrequests', true);
            }
        });

        $("#rze-wrapMyassociatesreq").keypress(function (e) {
            if (e.which == 13) {
                FilterRequest('Myassociatesreq', true);
            }
        });
    }
    catch (error) {
        $().Logger.error("TravelRequest.js (#TravelRequest_header).load()-->" + error)
    }
});

function ResetCreateRequestForm() {
    try {
        $("#TravelRequestName").val("");
        $("#TravelRequestProject").val("");
        var count = parseInt($("#hdnTravellerTypeCount").val());
        for (var i = 1; i <= count; i++) {
            $("#textTravellerName" + i).val("");
            DeleteTravellers(i);
        }
        $('#TravelRequestType option:eq(0)').attr('selected', 'selected');
        $('#TravelRequestCountry option:eq(0)').attr('selected', 'selected');
        $('#TravelRequestState option:eq(0)').attr('selected', 'selected');
        $('#TravelRequestCity option:eq(0)').attr('selected', 'selected');
        $("#TravelRequestStartDate").val("");
        $("#TravelRequestEndDate").val("");
        $("#TravelRequestReason").val("");
        $("#TravelRequestComments").val("");
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetCreateRequestForm()-->" + error)
    }
}

function closetab(e, req, RequestType) {
    try {
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
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;

                            return false;
                        }
                        else if (prevKey != undefined) {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            var reqNo = prevKey.split("//")[0];
                            sessionStorage.prevTab = JSON.stringify(prevKey);
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            window.location = "TravelRequestDetail.html" + "?RequestNo=" + reqNo;

                            return false;
                        }
                        else {
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                            if (e.stopPropagation != undefined)
                                e.stopPropagation();
                            else
                                e.cancelBubble = true;
                            window.location = "Dashboard.html";
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
                        if (e.stopPropagation != undefined)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                        if (sessionStorage.nextTab == undefined)
                            window.location = "Dashboard.html";
                        return false;
                    }
                }
                return false;
            }
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js closetab()-->" + error)
    }

}

function CloseRequest(req) {
    try {
        if (req == undefined || req != "NewTR") {
            if ($("#myTab .active").attr('id') == 'element_NewExp_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                event.preventDefault();
                return false;
            }
            else if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-info");
                $("#lblMessage").html('Kindly Save Data.');
                $(window).scrollTop(0);
                event.preventDefault();
            }
            else
                return true;
        }
        else
            return true;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js CloseRequest()-->" + error)
    }
}

function FindAdminOrEmployee(response) {
    try {
        if (response != null) {
            $('.rze-loginname').html(response.UserName);
            $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
            $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
            $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
            if (response.Role != "TMCAdmin" && response.Role != "TMCUser" && response.Role != "TMCAdmin,TMCUser" && response.Role != "Administrator") {
                $("#tmcProfile_headerBD").remove();
                $("#tmcProfile_headerSD").remove();
                $("#myProfile_headerBD").css("display", "");
                $("#myProfile_headerSD").css("display", "");
                if (response.approver == false) {
                    $('#MyAssociate').css('display', 'none');
                    $('#Associate').attr('class', 'hide');
                    $('#Admin').attr('class', 'hide');
                    $('#IsAdmin').val(false);
                    LoadNonApproverTravelRequest();
                }
                else {
                    $('#Associate').attr('class', 'tab-pane fade');
                    $('#Admin').attr('class', 'hide');
                    $('#IsAdmin').val(false);
                    if (getUrlVars().hasOwnProperty("ApprViewAll")) {
                        // enable approver tab;
                        $('#MyRequest').removeClass("active");
                        $('#home').attr('class', 'tab-pane fade');
                        $('#MyAssociate').addClass("active");
                        $('#Associates').attr('class', 'tab-pane fade in active');
                        LoadApproverTravelRequest();
                    }
                    else {
                        LoadNonApproverTravelRequest();
                    }
                    //LoadApproverTravelRequest();
                }
            }
            else {
                $("#myProfile_headerBD").remove();
                $("#myProfile_headerSD").remove();
                $("#tmcProfile_headerBD").css("display", "");
                $("#tmcProfile_headerSD").css("display", "");
                $('#MyAssociate').css('display', 'none');
                $('#Associate').attr('class', 'hide');
                $('#MyRequestTab').attr('class', 'hide');
                $('#menu1').attr('class', 'hide');
                $('#home').attr('class', 'hide');
                $('#IsAdmin').val(true);
                LoadAdminRequest('AdminRequest');
            }
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js FindAdminOrEmployee()-->" + error)
    }
}

function LoadNonApproverTravelRequest(invokingColumnId) {
    try {
        var invokingColumnId;
        var IsScroll = $('#hdnIsScroll').val();
        var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
        if (IsScroll == "true") {
            var pageIndex = parseInt(PageIndex);
            var totalCnt = $("#hdnTotalResultsCount").val();
            var showCnt = $("#hdnShowCount").val();
            if (showCnt == totalCnt) {
                return false;
            }
            if (pageIndex > 1) {
                skipCount = (pageIndex - 1) * defaultTakeCount;
            }
            else {
                skipCount = 0;
            }
        }
        else {
            skipCount = 0;
        }
        var selectedMonth = '0';
        var selectedYear = '0';
        if (invokingColumnId === undefined) {
            invokingColumnId = "RequestBy_Self";
            var sortingType = "desc";
        }
        else if (invokingColumnId !== undefined) {
            if ($('th#' + invokingColumnId).attr("asc") == "asc" && IsScroll == "false")
                var sortingType = "desc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if ($('th#' + invokingColumnId).attr("asc") == "desc" && IsScroll == "false")
                var sortingType = "asc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if (sortingType === undefined)
                var sortingType = "desc";
        }
        var activeClassTo = "";
        if (sortingType == "desc") {
            activeClassTo = "down";
        }
        else {
            activeClassTo = "up";
        }

        if (defaultTakeCount != "NaN" && IsScroll != undefined) {
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetNonApproverTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
            "POST",
            null,
            function (response) {
                var savedCnt = parseFloat('0');
                var rejectedCnt = parseFloat('0');
                if (response.data.length > 0) {
                    if (PageIndex == 1) { $("#MyReq_TravelRequestGrid").empty(); }

                    $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
                    $("#hdncorporateId").val("1104");
                    $.each(response.data, function (key, value) {
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#MyReq_TravelRequestGrid").append(newRow);
                    });
                    $('th#' + invokingColumnId).attr("asc", sortingType);
                    $("#MyReq_RequestGridheadings i").removeClass("active")
                    $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
                    isLoadingData = false;

                    //$('#rzebtn').remove();

                    if ($("#MyReq_TravelRequestGrid").children().length > 0) {
                        //var ViewAllRow = "<tr id=rzebtn><td colspan='8' class='text-center rze-btn'></td></tr>";
                        //$("#MyReq_TravelRequestGrid").append(ViewAllRow);

                        GetHover();
                    }
                    if (PageIndex == 1) {
                        $("#hdnShowCount").val(parseInt(response.data.length));
                        $("#requestTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                        $("#hdnConstantTotalResults").val(parseInt(response.count));
                    }
                    else {
                        CurrentCount = $("#hdnShowCount").val();
                        CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                        $("#hdnShowCount").val(parseInt(CurrentCount));
                        $("#requestTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                    var originalGrid = $('#MyReq_RequestGrid tr.row_main:has(td)').map(function (i, v) {
                        var $td = $('td', this);
                        return {
                            id: ++i,
                            RequestBy: $td.eq(0).text(),
                            RequestDate: $td.eq(1).text(),
                            RequestNo: $td.eq(2).text(),
                            TripName: $td.eq(3).text(),
                            TravelDestination: $td.eq(4).text(),
                            TravelStartDate: $td.eq(5).text(),
                            RequestStatus: $td.eq(6).text(),
                            Action: $td.eq(7).text()
                        }
                    }).get();
                    sessionStorage.originalGrid = JSON.stringify(originalGrid);
                    $.unblockUI();
                }
                else {
                    if (PageIndex == 1) {
                        var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>You don’t have any Travel Request.</h4></td></tr>";
                        $("#MyReq_TravelRequestGrid").empty();
                        $("#MyReq_TravelRequestGrid").append(newRow);
                        $.unblockUI();
                    }
                }
                //Footable
                //rezFootable();
            }
         ,
            function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            },
            "json"
            );

        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadNonApproverTravelRequest()-->" + error)
    }
}

function rezFootable() {
    //Footable
    $('.table').footable({
        "breakpoints": {
            "xxs": 320,
            "xs": 480, // extra small
            "sm": 768, // small
            "md": 992, // medium
            "lg": 1200 // large
        }
    });
    $("#MyReq_TravelRequestGrid td:empty").addClass("emptytd");
    $("#MyAssociates_TravelRequestGrid td:empty").addClass("emptytd");
}

function checkUncheckFilter(filter) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var obj = {};
        var uncheckobj = {};
        var filterCriteria = new Array();

        var status = $(filter).parent().html().split('>')[1];

        if ($(filter)[0].checked) {
            obj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
        }
        else {
            uncheckobj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
        }
        if ($('#MyReq_StatusFilter input:checked').length > 0) {
            $('#MyReq_StatusFilter input:checked').each(function () {

                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
                if (status.toLowerCase().indexOf("approved") >= 0) {
                    var type = status.split('-')[0].toLowerCase();
                    filterCriteria.push(type + "-approved by l1");
                    filterCriteria.push(type + "-approved by l1 , l2");
                    filterCriteria.push(type + "-approved by l1 , l2 , l3");
                }
                else if (status.toLowerCase().indexOf("rejected") >= 0) {
                    filterCriteria.push(type + "-rejected by l1");
                    filterCriteria.push(type + "-rejected by l2");
                    filterCriteria.push(type + "-rejected by l3");
                }
                else
                    filterCriteria.push(status.toLowerCase());
            });
        }
        $.each(obj, function (key, value) {
            var s = value.split('-');
            if (s.length > 0) {
                var str = s[1];
                if (s[0].toLowerCase().indexOf('itr.') >= 0)
                    value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
                else
                    value = "TR-" + str[0].toUpperCase() + str.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
        });
        $.each(uncheckobj, function (key, value) {
            var s = value.split('-');
            if (s.length > 0) {
                var str = s[1];
                if (s[0].toLowerCase().indexOf('itr.') >= 0)
                    value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
                else
                    value = "TR-" + str[0].toUpperCase() + str.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }

            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
        });
        if (!$.isEmptyObject(uncheckobj)) {
            $.each(uncheckobj, function (key, value) {
                for (var i in filterCriteria) {
                    if (filterCriteria[i] == value) {
                        filterCriteria.splice(i, 1);
                        break;
                    }
                }
            });
        }
        ApplyStatusFilter(filterCriteria);
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js checkUncheckFilter()-->" + error)
    }
}

function checkUncheckFilterAssociates(filter) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var obj = {};
        var uncheckobj = {};
        var filterCriteria = new Array();

        var status = $(filter).parent().html().split('>')[1];

        if ($(filter)[0].checked) {
            obj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
        }
        else {
            uncheckobj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
        }
        if ($('#MyAssociates_StatusFilter input:checked').length > 0) {
            $('#MyAssociates_StatusFilter input:checked').each(function () {

                var status = $(this).parent().html().split('>')[1];

                obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
                if (status.toLowerCase().indexOf("approved") >= 0) {
                    var type = status.split('-')[0].toLowerCase();
                    filterCriteria.push(type + "-approved by l1");
                    filterCriteria.push(type + "-approved by l1 , l2");
                    filterCriteria.push(type + "-approved by l1 , l2 , l3");
                }
                else if (status.toLowerCase().indexOf("rejected") >= 0) {
                    filterCriteria.push(type + "-rejected by l1");
                    filterCriteria.push(type + "-rejected by l2");
                    filterCriteria.push(type + "-rejected by l3");
                }
                else
                    filterCriteria.push(status.toLowerCase());
            });
        }
        $.each(obj, function (key, value) {
            var s = value.split('-');
            if (s.length > 0) {
                var str = s[1];
                if (s[0].toLowerCase().indexOf('itr.') >= 0)
                    value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
                else
                    value = "TR-" + str[0].toUpperCase() + str.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAssociates(this)' checked='checked'>" + value + "</label></div>");
        });
        $.each(uncheckobj, function (key, value) {
            var s = value.split('-');
            if (s.length > 0) {
                var str = s[1];
                if (s[0].toLowerCase().indexOf('itr.') >= 0)
                    value = "Itr.-" + str[0].toUpperCase() + str.slice(1);
                else
                    value = "TR-" + str[0].toUpperCase() + str.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAssociates(this)'>" + value + "</label></div>");
        });
        if (!$.isEmptyObject(uncheckobj)) {
            $.each(uncheckobj, function (key, value) {
                for (var i in filterCriteria) {
                    if (filterCriteria[i] == value) {
                        filterCriteria.splice(i, 1);
                        break;
                    }
                }
            });
        }
        ApplyStatusFilterAssociates(filterCriteria);
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js checkUncheckFilterAssociates()-->" + error)
    }
}

function ApplyStatusFilter(criteria) {
    try {
        if (criteria.length > 0) {
            if (sessionStorage.originalGrid != undefined) {
                originalSelfGrid = $.parseJSON(sessionStorage.originalGrid);
                if (originalSelfGrid != '') {
                    $("#MyReq_TravelRequestGrid").empty();
                    $.each(originalSelfGrid, function (key, value) {
                        if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#MyReq_TravelRequestGrid").append(newRow);
                        }
                    });
                    var statusNotifyCount = $('#MyReq_RequestGrid tbody tr.row_main').length;
                    if (statusNotifyCount > 0) {
                        $("#requestTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    }
                    else { $("#requestTabResultCount").html(" "); }
                    if ($("#MyReq_TravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                        $("#MyReq_TravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#MyReq_TravelRequestGrid").empty();
                        $("#MyReq_TravelRequestGrid").append(newRow);
                    }
                }
            }
        }
        else {
            ResetStatusFilter('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ApplyStatusFilter()-->" + error)
    }
}

function ResetStatusFilter(cond) {
    try {
        if (sessionStorage.originalGrid != undefined) {
            originalSelfGrid = $.parseJSON(sessionStorage.originalGrid);
            if (originalSelfGrid != '') {
                $("#MyReq_TravelRequestGrid").empty();
                $.each(originalSelfGrid, function (key, value) {
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#MyReq_TravelRequestGrid").append(newRow);
                    $("#hdnShowCount").val(parseInt(originalSelfGrid.length));
                    $("#requestTabResultCount").html("Showing " + originalSelfGrid.length + " " + "of " + originalSelfGrid.length);
                    $("#hdnTotalResultsCount").val(parseInt(originalSelfGrid.length));
                });
                if ($("#MyReq_TravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                    $("#MyReq_TravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
            }
        }
        if (cond == 'All') { // check all checkbox;
            var atr = $('#showingAllFilterMyReq').attr('onclick');
            var str = atr.split('All');
            var natr = str.join('Clear');
            $('#showingAllFilterMyReq').replaceWith('<input id="showingAllFilterMyReq" type="checkbox" checked="checked">');
            $('#showingAllFilterMyReq').attr('onclick', natr);
            var obj = {};
            if ($('#MyReq_StatusFilter input').length > 0) {
                $('#MyReq_StatusFilter input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
                });
            }

        }
        if (cond == 'Clear')  // uncheck All Checkbox
        {
            var atr = $('#showingAllFilterMyReq').attr('onclick');
            var str = atr.split('Clear');
            var natr = str.join('All');
            $('#showingAllFilterMyReq').replaceWith('<input id="showingAllFilterMyReq" type="checkbox">');
            $('#showingAllFilterMyReq').attr('onclick', natr);
            var obj = {};
            if ($('#MyReq_StatusFilter input').length > 0) {
                $('#MyReq_StatusFilter input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                });
            }
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetStatusFilter()-->" + error)
    }
}

function LoadApproverTravelRequest(invokingColumnId) {
    try {
        var IsScroll = $('#hdnIsScroll').val();
        var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
        if (IsScroll == "true") {
            var pageIndex = parseInt(PageIndex);
            var totalCnt = $("#hdnTotalResultsCount").val();
            var showCnt = $("#hdnShowCount").val();
            if (showCnt == totalCnt) {
                return false;
            }
            if (pageIndex > 1) {
                skipCount = (pageIndex - 1) * defaultTakeCount;
            }
            else {
                skipCount = 0;
            }
        }
        else {
            skipCount = 0;
        }
        var selectedMonth = '0';
        var selectedYear = '0';

        if (invokingColumnId === undefined) {
            invokingColumnId = "RequestDate";
            var sortingType = "desc";
        }
        else if (invokingColumnId !== undefined) {
            if ($('th#' + invokingColumnId).attr("asc") == "asc" && IsScroll == "false")
                var sortingType = "desc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if ($('th#' + invokingColumnId).attr("asc") == "desc" && IsScroll == "false")
                var sortingType = "asc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if (sortingType === undefined)
                var sortingType = "desc";
        }
        var activeClassTo = "";
        if (sortingType == "desc") {
            activeClassTo = "down";
        }
        else {
            activeClassTo = "up";
        }

        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetApproverTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
        "POST",
        null,
        function (response) {
            var savedCnt = parseFloat('0');
            var rejectedCnt = parseFloat('0');
            if (response.data.length > 0) {
                if (PageIndex == 1) { $("#MyAssociates_TravelRequestGrid").empty(); }
                $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
                $("#hdncorporateId").val("1104");
                $.each(response.data, function (key, value) {
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#MyAssociates_TravelRequestGrid").append(newRow);
                });
                $('th#' + invokingColumnId).attr("asc", sortingType);
                $("#MyAssociates_RequestGridheadings i").removeClass("active")
                $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
                isLoadingData = false;

                if ($("#MyAssociates_TravelRequestGrid").children().length > 0) {
                    //var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                    //$("#MyAssociates_TravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                if (PageIndex == 1) {
                    $("#hdnShowCount").val(parseInt(response.data.length));
                    $("#requestMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
                else {
                    CurrentCount = $("#hdnShowCount").val();
                    CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                    $("#hdnShowCount").val(parseInt(CurrentCount));
                    $("#requestMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
                var originalAssociateGrid = $('#MyAssociates_RequestGrid tr.row_main:has(td)').map(function (i, v) {
                    var $td = $('td', this);
                    return {
                        id: ++i,
                        RequestBy: $td.eq(0).text(),
                        RequestDate: $td.eq(1).text(),
                        RequestNo: $td.eq(2).text(),
                        TripName: $td.eq(3).text(),
                        TravelDestination: $td.eq(4).text(),
                        TravelStartDate: $td.eq(5).text(),
                        RequestStatus: $td.eq(6).text(),
                        Action: $td.eq(7).text()
                    }
                }).get();
                sessionStorage.originalGrid = JSON.stringify(originalAssociateGrid);
                $.unblockUI();
            }
            else {
                if (PageIndex == 1) {
                    var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>You don’t have any Travel Request.</h4></td></tr>";
                    $("#MyAssociates_TravelRequestGrid").empty();
                    $("#MyAssociates_TravelRequestGrid").append(newRow);
                    $("#requestMyApprovalsTabResultCount").html("");
                    $.unblockUI();
                }
            }
            //Footable
            //rezFootable();
        }
     ,
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetStatusFilter()-->" + error)
    }
}

function ApplyStatusFilterAssociates(criteria) {
    try {
        if (criteria.length > 0) {
            if (sessionStorage.originalGrid != undefined) {
                originalSelfGrid = $.parseJSON(sessionStorage.originalGrid);
                if (originalSelfGrid != '') {
                    $("#MyAssociates_TravelRequestGrid").empty();
                    $.each(originalSelfGrid, function (key, value) {
                        if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#MyAssociates_TravelRequestGrid").append(newRow);
                        }
                    });
                    var statusNotifyCount = $('#MyAssociates_RequestGrid tbody tr.row_main').length;
                    if (statusNotifyCount > 0) {
                        $("#requestMyApprovalsTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    }
                    else { $("#requestMyApprovalsTabResultCount").html(" "); }
                    if ($("#MyAssociates_TravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                        $("#MyAssociates_TravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#MyAssociates_TravelRequestGrid").empty();
                        $("#MyAssociates_TravelRequestGrid").append(newRow);
                    }
                }
            }
        }
        else {
            ResetStatusFilterAssociates('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ApplyStatusFilterAssociates()-->" + error)
    }
}

function ResetStatusFilterAssociates(cond) {
    try {
        if (sessionStorage.originalGrid != undefined) {
            originalSelfGrid = $.parseJSON(sessionStorage.originalGrid);
            if (originalSelfGrid != '') {
                $("#MyAssociates_TravelRequestGrid").empty();
                $.each(originalSelfGrid, function (key, value) {
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#MyAssociates_TravelRequestGrid").append(newRow);
                    $("#hdnShowCount").val(parseInt(originalSelfGrid.length));
                    $("#requestMyApprovalsTabResultCount").html("Showing " + originalSelfGrid.length + " " + "of " + originalSelfGrid.length);
                    $("#hdnTotalResultsCount").val(parseInt(originalSelfGrid.length));
                });
                if ($("#MyAssociates_TravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                    $("#MyAssociates_TravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
            }
        }
        if (cond == 'All') { // check all checkbox;
            var atr = $('#showingAllFilterMyAssociates').attr('onclick');
            var str = atr.split('All');
            var natr = str.join('Clear');
            $('#showingAllFilterMyAssociates').replaceWith('<input id="showingAllFilterMyAssociates" type="checkbox" checked="checked">');
            $('#showingAllFilterMyAssociates').attr('onclick', natr);
            var obj = {};
            if ($('#MyAssociates_StatusFilter input').length > 0) {
                $('#MyAssociates_StatusFilter input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAssociates(this)' checked='checked'>" + value + "</label></div>");
                });
            }

        }
        if (cond == 'Clear')  // uncheck All Checkbox
        {
            var atr = $('#showingAllFilterMyAssociates').attr('onclick');
            var str = atr.split('Clear');
            var natr = str.join('All');
            $('#showingAllFilterMyAssociates').replaceWith('<input id="showingAllFilterMyAssociates" type="checkbox">');
            $('#showingAllFilterMyAssociates').attr('onclick', natr);
            var obj = {};
            if ($('#MyAssociates_StatusFilter input').length > 0) {
                $('#MyAssociates_StatusFilter input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAssociates(this)'>" + value + "</label></div>");
                });
            }
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetStatusFilterAssociates()-->" + error)
    }
}

function LoadAdminRequest(CallBy, invokingColumnId) {
    try {
        if (CallBy == 'AdminRequest') {
            $('#hdnCalledByAdminRequest').val("true");
        }
        if (intervals.length > 0)
            intervals.forEach(clearInterval);
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var selectedMonth = 0;
        var selectedYear = 0;
        var arrDashboardStatus;
        var IsScroll = $('#hdnIsScroll').val();
        var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
        if (isNaN(defaultTakeCount)) {
            defaultTakeCount = 10;
        }
        if (IsScroll == "true") {
            var pageIndex = parseInt(PageIndex);
            var totalCnt = $("#hdnTotalResultsCount").val();
            var showCnt = $("#hdnShowCount").val();
            if (showCnt == totalCnt) {
                return false;
            }
            if (pageIndex > 1) {
                skipCount = (pageIndex - 1) * defaultTakeCount;
            }
            else {
                skipCount = 0;
            }
        }
        else {
            skipCount = 0;
        }
        if (invokingColumnId === undefined) {
            invokingColumnId = "RequestDate_Admin";
            var sortingType = "desc";
        }
        else if (invokingColumnId !== undefined) {
            if ($('th#' + invokingColumnId).attr("asc") == "asc" && IsScroll == "false")
                var sortingType = "desc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if ($('th#' + invokingColumnId).attr("asc") == "desc" && IsScroll == "false")
                var sortingType = "asc";
            else
                if (IsScroll == "true")
                    var sortingType = $('th#' + invokingColumnId).attr("asc");
            if (sortingType === undefined)
                var sortingType = "desc";
        }
        var activeClassTo = "";
        if (sortingType == "desc") {
            activeClassTo = "down";
        }
        else {
            activeClassTo = "up";
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetAdminTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
        "POST",
        null,
        function (response) {
            var i = 0;
            var rotator;
            if (response.data.length > 0) {
                if (PageIndex == 1) { $("#AdminTravelRequestGrid").empty(); }
                $.each(response.data, function (key, value) {
                    if (!IsCBTSonata) {
                        var countDownTime = new Date(value.TicketingTimeLine).getTime();
                        var timerString = '';

                        // Allow timer stirng when booking submitted.
                        if (value.RequestStatusValue == 10) {
                            timerString = '<span data-CountTime ="' + countDownTime + '" id="timer_' + value.RequestNo + '" class="rze-timer">' + value.TicketingTimeLine + '</span>';
                        } else {
                            timerString = '<span data-CountTime ="' + 0 + '" id="timer_' + value.RequestNo + '" ></span>';
                        }

                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td class="text-center">' +
                            timerString + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a  onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#AdminTravelRequestGrid").append(newRow);

                        $('th#' + invokingColumnId).attr("asc", sortingType);
                        $("#AdminRequestGridheadings i").removeClass("active")
                        $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
                        if (value.RequestStatusValue == 10) {
                            timerCnt++;
                            var Timerfunction = function StartTimers() {
                                var StartDate = new Date();
                                StartDate = StartDate.getTime();
                                var countDownDate = new Date(value.TicketingTimeLine).getTime();
                                // Find the distance between now an the count down date
                                var distance = countDownDate - StartDate;
                                // Time calculations for days, hours, minutes and seconds
                                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                if (days > 0)
                                    $("#timer_" + value.RequestNo).html(days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s ");
                                else if (hours > 0)
                                    $("#timer_" + value.RequestNo).html(hours + "h : " + minutes + "m : " + seconds + "s");
                                else
                                    $("#timer_" + value.RequestNo).html(minutes + "m : " + seconds + "s ");
                                // If the count down is over, write some text
                                if (distance < 0) {
                                    clearInterval(Timerfunction);
                                    $("#timer_" + value.RequestNo).html("EXPIRED");
                                }
                            }
                            rotator = setInterval(Timerfunction, 1000);
                            Timerfunction();
                            intervals.push(rotator);
                            i++;
                        }
                        else {
                            if (value.RequestStatusValue == 9) {
                                $("#timer_" + value.RequestNo).removeClass().html("-- : -- : --");
                            }
                            else {
                                $("#timer_" + value.RequestNo).removeClass().html("00 : 00 : 00");
                            }
                        }
                    }
                    else {
                        $('#TicketingTimeline_Admin').remove();
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td class="text-center">' +
                            timerString + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a  onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#AdminTravelRequestGrid").append(newRow);
                    }
                });
                isLoadingData = false;
                GetHover();

                if (PageIndex == 1) {
                    $("#hdnShowCount").val(parseInt(response.data.length));
                    $("#AdminRequestTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                    $("#hdnConstantTotalResults").val(parseInt(response.count));
                }
                else {
                    CurrentCount = $("#hdnShowCount").val();
                    CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                    $("#hdnShowCount").val(parseInt(CurrentCount));
                    $("#AdminRequestTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
                if (!IsCBTSonata) {
                    var originalAdminGrid = $('#AdminRequestGrid tr.row_main:has(td)').map(function (i, v) {
                        var $td = $('td', this);
                        return {
                            id: ++i,
                            Company_Admin: $td.eq(0).text(),
                            RequestDate_Admin: $td.eq(1).text(),
                            RequestNo_Admin: $td.eq(2).text(),
                            TravelDestination_Admin: $td.eq(3).text(),
                            TravelStartDate_Admin: $td.eq(4).text(),
                            TicketingTimeLine_Admin: $td.eq(5).children()[0].getAttribute("data-CountTime"),
                            RequestStatus_Admin: $td.eq(6).text(),
                            TimeLine_Admin: $td.eq(5).text(),
                            Action_Admin: $td.eq(7).text()
                        }
                    }).get();
                }
                else {
                    var originalAdminGrid = $('#AdminRequestGrid tr.row_main:has(td)').map(function (i, v) {
                        var $td = $('td', this);
                        return {
                            id: ++i,
                            Company_Admin: $td.eq(0).text(),
                            RequestDate_Admin: $td.eq(1).text(),
                            RequestNo_Admin: $td.eq(2).text(),
                            TravelDestination_Admin: $td.eq(3).text(),
                            TravelStartDate_Admin: $td.eq(4).text(),
                            RequestStatus_Admin: $td.eq(5).text(),
                            TimeLine_Admin: $td.eq(6).text(),
                            Action_Admin: $td.eq(7).text()
                        }
                    }).get();
                }
                sessionStorage.originalAdminGrid = JSON.stringify(originalAdminGrid);
                if ($("#AdminTravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                    $("#AdminTravelRequestGrid").append(ViewAllRow);
                }
                $.unblockUI();
            }
            else {
                var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#AdminTravelRequestGrid").empty();
                $("#AdminRequestTabResultCount").empty();
                $("#AdminTravelRequestGrid").append(newRow);
                $.unblockUI();
            }
        }
     ,
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadAdminRequest()-->" + error)
    }
}

function checkUncheckFilterAdmin(filter) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var obj = {};
        var uncheckobj = {};
        var criteria = new Array();
        var filterCriteria = new Array();

        var status = $(filter).parent().html().split('>')[1];
        if (status.indexOf('TR-') >= 0)
            status = "Travel Request " + status.split('-')[1];
        if (status.indexOf('Itr.-') >= 0)
            status = "Itinerary " + status.split('-')[1];

        if ($(filter)[0].checked) {
            obj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
            criteria.push(status.toLowerCase());
        }
        else {
            uncheckobj[$(filter).parent().closest('div')[0].id] = status.toLowerCase();
            criteria.push(status.toLowerCase());
        }

        if ($('#StatusFilterAdmin input:checked').length > 0) {
            $('#StatusFilterAdmin input:checked').each(function () {

                var status = $(this).parent().html().split('>')[1];
                if (status.indexOf('TR-') >= 0)
                    status = "Travel Request " + status.split('-')[1];
                if (status.indexOf('Itr.-') >= 0)
                    status = "Itinerary " + status.split('-')[1];

                obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
                filterCriteria.push(status.toLowerCase());
            });
        }
        $.each(obj, function (key, value) {

            if (value.indexOf('travel request') >= 0) {
                var s = value.split(' ')[2];
                value = "TR-" + s[0].toUpperCase() + s.slice(1);
            }
            else if (value.indexOf('itinerary') >= 0) {
                var s = value.split(' ')[1];
                value = "Itr.-" + s[0].toUpperCase() + s.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }

            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)' checked='checked'>" + value + "</label></div>");
        });
        $.each(uncheckobj, function (key, value) {

            if (value.indexOf('travel request') >= 0) {
                var s = value.split(' ')[2];
                value = "TR-" + s[0].toUpperCase() + s.slice(1);
            }
            else if (value.indexOf('itinerary') >= 0) {
                var s = value.split(' ')[1];
                value = "Itr.-" + s[0].toUpperCase() + s.slice(1);
            }
            else {
                var s = value.split(' ');
                value = '';
                for (i = 0; i < s.length; i++) {
                    if (s[i] != '')
                        s[i] = s[i][0].toUpperCase() + s[i].slice(1);
                }
                value = s.join(' ');
            }

            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
        });
        if (!$.isEmptyObject(uncheckobj)) {
            $.each(uncheckobj, function (key, value) {
                for (var i in filterCriteria) {
                    if (filterCriteria[i] == value) {
                        filterCriteria.splice(i, 1);
                        break;
                    }
                }
            });
        }
        ApplyStatusFilterAdmin(filterCriteria);
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js checkUncheckFilterAdmin()-->" + error)
    }
}

function ApplyStatusFilterAdmin(criteria) {
    try {
        if (criteria.length > 0) {
            if (sessionStorage.originalAdminGrid != undefined) {
                originalAdminGrid = $.parseJSON(sessionStorage.originalAdminGrid);
                if (originalAdminGrid != '') {
                    $("#AdminTravelRequestGrid").empty();
                    $.each(originalAdminGrid, function (key, value) {
                        if (parseFloat($.inArray(value.RequestStatus_Admin.toLowerCase(), criteria)) >= 0) {
                            if (IsCBTSonata) {
                                $('#TicketingTimeline_Admin').remove();
                                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            }
                            else {
                                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td class="text-center"><span data-CountTime ="' + value.TicketingTimeLine_Admin + '" id="timer_' + value.RequestNo_Admin + '" class="rze-timer">' + value.TimeLine_Admin + '</span></td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            }
                            $("#AdminTravelRequestGrid").append(newRow);
                        }
                    });
                    if ($("#AdminTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                        $("#AdminTravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#AdminTravelRequestGrid").empty();
                        $("#AdminTravelRequestGrid").append(newRow);
                    }
                }
            }
        }
        else {
            ResetStatusFilterAdmin('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ApplyStatusFilterAdmin()-->" + error)
    }
}

function ResetStatusFilterAdmin(cond) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if (sessionStorage.originalAdminGrid != undefined) {
            originalAdminGrid = $.parseJSON(sessionStorage.originalAdminGrid);
            if (originalAdminGrid != '') {
                $("#AdminTravelRequestGrid").empty();
                $.each(originalAdminGrid, function (key, value) {
                    if (IsCBTSonata) {
                        $('#TicketingTimeline_Admin').remove();
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    }
                    else {
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td class="text-center"><span data-CountTime ="' + value.TicketingTimeLine_Admin + '" id="timer_' + value.RequestNo_Admin + '" class="rze-timer">' + value.TimeLine_Admin + '</span></td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    }
                    $("#AdminTravelRequestGrid").append(newRow);
                });
                if ($("#AdminTravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                    $("#AdminTravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
            }
        }
        if (cond == 'All') { // check all checkbox;
            var atr = $('#showingAllFilterAdmin').attr('onclick');
            var str = atr.split('All');
            var natr = str.join('Clear');
            $('#showingAllFilterAdmin').replaceWith('<input id="showingAllFilterAdmin" type="checkbox" checked="checked">');
            $('#showingAllFilterAdmin').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilterAdmin input').length > 0) {
                $('#StatusFilterAdmin input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "_Admin'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)' checked='checked'>" + value + "</label></div>");
                });
            }

        }
        if (cond == 'Clear')  // uncheck All Checkbox
        {
            var atr = $('#showingAllFilterAdmin').attr('onclick');
            var str = atr.split('Clear');
            var natr = str.join('All');
            $('#showingAllFilterAdmin').replaceWith('<input id="showingAllFilterAdmin" type="checkbox">');
            $('#showingAllFilterAdmin').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilterAdmin input').length > 0) {
                $('#StatusFilterAdmin input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "_Admin'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
                });
            }
        }
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetStatusFilterAdmin()-->" + error)
    }
}

function FilterRequest(tabname, Submit) {
    try {
        if (Submit) { PageIndex = 1 }
        if (PageIndex == 1) { $("#hdnShowCount").val("0"); }
        $("#hdnIsFilterApplied").val(true);
        $("#hdnFilterRequestType").val(tabname);

        var statusFilterApplied = "NoFilter";

        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var isApprover = $('#MyAssociate').hasClass("active");
        var isAdmin = $('#IsAdmin').val();
        if (isAdmin == 'false') {
            if (isApprover) {
                var myAssociates_RequestStartDate = new Date(moment($("#MyAssociates_RequestStartDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myAssociates_RequestStartDate == null || myAssociates_RequestStartDate == "" || myAssociates_RequestStartDate == undefined || myAssociates_RequestStartDate == "Invalid Date") {
                    $("#MyAssociates_RequestStartDate").val("");
                }
                var myAssociates_RequestEndDate = new Date(moment($("#MyAssociates_RequestEndDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myAssociates_RequestEndDate == null || myAssociates_RequestEndDate == "" || myAssociates_RequestEndDate == undefined || myAssociates_RequestEndDate == "Invalid Date") {
                    $("#MyAssociates_RequestEndDate").val("");
                }
                var myAssociates_RequestedDate = new Date(moment($("#MyAssociates_RequestedDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myAssociates_RequestedDate == null || myAssociates_RequestedDate == "" || myAssociates_RequestedDate == undefined || myAssociates_RequestedDate == "Invalid Date") {
                    $("#MyAssociates_RequestedDate").val("");
                }
                if (myAssociates_RequestStartDate != null && myAssociates_RequestStartDate != "" && myAssociates_RequestStartDate != undefined && myAssociates_RequestStartDate != "Invalid Date" && myAssociates_RequestEndDate != null && myAssociates_RequestEndDate != "" && myAssociates_RequestEndDate != undefined && myAssociates_RequestEndDate != "Invalid Date") {
                    if (IsInvalidDateRange(myAssociates_RequestStartDate, myAssociates_RequestEndDate) == true) {
                        $.unblockUI();
                        alertmsg("Travelled-From date is greater than Travelled-To date");
                        return false;
                    }
                }
                var company = '';
                var RequestStartDate = $('#MyAssociates_RequestStartDate').val();
                var RequestEndDate = $('#MyAssociates_RequestEndDate').val();
                var RequestedDate = $('#MyAssociates_RequestedDate').val();
                var RequestStatus = $('#MyAssociates_RequestStatus').val();
                var TripName = $('#MyAssociates_TripName').val();
                var TravellerName = $('#MyAssociates_TravellerName').val();
                var TravellerDestination = $('#MyAssociates_TravellerDestination').val();
                var RequestNo = $('#MyAssociates_RequestNo').val();
                var IsAdmin = false;
            }
            else {
                var myReq_RequestStartDate = new Date(moment($("#MyReq_RequestStartDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myReq_RequestStartDate == null || myReq_RequestStartDate == "" || myReq_RequestStartDate == undefined || myReq_RequestStartDate == "Invalid Date") {
                    $("#MyReq_RequestStartDate").val("");
                }
                var myReq_RequestEndDate = new Date(moment($("#MyReq_RequestEndDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myReq_RequestEndDate == null || myReq_RequestEndDate == "" || myReq_RequestEndDate == undefined || myReq_RequestEndDate == "Invalid Date") {
                    $("#MyReq_RequestEndDate").val("");
                }
                var myReq_RequestedDate = new Date(moment($("#MyReq_RequestedDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (myReq_RequestedDate == null || myReq_RequestedDate == "" || myReq_RequestedDate == undefined || myReq_RequestedDate == "Invalid Date") {
                    $("#MyReq_RequestedDate").val("");
                }
                if (myReq_RequestStartDate != null && myReq_RequestStartDate != "" && myReq_RequestStartDate != undefined && myReq_RequestStartDate != "Invalid Date" && myReq_RequestEndDate != null && myReq_RequestEndDate != "" && myReq_RequestEndDate != undefined && myReq_RequestEndDate != "Invalid Date") {
                    if (IsInvalidDateRange(myReq_RequestStartDate, myReq_RequestEndDate) == true) {
                        $.unblockUI();
                        alertmsg("Travelled-From date is greater than Travelled-To date");
                        return false;
                    }
                }
                var company = '';
                var RequestStartDate = $('#MyReq_RequestStartDate').val();
                var RequestEndDate = $('#MyReq_RequestEndDate').val();
                var RequestedDate = $('#MyReq_RequestedDate').val();
                var RequestStatus = $('#MyReq_RequestStatus').val();
                var TripName = $('#MyReq_TripName').val();
                var TravellerName = $('#MyReq_TravellerName').val();
                var TravellerDestination = $('#MyReq_TravellerDestination').val();
                var RequestNo = $('#MyReq_RequestNo').val();
                var IsAdmin = false;
            }
        }
        else {
            var requestStartDate_Admin = new Date(moment($("#RequestStartDate_Admin").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
            if (requestStartDate_Admin == null || requestStartDate_Admin == "" || requestStartDate_Admin == undefined || requestStartDate_Admin == "Invalid Date") {
                $("#RequestStartDate_Admin").val("");
            }
            var requestEndDate_Admin = new Date(moment($("#RequestEndDate_Admin").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
            if (requestEndDate_Admin == null || requestEndDate_Admin == "" || requestEndDate_Admin == undefined || requestEndDate_Admin == "Invalid Date") {
                $("#RequestEndDate_Admin").val("");
            }
            var requestedDate_Admin = new Date(moment($("#RequestedDate_Admin").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
            if (requestedDate_Admin == null || requestedDate_Admin == "" || requestedDate_Admin == undefined || requestedDate_Admin == "Invalid Date") {
                $("#RequestedDate_Admin").val("");
            }
            if (requestStartDate_Admin != null && requestStartDate_Admin != "" && requestStartDate_Admin != undefined && requestStartDate_Admin != "Invalid Date" && requestEndDate_Admin != null && requestEndDate_Admin != "" && requestEndDate_Admin != undefined && requestEndDate_Admin != "Invalid Date") {
                if (IsInvalidDateRange(requestStartDate_Admin, requestEndDate_Admin) == true) {
                    $.unblockUI();
                    alertmsg("Travelled-From date is greater than Travelled-To date");
                    return false;
                }
            }
            var IsAdmin = true;
            var company = $('#Company_Admin').val();
            var RequestStartDate = $('#RequestStartDate_Admin').val();
            var RequestEndDate = $('#RequestEndDate_Admin').val();
            var RequestedDate = $('#RequestedDate_Admin').val();
            var RequestStatus = $('#RequestStatus_Admin').val();
            var TripName = '';
            var TravellerName = '';
            var TravellerDestination = $('#TravellerDestination_Admin').val();
            var RequestNo = $('#RequestNo_Admin').val();
        }
        //if (RequestStartDate == "" && RequestEndDate == "") {
        var selectedMonth = new Date().getMonth() + 1;
        var selectedYear = new Date().getFullYear();
        RequestEndDate = convertDate(new Date(selectedYear, selectedMonth));
        //}
        var IsScroll = $('#hdnIsScroll').val();
        var defaultTakeCount = parseInt($('#DefaultTakeCount').val());
        if (IsScroll == "true") {
            var pageIndex = parseInt(PageIndex);
            var totalCnt = $("#hdnTotalResultsCount").val();
            var showCnt = $("#hdnShowCount").val();
            if (showCnt == totalCnt) {
                return false;
            }
            if (pageIndex > 1) {
                skipCount = (pageIndex - 1) * defaultTakeCount;
            }
            else {
                skipCount = 0;
            }
        }
        else {
            skipCount = 0;
        }


        var totalCount = $("#hdnConstantTotalResults").val();
        var UserId = $('#hdnUserId').val();
        var corporateId = $('#hdncorporateId').val();
        var RequestFilterCriteria = {
            TripName: TripName,
            TravellerName: TravellerName,
            TravellerDestination: TravellerDestination,
            RequestStartDate: RequestStartDate,
            RequestEndDate: RequestEndDate,
            RequestNo: RequestNo,
            RequestedDate: RequestedDate,
            RequestStatus: RequestStatus,
            isApprover: isApprover,
            UserId: UserId,
            corporateId: corporateId,
            isAdmin: IsAdmin,
            company: company
        };
        isLoadingData = true;
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/FilterTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + totalCount + "/" + statusFilterApplied,
        "POST",
           RequestFilterCriteria,
        function (response) {
            if (isAdmin == 'false') {
                if (!isApprover) {
                    if (response.data.length > 0) {
                        if (PageIndex == 1) { $("#MyReq_TravelRequestGrid").empty(); }
                        $.each(response.data, function (key, value) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#MyReq_TravelRequestGrid").append(newRow);
                        });

                        isLoadingData = false;

                        if ($("#MyReq_TravelRequestGrid").children().length > 0) {
                            var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                            $("#MyReq_TravelRequestGrid").append(ViewAllRow);
                            GetHover();
                        }
                        SearchToggle(tabname);
                        HideSearchToggle(tabname);
                        $.unblockUI();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#MyReq_TravelRequestGrid").empty();
                        $("#MyReq_TravelRequestGrid").append(newRow);
                        SearchToggle(tabname);
                        $.unblockUI();
                    }
                    if (PageIndex == 1) {
                        $("#hdnShowCount").val(parseInt(response.data.length));
                        $("#requestTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                    else {
                        CurrentCount = $("#hdnShowCount").val();
                        CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                        $("#hdnShowCount").val(parseInt(CurrentCount));
                        $("#requestTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                }
                else {
                    if (response.data.length > 0) {
                        if (PageIndex == 1) { $("#MyAssociates_TravelRequestGrid").empty(); }
                        $.each(response.data, function (key, value) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub hidden-xs hidden-sm"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#MyAssociates_TravelRequestGrid").append(newRow);
                        });
                        isLoadingData = false;
                        if ($("#MyAssociates_TravelRequestGrid").children().length > 0) {
                            var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                            $("#MyAssociates_TravelRequestGrid").append(ViewAllRow);
                            GetHover();
                        }
                        SearchToggle(tabname);
                        HideSearchToggle(tabname);
                        $.unblockUI();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#MyAssociates_TravelRequestGrid").empty();
                        $("#MyAssociates_TravelRequestGrid").append(newRow);
                        SearchToggle(tabname);
                        $.unblockUI();
                    }
                    if (PageIndex == 1) {
                        $("#hdnShowCount").val(parseInt(response.data.length));
                        $("#requestMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                    else {
                        CurrentCount = $("#hdnShowCount").val();
                        CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                        $("#hdnShowCount").val(parseInt(CurrentCount));
                        $("#requestMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                }
            }
            else {
                var i = 0;
                var rotator;
                if (response.data.length > 0) {
                    if (PageIndex == 1) { $("#AdminTravelRequestGrid").empty(); }
                    $.each(response.data, function (key, value) {
                        if (!IsCBTSonata) {
                            var countDownTime = new Date(value.TicketingTimeLine).getTime();
                            var timerString = '';

                            // Allow timer stirng when booking submitted.
                            if (value.RequestStatusValue == 10) {
                                timerString = '<span data-CountTime ="' + countDownTime + '" id="timer_' + value.RequestNo + '" class="rze-timer">' + value.TicketingTimeLine + '</span>';
                            } else {
                                timerString = '<span data-CountTime ="' + 0 + '" id="timer_' + value.RequestNo + '" ></span>';
                            }

                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td class="text-center">' +
                                timerString + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a  onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';

                            $("#AdminTravelRequestGrid").append(newRow);

                            if (value.RequestStatusValue == 10) {
                                timerCnt++;
                                var Timerfunction = function StartTimers() {
                                    var StartDate = new Date();
                                    StartDate = StartDate.getTime();
                                    var countDownDate = new Date(value.TicketingTimeLine).getTime();
                                    // Find the distance between now an the count down date
                                    var distance = countDownDate - StartDate;
                                    // Time calculations for days, hours, minutes and seconds
                                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                    if (days > 0)
                                        $("#timer_" + value.RequestNo).html(days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s ");
                                    else if (hours > 0)
                                        $("#timer_" + value.RequestNo).html(hours + "h : " + minutes + "m : " + seconds + "s");
                                    else
                                        $("#timer_" + value.RequestNo).html(minutes + "m : " + seconds + "s ");
                                    // If the count down is over, write some text
                                    if (distance < 0) {
                                        clearInterval(Timerfunction);
                                        $("#timer_" + value.RequestNo).html("EXPIRED");
                                    }
                                }
                                rotator = setInterval(Timerfunction, 1000);
                                Timerfunction();
                                intervals.push(rotator);
                                i++;
                            }
                            else {
                                if (value.RequestStatusValue == 9) {
                                    $("#timer_" + value.RequestNo).removeClass().html("-- : -- : --");
                                }
                                else {
                                    $("#timer_" + value.RequestNo).removeClass().html("00 : 00 : 00");
                                }
                            }
                        }
                        else {
                            $('#TicketingTimeline_Admin').remove();
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td>'
                                + '<td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a  onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';

                            $("#AdminTravelRequestGrid").append(newRow);
                        }
                    });
                    isLoadingData = false;
                    GetHover();
                    if ($("#AdminTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'></td></tr>";
                        $("#AdminTravelRequestGrid").append(ViewAllRow);
                    }
                    SearchToggle(tabname);
                    HideSearchToggle(tabname);
                    $.unblockUI();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#AdminTravelRequestGrid").empty();
                    $("#AdminRequestTabResultCount").empty();
                    $("#AdminTravelRequestGrid").append(newRow);
                    SearchToggle(tabname);
                    $.unblockUI();
                }
                if (PageIndex == 1) {
                    $("#hdnShowCount").val(parseInt(response.data.length));
                    $("#AdminRequestTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
                else {
                    CurrentCount = $("#hdnShowCount").val();
                    CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                    $("#hdnShowCount").val(parseInt(CurrentCount));
                    $("#AdminRequestTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
            }
            //if (tabname.toLowerCase() != 'myrequest')
            //    ResetStatusFilterAssociates('clear');
            //else
            //    ResetStatusFilter('clear');
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js FilterRequest()-->" + error)
    }
}

function convertDate(str) {
    try {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    catch (error) {
        $().Logger.error("TravelRequest.js convertDate()-->" + error)
    }
}

function GetHover() {
    try {
        $('.table-action div').hide();

        $('tr.row_main').mouseenter(function () {
            $(".table-action div").hide();
            $(this).next('tr').find(".table-action div").show();

            /*initially making white bg*/
            $('tr.row_main').css('background', '#fff');
            $('tr.row_sub').css('background', '#fff');

            /*Find two row and changing background color*/
            $(this).css('background', '#ccc');
            $(this).next('tr.row_sub').css('background', '#ccc')
        });

        $('tr.row_sub').mouseenter(function () {

            $('tr.row_main').css('background', '#fff')
            $(this).prev('tr.row_main').css('background', '#ccc')

        });
        $('tr.row_sub').mouseleave(function () {
            $('tr.row_main').css('background', '#fff')
            $(this).prev('tr.row_main').css('background', '#ccc')


        });
    }
    catch (error) {
        $().Logger.error("TravelRequest.js GetHover()-->" + error)
    }
}
// Close model popup.

function closeModel() {
    try {
        $('#tremp-search').modal('hide');
        $('#textTravellerName' + parseInt($("#hdnTravellerId").val())).focus();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js closeModel()-->" + error)
    }
}
// For next traveller.

function ShowTraveller(row) {
    ShowModel(row);
}

// Show model popup.
function ShowModel(row) {
    try {
        if ($("#hdnProjectId").val() == "") {
            $('#lblTravelRequestProject').html('Please search valid project.');
            return false;
        }
        else {
            $('#tremp-search').modal('show');
            $("#SearchEmployeeCode").val('');
            $("#SearchEmployeeName").val('');
            $("#hdnTravellerId").val(row);
            LoadTravellers(row);
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ShowModel()-->" + error)
    }
}

// Generate the travellers.
function TravellerName(value) {
    try {
        // should not when adding 
        if ($('#IsEditFlow').val() == "true") {
            var clonecont = $("#rza_addemp-clone").html();
            clonecont = clonecont.replace("rza_addemp - clone", "rza_addemp - clone" + value);
            clonecont = clonecont.replace("rza-empremove", "rza-empremove" + value);
            clonecont = clonecont.replace(new RegExp("lblTravellerName", "ig"), "lblTravellerName" + value);
            clonecont = clonecont.replace(new RegExp("textTravellerName", "ig"), "textTravellerName" + value);
            clonecont = clonecont.replace(new RegExp("AutoTravellerName", "ig"), "AutoTravellerName" + value);
            clonecont = clonecont.replace(new RegExp("hdnGrade", "ig"), "hdnGrade" + value);
            clonecont = clonecont.replace(new RegExp("hdnEmployeeId", "ig"), "hdnEmployeeId" + value);
            clonecont = clonecont.replace(new RegExp("SearchTraveller", "ig"), "SearchTraveller" + value);
            clonecont = clonecont.replace("DeleteTravellers();", "DeleteTravellers(" + value + ");");
            clonecont = clonecont.replace(new RegExp("closeTraveller", "ig"), "closeTraveller" + value);
            clonecont = clonecont.replace("ShowModel();", "ShowModel(" + value + ");");
            clonecont = clonecont.replace("ShowTraveller();", "ShowTraveller(" + value + ");");
            clonecont = clonecont.replace(new RegExp("lbltxtTravellerName", "ig"), "lbltxtTravellerName" + value);
            $("#rza_addemp-clonecont").append(clonecont);
        }
        var row = parseFloat($("#hdnTravellerId").val()) + 1;
        $("#hdnTravellerId").val(row);
        LoadTravellers(row);
    }
    catch (error) {
        $().Logger.error("TravelRequest.js TravellerName()-->" + error)
    }
}

// Number of travellers increment and decrement flow
function roomDecrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count > 1) {
            $inputTxt.val(parseInt($inputTxt.val()) - 1);

            //Remove Content
            $(".dp-PaxClonecont .dp-PaxCol:last-child").remove();
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js roomDecrementValue()-->" + error)
    }
}

function roomIncrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count < 7) {
            $inputTxt.val(parseInt($inputTxt.val()) + 1);

            //Load Content
            var $clonecont = $(".dp_pax-clone").html();
            $clonecont.replace("lblTraveller", "lblTraveller" + $count);
            $clonecont.replace("TravellerName", "TravellerName" + $count);
            $clonecont.replace("#TravellerName", "Traveller-" + $count + " Name");
            $(".dp-PaxClonecont").append($clonecont);
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js roomIncrementValue()-->" + error)
    }

}

// Countries.
function LoadCountries() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/Country/Countries",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestCountry").html("");
                $("#TravelRequestCountry").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestCountry").append("<option value='" + response[count].LocationId + "'>" + response[count].LocationValue + "</option>");
                }
            }
        },
       function (XMLHttpRequest, textStatus, errorThrown) {
           Error(XMLHttpRequest, textStatus, errorThrown);
       },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadCountries()-->" + error)
    }
}

// Countries based on travel type.
function CountryDetails() {
    try {
        var travelType = $("#TravelRequestType option:Selected").val();
        $("#lbltxtTravellerName1").val('');
        if ($("#hdnEmployeeId1").val() == 0) {
            $("#lbltxtTravellerName1").val('Please select traveller one.');
            return false;
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/Country/" + travelType + "/Countries/" + $("#hdnEmployeeId1").val(),
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestCountry").html("");
                $("#TravelRequestCountry").append("<option value='0'>Select</option>");

                $("#TravelRequestState").html("");
                $("#TravelRequestState").append("<option value='0'>Select</option>");

                $("#TravelRequestCity").html("");
                $("#TravelRequestCity").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestCountry").append("<option value='" + response[count].CountryId.toString() + "'>" + response[count].Name.toString() + "</option>");
                }
            }
            $.unblockUI();
        },
       function (XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest);
       },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js CountryDetails()-->" + error)
    }
}

// Error handler.
function Error(XMLHttpRequest, textStatus, errorThrown) {
    var object = $.parseJSON(XMLHttpRequest.responseText);
    try {
        if (XMLHttpRequest.status == 12031) {
        }
        else if (XMLHttpRequest.status == 500) {
        }
        else if (XMLHttpRequest.status == 400 || XMLHttpRequest.status == 404) {
            alertmsg(object.Message)
        }
        else {
            alertmsg('error');
        }
    }
    catch (e) {
        alertmsg(e);
    }
}

// States.
function LoadStates() {

    try {
        if ($("#TravelRequestCountry").val() == 0)
        { return false; }
        $("#TravelRequestCity").html("");
        $("#TravelRequestCity").append("<option value='0'>Select</option>");
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/State/" + $("#TravelRequestCountry").val() + "/States",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestState").html("");
                $("#TravelRequestState").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestState").append("<option value='" + response[count].StateId + "'>" + response[count].Name + "</option>");
                }

            }

        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadStates()-->" + error)
    }
}

// Cities.
function LoadCities() {
    try {
        if ($("#TravelRequestState").val() == 0)
        { return false; }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/City/" + $("#TravelRequestState").val() + "/Cities",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestCity").html("");
                $("#TravelRequestCity").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestCity").append("<option value='" + response[count].CityId + "'>" + response[count].Name + "</option>");
                }
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadStates()-->" + error)
    }
}

function LoadStatus() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/GetTravelRequestStatus",
        "POST",
        null,
        function (response) {
            var cnt = parseFloat('1');
            $.each(response, function (key, value) {
                if (key == '0')
                    value = "All";
                else {
                    if (value.indexOf("Travel Request") >= 0) {
                        value = "TR-" + value.split(' ')[2];
                    }
                    else {
                        if (value.indexOf("Itinerary") >= 0)
                            value = "Itr.-" + value.split(' ')[1];
                    }
                }
                if (key > 8 || value == "All") {
                    $("#StatusFilterAdmin").append("<div id='" + cnt + "_Admin'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
                    $("#RequestStatus_Admin").append("<option value='" + key + "'>" + value + "</option>");
                }
                $("#MyReq_RequestStatus").append("<option value='" + key + "'>" + value + "</option>");
                $("#MyAssociates_RequestStatus").append("<option value='" + key + "'>" + value + "</option>");
                if (value != "All") {
                    $("#MyReq_StatusFilter").append("<div id='" + cnt + "_MyReq'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                    $("#MyAssociates_StatusFilter").append("<div id='" + cnt + "_MyAssociates'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAssociates(this)'>" + value + "</label></div>");
                    cnt = cnt + 1;
                }
            });
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadStatus()-->" + error)
    }
}

// Countries.
function LoadTravelType() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/TravelTypeDetails",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestType").html("");
                $("#TravelRequestType").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestType").append("<option value='" + response[count].TravelTypeId + "'>" + response[count].TravelTypeValue + "</option>");
                }
            }

        },
           function (XMLHttpRequest, textStatus, errorThrown) {
               console.log(XMLHttpRequest);
           },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadTravelType()-->" + error)
    }
}

//Mode Of Travel
function LoadTravelModes() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/TravelModeDetails",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestModeOfTravel").html("");
                $("#TravelRequestModeOfTravel").append("<option value='0'>Select</option>");
                for (count in response) {
                    $("#TravelRequestModeOfTravel").append("<option value='" + response[count].TravelModeId + "'>" + response[count].TravelModeValue + "</option>");
                }
            }

        },
           function (XMLHttpRequest, textStatus, errorThrown) {
               console.log(XMLHttpRequest);
           },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadTravelModes()-->" + error)
    }
}

function LoadTravelCurrency() {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/CurrencyDetails",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestCurrency").html("");
                $("#TravelRequestAdvForexCurrency").html("");
                $("#TravelRequestCurrency").append("<option value='00000000-0000-0000-0000-000000000000'>Select</option>");
                $("#TravelRequestAdvForexCurrency").append("<option value='00000000-0000-0000-0000-000000000000'>Select</option>");
                for (count in response) {
                    $("#TravelRequestCurrency").append("<option value='" + response[count].CurrencyId + "'>" + response[count].Description + ' (' + response[count].Code + ')' + "</option>");
                    $("#TravelRequestAdvForexCurrency").append("<option value='" + response[count].CurrencyId + "'>" + response[count].Description + ' (' + response[count].Code + ')' + "</option>");
                }
            }

        },
           function (XMLHttpRequest, textStatus, errorThrown) {
               console.log(XMLHttpRequest);
           },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadTravelCurrency()-->" + error)
    }
}

function OnChangeRequestType() {
    try {
        $("#TravelRequestCountry").html("").append("<option value='0'>Select</option>");
        $("#TravelRequestState").html("").append("<option value='0'>Select</option>");
        $("#TravelRequestCity").html("").append("<option value='0'>Select</option>");
        validateRequestType();
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadTravelType()-->" + error)
    }
}

function validateRequestType() {

    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        $("#lbltxtTravellerName1").val('');
        if ($("#hdnEmployeeId1").val() == 0) {
            $("#lbltxtTravellerName1").html('Please select atleast one traveller.');
            $.unblockUI();
            return false;
        }

        if ($("#TravelRequestType option:Selected").val() == "0") {
            $("#lblTravelRequestType").html("Please select travel type.");
            $.unblockUI();
            return false;
        }
        else {
            $("#lblTravelRequestType").html('');
            if ($("#TravelRequestCountry option:Selected").val() == "0") {
                setTimeout(function () {
                    CountryDetails();
                }, 200);

            }
        }
        return true;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js validateRequestType()-->" + error)
    }
}

function validateTravelRequestCountry() {
    try {
        if ($("#TravelRequestCountry option:Selected").val() == "0") {
            $("#TravelRequestState").html("");
            $("#TravelRequestState").append("<option value='0'>Select</option>");
            $("#lblTravelRequestCountry").html("Select country.");
            return false;
        }
        else {
            $("#lblTravelRequestCountry").html('');
        }

        return true;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js validateTravelRequestCountry()-->" + error)
    }
}

function validateTravelRequestState() {
    try {
        if ($("#TravelRequestState option:Selected").val() == "0") {
            $("#TravelRequestCity").html("");
            $("#TravelRequestCity").append("<option value='0'>Select</option>");
            $("#lblTravelRequestState").html("Select state.");
            return false;
        }
        else {
            $("#lblTravelRequestState").html('');
        }

        return true;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js validateTravelRequestState()-->" + error)
    }
}

function validateTravelRequestCity() {
    try {
        if ($("#TravelRequestCity option:Selected").val() == "0") {
            $("#lblTravelRequestCity").html("Select city.");
            return false;
        }
        else {
            $("#lblTravelRequestCity").html('');
        }

        return true;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js validateTravelRequestCity()-->" + error)
    }
}

// The travellers.
function LoadTravellers(row) {
    try {
        var count = parseInt($("#hdnTravellerTypeCount").val());
        var secondTime = false;
        var ids = '';
        for (var i = 1; i <= count; i++) {
            if ($("#hdnEmployeeId" + i).val() != '' && $("#hdnEmployeeId" + i).val() != undefined) {
                if (secondTime == false)
                    ids = $("#hdnEmployeeId" + i).val();
                else
                    ids = ids + ',' + $("#hdnEmployeeId" + i).val();
                secondTime = true;
            }
        }
        $("#SearchEmployeeCode").focus();
        var url = '';
        $("#modelGrid").html('');
        if (row == 1) {
            if ($("#hdnEmployeeId1").val() == "") {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers";
            }
            else {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val();
            }
        }
        else {
            // projectid, employeeid, garderid, countryid.
            //url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + $("#hdnGrade1").val() + "/" + $("#hdnFirstLevelApproverID").val() + "/" + $("#hdnSecondLevelApproverID").val() + "/" + $("#hdnThirdLevelApproverID").val() + "/" + $("#hdntravellerIds").val();
            url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + $("#hdnGrade1").val() + "/" + $("#hdnFirstLevelApproverID").val() + "/" + $("#hdnSecondLevelApproverID").val() + "/" + $("#hdnThirdLevelApproverID").val() + "/" + ids;
        }

        //GetTraveller(url);
        GetAutoCompleteTraveller(url, row);
    }
    catch (error) {
        $().Logger.error("TravelRequest.js LoadTravellers()-->" + error)
    }
}

// Select traveller.
function SelectFunction(gradeId, employeeId, employeeName, FirstLevelApproverID, SecondLevelApproverID, ThirdLevelApproverID) {
    try {
        var row = $("#hdnTravellerId").val();
        if ($("#hdnEmployeeId" + row).val() != "" && $("#hdnEmployeeId" + row).val() != employeeId) {

            // Remove other travellers once change in first traveller.
            var count = parseInt($("#hdnTravellerTypeCount").val());
            for (var i = 1; i <= count; i++) {
                if (row != i) {
                    DeleteTravellers(i);

                }
            }
        }

        $("#textTravellerName" + row).val(employeeName);
        $("#hdnEmployeeId" + row).val(employeeId);
        $("#hdnGrade" + row).val(gradeId);
        $('#tremp-search').modal('hide');
        $("#lbltxtTravellerName" + row).html("");
        // commented below bcoz - should able to change traveller which is previously selected.
        if (row == 1) {
            $("#addMoreTraveller").removeClass('hide');
            $("#hdnFirstLevelApproverID").val(FirstLevelApproverID);
            $("#hdnSecondLevelApproverID").val(SecondLevelApproverID);
            $("#hdnThirdLevelApproverID").val(ThirdLevelApproverID);
            LoadTravelType();
            $("#hdntravellerIds").val(employeeId);
        }
        else {
            $("#hdntravellerIds").val($("#hdntravellerIds").val() + "," + employeeId);
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js SelectFunction()-->" + error)
    }
}

// Call api to get travellers.
function GetAutoCompleteTraveller(url, row) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            url,
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                var value = row;
                var LoggedInUser = '';
                if ($('#IsEditFlow').val() == "false") {
                    // should not when edit flow
                    if (row != 1 && $("#AutoTravellerName" + (value - 1)).val() != "") {
                        var clonecont = $("#rza_addemp-clone").html();
                        clonecont = clonecont.replace("rza_addemp - clone", "rza_addemp - clone" + value);
                        clonecont = clonecont.replace("rza-empremove", "rza-empremove" + value);
                        clonecont = clonecont.replace(new RegExp("lblTravellerName", "ig"), "lblTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("textTravellerName", "ig"), "textTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("AutoTravellerName", "ig"), "AutoTravellerName" + value);
                        clonecont = clonecont.replace(new RegExp("hdnGrade", "ig"), "hdnGrade" + value);
                        clonecont = clonecont.replace(new RegExp("hdnEmployeeId", "ig"), "hdnEmployeeId" + value);
                        clonecont = clonecont.replace(new RegExp("SearchTraveller", "ig"), "SearchTraveller" + value);
                        clonecont = clonecont.replace("DeleteTravellers();", "DeleteTravellers(" + value + ");");
                        clonecont = clonecont.replace(new RegExp("closeTraveller", "ig"), "closeTraveller" + value);
                        clonecont = clonecont.replace("ShowModel();", "ShowModel(" + value + ");");
                        clonecont = clonecont.replace("ShowTraveller();", "ShowTraveller(" + value + ");");
                        clonecont = clonecont.replace(new RegExp("lbltxtTravellerName", "ig"), "lbltxtTravellerName" + value);
                        $("#rza_addemp-clonecont").append(clonecont);
                    }
                }
                for (count in response) {
                    if (row == 1 && $('#IsEditFlow').val() == "false") {
                        if (response[count].EmployeeName.indexOf("_Myself") != -1) {
                            LoggedInUser = count;
                            response[count].EmployeeName = response[count].EmployeeName.split('_')[0];
                            $('#IsDefaultTravellerLoaded').val('false');
                        }
                    }
                    response[count].id = response[count].CorporateGradeID + "," + response[count].EmployeeId + ",'" + response[count].EmployeeName + "'," + response[count].FirstLevelApproverID + "," + response[count].SecondLevelApproverID + "," + response[count].ThirdLevelApproverID + "," + response[count].GradeName + "," + response[count].CorporateID + "," + response[count].HasApprovers;
                    response[count].value = response[count].EmployeeName + "-" + response[count].EmployeeCode;
                }
                if (LoggedInUser != '') {
                    $("#AutoTravellerName" + row).val(response[LoggedInUser].EmployeeName.split('_')[0] + ' - ' + response[LoggedInUser].EmployeeCode);
                    $("#TravelRequestTravellerGrade").val(response[LoggedInUser].GradeName);
                    if (IsCBTSonata == true) {
                        if (response[LoggedInUser].id.split(',')[8] == 'false') {
                            $('#AutoApprover').css('display', 'block');
                            GetAutoCompleteApprover(response[LoggedInUser].CorporateID, response[LoggedInUser].EmployeeId, response[LoggedInUser].HasApprovers)
                        }
                        else {
                            $('#AutoApprover').css('display', 'none');
                        }
                    }

                    $("#hdnTravellerId").val(row);
                    $("#hdnTravellerTypeCount").val(row);
                    SelectFunction(response[LoggedInUser].id.split(',')[0], response[LoggedInUser].id.split(',')[1], response[LoggedInUser].id.split(',')[2], response[LoggedInUser].id.split(',')[3], response[LoggedInUser].id.split(',')[4], response[LoggedInUser].id.split(',')[5]);
                }
                else {
                    if ($("#AutoTravellerName" + row).val() != '' && $('#IsEditFlow').val() == "false") {
                        $("#AutoTravellerName" + row).val('');
                        $("#hdnEmployeeId" + row).val('');
                        $("#hdnGrade" + row).val('');
                        $("#TravelRequestTravellerGrade").val('');
                    }
                }
                $("#AutoTravellerName" + row).autocomplete({
                    source: response,
                    select: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#lbltxtTravellerName' + row).html('Please search valid traveller');
                            $("#TravelRequestTravellerGrade").val('');
                        }
                        else {
                            $("#hdnTravellerId").val(row);
                            $("#hdnTravellerTypeCount").val(row);
                            SelectFunction(ui.item.id.split(',')[0], ui.item.id.split(',')[1], ui.item.id.split(',')[2], ui.item.id.split(',')[3], ui.item.id.split(',')[4], ui.item.id.split(',')[5]);
                            $("#AutoTravellerName" + row).val(ui.item.value);
                            $('#IsDefaultTravellerLoaded').val('true');
                            $('#lbltxtTravellerName' + row).html('');
                            $("#TravelRequestTravellerGrade").val(ui.item.id.split(',')[6]);
                            if (IsCBTSonata == true) {
                                if (ui.item.id.split(',')[8] == 'false') {
                                    $('#AutoApprover').css('display', 'block');
                                    GetAutoCompleteApprover(ui.item.id.split(',')[7], ui.item.id.split(',')[1], ui.item.id.split(',')[8]);
                                }
                                else {
                                    $('#AutoApprover').css('display', 'none');
                                }
                            }
                            $.unblockUI();
                            return false;
                        }
                    },
                    change: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#lbltxtTravellerName' + row).html('Please search valid traveller');
                            $("#TravelRequestTravellerGrade").val('');
                        }
                    }
                });
                if ($('#IsEditFlow').val() == "true") {
                    $("#TravelRequestTravellerGrade").val(response[0].GradeName);
                }
                $.unblockUI();
            }
            else {
                if ($('#IsEditFlow').val() == "false") {
                    DeleteTravellers(row);
                    $('#lblTravellerError').html('No more travellers are available');
                    $("#AutoTravellerName" + row).val('');
                }
                $.unblockUI();
            }
            $.unblockUI();
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            alertmsg("GetTraveller");
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js GetAutoCompleteTraveller()-->" + error)
    }
}

function GetAutoCompleteApprover(corporateID, employeeID, hasApprovers) {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/Traveller/Approvers/" + corporateID + "/" + employeeID,
            "GET",
            null,
            function (response) {
                if (response != null && response.count != 0) {
                    for (count in response) {
                        //if (row == 1 && $('#IsEditFlow').val() == "false") {
                        //    if (response[count].EmployeeName.indexOf("_Myself") != -1) {
                        //        LoggedInUser = count;
                        //        response[count].EmployeeName = response[count].EmployeeName.split('_')[0];
                        //        $('#IsDefaultTravellerLoaded').val('false');
                        //    }
                        //}
                        response[count].id = response[count].ApproverId
                        response[count].value = response[count].ApproverName;
                    }
                    var Approver = response;

                    //if ($('#IsApprover').is(":checked")) {
                    //    $("#corpEmpSubApprover").css("display", "block");
                    //}
                    //else {
                    //    $("#corpEmpSubApprover").css("display", "none");
                    //}
                    $("#AutoApproverName").autocomplete({
                        source: Approver,
                        select: function (event, ui) {
                            if (ui.item === null) {
                                $(this).val('');
                                $('#lblAutoApproverNameError').html('Please search valid Approver');
                                $("#TravelRequestTravellerGrade").val('');
                            }
                            else {
                                //$("#hdnTravellerId").val(row);
                                //$("#hdnTravellerTypeCount").val(row);
                                //SelectFunction(ui.item.id.split(',')[0], ui.item.id.split(',')[1], ui.item.id.split(',')[2], ui.item.id.split(',')[3], ui.item.id.split(',')[4], ui.item.id.split(',')[5]);
                                $("#AutoApproverName").val(ui.item.value);
                                $("#ApproverID").val(ui.item.id);
                                $.unblockUI();
                                return false;
                            }
                        },
                        change: function (event, ui) {
                            if (ui.item === null) {
                                $(this).val('');
                                $('#lblAutoApproverNameError').html('Please search valid Approver');
                            }
                            else {
                                $("#AutoApproverName").val(ui.item.value);
                                $("#ApproverID").val(ui.item.id);
                            }
                        }
                    });
                }
            },
            "json");
    }
    catch (e) {
        $().Logger.error("TravelRequest.js  GetAutoCompleteApprover()-->" + error)
    }
}

// Call api to get travellers.
function GetTraveller(url) {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            url,
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                var clone = $("#rza_addemp-Row-clone").html();
                var cloneHtml = '';
                for (count in response) {
                    var clonecont = clone;
                    clonecont = clonecont.replace("selectTraveller", "selectTraveller" + response[count].EmployeeId);
                    clonecont = clonecont.replace("SelectFunction()", "SelectFunction(" + response[count].CorporateGradeID + "," + response[count].EmployeeId + ",'" + response[count].EmployeeName + "'," + response[count].FirstLevelApproverID + "," + response[count].SecondLevelApproverID + "," + response[count].ThirdLevelApproverID + ")");
                    clonecont = clonecont.replace("#EmployeeCode#", response[count].EmployeeCode);
                    clonecont = clonecont.replace("#EmployeeName#", response[count].EmployeeName);
                    clonecont = clonecont.replace("#WorkLocation#", response[count].ProjectLocation);
                    clonecont = clonecont.replace("#Project#", response[count].ProjectName);
                    cloneHtml = cloneHtml + "<tr>" + clonecont + "</tr>";
                    $("#selectTraveller" + response[count].EmployeeId).attr("tabIndex", "0");
                }

                $("#modelGrid").html(cloneHtml);
            }
            else {

                $("#modelGrid").html("<tr><td colspan='5' align='center'>" + 'No travellers found.' + "</td></tr>");
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            alertmsg("GetTraveller");
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js GetTraveller()-->" + error)
    }
}

// Search travellers.
function SearchTraveller() {
    try {
        var url = '';
        var employeeCode = $("#SearchEmployeeCode").val();
        var employeeName = $("#SearchEmployeeName").val();
        if (employeeCode == '')
            employeeCode = null;
        if (employeeName == '')
            employeeName = null;
        var row = $("#hdnTravellerId").val();
        if (row == 1) {
            if ($("#hdnEmployeeId1").val() == "") {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/0/" + employeeCode + "/" + employeeName;
            }
            else if ($("#hdnEmployeeId1").val() != "") {
                url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + employeeCode + "/" + employeeName;
            }
        }
        else {
            url = "TravelRequest/Traveller/" + $("#hdnProjectId").val() + "/Travellers/" + $("#hdnEmployeeId1").val() + "/" + $("#hdnGrade1").val() + "/" + $("#hdnFirstLevelApproverID").val() + "/" + $("#hdnSecondLevelApproverID").val() + "/" + $("#hdnThirdLevelApproverID").val() + "/" + $("#hdntravellerIds").val() + "/" + employeeCode + "/" + employeeName;
        }

        GetTraveller(url);
    }
    catch (error) {
        $().Logger.error("TravelRequest.js SearchTraveller()-->" + error)
    }
}

function AllowAlphaNumerics(id) {
    try {
        $('#' + id).keypress(function (e) {
            if (e.charCode == 8 || e.charCode == 0) {
                return;
            }
            else {
                var regex = new RegExp("^[a-zA-Z0-9]+$");
                var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                if (regex.test(str)) {
                    return true;
                }
                e.preventDefault();
            }
            return false;
        });
    }
    catch (error) {
        $().Logger.error("TravelRequest.js AlphaNumerics()-->" + error)
    }
}

// Save travel request.
function SaveTravelRequest(file) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if ($("#TravelRequestName").val() == "") {
            $("#lblTravelRequestTripName").html('Please enter Trip Name.');
            $("#TravelRequestName").focus();
            $.unblockUI();
            return false;
        }
        else {
            $("#lblTravelRequestTripName").html('');
        }
        if ($("#TravelRequestProject").val() == "") {
            $("#lblTravelRequestProject").html('Please search Project.');
            $("#TravelRequestProject").focus();
            $.unblockUI();
            return false;
        }
        else {
            $("#lblTravelRequestProject").html('');
        }

        //if ($("#TravelRequestReason").val() == "") {
        //    $("#lblTravelRequestReason").html('Please enter purpose for travel.');
        //    $("#TravelRequestReason").focus();
        //    $.unblockUI();
        //    return false;
        //}
        //else {
        //    $("#lblTravelRequestReason").html('');
        //}
        // Validate travellers.
        var count = parseInt($("#hdnTravellerTypeCount").val());
        for (var i = 1; i <= count; i++) {
            if ($("#AutoTravellerName" + i).val() == "") {
                $("#lbltxtTravellerName" + i).html("Please select Traveller.");
                $("#AutoTravellerName" + i).focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lbltxtTravellerName" + i).html("");
            }
        }
        if (IsCBTSonata == true) {

            // Validate Approver
            if ($('#AutoApprover').is(':visible'))
            {
                if ($('#AutoApproverName').val() == "")
                {
                    $('#lblAutoApproverNameError').html('Please select Approver.');
                    $('#AutoApproverName').focus();
                    $.unblockUI();
                    return false;
                }
                else {
                    $('#lblAutoApproverNameError').html('');
                }
            }

            //Is TravelCost Billable
            if ($("#TravelRequestIsBillable").val() == "") {
                $("#lblTravelRequestIsBillable").html('Please select Travel Cost Billable.');
                $("#TravelRequestIsBillable").focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lblTravelRequestIsBillable").html('');
            }

            //Long Term Assignment
            if ($("#TravelRequestLongTermAssignment").val() == "") {
                $("#lblTravelRequestLongTermAssignment").html('Please select Long Term Assignment');
                $("#TravelRequestLongTermAssignment").focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lblTravelRequestLongTermAssignment").html('');
            }

            //Spouse or Family Ticket
            //if ($("#TravelRequestFamilyTicket").val() == "") {
            //    $("#lblTravelRequestFamilyTicket").html('Please select');
            //    $("#TravelRequestFamilyTicket").focus();
            //    $.unblockUI();
            //    return false;
            //}
            //else {
            //    $("#lblTravelRequestFamilyTicket").html('');
            //}

            //Estimated Price
            if ($("#TravelRequestEstimatedPrice").val() == "") {
                $("#lblTravelRequestEstimatedPrice").html('Please enter Estimated Price');
                $("#TravelRequestEstimatedPrice").focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lblTravelRequestEstimatedPrice").html('');
            }

            //Currency 
            if ($("#TravelRequestCurrency").val() == "00000000-0000-0000-0000-000000000000") {
                $("#lblTravelRequestCurrency").html('Please select Currency');
                $("#TravelRequestCurrency").focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lblTravelRequestCurrency").html('');
            }

            //Client Name
            if ($("#TravelRequestClientName").val() == "") {
                $("#lblTravelRequestClientName").html('Please enter Client Name');
                $("#TravelRequestClientName").focus();
                $.unblockUI();
                return false;
            }
            else {
                $("#lblTravelRequestClientName").html('');
            }
        }

        // Start date.
        if ($("#TravelRequestStartDate").val() == "") {
            $("#lblTravelRequestStartDate").html('Please select Start date.');
            $("#TravelRequestStartDate").focus();
            $.unblockUI();
            return false;
        }
        else {
            $("#lblTravelRequestStartDate").html('');
        }

        // End date.
        if ($("#TravelRequestEndDate").val() == "") {
            $("#lblTravelRequestEndDate").html('Please select End date.');
            $("#TravelRequestEndDate").focus();
            $.unblockUI();
            return false;
        }
        else {
            $("#lblTravelRequestEndDate").html('');
        }

        if ($("#TravelRequestStartDate").val() == null || $("#TravelRequestStartDate").val() == "" || $("#TravelRequestStartDate").val() == undefined || $("#TravelRequestStartDate").val() == (sessionStorage.CultureMaskFormat).replace(/[0-9]/g, "_")) {
            $("#TravelRequestStartDate").focus();
            $.unblockUI();
            return false;
        }

        // Request type.
        if (!validateRequestType()) {
            $("#TravelRequestType").focus();
            $.unblockUI();
            return false;
        }

        // Country.
        if (!validateTravelRequestCountry()) {
            $("#TravelRequestCountry").focus();
            $.unblockUI();
            return false;
        }

        // State.
        if (!validateTravelRequestState()) {
            $("#TravelRequestState").focus();
            $.unblockUI();
            return false;
        }

        // City.
        if (!validateTravelRequestCity()) {
            $("#TravelRequestCity").focus();
            $.unblockUI();
            return false;
        }
        $("#lblMessage").removeAttr("class");
        $("#lblMessage").html('');
        $('#lblTravellerError').removeAttr("class").html('');
        var model = new Object();

        if ($("#TravelRequestNo").text() == "") {
            model.TravelRequestId = 0;
        }
        else {
            model.TravelRequestId = $("#TravelRequestNo").text();
        }
        model.Name = $("#TravelRequestName").val();
        model.CorporateProjectId = $("#hdnProjectId").val();
        model.TravelRequestEmployees = new Array();

        // loop.
        var count = parseInt($("#hdnTravellerTypeCount").val());
        for (var i = 1; i <= count; i++) {
            if ($("#hdnEmployeeId" + i).length > 0) {
                var travelRequestEmployee = new Object();
                travelRequestEmployee.EmployeeId = $("#hdnEmployeeId" + i).val();
                model.TravelRequestEmployees.push(travelRequestEmployee);
            }
        }
        if (IsCBTSonata == true) {
            model.IsBillable = !!$('#TravelRequestIsBillable').val();
            model.IsLongTermAssignment = !!$('#TravelRequestLongTermAssignment').val();
            if ($('#TravelRequestFamilyTicket').val() != '') {
                model.IsFamilyIncluded = !!$('#TravelRequestFamilyTicket').val();
            }
            model.FlightBudget = $('#TravelRequestEstimatedPrice').val();
            model.ClientName = $('#TravelRequestClientName').val();
            model.CurrencyID = $('#TravelRequestCurrency').val();
            if ($('#TravelRequestModeOfTravel').val() != '0') {
                model.ModeOfTravel = $('#TravelRequestModeOfTravel').val();
            }
            if ($('#TravelRequestAdvForexCurrency').val() != '00000000-0000-0000-0000-000000000000') {
                model.ForexCurrencyID = $("#TravelRequestAdvForexCurrency").val();
            }
            if ($('#TravelRequestAdvForexAmount').val() != '') {
                model.AdvForexAmount = $("#TravelRequestAdvForexAmount").val();
            }
            if ($('#TravelRequestTravelKnownDate').val() == "") {
                model.TravelKnownDate = "null";
            }
            else {
                model.TravelKnownDate = $('#TravelRequestTravelKnownDate').val();
            }
            model.NextApproverID = $('#ApproverID').val();
        }
        else {
            model.IsBillable = false;
            model.IsLongTermAssignment = false;
            model.ClientName = 'null';
            model.CurrencyID = '00000000-0000-0000-0000-000000000000';
        }

        model.Type = $("#TravelRequestType").val();
        model.CountryId = $("#TravelRequestCountry").val();
        model.StateId = $("#TravelRequestState").val();
        model.CityId = $("#TravelRequestCity").val();
        model.StartDate = $("#TravelRequestStartDate").val();
        model.EndDate = $("#TravelRequestEndDate").val();
        if ($("#TravelRequestReason").val() == "") { model.Purpose = "null"; }
        else { model.Purpose = $("#TravelRequestReason").val(); }



        model.ReferenceNumber = $("#TravelRequestReferenceNumber").val();
        model.CorporateId = 1104;
        model.RequestedEmployeeId = 1104;
        model.Notes = $("#TravelRequestComments").val();
        model.IsActive = true;

        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
            "TravelRequest/TravelRequest/Save",
        "POST",
        $.postifyData(model),
        function (response) {
            if (response != null) {
                var RequestNo = response.split("//")[0];
                var RequestStatus = response.split("//")[1];
                var RequestAction = response.split("//")[2];
                if (RequestNo > 0) {
                    $("#TravelRequestNo").html(RequestNo);
                    $("#TravelRequestStatus").html(RequestStatus);
                    $("#TravelRequestAction").html(RequestAction);
                    if (file != null) {
                        SaveAttachment(file, RequestNo, RequestStatus, RequestAction);
                    }
                    else
                        GetTRSaveResponse(RequestNo, RequestStatus, RequestAction);
                    //$("#btnSave").attr("disabled", "disabled");
                }
                else {
                    $("#lblMessage").removeAttr("class").attr("class", "alert alert-danger").html('Failed saving travel request.');
                    $.unblockUI();
                    $(window).scrollTop(0);
                }
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        }
        );
    }
    catch (error) {
        $().Logger.error("TravelRequest.js SaveTravelRequest()-->" + error)
    }
}

function GetTRSaveResponse(RequestNo, RequestStatus, RequestAction) {
    $("#lblMessage").removeAttr("class").attr("class", "alert alert-success").html('Travel request saved.');
    $(window).scrollTop(0);
    $('#travelrequestheader').css('display', 'block');
    $('#travelrequestheaderStatus').css('display', 'block');
    $('#travelrequestheaderAction').css('display', 'block');
    $("#btnSubmit").removeAttr("disabled");
    if (sessionStorage.SavedTR != undefined) {
        var MatchFound = '';
        if ($("#myTab li").hasClass("active")) {
            $("#myTab li.active").each(function () {
                var ReqNumber = $(this).attr('id').split("_")[1];
                var RequestType = $(this).attr('id').split("_")[2];
                if (ReqNumber.indexOf("NewTR") == 0) {
                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                    if (SavedTR != '') {
                        $.each(SavedTR, function (key, value) {
                            var savedKey = key.split("//")[0];
                            MatchFound = savedKey.indexOf(ReqNumber);
                            if (MatchFound == 0) {
                                var tripName = $("#TravelRequestName").val();
                                delete SavedTR[key];
                                key = RequestNo + '//' + RequestStatus;
                                SavedTR[key] = tripName;
                            }
                        });
                    }
                    sessionStorage.SavedTR = JSON.stringify(SavedTR);
                }
            });
        }
    }
    var id = "element_" + RequestNo + "_" + RequestStatus;
    if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
        $("#myTab li.active").each(function () {
            $(this).attr('id', id);
            var value = $("#TravelRequestName").val();
            var content = '<a>TR' + RequestNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(\'' + RequestNo + '\',\'' + RequestStatus + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
            $(this).empty();
            $(this).append(content);
        });
    }
    GetVouchers(true, true);
    $.unblockUI();
    $(window).scrollTop(0);
    return true;
}

function SaveAttachment(file, RequestNo, RequestStatus, RequestAction) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var travelRequestId = getUrlVars()["RequestNo"];
    if (travelRequestId == '' || travelRequestId == undefined || travelRequestId == null)
        travelRequestId = $("#TravelRequestNo").text();
    var finalFileData = file;
    var voucherComments = null;
    var isAttachment = true;
    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
    'TravelRequest/UploadMultipleVouchers/?travelRequestId=' + travelRequestId + '&voucherComments=' + voucherComments + '&isAttachment=' + isAttachment,
    "POST",
    finalFileData,
    function (jsonResponse) {
        if (jsonResponse != null) {
            if (jsonResponse != "" && jsonResponse.indexOf('voucherLink') >= 0) {
                if (jsonResponse == "") jsonResponse = "{}";
                var jsObject = JSON.parse(jsonResponse);
                if (jsObject.voucherFiles != null)
                    $('.alreadyUplodedAttachmentInfo').html(jsObject.voucherFiles);
                $('#attachmentUploadForm .rze-upvouchtable').find('.files').empty();
                GetTRSaveResponse(RequestNo, RequestStatus, RequestAction);
            }
            else {
                $("#lblMessage").removeAttr("class").attr("class", "alert alert-danger").html('Failed to attached attachment for travel request.');
                $.unblockUI();
                $(window).scrollTop(0);
            }
        }
        else {
            $("#lblMessage").removeAttr("class").attr("class", "alert alert-danger").html('Failed to attached attachment for travel request.');
            $.unblockUI();
            $(window).scrollTop(0);
        }

    }, function (XMLHttpRequest, textStatus, errorThrown) { },
    null,
    true,
    true
    );
}

// Close traveller.
function DeleteTravellers(row) {
    try {
        var ids = $("#hdntravellerIds").val();
        var idsArray = ids.split(',');
        var employeeId = $("#hdnEmployeeId" + row).val();
        if (employeeId != "") {
            idsArray.splice($.inArray(employeeId, idsArray), 1);
        }

        $("#hdntravellerIds").val(idsArray.join(','));
        $("#rza-empremove" + row).remove();
        $("#hdnTravellerType").val(parseInt($("#hdnTravellerType").val()) - 1);
        $("#hdnTravellerTypeCount").val(parseInt($("#hdnTravellerTypeCount").val()) - 1);
        $("#hdnTravellerId").val(parseInt($("#hdnTravellerId").val()) - 1);
        if ($('#lblTravellerError').html() != '')
            $('#lblTravellerError').html('');
    }
    catch (error) {
        $().Logger.error("TravelRequest.js DeleteTravellers()-->" + error)
    }
}

// Submit request.
function SubmitTravelRequest() {
    try {
        $("#lblMessage").html('');
        var model = new Object();
        if ($("#TravelRequestNo").text() == "") {
            return false;
        }
        var nextApproverId = parseFloat($('#ApproverID').val());

        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/TravelRequest/Submit/" + $("#TravelRequestNo").text() + "/" + $("#hdnGrade1").val() + "/" + nextApproverId,
        "GET",
        $.postifyData(model),
        function (response) {
            if (response != null) {
                if (response != "") {

                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-success");
                    $(window).scrollTop(0);
                    if (response.indexOf('Approved') > 0) {
                        LoadTravelRequest($("#TravelRequestNo").text(), 'TR-Draft');
                        $("#lblMessage").html('Travel request approved.');
                        $("#TravelRequestStatus").html(response);
                    }
                    else if (response.indexOf('submitted') > 0) {
                        $("#lblMessage").html('Travel request submitted.');
                        $("#TravelRequestStatus").html("Travel Request Review");
                        $("#TravelRequestAction").html("Not Required");
                    }
                    $("#btnSubmit").attr("disabled", "disabled");
                    $("#btnSave").attr("disabled", "disabled");

                    if (sessionStorage.SavedTR != undefined) {
                        var MatchFound = '';
                        var id = '';
                        var reqNo = '';
                        if ($("#myTab li").hasClass("active")) {
                            $("#myTab li.active").each(function () {
                                var ReqNumber = $(this).attr('id').split("_")[1];
                                var RequestType = $(this).attr('id').split("_")[2];
                                if (RequestType.indexOf("Travel Request Draft") == 0) {
                                    SavedTR = $.parseJSON(sessionStorage.SavedTR);
                                    if (SavedTR != '') {
                                        $.each(SavedTR, function (key, value) {
                                            var savedKey = key.split("//")[0];
                                            MatchFound = savedKey.indexOf(ReqNumber);
                                            if (MatchFound == 0) {
                                                var tripName = $("#TravelRequestName").val();
                                                delete SavedTR[key];
                                                key = ReqNumber + '//self';
                                                SavedTR[key] = tripName;
                                                id = "element_" + ReqNumber + "_self";
                                                reqNo = ReqNumber;
                                            }
                                        });
                                    }
                                    sessionStorage.SavedTR = JSON.stringify(SavedTR);
                                }
                            });
                        }
                    }
                    if ($("#myTab .active").attr('id') == 'element_' + reqNo + '_Travel Request Draft') {
                        $("#myTab li.active").each(function () {
                            $(this).attr('id', id);
                            var value = $("#TravelRequestName").val();
                            var content = '<a>TR' + reqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(\'' + reqNo + '\',\'self\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                            $(this).empty();
                            $(this).append(content);
                        });
                    }

                    $('#addMoreTraveller').css("display", "none");
                    $('#SavedTravelRequest [id^="closeTraveller"]').css("display", "none");
                    $('#SavedTravelRequest [id^="SearchTraveller"]').attr('onclick', 'return false');
                    $("#SavedTravelRequest input").prop("disabled", true);
                    $("#SavedTravelRequest select").prop("disabled", true);
                    $("#SavedTravelRequest textarea").prop("disabled", true);

                    $('#attachmentUploadForm').find('.fileupload-buttonbar').hide();
                    $('#attachmentUploadForm').find('.deleteItem').hide();
                    $.unblockUI();
                    $(window).scrollTop(0);

                }
                else {
                    $("#lblMessage").removeAttr("class");
                    $("#lblMessage").attr("class", "alert alert-danger");
                    $("#lblMessage").html('Failed submitting travel request.');
                    $.unblockUI();
                    $(window).scrollTop(0);
                }
            }
            else {
                $("#lblMessage").removeAttr("class");
                $("#lblMessage").attr("class", "alert alert-danger");
                $("#lblMessage").html('Failed submitting travel request.');
                $.unblockUI();
                $(window).scrollTop(0);

            }

        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        }

        );

        $(window).scrollTop(0);
    }
    catch (error) {
        $().Logger.error("TravelRequest.js SubmitTravelRequest()-->" + error)
    }
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    try {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    catch (error) {
        $().Logger.error("TravelRequest.js getUrlVars()-->" + error)
    }
}

function gototravelrequestedit(RequestNo, title, RequestType) {
    try {
        window.location = "TravelRequestDetail.html" + "?RequestNo=" + RequestNo;
        var MatchFound = false;
        var MatchedReqType = '';
        if (sessionStorage.SavedTR != undefined) {
            SavedTR = $.parseJSON(sessionStorage.SavedTR);
            if (SavedTR != '') {
                $.each(SavedTR, function (key, value) {
                    var savedKey = key.split("//")[0];
                    if (savedKey == RequestNo)
                        MatchFound = true;
                    if (MatchFound) {
                        MatchedReqType = key.split("//")[1];
                        if (MatchedReqType != RequestType) {
                            // changing existing one.
                            var tripName = title;
                            delete SavedTR[key];
                            key = RequestNo + '//' + RequestType;
                            SavedTR[key] = tripName;
                            sessionStorage.SavedTR = JSON.stringify(SavedTR);
                        }
                    }
                });
                if (!MatchFound) {
                    SavedTR[RequestNo + "//" + RequestType] = title;
                    sessionStorage.SavedTR = JSON.stringify(SavedTR);
                }
            }
        }
        else {
            var obj = {};
            obj[RequestNo + "//" + RequestType] = title;
            sessionStorage.SavedTR = JSON.stringify(obj);
        }
        if ($("#myTab").children().length >= ReqTabSliderLenthCnt) {
            var clickedTab = RequestNo + "//" + RequestType;
            sessionStorage.ClickedTab = JSON.stringify(clickedTab);
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js gototravelrequestedit()-->" + error)
    }
}

function ResetRequest() {
    try {
        $("#MyReq_RequestEndDate").prop('disabled', true);
        $("#MyReq_RequestEndDate").css('background', '#e0dcdc');
        $("#MyReq_RequestEndDateLbl .btn").css('background', '#e0dcdc');

        $("#MyAssociates_RequestEndDate").prop('disabled', true);
        $("#MyAssociates_RequestEndDate").css('background', '#e0dcdc');
        $("#MyAssociates_RequestEndDateLbl .btn").css('background', '#e0dcdc');

        var isApprover = $('#MyAssociate').hasClass("active");
        var isAdmin = $('#IsAdmin').val();
        if (isAdmin == 'false') {
            if (!isApprover) {
                $('#MyReq_RequestStartDate').val('');
                $('#MyReq_RequestEndDate').val('');
                $('#MyReq_RequestedDate').val('');
                $('#MyReq_RequestStatus').val('');
                $('#MyReq_TripName').val('');
                $('#MyReq_TravellerName').val('');
                $('#MyReq_TravellerDestination').val('');
                $('#MyReq_RequestNo').val('');

            }
            else {
                $('#MyAssociates_RequestStartDate').val('');
                $('#MyAssociates_RequestEndDate').val('');
                $('#MyAssociates_RequestedDate').val('');
                $('#MyAssociates_RequestStatus').val('');
                $('#MyAssociates_TripName').val('');
                $('#MyAssociates_TravellerName').val('');
                $('#MyAssociates_TravellerDestination').val('');
                $('#MyAssociates_RequestNo').val('');
            }
        }
        else {
            $('#RequestStartDate_Admin').val('');
            $('#RequestEndDate_Admin').val('');
            $('#RequestedDate_Admin').val('');
            $('#RequestStatus_Admin').val('');
            $('#Company_Admin').val('');
            $('#TravellerDestination_Admin').val('');
            $('#RequestNo_Admin').val('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js ResetRequest()-->" + error)
    }
}

function CreateRequest() {

    try {
        if (sessionStorage.SavedTR != undefined) {
            SavedTR = $.parseJSON(sessionStorage.SavedTR);
            if (SavedTR != '') {
                SavedTR["NewTR//Travel Request Draft"] = "New TR";
                sessionStorage.SavedTR = JSON.stringify(SavedTR);
            }
        }
        else {
            var obj = {};
            obj["NewTR//Travel Request Draft"] = "New TR";
            sessionStorage.SavedTR = JSON.stringify(obj);
        }

        window.location = "TravelRequestDetail.html";

    }
    catch (error) {
        $().Logger.error("TravelRequest.js CreateRequest()-->" + error)
    }
}

function getActiveTabDetail(tab) {
    try {
        if ($("#myTab .active").attr('id') == 'element_NewTR_Travel Request Draft') {
            $("#lblMessage").removeAttr("class");
            $("#lblMessage").attr("class", "alert alert-info");
            $("#lblMessage").html('Kindly Save Data.');
            $(window).scrollTop(0);
            event.preventDefault();
        }
        else {
            $('#myNavbar li.active').each(function () {
                $(this).removeClass("active");
            });
            $(tab).attr('class', 'active');
            var ReqNo = tab.id.split("_")[1];
            var ReqType = tab.id.split("_")[2];
            if (ReqNo > 0) {
                var clickedTab = ReqNo + "//" + ReqType;
                sessionStorage.ClickedTab = JSON.stringify(clickedTab);
                window.location = "TravelRequestDetail.html" + "?RequestNo=" + ReqNo;
            }
        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js getActiveTabDetail()-->" + error)
    }
}

var isLoadingData;
$(window).scroll(function () {
    try {
        if ($(window).scrollTop() == $(document).height() - $(window).height() && !isLoadingData) {
            var columnForSorting = $("#lastSortedColumn").val();
            isLoadingData = true;
            $('#hdnIsScroll').val("true");
            var IsFilterApplied = $('#hdnIsFilterApplied').val();

            var totalCnt = $("#hdnTotalResultsCount").val();
            var showCnt = $("#hdnShowCount").val();
            if (showCnt == totalCnt) {
                return false;
            }

            if (IsFilterApplied == "false") {
                PageIndex++;

                if ($('#hdnCalledByAdminRequest').val() == "true") { LoadAdminRequest('AdminRequest', columnForSorting); }
                else if ($('#MyRequest').hasClass('active')) { LoadNonApproverTravelRequest(columnForSorting); }
                else { LoadApproverTravelRequest(columnForSorting); } //$('#MyAssociate').hasClass('active')

            }
            else {
                PageIndex++;
                var FilterRequestTabType = $('#hdnFilterRequestType').val();
                FilterRequest(FilterRequestTabType);
            }

        }
    }
    catch (error) {
        $().Logger.error("TravelRequest.js scroll()-->" + error)
    }
});

function CalculateDurationinDays() {
    if (IsCBTSonata == true) {
        var startDate = $('#TravelRequestStartDate').val().split('/');
        var endDate = $('#TravelRequestEndDate').val().split('/');
        if (startDate != undefined && startDate != '' && endDate != undefined && endDate != '') {
            startDateFormatted = new Date(startDate[2], startDate[1] - 1, startDate[0]);
            endDateFormatted = new Date(endDate[2], endDate[1] - 1, endDate[0]);
            if (startDateFormatted != "Invalid Date" && endDateFormatted != "Invalid Date") {
                var difference = new Date(endDateFormatted - startDateFormatted);
                var duration = difference / 1000 / 60 / 60 / 24;
                $('#TravelRequestDuration').val(duration);
            }
        }
    }
}

function AllowNumerics(id) {
    $("#" + id).keypress(function (e) {
        if (e.charCode == 8 || e.charCode == 0) {
            return;
        }
        else if (e.charCode == 46) {
            if ($("#" + id).val().indexOf('.')!==-1)
            {
                e.preventDefault();
            }
            else {
                return true;
            }
           
        }
        else {
            var regex = new RegExp("^[0-9]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (regex.test(str)) {
                return true;
            }
            e.preventDefault();
        }
        return false;
    });
}