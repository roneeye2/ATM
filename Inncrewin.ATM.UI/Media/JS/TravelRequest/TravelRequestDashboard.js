var intervals = [];
var timerCnt = parseFloat('0');
var PageIndex = 1;
var CurrentCount;
var skipCount;
var DashBoardTabSliderLenthCnt = 3;
var IsCBTSonata = false;
$(function () {
    try {
        $('#footer').load('/footer.html',
            function () {  });
        $("#header_Dashboard").load('header.html', function () {
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            var serviceProxy = new ServiceProxy();
            serviceProxy.invoke(
                "TravelRequest/TravelRequest/GetUserInfo",
                "POST",
            null,
            function (response) {
                IsCBTSonata = response.ISCBTSONATA;
                if (IsCBTSonata)
                {
                    $('#header_TravelFareFinder').addClass('hide');
                    $('#ApprRequestStatusDiv').removeClass().addClass('hide');
                    $('#RequestorRequestStatusDiv').removeClass().addClass('hide');
                    $('#AdminRequestStatusDiv').removeClass().addClass('hide');

                    $('#ItrRejectedCntDiv').removeClass().addClass('hide');
                    $('#RequestorViewItemDiv').addClass('rz-soncount');
                    $('#ItrSubForApprovalDiv').removeClass().addClass('col-md-6 col-sm-6 col-xs-6');

                    $('#AdminViewItemDiv').removeClass().addClass('rze-admcont rze-soncbt');
                    $('#CreateItineraryCntDiv').removeClass().addClass('col-md-6');
                    $('#ItineraryCreatedCntDiv').removeClass().addClass('col-md-6');
                    $('#ItineraryApprovedCntDiv').removeClass().addClass('col-md-6');
                }

                if (!response.ISEXPENSE) {
                    $('#ExpenseReports_header').hide();
                }

                FindAdminOrEmployee(response);
                if ($('#ExpenseReports_header').length > 0) {
                    DashBoardTabSliderLenthCnt = 2;
                    //SliderMoveIndex = 1;
                }
                loadTravelRequestHeaderTab();
                loadExpenseReportHeaderTab();
                $("a[href='/Dashboard.html']").parent().attr('class', 'active');
            });

        });

        $(".rze-selfsection .form-group").keypress(function (e) {
            if (e.which == 13) {
                FilterRequest('self', true);
            }
        });

        $(".rze-wrapAssociates .form-group").keypress(function (e) {
            if (e.which == 13) {
                FilterRequest('Associates', true);
            }
        });

    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js #footer load()-->" + error);
    }
});

function loadTravelRequestHeaderTab() {
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

                if ($("#myTab").children().length > DashBoardTabSliderLenthCnt) {
                    $(".slider").attr("id", "slider1");
                    if ($('#ExpenseReports_header').length > 0) {
                        $('#slider1 .viewport').addClass('expense');
                    }
                    $('#slider1').tinycarousel();
                    var slider1 = $("#slider1").data("plugin_tinycarousel");
                    slider1.update();
                }

            });
        }
    }
}

function loadExpenseReportHeaderTab() {
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

                if ($("#myTab").children().length > DashBoardTabSliderLenthCnt) {
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
}

function LoadDataTravelRequestDashBoard() {
    try {

        LoadStatus();
        LoadCalender();
        $('#ApproverTab').css('display', 'none');
        var LoadedSelf = false;
        // Set date picker for start date.
        $("#RequestStartDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestStartDate")
            },
            onSelect: function () {
                $("#RequestEndDate").prop('disabled', false);
                $("#RequestEndDate").css('background', '#fff');
                $("#RequestEndDateLbl .btn").css('background', '#fff');
                $('#RequestEndDate').datepicker('option', 'minDate', this.value);
                $("#RequestStartDate").focus();
            }
        });

        $("#RequestStartDate").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestEndDate")
            }, onSelect: function () { $("#RequestEndDate").focus(); }
        });
        $("#RequestEndDate").mask(sessionStorage.CultureMaskFormat);

        $("#RequestEndDate").prop('disabled', true);
        $("#RequestEndDate").css('background', '#e0dcdc');
        $("#RequestEndDateLbl .btn").css('background', '#e0dcdc');

        $("#RequestedDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestedDate")
            }, onSelect: function () { $("#RequestedDate").focus(); }
        });
        $("#RequestedDate").mask(sessionStorage.CultureMaskFormat);
        $("#RequestStartDate_Self").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestStartDate_Self")

            },
            onSelect: function () {
                $("#RequestEndDate_Self").prop('disabled', false);
                $("#RequestEndDate_Self").css('background', '#fff');
                $("#RequestEndDate_SelfLbl .btn").css('background', '#fff');
                $('#RequestEndDate_Self').datepicker('option', 'minDate', this.value);
                $("#RequestStartDate_Self").focus();
            }
        });

        $("#RequestStartDate_Self").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate_Self").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestEndDate_Self")
            }, onSelect: function () { $("#RequestEndDate_Self").focus(); }
        });
        $("#RequestEndDate_Self").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate_Self").prop('disabled', true);
        $("#RequestEndDate_Self").css('background', '#e0dcdc');
        $("#RequestEndDate_SelfLbl .btn").css('background', '#e0dcdc');

        $("#RequestedDate_Self").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestedDate_Self")
            },
            onSelect: function () { $("#RequestedDate_Self").focus(); }
        });
        $("#RequestedDate_Self").mask(sessionStorage.CultureMaskFormat);
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
                $("#RequestEndDate_Self").focus();
            }
        });
        $("#RequestStartDate_Admin").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate_Admin").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestEndDate_Admin")
            },
            onSelect: function () { $("#RequestEndDate_Admin").focus(); }
        });
        $("#RequestEndDate_Admin").mask(sessionStorage.CultureMaskFormat);
        $("#RequestEndDate_Admin").prop('disabled', true);
        $("#RequestEndDate_Admin").css('background', '#e0dcdc');
        $("#RequestEndDate_AdminLbl .btn").css('background', '#e0dcdc');

        $("#RequestedDate_Admin").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "RequestedDate_Admin")
            },
            onSelect: function () { $("#RequestedDate_Admin").focus(); }
        });
        $("#RequestedDate_Admin").mask(sessionStorage.CultureMaskFormat);
        $("#IRPending").html(ConvertNumber(parseFloat('0')));
        $("#IRApproved").html(ConvertNumber(parseFloat('0')));
        $("#IRRejected").html(ConvertNumber(parseFloat('0')));
        $("#TRSubmitted_Self").html(ConvertNumber(parseFloat('0')));
        $("#TRApproved_Self").html(ConvertNumber(parseFloat('0')));
        $("#IRApproved_Self").html(ConvertNumber(parseFloat('0')));
        $("#IRRejected_Self").html(ConvertNumber(parseFloat('0')));
        $("#IRSubmitted_Admin").html(ConvertNumber(parseFloat('0')));
        $("#BookingSubmitted_Admin").html(ConvertNumber(parseFloat('0')));
        $("#Ticketed_Admin").html(ConvertNumber(parseFloat('0')));
        $('#MySelf').click(function () {
            $('#SelfSection').attr('class', 'tab-pane fade active in');
            $('#ApproverSection').attr('class', 'hide');
            PageIndex = 1;
            skipCount = 0;
            $('#hdnIsScroll').val("false");
            ResetStatusFilterSelf('Clear');
            LoadNonApproverTravelRequest();
        });
        $('#MyAssociates').click(function () {
            $('#ApproverSection').attr('class', 'tab-pane fade active in');
            $('#SelfSection').attr('class', 'hide');
            ResetStatusFilter('Clear');
            skipCount = 0;
            PageIndex = 1;
            $('#hdnIsScroll').val("false");
            LoadApproverTravelRequest();
        });

        var approvalArrayOriginalLowerCase = '';
        var nonApprovalArrayOriginalSelfLowerCase = '';
        var arrOriginalAdminLowerCase = '';
        $('#ApproverGridheadings th i[id!="filter"]').click(function () {
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

        $('#SelfRequestGridheadings th i[id!="filter"]').click(function () {
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
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js LoadDataTravelRequestDashBoard()-->" + error);
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
        $().Logger.error("TravelRequestDashboard.js CreateRequest()-->" + error);
    }
}

function closetab(e, req, RequestType) {
    try {
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
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js closetab()-->" + error);
    }
}

function getActiveTabDetail(tab) {
    try {
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
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js getActiveTabDetail()-->" + error);
    }
}

function FindAdminOrEmployee(response) {
    try {

        if (response != null) {
            if (sessionStorage != null && sessionStorage != undefined) {
                if (response.CultureTypeInfo != undefined && response.CultureTypeInfo != null) {
                    sessionStorage.CultureTypeInfo = response.CultureTypeInfo
                    var newDateFormat = $.datepicker.regional[response.CultureTypeInfo].dateFormat;
                    sessionStorage.CultureDateFormat = newDateFormat;
                    $.datepicker.setDefaults($.datepicker.regional['en-US']);
                    if (newDateFormat != null && newDateFormat != "") {
                        newDateFormat = (newDateFormat.replace("yy", "YYYY")).toUpperCase();
                        var dateValue = (moment("31/12/2017", "DD/MM/YYYY")).format(newDateFormat);
                        var maskvalue = dateValue.replace(/[0-9]/g, "9");
                        sessionStorage.CultureMaskFormat = maskvalue;
                        sessionStorage.DateFormatForMoment = newDateFormat;
                    }

                }
                LoadDataTravelRequestDashBoard();
            }
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
                    $('#ApproverTab').css('display', 'block');
                    $('#ApproverSection').attr('class', 'hide');
                    $('#MyAssociates').hide();
                    $('#AdminSection').attr('class', 'hide');
                    $('#SelfSection').attr('class', 'tab-pane fade in active');
                    $('#IsAdmin').val(false);
                    LoadNonApproverTravelRequest();
                }
                else {
                    $('#ApproverTab').css('display', 'block');
                    $('#ApproverSection').attr('class', 'hide');
                    $('#AdminSection').attr('class', 'hide');
                    $('#SelfSection').attr('class', 'tab-pane fade in active');
                    $('#IsAdmin').val(false);
                    LoadNonApproverTravelRequest();
                    $('#IsAdmin').val(false);
                }
            }
            else {
                $("#myProfile_headerBD").remove();
                $("#myProfile_headerSD").remove();
                $("#tmcProfile_headerSD").css("display", "");
                $("#tmcProfile_headerBD").css("display", "");
                $("#ExpenseReports_header").remove();
                $('#ApproverTab').css('display', 'none');
                $('#ApproverSection').attr('class', 'hide');
                $('#SelfSection').attr('class', 'hide');
                $('#AdminSection').attr('class', 'tab-pane fade in active');
                $('#IsAdmin').val(true);
                LoadAdminRequest('AdminDashboard');
            }
            $.unblockUI();
        }
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js     minOrEmployee()-->" + error);
    }
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
        if ($('#StatusFilter input:checked').length > 0) {
            $('#StatusFilter input:checked').each(function () {

                var status = $(this).parent().html().split('>')[1];

                obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
                if (status.toLowerCase().indexOf("approved") >= 0) {
                    var type = status.split('-')[0].toLowerCase();
                    filterCriteria.push(type + "-approved by l1");
                    filterCriteria.push(type + "-approved by l2");
                    filterCriteria.push(type + "-approved by l3");
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
        $().Logger.error("TravelRequestDashboard.js checkUncheckFilter()-->" + error);
    }
}

function checkUncheckFilterSelf(filter) {
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
        if ($('#StatusFilterSelf input:checked').length > 0) {
            $('#StatusFilterSelf input:checked').each(function () {

                var status = $(this).parent().html().split('>')[1];
                obj[$(this).parent().closest('div')[0].id] = status.toLowerCase();
                if (status.toLowerCase().indexOf("approved") >= 0) {
                    var type = status.split('-')[0].toLowerCase();
                    filterCriteria.push(type + "-approved by l1");
                    filterCriteria.push(type + "-approved by l2");
                    filterCriteria.push(type + "-approved by l3");
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
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
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
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
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
        ApplyStatusFilterSelf(filterCriteria);
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js checkUncheckFilter()-->" + error);
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
        $().Logger.error("TravelRequestDashboard.js checkUncheckFilterAdmin()-->" + error);
    }
}

function ApplyStatusFilter(criteria) {
    try {
        if (criteria.length > 0) {
            if (sessionStorage.originalGrid != undefined) {
                originalGrid = $.parseJSON(sessionStorage.originalGrid);
                if (originalGrid != '') {
                    $("#ApproverTravelRequestGrid").empty();
                    $.each(originalGrid, function (key, value) {
                        if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#ApproverTravelRequestGrid").append(newRow);
                        }
                    });
                    var statusNotifyCount = $('#ApproverGrid tbody tr.row_main').length;
                    if (statusNotifyCount > 0) {
                        $("#dashboardMyApprovalsTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                        $("#hdnShowCount").val(parseInt(statusNotifyCount));
                        $("#hdnTotalResultsCount").val(statusNotifyCount);
                    }
                    else { $("#dashboardMyApprovalsTabResultCount").html(" "); }
                    if ($("#ApproverTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                        $("#ApproverTravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#ApproverTravelRequestGrid").empty();
                        $("#dashboardMyApprovalsTabResultCount").empty();
                        $("#ApproverTravelRequestGrid").append(newRow);
                    }
                }
            }
        }
        else {
            ResetStatusFilter('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ApplyStatusFilter()-->" + error);
    }
}

function ApplyStatusFilterSelf(criteria) {
    try {
        if (criteria.length > 0) {
            if (sessionStorage.originalSelfGrid != undefined) {
                originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
                if (originalSelfGrid != '') {
                    $("#SelfTravelRequestGrid").empty();
                    $.each(originalSelfGrid, function (key, value) {
                        if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#SelfTravelRequestGrid").append(newRow);
                        }
                    });
                    var statusNotifyCount = $('#SelfRequestGrid tbody tr.row_main').length;
                    if (statusNotifyCount > 0) {
                        $("#myselfTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                        $("#hdnShowCount").val(parseInt(statusNotifyCount));
                        $("#hdnTotalResultsCount").val(statusNotifyCount);
                    }
                    else { $("#myselfTabResultCount").html(" "); }
                    if ($("#SelfTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                        $("#SelfTravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#SelfTravelRequestGrid").empty();
                        $("#myselfTabResultCount").empty();
                        $("#SelfTravelRequestGrid").append(newRow);
                    }
                }
            }
        }
        else {
            ResetStatusFilterSelf('');
        }
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ApplyStatusFilterSelf()-->" + error);
    }
}

function ResetStatusFilterSelf(cond) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if (sessionStorage.originalSelfGrid != undefined) {
            originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
            if (originalSelfGrid != '') {
                $("#SelfTravelRequestGrid").empty();
                $.each(originalSelfGrid, function (key, value) {
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#SelfTravelRequestGrid").append(newRow);
                    $("#hdnShowCount").val(parseInt(originalSelfGrid.length));
                    $("#myselfTabResultCount").html("Showing " + originalSelfGrid.length + " " + "of " + originalSelfGrid.length);
                    $("#hdnTotalResultsCount").val(parseInt(originalSelfGrid.length));
                });
                if ($("#SelfTravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#SelfTravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
            }
        }
        if (cond == 'All') { // check all checkbox;
            var atr = $('#showingAllFilterSelf').attr('onclick');
            var str = atr.split('All');
            var natr = str.join('Clear');
            $('#showingAllFilterSelf').replaceWith('<input id="showingAllFilterSelf" type="checkbox" checked="checked">');
            $('#showingAllFilterSelf').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilterSelf input').length > 0) {
                $('#StatusFilterSelf input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
                });
            }

        }
        if (cond == 'Clear')  // uncheck All Checkbox
        {
            var atr = $('#showingAllFilterSelf').attr('onclick');
            var str = atr.split('Clear');
            var natr = str.join('All');
            $('#showingAllFilterSelf').replaceWith('<input id="showingAllFilterSelf" type="checkbox">');
            $('#showingAllFilterSelf').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilterSelf input').length > 0) {
                $('#StatusFilterSelf input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
                });
            }
        }
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ResetStatusFilterSelf()-->" + error);
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
                                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            }
                            else
                                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td class="text-center"><span data-CountTime ="' + value.TicketingTimeLine_Admin + '" id="timer_' + value.RequestNo_Admin + '" class="rze-timer">' + value.TimeLine_Admin + '</span></td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';

                            $("#AdminTravelRequestGrid").append(newRow);
                        }
                    });
                    var statusNotifyCount = $('#AdminRequestGrid tbody tr.row_main').length; //set del
                    if (statusNotifyCount > 0) {
                        $("#AdminDashboardTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                        $("#hdnShowCount").val(parseInt(statusNotifyCount));
                        $("#hdnTotalResultsCount").val(statusNotifyCount);
                    }
                    else { $("#AdminDashboardTabResultCount").html(" "); }
                    if ($("#AdminTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                        $("#AdminTravelRequestGrid").append(ViewAllRow);
                        GetHover();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#AdminTravelRequestGrid").empty();
                        $('#AdminDashboardTabResultCount').empty();
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
        $().Logger.error("TravelRequestDashboard.js ApplyStatusFilterAdmin()-->" + error);
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
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    }
                    else
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate_Admin)) + '</td><td>' + value.RequestNo_Admin + '</td><td>' + value.TravelDestination_Admin + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate_Admin)) + '</td><td class="text-center"><span data-CountTime ="' + value.TicketingTimeLine_Admin + '" id="timer_' + value.RequestNo_Admin + '" class="rze-timer">' + value.TimeLine_Admin + '</span></td><td>' + value.RequestStatus_Admin + '</td><td><a class="btn btn-info">' + value.Action_Admin + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo_Admin + '\',\'' + value.CorporateName_Admin + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#AdminTravelRequestGrid").append(newRow);
                    $("#hdnShowCount").val(parseInt(originalAdminGrid.length));
                    $("#myselfTabResultCount").html("Showing " + originalAdminGrid.length + " " + "of " + originalAdminGrid.length);
                    $("#hdnTotalResultsCount").val(parseInt(originalAdminGrid.length));
                });
                if ($("#AdminTravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
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
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
                });
            }
        }
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ResetStatusFilterAdmin()-->" + error);
    }
}

function ResetStatusFilter(cond) {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if (sessionStorage.originalGrid != undefined) {
            originalGrid = $.parseJSON(sessionStorage.originalGrid);
            if (originalGrid != '') {
                $("#ApproverTravelRequestGrid").empty();
                $.each(originalGrid, function (key, value) {
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                    $("#ApproverTravelRequestGrid").append(newRow);
                    $("#hdnShowCount").val(parseInt(originalGrid.length));
                    $("#dashboardMyApprovalsTabResultCount").html("Showing " + originalGrid.length + " " + "of " + originalGrid.length);
                    $("#hdnTotalResultsCount").val(parseInt(originalGrid.length));

                });
                if ($("#ApproverTravelRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#ApproverTravelRequestGrid").append(ViewAllRow);
                    GetHover();
                }
            }
        }
        if (cond == 'All') { // check all checkbox;
            var atr = $('#showingAllFilter').attr('onclick');
            var str = atr.split('All');
            var natr = str.join('Clear');
            $('#showingAllFilter').replaceWith('<input id="showingAllFilter" type="checkbox" checked="checked">');
            $('#showingAllFilter').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilter input').length > 0) {
                $('#StatusFilter input').each(function () {
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
            var atr = $('#showingAllFilter').attr('onclick');
            var str = atr.split('Clear');
            var natr = str.join('All');
            $('#showingAllFilter').replaceWith('<input id="showingAllFilter" type="checkbox">');
            $('#showingAllFilter').attr('onclick', natr);
            var obj = {};
            if ($('#StatusFilter input').length > 0) {
                $('#StatusFilter input').each(function () {
                    var status = $(this).parent().html().split('>')[1];
                    obj[$(this).parent().closest('div')[0].id] = status;
                });
                $.each(obj, function (key, value) {
                    $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                });
            }
        }
        $.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ResetStatusFilter()-->" + error);
    }
}

function ApprTravelRequestViewItem(status) {
    try {
        ResetRequest();
        PageIndex = 1;
        ////$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var criteria = new Array();
        var id = '';
        var type = '';
        var isPushedToCriteria = 'false';
        if (status.toLowerCase().indexOf('travel request') >= 0) {
            type = "tr-";
        }
        else if (status.toLowerCase().indexOf('itinerary') >= 0) {
            type = "itr.-";
        }
        else
            criteria.push(status.toLowerCase());

        if (type != '') {
            if (status.toLowerCase().indexOf("approved") >= 0) {
                criteria.push(type + "approved by l1");
                criteria.push(type + "approved by l2");
                criteria.push(type + "approved by l3");
                isPushedToCriteria = 'true';
            }
            else if (status.toLowerCase().indexOf("rejected") >= 0) {
                criteria.push(type + "rejected by l1");
                criteria.push(type + "rejected by l2");
                criteria.push(type + "rejected by l3");
                isPushedToCriteria = 'true';
            }
            else
                isPushedToCriteria = 'false';
            //criteria.push(status.toLowerCase());
        }

        var obj = {};
        if (status.toLowerCase().indexOf('travel request') >= 0) {
            var s = status.split(' ')[2];
            status = "TR-" + s[0].toUpperCase() + s.slice(1);
        }
        else if (status.toLowerCase().indexOf('itinerary') >= 0) {
            var s = status.split(' ')[1];
            status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        }
        else {
            var s = status.split(' ');
            status = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            status = s.join(' ');
        }

        if (isPushedToCriteria == 'false')
            criteria.push(status.toLowerCase());

        $('#StatusFilter div').each(function () {
            if ($(this).text().toLowerCase() == status.toLowerCase())
                id = $(this)[0].id;
        });
        obj[id] = status;
        ResetStatusFilter('Clear');
        $.each(obj, function (key, value) {
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)' checked='checked'>" + value + "</label></div>");
        });
        $('#ApproverTravelRequestGrid').empty();
        $('#dashboardMyApprovalsTabResultCount').empty();
        if (status == "Itr.-Review") {
            var RequestStatus = $('#RequestStatus').val("6");
            $('#hdnStatusFilterOnCount').val('ITR-Pending');
        }
        else if (status == "TR-Submitted") {
            var RequestStatus = $('#RequestStatus').val("2");
            $('#hdnStatusFilterOnCount').val('TRPending');
        }
        if (status == "TR-Approved") {
            var RequestStatus = $('#RequestStatus').val("3");
            $('#hdnStatusFilterOnCount').val('TRApproved');
        }
        else if (status == "TR-Rejected") {
            var RequestStatus = $('#RequestStatus').val("4");
            $('#hdnStatusFilterOnCount').val('TRRejected');
        }
        else if (status == "Itr.-Approved") {
            var RequestStatus = $('#RequestStatus').val("7");
            $('#hdnStatusFilterOnCount').val('ITR-Approved');
        }
        else if (status == "Itr.-Rejected") {
            var RequestStatus = $('#RequestStatus').val("8");
            $('#hdnStatusFilterOnCount').val('ITR-Rejected');
        }
        else { }
        FilterRequest('Associates', true);
        //////ApplyStatusFilter(criteria); //sethu demo
        ////$.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js ApprTravelRequestViewItem()-->" + error);
    }
}

function SelfTravelRequestViewItem(status) {
    try {
        ////$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        ResetRequest();
        PageIndex = 1;
        var criteria = new Array();
        var id = '';
        var type = '';
        var isPushedToCriteria = 'false';
        if (status.toLowerCase().indexOf('travel request') >= 0) {
            type = "tr-";
        }
        else if (status.toLowerCase().indexOf('itinerary') >= 0) {
            type = "itr.-";
        }
        else
            criteria.push(status.toLowerCase());

        if (type != '') {
            if (status.toLowerCase().indexOf("approved") >= 0) {
                criteria.push(type + "approved by l1");
                criteria.push(type + "approved by l2");
                criteria.push(type + "approved by l3");
                isPushedToCriteria = 'true';
            }
            else if (status.toLowerCase().indexOf("rejected") >= 0) {
                criteria.push(type + "rejected by l1");
                criteria.push(type + "rejected by l2");
                criteria.push(type + "rejected by l3");
                isPushedToCriteria = 'true';
            }
            else
                isPushedToCriteria = 'false';
            //criteria.push(status.toLowerCase());
        }
        var obj = {};
        if (status.toLowerCase().indexOf('travel request') >= 0) {
            var s = status.split(' ')[2];
            status = "TR-" + s[0].toUpperCase() + s.slice(1);
        }
        else if (status.toLowerCase().indexOf('itinerary') >= 0) {
            var s = status.split(' ')[1];
            status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        }
        else {
            var s = status.split(' ');
            status = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            status = s.join(' ');
        }

        if (isPushedToCriteria == 'false')
            criteria.push(status.toLowerCase());

        $('#StatusFilterSelf div').each(function () {
            if ($(this).text().toLowerCase() == status.toLowerCase())
                id = $(this)[0].id;
        });
        obj[id] = status;
        ResetStatusFilterSelf('Clear');
        $.each(obj, function (key, value) {
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)' checked='checked'>" + value + "</label></div>");
        });
        $('#SelfTravelRequestGrid').empty();
        $('#myselfTabResultCount').empty();
        if (status == "TR-Draft") {
            var RequestStatus = $('#RequestStatus_Self').val("1");
        }
        else if (status == "TR-Submitted") {
            var RequestStatus = $('#RequestStatus_Self').val("2");
        }
        else if (status == "TR-Approved") {
            var RequestStatus = $('#RequestStatus_Self').val("3");
        }
        else if (status == "TR-Rejected") {
            var RequestStatus = $('#RequestStatus_Self').val("4");
        }
        else if (status == "Itr.-Approved") {
            var RequestStatus = $('#RequestStatus_Self').val("7");
        }
        else if (status == "Itr.-Rejected") {
            var RequestStatus = $('#RequestStatus_Self').val("8");
        }
        else if (status.toLowerCase() == "submit for approval") {
            var RequestStatus = $('#RequestStatus_Self').val("15");
        }
        else { }
        //$('#hdnStatusFilterOnCount').val(RequestStatus);
        FilterRequest('self', true);
        //////ApplyStatusFilterSelf(criteria);   //sethu demo cgs
        ////$.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js SelfTravelRequestViewItem()-->" + error);
    }
}

function AdminTravelRequestViewItem(status) {
    try {
        PageIndex = 1;
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        if (status == "Itinerary Submitted") {
            var RequestStatus = $('#RequestStatus_Admin').val("9");
            $('#hdnStatusFilterOnCount').val('ITR-Submitted');
        }
        else if (status == "Booking Submitted") {
            var RequestStatus = $('#RequestStatus_Admin').val("10");
            $('#hdnStatusFilterOnCount').val('Booking Submitted');
        }
        else if (status == "Ticketed") {
            var RequestStatus = $('#RequestStatus_Admin').val("11");
            $('#hdnStatusFilterOnCount').val('Ticketed');
        }
        else if (status == "Create Itinerary") {
            var RequestStatus = $('#RequestStatus_Admin').val("13");
            $('#hdnStatusFilterOnCount').val('Create Itinerary');
        }
        else if (status == "Itinerary Created") {
            var RequestStatus = $('#RequestStatus_Admin').val("15");
            $('#hdnStatusFilterOnCount').val('Itinerary Created');
        }
        else if (status == "Itinerary Approved") {
            var RequestStatus = $('#RequestStatus_Admin').val("7");
            $('#hdnStatusFilterOnCount').val('Itinerary Approved');
        }
        else if (status == "Itinerary Created") {
            var RequestStatus = $('#RequestStatus_Admin').val("15");
            $('#hdnStatusFilterOnCount').val('Itinerary Created');
        }
        else if (status == "Create Itinerary") {
            var RequestStatus = $('#RequestStatus_Admin').val("3");
            $('#hdnStatusFilterOnCount').val('Create Itinerary');
        }

        else { }
        var criteria = new Array();
        var id = '';
        var obj = {};
        if (status.toLowerCase().indexOf('travel request') >= 0) {
            var s = status.split(' ')[2];
            status = "TR-" + s[0].toUpperCase() + s.slice(1);
        }
        else if (status.toLowerCase().indexOf('itinerary') >= 0) {
            var s = status.split(' ')[1];
            status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        }
        else {
            var s = status.split(' ');
            status = '';
            for (i = 0; i < s.length; i++) {
                if (s[i] != '')
                    s[i] = s[i][0].toUpperCase() + s[i].slice(1);
            }
            status = s.join(' ');
        }
        criteria.push(status.toLowerCase());
        $('#StatusFilterAdmin div').each(function () {
            if ($(this).text().toLowerCase() == status.toLowerCase())
                id = $(this)[0].id;
        });
        obj[id] = status;
        ResetStatusFilterAdmin('Clear');
        $.each(obj, function (key, value) {
            $("#" + key).replaceWith("<div id='" + key + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)' checked='checked'>" + value + "</label></div>");
        });

        $('#AdminTravelRequestGrid').empty();
        $('#AdminDashboardTabResultCount').empty();
        FilterRequest('Admin', true);
        //ApplyStatusFilterAdmin(criteria);
        //$.unblockUI();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js AdminTravelRequestViewItem()-->" + error);
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
                $("#RequestStatus").append("<option value='" + key + "'>" + value + "</option>");
                $("#RequestStatus_Self").append("<option value='" + key + "'>" + value + "</option>");
                if (value != "All") {
                    $("#StatusFilter").append("<div id='" + cnt + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                    $("#StatusFilterSelf").append("<div id='" + cnt + "_Self'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
                    cnt = cnt + 1;
                }
            });
        },
        function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js LoadStatus()-->" + error);
    }
}

function LoadApproverTravelRequest(invokingColumnId) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var arrDashboardStatus;
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
    var selectedMonth = $('#thirdMonth').text().split(" ")[0];
    var selectedYear = $('#thirdMonth').text().split(" ")[2];
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    var lastSortedColumn = $('th[asc="desc"]').attr('id');
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

    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
        "TravelRequest/TravelRequest/GetApproverTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
        //"TravelRequest/TravelRequest/GetApproverTravelRequest/632AB514-23B6-4157-99D5-281DCEE6114B/1104/" + selectedMonth + "/" + selectedYear,
    "POST",
    null,
    function (response) {
        if (response.data.length > 0) {
            if (PageIndex == 1) { $("#ApproverTravelRequestGrid").empty(); }
            $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
            $("#hdncorporateId").val("1104");
            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#ApproverTravelRequestGrid").append(newRow);

            });
            $('th#' + invokingColumnId).attr("asc", sortingType);
            $("#ApproverGridheadings i").removeClass("active")
            $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
            if ($("#ApproverTravelRequestGrid").children().length > 0) {
                //var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                //$("#ApproverTravelRequestGrid").append(ViewAllRow);
            }
            isLoadingData = false;
            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0,0,0,0"
            }
            arrDashboardStatus = response.dashboardStatus.split(",");
            var pendingCnt = parseFloat(arrDashboardStatus[0]);
            var approvedCnt = parseFloat(arrDashboardStatus[1]);
            var rejectedCnt = parseFloat(arrDashboardStatus[2]);
            var IRpendingCnt = parseFloat(arrDashboardStatus[3]);
            var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
            var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);


            if (PageIndex == 1) {
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
                $("#hdnConstantTotalResults").val(parseInt(response.count));

                //Dashboard status count on page load
                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
                $('#IRPending').html(ConvertNumber(IRpendingCnt));
                $('#IRApproved').html(ConvertNumber(IRapprovedCnt));
                $('#IRRejected').html(ConvertNumber(IRrejectedCnt));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }

            var originalGrid = $('#ApproverGrid tr.row_main:has(td)').map(function (i, v) {
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
                if (response.dashboardStatus == "") {
                    response.dashboardStatus = "0,0,0,0,0,0"
                }
                arrDashboardStatus = response.dashboardStatus.split(",");
                var pendingCnt = parseFloat(arrDashboardStatus[0]);
                var approvedCnt = parseFloat(arrDashboardStatus[2]);
                var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                var IRpendingCnt = parseFloat(arrDashboardStatus[1]);
                var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
                var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>You don’t have any Travel Request.</h4></td></tr>";
                $("#ApproverTravelRequestGrid").empty();
                $("#dashboardMyApprovalsTabResultCount").empty();
                $("#ApproverTravelRequestGrid").append(newRow);

                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
                $('#IRPending').html(ConvertNumber(IRpendingCnt));
                $('#IRApproved').html(ConvertNumber(IRapprovedCnt));
                $('#IRRejected').html(ConvertNumber(IRrejectedCnt));
                $.unblockUI();
            }
        }
        if (arrDashboardStatus[0] == 0)
            $('#TRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRPending_Anchor').attr("onclick", "ApprTravelRequestViewItem('travel request submitted')").removeClass("rez-nolinks");
        if (arrDashboardStatus[1] == 0)
            $('#TRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRApproved_Anchor').attr("onclick", "ApprTravelRequestViewItem('travel request approved')").removeClass("rez-nolinks");
        if (arrDashboardStatus[2] == 0)
            $('#TRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRRejected_Anchor').attr("onclick", "ApprTravelRequestViewItem('travel request rejected')").removeClass("rez-nolinks");
        if (arrDashboardStatus[3] == 0)
            $('#IRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRPending_Anchor').attr("onclick", "ApprTravelRequestViewItem('itinerary review')").removeClass("rez-nolinks");
        if (arrDashboardStatus[4] == 0)
            $('#IRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRApproved_Anchor').attr("onclick", "ApprTravelRequestViewItem('itinerary approved')").removeClass("rez-nolinks");
        if (arrDashboardStatus[5] == 0)
            $('#IRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRRejected_Anchor').attr("onclick", "ApprTravelRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");
    },
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function rzeDboardFootable() {
    $('.table').footable({
        "breakpoints": {
            "xxs": 320,
            "xs": 480, // extra small
            "sm": 768, // small
            "md": 992, // medium
            "lg": 1200 // large
        }
    });
    $("#ApproverTravelRequestGrid td:empty").addClass("emptytd");
    $("#SelfTravelRequestGrid td:empty").addClass("emptytd");
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
        if ($("#myTab").children().length >= DashBoardTabSliderLenthCnt) {
            var clickedTab = RequestNo + "//" + RequestType;
            sessionStorage.ClickedTab = JSON.stringify(clickedTab);
        }
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js gototravelrequestedit()-->" + error);
    }
}

function LoadNonApproverTravelRequest(invokingColumnId) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var arrDashboardStatus;
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
    var selectedMonth = $('#thirdMonth_Self').text().split(" ")[0];
    var selectedYear = $('#thirdMonth_Self').text().split(" ")[2];
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;

    if (invokingColumnId === undefined) {
        invokingColumnId = "RequestDate_Self";
        var sortingType = "desc";
    }
    else if (invokingColumnId !== undefined) {
        if ($('th#' + invokingColumnId).attr("asc") == "asc" && IsScroll == "false")
            var sortingType = "desc";
        else
            if (IsScroll == "true") {
                var sortingType = $('th#' + invokingColumnId).attr("asc");
            }
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
        "TravelRequest/TravelRequest/GetNonApproverTravelRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
    "POST",
    null,
    function (response) {
        if (response.data.length == 0) { PageIndex = 1; }

        if (response.data.length > 0) {
            if (PageIndex == 1) { $("#SelfTravelRequestGrid").empty(); }
            $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
            $("#hdncorporateId").val("1104");
            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#SelfTravelRequestGrid").append(newRow);
                //dlo
            });
            $('th#' + invokingColumnId).attr("asc", sortingType);
            $("#SelfRequestGridheadings i").removeClass("active")
            $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
            isLoadingData = false;

            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0,0,0,0,0"
            }
            arrDashboardStatus = response.dashboardStatus.split(",");

            var savedCnt = parseFloat(arrDashboardStatus[0]);
            var submittedCnt = parseFloat(arrDashboardStatus[1]);
            var approvedCnt = parseFloat(arrDashboardStatus[2]);
            var rejectedCnt = parseFloat(arrDashboardStatus[3]);
            var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
            var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
            var SubForApprovalCnt = parseFloat(arrDashboardStatus[6]);
            if (PageIndex == 1) {
                //Dashboard status count on page load

                $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                $("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                $("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
                $("#SubForApproval_Self").html(ConvertNumber(SubForApprovalCnt));
                //
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#myselfTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#myselfTabResultCount").show();
                $("#hdnTotalResultsCount").val(parseInt(response.count));
                $("#hdnConstantTotalResults").val(parseInt(response.count));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#myselfTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#myselfTabResultCount").show();
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }

            var originalSelfGrid = $('#SelfRequestGrid tr.row_main:has(td)').map(function (i, v) {
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
            sessionStorage.originalSelfGrid = JSON.stringify(originalSelfGrid);
            //if ($("#SelfTravelRequestGrid").children().length > 0) {
            //    var ViewAllRow = "<tr id=rzebtn><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
            //    $("#SelfTravelRequestGrid").append(ViewAllRow);
            //}
            $.unblockUI();
        }
        else {
            if (PageIndex == 1) {
                if (response.dashboardStatus == "") {
                    response.dashboardStatus = "0,0,0,0,0,0,0"
                }
                arrDashboardStatus = response.dashboardStatus.split(",");
                var savedCnt = parseFloat(arrDashboardStatus[0]);
                var submittedCnt = parseFloat(arrDashboardStatus[1]);
                var approvedCnt = parseFloat(arrDashboardStatus[2]);
                var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
                var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
                var SubForApprovalCnt = parseFloat(arrDashboardStatus[6]);
                var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>You don’t have any Travel Request.</h4></td></tr>";
                $("#SelfTravelRequestGrid").empty();
                $("#myselfTabResultCount").empty();
                $("#SelfTravelRequestGrid").append(newRow);

                $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                $("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                $("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
                $("#SubForApproval_Self").html(ConvertNumber(SubForApprovalCnt));
                $.unblockUI();
            }
        }

        //if (CallFrom == "calenderBack") {
        //    return false;
        //}
        if (savedCnt == 0)
            $('#TRSaved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRSaved_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('Travel Request draft')").removeClass("rez-nolinks");

        if (rejectedCnt == 0)
            $('#TRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRRejected_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('Travel Request rejected')").removeClass("rez-nolinks");

        if (submittedCnt == 0)
            $('#TRSubmitted_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRSubmitted_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('Travel Request submitted')").removeClass("rez-nolinks");

        if (approvedCnt == 0)
            $('#TRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRApproved_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('Travel Request approved')").removeClass("rez-nolinks");

        if (IRapprovedCnt == 0)
            $('#IRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRApproved_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('itinerary approved')").removeClass("rez-nolinks");

        if (IRrejectedCnt == 0)
            $('#IRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRRejected_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");

        if (SubForApprovalCnt == 0)
            $('#SubForApproval_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#SubForApproval_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('submit for approval')").removeClass("rez-nolinks");

    }
    ,
    function (XMLHttpRequest, textStatus, errorThrown) { },
    "json"
    );
}

function LoadAdminRequest(CallBy, invokingColumnId) {
    if (CallBy == 'AdminDashboard') {
        $('#hdnCalledByAdminDashboard').val("true");
    }
    if (intervals.length > 0)
        intervals.forEach(clearInterval);
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var arrDashboardStatus;
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

    var selectedMonth = $('#thirdMonth_Admin').text().split(" ")[0];
    var selectedYear = $('#thirdMonth_Admin').text().split(" ")[2];
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;

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
        $('#hdnStatusFilterOnCount').val('0');
        if (response.data.length == 0) { PageIndex = 1; }
        var IRSubmittedCnt = parseFloat('0');
        var TicketedCnt = parseFloat('0');
        var BookingSubmittedCnt = parseFloat('0');
        var CreateItinerayCnt = parseFloat('0');
        var itinerayCreatedCnt = parseFloat('0');
        var ItineraryApprovedCnt = parseFloat('0');

        var i = 0;
        var rotator;
        if (response.data.length > 0) {
            if (PageIndex == 1) { $("#AdminTravelRequestGrid").empty(); }
            $.each(response.data, function (key, value) {
                var countDownTime = new Date(value.TicketingTimeLine).getTime();
                if (IsCBTSonata) {
                    $('#TicketingTimeline_Admin').remove();
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                }
                else
                    var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td class="text-center"><span data-CountTime ="' + countDownTime + '" id="timer_' + value.RequestNo + '" class="rze-timer">' + value.TicketingTimeLine + '</span></td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';

                $("#AdminTravelRequestGrid").append(newRow); timerCnt++;
                $('th#' + invokingColumnId).attr("asc", sortingType);
                $("#AdminRequestGridheadings i").removeClass("active")
                $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
                if (value.RequestStatusValue == 10) {
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
                    //if (value.RequestStatus.toLowerCase() == "itinerary submitted")
                    //    IRSubmittedCnt = IRSubmittedCnt + 1;
                    //if (value.RequestStatus.toLowerCase() == "booking submitted")
                    //    BookingSubmittedCnt = BookingSubmittedCnt + 1;
                    //if (value.RequestStatus.toLowerCase() == "ticketed")
                    //    TicketedCnt = TicketedCnt + 1;
                }
                else {
                    if (value.RequestStatusValue == 9) {
                        $("#timer_" + value.RequestNo).removeClass().html("-- : -- : --");
                    }
                    else {
                        $("#timer_" + value.RequestNo).removeClass().html("00 : 00 : 00");
                    }
                }
            });
            isLoadingData = false;
            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0"
            }
            arrDashboardStatus = response.dashboardStatus.split(",");
            IRSubmittedCnt = parseFloat(arrDashboardStatus[0]);
            BookingSubmittedCnt = parseFloat(arrDashboardStatus[1]);
            TicketedCnt = parseFloat(arrDashboardStatus[2]);
            if (IsCBTSonata) {
                CreateItinerayCnt = parseFloat(arrDashboardStatus[3]);
                itinerayCreatedCnt = parseFloat(arrDashboardStatus[4]);
                ItineraryApprovedCnt = parseFloat(arrDashboardStatus[5]);
            }
            if (PageIndex == 1) {
                //Dashboard status count on page load
                $("#IRSubmitted_Admin").html(IRSubmittedCnt);
                $("#BookingSubmitted_Admin").html(BookingSubmittedCnt);
                $("#Ticketed_Admin").html(TicketedCnt);
                $("#CreateItinerary_Admin").html(CreateItinerayCnt);
                $("#ItineraryCreated_Admin").html(itinerayCreatedCnt);
                $("#ItineraryApproved_Admin").html(ItineraryApprovedCnt);
                //
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#AdminDashboardTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#AdminDashboardTabResultCount").show();
                $("#hdnTotalResultsCount").val(parseInt(response.count));
                $("#hdnConstantTotalResults").val(parseInt(response.count));
            }
            else {
                CurrentCount = $("#hdnShowCount").val();
                CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                $("#hdnShowCount").val(parseInt(CurrentCount));
                $("#AdminDashboardTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                $("#AdminDashboardTabResultCount").show();
                $("#hdnTotalResultsCount").val(parseInt(response.count));
            }
            if (IsCBTSonata) {
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
                        TicketingTimeLine_Admin: $td.eq(5).children()[0].getAttribute("data-CountTime"),
                        RequestStatus_Admin: $td.eq(6).text(),
                        TimeLine_Admin: $td.eq(5).text(),
                        Action_Admin: $td.eq(7).text()
                    }
                }).get();
            }
            sessionStorage.originalAdminGrid = JSON.stringify(originalAdminGrid);
            if ($("#AdminTravelRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#AdminTravelRequestGrid").append(ViewAllRow);
            }
            $.unblockUI();
        }
        else {
            var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
            $("#AdminTravelRequestGrid").empty();
            $("#AdminDashboardTabResultCount").empty();
            $("#AdminTravelRequestGrid").append(newRow);
            $("#IRSubmitted_Admin").html(ConvertNumber(IRSubmittedCnt));
            $("#BookingSubmitted_Admin").html(ConvertNumber(BookingSubmittedCnt));
            $("#Ticketed_Admin").html(ConvertNumber(TicketedCnt));
            $.unblockUI();
        }
        if (IRSubmittedCnt == 0)
            $('#IRSubmitted_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#IRSubmitted_Anchor').attr("onclick", "AdminTravelRequestViewItem('Itinerary Submitted')").removeClass("rez-nolinks");

        if (BookingSubmittedCnt == 0)
            $('#BookingSubmitted_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#BookingSubmitted_Anchor').attr("onclick", "AdminTravelRequestViewItem('Booking Submitted')").removeClass("rez-nolinks");

        if (TicketedCnt == 0)
            $('#Ticketed_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#Ticketed_Anchor').attr("onclick", "AdminTravelRequestViewItem('Ticketed')").removeClass("rez-nolinks");

        if (CreateItinerayCnt == 0)
            $('#CreateItinerary_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#CreateItinerary_Anchor').attr("onclick", "AdminTravelRequestViewItem('Create Itinerary')").removeClass("rez-nolinks");

        if (itinerayCreatedCnt == 0)
            $('#ItineraryCreated_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#ItineraryCreated_Anchor').attr("onclick", "AdminTravelRequestViewItem('Itinerary Created')").removeClass("rez-nolinks");

        if (ItineraryApprovedCnt == 0)
            $('#ItineraryApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#ItineraryApproved_Anchor').attr("onclick", "AdminTravelRequestViewItem('Itinerary Approved')").removeClass("rez-nolinks");

    }
 ,
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function FilterRequest(tabname, Submit) {
    try {
        if ($("#rze-overlayAssociates").hasClass("overlaybox")) {
            SearchToggle('Associates');
        }
        if ($("#rze-overlaySelf").hasClass("overlaybox")) {
            SearchToggle('Self');
        }
        if (Submit) { PageIndex = 1 }
        if (PageIndex == 1) { $("#hdnShowCount").val("0"); }
        $("#hdnIsFilterApplied").val(true);
        $("#hdnFilterRequestType").val(tabname);

        var statusFilterApplied;
        if (tabname.toLowerCase() != 'self') {
            if ($('#hdnStatusFilterOnCount').val() != '0')
                statusFilterApplied = $('#hdnStatusFilterOnCount').val();
            else
                statusFilterApplied = "NoFilter";
        }
        else { statusFilterApplied = "NoFilter"; }

        if (tabname == 'Admin' || tabname == 'Associates') {
            if ($('#hdnStatusFilterOnCount').val() != '0')
                statusFilterApplied = $('#hdnStatusFilterOnCount').val();
            else
                statusFilterApplied = "NoFilter";
        }

        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var isApprover = $('#MyAssociates').hasClass("active");
        var isAdmin = $('#IsAdmin').val();
        if (isAdmin == 'false') {
            if (!isApprover) {
                var requestStartDate_Self = new Date(moment($("#RequestStartDate_Self").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestStartDate_Self == null || requestStartDate_Self == "" || requestStartDate_Self == undefined || requestStartDate_Self == "Invalid Date") {
                    $("#RequestStartDate_Self").val("");
                }
                var requestEndDate_Self = new Date(moment($("#RequestEndDate_Self").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestEndDate_Self == null || requestEndDate_Self == "" || requestEndDate_Self == undefined || requestEndDate_Self == "Invalid Date") {
                    $("#RequestEndDate_Self").val("");
                }
                var requestedDate_Self = new Date(moment($("#RequestedDate_Self").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestedDate_Self == null || requestedDate_Self == "" || requestedDate_Self == undefined || requestedDate_Self == "Invalid Date") {
                    $("#RequestedDate_Self").val("");
                }
                if (requestStartDate_Self != null && requestStartDate_Self != "" && requestStartDate_Self != undefined && requestStartDate_Self != "Invalid Date" && requestEndDate_Self != null && requestEndDate_Self != "" && requestEndDate_Self != undefined && requestEndDate_Self != "Invalid Date") {
                    if (IsInvalidDateRange(requestStartDate_Self, requestEndDate_Self) == true) {
                        $.unblockUI();
                        alertmsg("Travelled-From date is greater than Travelled-To date");
                        return false;
                    }
                }
                var IsAdmin = false;
                var company = '';
                var RequestStartDate = $('#RequestStartDate_Self').val();
                var RequestEndDate = $('#RequestEndDate_Self').val();
                var RequestedDate = $('#RequestedDate_Self').val();
                var RequestStatus = $('#RequestStatus_Self').val();
                var TripName = $('#TripName_Self').val();
                var TravellerName = $('#TravellerName_Self').val();
                var TravellerDestination = $('#TravellerDestination_Self').val();
                var RequestNo = $('#RequestNo_Self').val();

            }
            else {
                var requestStartDate = new Date(moment($("#RequestStartDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestStartDate == null || requestStartDate == "" || requestStartDate == undefined || requestStartDate == "Invalid Date") {
                    $("#RequestStartDate").val("");
                }
                var requestEndDate = new Date(moment($("#RequestEndDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestEndDate == null || requestEndDate == "" || requestEndDate == undefined || requestEndDate == "Invalid Date") {
                    $("#RequestEndDate").val("");
                }
                var requestedDate = new Date(moment($("#RequestedDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
                if (requestedDate == null || requestedDate == "" || requestedDate == undefined || requestedDate == "Invalid Date") {
                    $("#RequestedDate").val("");
                }
                if (requestStartDate != null && requestStartDate != "" && requestStartDate != undefined && requestStartDate != "Invalid Date" && requestEndDate != null && requestEndDate != "" && requestEndDate != undefined && requestEndDate != "Invalid Date") {
                    if (IsInvalidDateRange(requestStartDate, requestEndDate) == true) {
                        $.unblockUI();
                        alertmsg("Travelled-From date is greater than Travelled-To date");
                        return false;
                    }
                }
                var IsAdmin = false;
                var company = '';
                var RequestStartDate = $('#RequestStartDate').val();
                var RequestEndDate = $('#RequestEndDate').val();
                var RequestedDate = $('#RequestedDate').val();
                var RequestStatus = $('#RequestStatus').val();
                var TripName = $('#TripName').val();
                var TravellerName = $('#TravellerName').val();
                var TravellerDestination = $('#TravellerDestination').val();
                var RequestNo = $('#RequestNo').val();

                if (RequestStatus != null || RequestStatus != "") {
                    if (RequestStatus == "6") {
                        statusFilterApplied = "ITR-Pending";
                    }
                    else if (RequestStatus == "2") {
                        statusFilterApplied = "TRPending";
                    }
                    else if (RequestStatus == "3") {
                        statusFilterApplied = "TRApproved";
                    }
                    else if (RequestStatus == "4") {
                        statusFilterApplied = "TRRejected";
                    }
                    else if (RequestStatus == "7") {
                        statusFilterApplied = "ITR-Approved";
                    }
                    else if (RequestStatus == "8") {
                        statusFilterApplied = "ITR-Rejected";
                    }
                    else {
                    }
                }
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
        // need to provide request start date from calender last 3 month...????
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
        if (RequestStartDate == "" && RequestEndDate == "" && tabname == 'Associates') { //sethu uat fix
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var selectedMonth = $('#thirdMonth').text().split(" ")[0];
            var selectedYear = $('#thirdMonth').text().split(" ")[2];
            selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
            RequestEndDate = convertDate(new Date(selectedYear, selectedMonth));
        }
        else if (RequestStartDate == "" && RequestEndDate == "" && tabname == 'self') {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var selectedMonth = $('#thirdMonth_Self').text().split(" ")[0];
            var selectedYear = $('#thirdMonth_Self').text().split(" ")[2];
            selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
            RequestEndDate = convertDate(new Date(selectedYear, selectedMonth));
        }
        else {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            var selectedMonth = $('#thirdMonth_Admin').text().split(" ")[0];
            var selectedYear = $('#thirdMonth_Admin').text().split(" ")[2];
            selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
            RequestEndDate = convertDate(new Date(selectedYear, selectedMonth));
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
            $('#hdnStatusFilterOnCount').val('0');
            if (isAdmin == 'false') {
                if (isApprover) {
                    if (response.data.length > 0) {
                        if (PageIndex == 1) { $("#ApproverTravelRequestGrid").empty(); }
                        $.each(response.data, function (key, value) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#ApproverTravelRequestGrid").append(newRow);
                        });
                        isLoadingData = false;
                        if ($("#ApproverTravelRequestGrid").children().length > 0) {
                            var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                            $("#ApproverTravelRequestGrid").append(ViewAllRow);
                            GetHover();
                        }
                        SearchToggle(tabname);
                        HideSearchToggle(tabname);
                        $.unblockUI();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#ApproverTravelRequestGrid").empty();
                        $("#dashboardMyApprovalsTabResultCount").empty();
                        $("#ApproverTravelRequestGrid").append(newRow);
                        SearchToggle(tabname);
                        $.unblockUI();
                    }
                    if (PageIndex == 1) {
                        $("#hdnShowCount").val(parseInt(response.data.length));
                        $("#dashboardMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                    else {
                        CurrentCount = $("#hdnShowCount").val();
                        CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                        $("#hdnShowCount").val(parseInt(CurrentCount));
                        $("#dashboardMyApprovalsTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                }
                else {
                    if (response.data.length > 0) {
                        $("#hdnShowCount").val(parseInt(response.data.length) + parseInt($("#hdnShowCount").val()))
                        if (PageIndex == 1) { $("#SelfTravelRequestGrid").empty(); }
                        $.each(response.data, function (key, value) {
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                            $("#SelfTravelRequestGrid").append(newRow);
                        });
                        isLoadingData = false;
                        if ($("#SelfTravelRequestGrid").children().length > 0) {
                            var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                            $("#SelfTravelRequestGrid").append(ViewAllRow);
                            GetHover();
                        }
                        tabname = "Self";
                        SearchToggle(tabname);
                        HideSearchToggle(tabname);
                        $.unblockUI();
                    }
                    else {
                        var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                        $("#SelfTravelRequestGrid").empty();
                        $("#myselfTabResultCount").empty();
                        $("#SelfTravelRequestGrid").append(newRow);
                        tabname = "Self";
                        SearchToggle(tabname);
                        $.unblockUI();
                    }

                    if (PageIndex == 1) {
                        $("#hdnShowCount").val(parseInt(response.data.length));
                        $("#myselfTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                    else {
                        CurrentCount = $("#hdnShowCount").val();
                        //CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                        $("#hdnShowCount").val(parseInt(CurrentCount));
                        $("#myselfTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                        $("#hdnTotalResultsCount").val(parseInt(response.count));
                    }
                }
            }
            else {
                if (response.data.length > 0) {
                    var i = 0;
                    var rotator;
                    if (intervals.length > 0)
                        intervals.forEach(clearInterval);
                    //$("#hdnShowCount").val(parseInt(response.data.length) + parseInt($("#hdnShowCount").val()))
                    if (PageIndex == 1) { $("#AdminTravelRequestGrid").empty(); }
                    $.each(response.data, function (key, value) {
                        var countDownTime = new Date(value.TicketingTimeLine).getTime();
                        if (IsCBTSonata) {
                            $('#TicketingTimeLine_Admin').remove();
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        }
                        else
                            var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.CorporateName + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td class="text-center"><span data-CountTime ="' + countDownTime + '" id="timer_' + value.RequestNo + '" class="rze-timer">' + value.TicketingTimeLine + '</span></td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.CorporateName + '\',\'Admin\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
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
                        } else {
                            if (value.RequestStatusValue == 9) {
                                $("#timer_" + value.RequestNo).removeClass().html("-- : -- : --");
                            }
                            else {
                                $("#timer_" + value.RequestNo).removeClass().html("00 : 00 : 00");
                            }
                        }
                    });
                    isLoadingData = false;
                    GetHover();
                    if ($("#AdminTravelRequestGrid").children().length > 0) {
                        var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                        $("#AdminTravelRequestGrid").append(ViewAllRow);
                    }
                    SearchToggle(tabname);
                    HideSearchToggle(tabname);
                    $.unblockUI();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#AdminTravelRequestGrid").empty();
                    $("#AdminTravelRequestGrid").append(newRow);
                    SearchToggle(tabname);
                    $.unblockUI();
                }
                if (PageIndex == 1) {
                    $("#hdnShowCount").val(parseInt(response.data.length));
                    $("#AdminDashboardTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                    $("#AdminDashboardTabResultCount").show();
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
                else {
                    CurrentCount = $("#hdnShowCount").val();
                    CurrentCount = parseInt(CurrentCount) + parseInt(response.data.length);
                    $("#hdnShowCount").val(parseInt(CurrentCount));
                    $("#AdminDashboardTabResultCount").html("Showing " + CurrentCount + " " + "of " + response.count);
                    $("#AdminDashboardTabResultCount").show();
                    $("#hdnTotalResultsCount").val(parseInt(response.count));
                }
            }

            //if (tabname.toLowerCase() != 'self')
            //    ResetStatusFilter('Clear');
            //else
            //    ResetStatusFilterSelf('Clear');

        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js FilterRequest()-->" + error);
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
        $().Logger.error("TravelRequestDashboard.js convertDate()-->" + error);
    }
}

function ConvertNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

function LoadCalender() {
    try {
        $('#calenderBackward').attr("onclick", "calenderBackward('');")
        $('#calenderForward').attr("onclick", "calenderForward('');")
        $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
        $('#calenderForward_Self').attr("onclick", "calenderForward('self');")
        $('#calenderBackward_Admin').attr("onclick", "calenderBackward('Admin');")
        $('#calenderForward_Admin').attr("onclick", "calenderForward('Admin');")

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        var now = new Date();

        var d = new Date(),

        n = d.getMonth(),

        day = d.getDay(),

        y = d.getFullYear();


        var presentMonth = new Date();

        var oneMonthsFromNow = new Date(y, n - 1, day);

        var twoMonthsFromNow = new Date(y, n - 2, day);

        $('#thirdMonth_Self').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

        $('#secondMonth_Self').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

        $('#firstMonth_Self').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());

        $('#thirdMonth_Admin').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

        $('#secondMonth_Admin').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

        $('#firstMonth_Admin').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());

        $('#thirdMonth').html(monthNames[presentMonth.getMonth()].substring(0, 3) + "  " + presentMonth.getFullYear());

        $('#secondMonth').html(monthNames[oneMonthsFromNow.getMonth()].substring(0, 3) + "  " + oneMonthsFromNow.getFullYear());

        $('#firstMonth').html(monthNames[twoMonthsFromNow.getMonth()].substring(0, 3) + "  " + twoMonthsFromNow.getFullYear());
        CalenderRestriction();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js LoadCalender()-->" + error);
    }
}

function CalenderRestriction() {
    try {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        var now = new Date();
        var presentMonthNo = now.getMonth();
        var presentYear = now.getFullYear();
        var presentMonth = monthNames[presentMonthNo];
        var CalenderUpperLimitMonth = $('#thirdMonth').text().split(" ")[0];
        var CalenderUpperLimitYear = $('#thirdMonth').text().split(" ")[2];
        if (CalenderUpperLimitMonth == presentMonth && CalenderUpperLimitYear == presentYear)
            $('#calenderForward').removeAttr("onclick");

        var CalenderLowerLimitMonth = $('#firstMonth').text().split(" ")[0];
        var CalenderLowerLimitYear = $('#firstMonth').text().split(" ")[2];
        if (CalenderLowerLimitMonth == "Jan" && CalenderLowerLimitYear == "2017")
            $('#calenderBackward').removeAttr("onclick");


        var CalenderUpperLimitMonth_Self = $('#thirdMonth_Self').text().split(" ")[0];
        var CalenderUpperLimitYear_Self = $('#thirdMonth_Self').text().split(" ")[2];
        if (CalenderUpperLimitMonth_Self == presentMonth && CalenderUpperLimitYear_Self == presentYear)
            $('#calenderForward_Self').removeAttr("onclick");

        var CalenderLowerLimitMonth_Self = $('#firstMonth_Self').text().split(" ")[0];
        var CalenderLowerLimitYear_Self = $('#firstMonth_Self').text().split(" ")[2];
        if (CalenderLowerLimitMonth_Self == "Jan" && CalenderLowerLimitYear_Self == "2017")
            $('#calenderBackward_Self').removeAttr("onclick");

        var CalenderUpperLimitMonth_Admin = $('#thirdMonth_Admin').text().split(" ")[0];
        var CalenderUpperLimitYear_Admin = $('#thirdMonth_Admin').text().split(" ")[2];
        if (CalenderUpperLimitMonth_Admin == presentMonth && CalenderUpperLimitYear_Admin == presentYear)
            $('#calenderForward_Admin').removeAttr("onclick");

        var CalenderLowerLimitMonth_Admin = $('#firstMonth_Admin').text().split(" ")[0];
        var CalenderLowerLimitYear_Admin = $('#firstMonth_Admin').text().split(" ")[2];
        if (CalenderLowerLimitMonth_Admin == "Jan" && CalenderLowerLimitYear_Admin == "2017")
            $('#calenderBackward_Admin').removeAttr("onclick");
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js CalenderRestriction()-->" + error);
    }
}

function SelectCalender(element) {
    try {
        $('#hdnSelectCalenderMonth').html(element.innerText.split(" ")[0].split("[")[1]);
        $('#hdnSelectCalenderYear').html(element.innerText.split(" ")[1].split("]")[0]);
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js SelectCalender()-->" + error);
    }
}

function calenderBackward(page) {
    try {
        ResetRequest()
        PageIndex = 1;
        $("#hdnShowCount").val("0");
        var calender = '';
        var firstCalenderDate = new Date();
        var secondCalenderDate = new Date();
        var thirdCalenderDate = new Date();
        var now = new Date();
        if (page.toLowerCase() == 'self') {
            calender = $('#firstMonth_Self').text();
        }
        else if (page.toLowerCase() == 'admin') {
            calender = $('#firstMonth_Admin').text();
        }
        else {
            calender = $('#firstMonth').text();
        }
        var selectedMonth = calender.split(" ")[0];
        var selectedYear = calender.split(" ")[2];
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        if (selectedYear == '2017') {
            var month = $.inArray(selectedMonth, monthNames);
            var janMonth = $.inArray('Jan', monthNames);
            var diff = month - janMonth;
            var preMonth = $.inArray(selectedMonth, monthNames);
            var PresentDate = new Date(selectedYear, preMonth, 1);
            var oneMonthsFromNow = new Date(PresentDate.setMonth(month - 1));
            var PresentDate = new Date(selectedYear, preMonth, 1);
            var oneMonthsAfter = new Date(PresentDate.setMonth(month + 1));
            var PresentDate = new Date(selectedYear, preMonth, 1);
            firstCalenderDate = oneMonthsFromNow;
            secondCalenderDate = PresentDate;
            thirdCalenderDate = oneMonthsAfter;
        }


        if (page.toLowerCase() == 'self') {
            $('#firstMonth_Self').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth_Self').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth_Self').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadNonApproverTravelRequest();
        }
        else if (page.toLowerCase() == 'admin') {
            $('#firstMonth_Admin').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth_Admin').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth_Admin').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadAdminRequest('AdminDashboard');
        }
        else {
            $('#firstMonth').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadApproverTravelRequest();
        }
        $('#calenderBackward').attr("onclick", "calenderBackward('');")
        $('#calenderForward').attr("onclick", "calenderForward('');")
        $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
        $('#calenderForward_Self').attr("onclick", "calenderForward('self');")
        $('#calenderBackward_Admin').attr("onclick", "calenderBackward('Admin');")
        $('#calenderForward_Admin').attr("onclick", "calenderForward('Admin');")
        CalenderRestriction();
    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js calenderBackward()-->" + error);
    }
}

function calenderForward(page) {
    try {
        ResetRequest()
        PageIndex = 1;
        $("#hdnShowCount").val("0");
        var firstCalenderDate = new Date();
        var secondCalenderDate = new Date();
        var thirdCalenderDate = new Date();
        var calender = '';
        var now = new Date();
        if (page.toLowerCase() == "self") {
            calender = $('#thirdMonth_Self').text();
        }
        else if (page.toLowerCase() == 'admin') {
            calender = $('#firstMonth_Admin').text();
        }
        else {
            calender = $('#thirdMonth').text();
        }
        var selectedMonth = calender.split(" ")[0];
        var selectedYear = calender.split(" ")[2];
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var month = $.inArray(selectedMonth, monthNames);
        var presentMonth = now.getMonth();
        if ((presentMonth - month) > 2) {
            var month = $.inArray(selectedMonth, monthNames);
            var PresentDate = new Date(selectedYear, month, 1);
            var oneMonthsAfterNow = new Date(PresentDate.setMonth(month + 1));
            PresentDate = new Date(selectedYear, month, 1);
            var secondMonthsAfterNow = new Date(PresentDate.setMonth(month + 2));
            PresentDate = new Date(selectedYear, month, 1);
            var thirdMonthsAfterNow = new Date(PresentDate.setMonth(month + 3));
            firstCalenderDate = oneMonthsAfterNow;
            secondCalenderDate = secondMonthsAfterNow;
            thirdCalenderDate = thirdMonthsAfterNow;
        }
        else {
            var diff = presentMonth - month;
            var preMonth = $.inArray(selectedMonth, monthNames);
            var PresentDate = new Date(selectedYear, preMonth, 1);
            var oneMonthsFromNow = new Date(PresentDate.setMonth(month - 1));
            var PresentDate = new Date(selectedYear, preMonth, 1);
            var oneMonthsAfter = new Date(PresentDate.setMonth(month + 1));
            var PresentDate = new Date(selectedYear, preMonth, 1);
            firstCalenderDate = oneMonthsFromNow;
            secondCalenderDate = PresentDate;
            thirdCalenderDate = oneMonthsAfter;
        }


        if (page.toLowerCase() == "self") {
            $('#firstMonth_Self').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth_Self').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth_Self').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadNonApproverTravelRequest();
        }
        else if (page.toLowerCase() == "admin") {
            $('#firstMonth_Admin').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth_Admin').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth_Admin').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadAdminRequest('AdminDashboard');
        }
        else {
            $('#firstMonth').html(monthNames[firstCalenderDate.getMonth()] + "  " + firstCalenderDate.getFullYear());

            $('#secondMonth').html(monthNames[secondCalenderDate.getMonth()] + "  " + secondCalenderDate.getFullYear());

            $('#thirdMonth').html(monthNames[thirdCalenderDate.getMonth()] + "  " + thirdCalenderDate.getFullYear());

            LoadApproverTravelRequest();
        }
        $('#calenderBackward').attr("onclick", "calenderBackward('');")
        $('#calenderForward').attr("onclick", "calenderForward('');")
        $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
        $('#calenderForward_Self').attr("onclick", "calenderForward('self');")
        $('#calenderBackward_Admin').attr("onclick", "calenderBackward('Admin');")
        $('#calenderForward_Admin').attr("onclick", "calenderForward('Admin');")
        CalenderRestriction();

    }
    catch (error) {
        $().Logger.error("TravelRequestDashboard.js calenderForward()-->" + error);
    }
}

function ResetRequest() {
    try {
        $("#RequestEndDate").prop('disabled', true);
        $("#RequestEndDate").css('background', '#e0dcdc');
        $("#RequestEndDateLbl .btn").css('background', '#e0dcdc');

        $("#RequestEndDate_Self").prop('disabled', true);
        $("#RequestEndDate_Self").css('background', '#e0dcdc');
        $("#RequestEndDate_SelfLbl .btn").css('background', '#e0dcdc');

        var isApprover = $('#MyAssociates').hasClass("active");
        var isAdmin = $('#IsAdmin').val();
        if (isAdmin == 'false') {
            if (!isApprover) {
                $('#RequestStartDate_Self').val('');
                $('#RequestEndDate_Self').val('');
                $('#RequestedDate_Self').val('');
                $('#RequestStatus_Self').val('');
                $('#TripName_Self').val('');
                $('#TravellerName_Self').val('');
                $('#TravellerDestination_Self').val('');
                $('#RequestNo_Self').val('');

            }
            else {
                $('#RequestStartDate').val('');
                $('#RequestEndDate').val('');
                $('#RequestedDate').val('');
                $('#RequestStatus').val('');
                $('#TripName').val('');
                $('#TravellerName').val('');
                $('#TravellerDestination').val('');
                $('#RequestNo').val('');

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
        $().Logger.error("TravelRequestDashboard.js ResetRequest()-->" + error);
    }
}


var isLoadingData;
$(window).scroll(function () {


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
            if ($('#hdnCalledByAdminDashboard').val() == "true") { LoadAdminRequest('AdminDasboard', columnForSorting); }
            else if ($('#MySelf').hasClass('active')) { LoadNonApproverTravelRequest(columnForSorting); }
            else { LoadApproverTravelRequest(columnForSorting); } //$('#MyAssociates').hasClass('active')
        }
        else {
            PageIndex++;
            var FilterRequestTabType = $('#hdnFilterRequestType').val();
            FilterRequest(FilterRequestTabType);
        }
    }
});


function closeExpTab(e, req, RequestType) {

    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            var presentKey = req + "//" + RequestType;
            var keys = Object.keys(SavedER),
            idIndex = keys.indexOf(presentKey),
            nextIndex = idIndex += 1;
            var nextKey = keys[nextIndex]
            var idNewIndex = keys.indexOf(presentKey);
            prevIndex = idNewIndex -= 1;
            var prevKey = keys[prevIndex]
            delete SavedER[req + "//" + RequestType];
            var id = "elementExp_" + req + "_" + RequestType;
            if ($("#myTab .active").attr('id') == id) {
                if (nextKey != undefined) {
                    sessionStorage.SavedER = JSON.stringify(SavedER);
                    var reqNo = nextKey.split("//")[0];
                    sessionStorage.nextTab = JSON.stringify(nextKey);
                    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + reqNo;
                    if (e.stopPropagation != undefined)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                    return false;
                }
                else if (prevKey != undefined) {
                    sessionStorage.SavedER = JSON.stringify(SavedER);
                    var reqNo = prevKey.split("//")[0];
                    sessionStorage.prevTab = JSON.stringify(prevKey);
                    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + reqNo;
                    if (e.stopPropagation != undefined)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                    return false;
                }
                else {
                    sessionStorage.SavedER = JSON.stringify(SavedER);
                    window.location = "ExpenseReports.html";
                    if (e.stopPropagation != undefined)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                    return false;
                }
            }
            else {
                sessionStorage.SavedER = JSON.stringify(SavedER);
                $("#myTab li.active").each(function () {
                    var ReqNumber = $(this).attr('id').split("_")[1];
                    var RequestType = $(this).attr('id').split("_")[2];
                    var presentKey = ReqNumber + "//" + RequestType;
                    sessionStorage.nextTab = JSON.stringify(presentKey);
                    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNumber;
                });
                if (sessionStorage.nextTab == undefined)
                    window.location = "ExpenseReports.html";
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

function getActiveExpTabDetail(tab) {
    $('#myNavbar li.active').each(function () {
        $(this).removeClass("active");
    });
    $(tab).attr('class', 'active');
    var ReqNo = tab.id.split("_")[1];
    var ReqType = tab.id.split("_")[2];
    if (ReqNo > 0) {
        var clickedTab = ReqNo + "//" + ReqType;
        sessionStorage.ClickedTab = JSON.stringify(clickedTab);
        window.location = "ExpenseSavedReport.html" + "?RequestNo=" + ReqNo;
    }
}
