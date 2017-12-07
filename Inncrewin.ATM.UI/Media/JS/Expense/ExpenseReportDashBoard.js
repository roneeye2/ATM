var intervals = [];
var timerCnt = parseFloat('0');
var PageIndex = 1;
var CurrentCount;
var skipCount;
var DashBoardExpTabSliderLenthCnt = 3;
//$(document).ready(function ()
//{

//    $('#ExpenseReports_header').load('header.html');
//    $('#footer').load('/footer.html');
//    GetHover();

//});

$(function () {
    try {
        //$('#footer').load('/footer.html',
        //    function () { FindAdminOrEmployee(); });
        $("#ExpenseReports_header").load('header.html', function () {
            if ($('#ExpenseReports_header').length > 0) {
                DashBoardExpTabSliderLenthCnt = 2;
                //SliderMoveIndex = 1;
            }
            loadExpenseReportHeaderTab();
            loadTravelRequestHeaderTab();
            $("a[href='/ExpenseReports.html']").parent().attr('class', 'active');
        });

        $('#ApproverGridheadings th i[id!="filter"]').click(function () {
            // need to get data from DB for sorting
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            PageIndex = 1;
            $("#hdnIsFilterApplied").val(false);
            $('#hdnIsScroll').val("false")
            var invokingColumnId = $(this).parent().parent().attr("id");
            $("#lastSortedColumn").remove();
            var $lastSortedColumn = $('<input/>', { type: 'hidden', id: 'lastSortedColumn', value: invokingColumnId });
            $lastSortedColumn.appendTo("#ExpenseReports_header");
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
            $lastSortedColumn.appendTo("#ExpenseReports_header");
            LoadNonApproverExpenseRequest(invokingColumnId);
        });
    }
    catch (error) {
        // $().Logger.error("TravelRequestDashboard.js #footer load()-->" + error);
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

                if ($("#myTab").children().length > DashBoardExpTabSliderLenthCnt) {
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

                if ($("#myTab").children().length > DashBoardExpTabSliderLenthCnt) {
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

function LoadDataExpenseRequestDashBoard() {
    LoadStatus();
    LoadCalender();
    $('#ApproverTab').css('display', 'none');

    var LoadedSelf = false;
    $("#TRSubmitted_Self").html(ConvertNumber(parseFloat('0')));
    $("#TRApproved_Self").html(ConvertNumber(parseFloat('0')));
    $('#MySelf').click(function () {

        $('#SelfSection').attr('class', 'tab-pane fade active in');
        $('#ApproverSection').attr('class', 'hide');
        PageIndex = 1;
        skipCount = 0;
        $('#hdnIsScroll').val("false");
        ResetStatusFilterSelf('Clear');
        LoadNonApproverExpenseRequest();
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
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var approvalArray = '';
        if (approvalArrayOriginalLowerCase != '')
            approvalArray = $.extend(true, [], approvalArrayOriginalLowerCase);
        else {
            approvalArray = $('#ApproverGrid tr.row_main:has(td)').map(function (i, v) {

                var $td = $('td', this);
                return {
                    id: ++i,
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
                    RequestStatus: $td.eq(6).text(),
                    Action: $td.eq(7).text()
                }
            }).get();
            if (approvalArrayOriginalLowerCase == '') {
                approvalArrayOriginalLowerCase = $.extend(true, [], approvalArray);
            }
        }

        var id = $(this).parent().parent()[0].id;
        var asc = (!$(this).parent().parent().attr('asc')); // switch the order, true if not set

        // set asc="asc" when sorted in ascending order
        $('#ApproverGridheadings th').each(function () {
            $(this).removeAttr('asc');
        });
        $(".rze-sortico .fa").removeClass("active");
        if (asc) {
            $(this).parent().parent().attr('asc', 'asc');
            $('#' + id + " .fa-caret-up").addClass("active");
        }
        else {
            $('#' + id + " .fa-caret-down").addClass("active");
        }

        var sort_by = function (field, reverse, primer) {
            var key = function (x) { return primer ? primer(x[field]) : x[field] };

            return function (a, b) {
                var A = key(a), B = key(b);
                return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
            }
        }

        if (id == "RequestDate") {
            approvalArray.sort(function (a, b) {
                if (asc)
                    return new Date(a.RequestDate) - new Date(b.RequestDate);
                else
                    return new Date(b.RequestDate) - new Date(a.RequestDate);
            });
        }
            //else if (id == "TravelStartDate") {
            //    approvalArray.sort(function (a, b) {
            //        if (asc)
            //            return new Date(a.TravelStartDate) - new Date(b.TravelStartDate);
            //        else
            //            return new Date(b.TravelStartDate) - new Date(a.TravelStartDate);
            //    });
            //}
        else {
            approvalArray.sort(sort_by(id, asc, function (a) { return a.toUpperCase() }));
        }
        if (approvalArray.length >= 1) {
            $("#ApproverExpenseRequestGrid").empty();
            $.each(approvalArray, function (key, value) {
                if (value.RequestBy == "Sorry, No Record Found For Your Search Criteria.")
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                else
                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                   + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                   + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                    + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                    + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                   + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Associate\');">View Details / Take Action</a></div></td></tr>';




                $("#ApproverExpenseRequestGrid").append(newRow);
            });
            GetHover();
            if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#ApproverExpenseRequestGrid").append(ViewAllRow);
            }
            $.unblockUI();
        }
        else {
            var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
            $("#ApproverExpenseRequestGrid").empty();
            $("#dashboardMyApprovalsTabResultCount").empty();
            $("#ApproverExpenseRequestGrid").append(newRow);
            $.unblockUI();
        }
    });
    $('#SelfExpenseRequestGrid th i[id!="filter"]').click(function () {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var nonApprovalArray = '';
        if (nonApprovalArrayOriginalSelfLowerCase != '') {
            nonApprovalArray = $.extend(true, [], nonApprovalArrayOriginalSelfLowerCase);
        }
        else {
            nonApprovalArray = $('#SelfRequestGrid tr.row_main:has(td)').map(function (i, v) {
                var $td = $('td', this);
                return {
                    id: ++i,
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
                    RequestStatus: $td.eq(6).text(),
                    Action: $td.eq(7).text()
                }
            }).get();
            if (nonApprovalArrayOriginalSelfLowerCase == '') {
                nonApprovalArrayOriginalLowerCase = $.extend(true, [], nonApprovalArray);
            }
        }

        var id = $(this).parent().parent()[0].id;
        var asc = (!$(this).parent().parent().attr('asc')); // switch the order, true if not set

        // set asc="asc" when sorted in ascending order
        $('#SelfRequestGridheadings th').each(function () {
            $(this).removeAttr('asc');
        });

        $(".rze-sortico .fa").removeClass("active");
        if (asc) {
            $(this).parent().parent().attr('asc', 'asc');
            $('#' + id + " .fa-caret-up").addClass("active");
        }
        else {
            $('#' + id + " .fa-caret-down").addClass("active");
        }

        var sort_by = function (field, reverse, primer) {
            var key = function (x) { return primer ? primer(x[field]) : x[field] };

            return function (a, b) {
                var A = key(a), B = key(b);
                return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
            }
        }
        if (id == "RequestDate_Self") {
            nonApprovalArray.sort(function (a, b) {
                if (asc)
                    return new Date(a.RequestDate_Self) - new Date(b.RequestDate_Self);
                else
                    return new Date(b.RequestDate_Self) - new Date(a.RequestDate_Self);
            });
        }
        else {
            nonApprovalArray.sort(sort_by(id, asc, function (a) { return a.toUpperCase() }));
        }
        if (nonApprovalArray.length >= 1) {
            $("#SelfExpenseRequestGrid").empty();
            $.each(nonApprovalArray, function (key, value) {
                if (value.RequestBy_Self == "Sorry, No Record Found For Your Search Criteria.")
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                else
                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                    + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                    + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                     + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                     + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                    + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                $("#SelfExpenseRequestGrid").append(newRow);

            });
            GetHover();
            if ($("#SelfExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#SelfExpenseRequestGrid").append(ViewAllRow);
            }
            $.unblockUI();
        }
        else {
            var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
            $("#SelfExpenseRequestGrid").empty();
            $("#myselfTabResultCount").empty();
            $("#SelfExpenseRequestGrid").append(newRow);
            $.unblockUI();
        }
    });


}

function CreateRequest() {
    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            SavedER["NewExp//Expense Report Draft"] = "New Exp.";
            sessionStorage.SavedER = JSON.stringify(SavedER);
        }
    }
    else {
        var obj = {};
        obj["NewExp//Expense Report Draft"] = "New Exp.";
        sessionStorage.SavedER = JSON.stringify(obj);
    }
    window.location = "ExpenseCreateReport.html";
}

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

function FindAdminOrEmployee() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ExpServiceProxy;
        serviceProxy.invoke(
            "ExpenseRequest/ExpenseRequest/GetUserInfo",
            "POST",
        null,
        function (response) {
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
                    LoadDataExpenseRequestDashBoard();
                }
                $('.rze-loginname').html(response.UserName);
                $("#b2eHeader #userImageBD").attr("src", response.userImagePath);
                $("#b2eHeader #userImageSD").attr("src", response.userImagePath);
                $("#b2eHeader #tenantLogo").attr("src", response.tenantLogoPath);
                if (response.Role != "TMCAdmin" && response.Role != "TMCUser" && response.Role != "TMCAdmin,TMCUser") {
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
                        LoadNonApproverExpenseRequest();
                    }
                    else {
                        $('#ApproverTab').css('display', 'block');
                        $('#ApproverSection').attr('class', 'hide');
                        $('#AdminSection').attr('class', 'hide');
                        $('#SelfSection').attr('class', 'tab-pane fade in active');
                        $('#IsAdmin').val(false);
                        LoadNonApproverExpenseRequest();
                        $('#IsAdmin').val(false);
                    }
                }
                else {
                    $("#myProfile_headerBD").remove();
                    $("#myProfile_headerSD").remove();
                    $("#tmcProfile_headerSD").css("display", "");
                    $("#tmcProfile_headerBD").css("display", "");
                    $('#ApproverTab').css('display', 'none');
                    $('#ApproverSection').attr('class', 'hide');
                    $('#SelfSection').attr('class', 'hide');
                    $('#AdminSection').attr('class', 'tab-pane fade in active');
                    $('#IsAdmin').val(true);
                    LoadAdminRequest('AdminDashboard');
                }
                $.unblockUI();
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            $.unblockUI();
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch (error) {
        //$().Logger.error("ExpenseRequestDashboard.js FindAdminOrEmployee()-->" + error);
    }
}

function checkUncheckFilter(filter) {
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
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
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
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
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

function checkUncheckFilterSelf(filter) {
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
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
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
                value = "Exp. Rep-" + str[0].toUpperCase() + str.slice(1);
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

function ApplyStatusFilter(criteria) {

    if (criteria.length > 0) {
        if (sessionStorage.originalGrid != undefined) {
            originalGrid = $.parseJSON(sessionStorage.originalGrid);
            if (originalGrid != '') {
                $("#ApproverExpenseRequestGrid").empty();
                $.each(originalGrid, function (key, value) {
                    if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {
                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#ApproverExpenseRequestGrid").append(newRow);
                    }
                });
                var statusNotifyCount = $('#ApproverGrid tbody tr.row_main').length;
                if (statusNotifyCount > 0) {
                    $("#dashboardMyApprovalsTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    $("#hdnShowCount").val(parseInt(statusNotifyCount));
                    $("#hdnTotalResultsCount").val(statusNotifyCount);
                }
                else { $("#dashboardMyApprovalsTabResultCount").html(" "); }
                if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#ApproverExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#ApproverExpenseRequestGrid").empty();
                    $("#dashboardMyApprovalsTabResultCount").empty();
                    $("#ApproverExpenseRequestGrid").append(newRow);
                }
            }
        }
    }
    else {
        ResetStatusFilter('');
    }
}

function ApplyStatusFilterSelf(criteria) {
    if (criteria.length > 0) {
        if (sessionStorage.originalSelfGrid != undefined) {
            originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
            if (originalSelfGrid != '') {
                $("#SelfExpenseRequestGrid").empty();
                $.each(originalSelfGrid, function (key, value) {
                    if (parseFloat($.inArray(value.RequestStatus.toLowerCase(), criteria)) >= 0) {

                        var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                        $("#SelfExpenseRequestGrid").append(newRow);
                    }
                });
                var statusNotifyCount = $('#SelfRequestGrid tbody tr.row_main').length;
                if (statusNotifyCount > 0) {
                    $("#myselfTabResultCount").html("Showing " + statusNotifyCount + " " + "of " + statusNotifyCount);
                    $("#hdnShowCount").val(parseInt(statusNotifyCount));
                    $("#hdnTotalResultsCount").val(statusNotifyCount);
                }
                else { $("#myselfTabResultCount").html(" "); }
                if ($("#SelfExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#SelfExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                else {
                    var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                    $("#SelfExpenseRequestGrid").empty();
                    $("#myselfTabResultCount").empty();
                    $("#SelfExpenseRequestGrid").append(newRow);
                }
            }
        }
    }
    else {
        ResetStatusFilterSelf('');
    }
}

function ResetStatusFilterSelf(cond) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    if (sessionStorage.originalSelfGrid != undefined) {
        originalSelfGrid = $.parseJSON(sessionStorage.originalSelfGrid);
        if (originalSelfGrid != '') {
            $("#SelfExpenseRequestGrid").empty();
            $.each(originalSelfGrid, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Self\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#SelfExpenseRequestGrid").append(newRow);
                $("#hdnShowCount").val(parseInt(originalSelfGrid.length));
                $("#myselfTabResultCount").html("Showing " + originalSelfGrid.length + " " + "of " + originalSelfGrid.length);
                $("#hdnTotalResultsCount").val(parseInt(originalSelfGrid.length));
            });
            if ($("#SelfExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#SelfExpenseRequestGrid").append(ViewAllRow);
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

function ResetStatusFilter(cond) {
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    if (sessionStorage.originalGrid != undefined) {
        originalGrid = $.parseJSON(sessionStorage.originalGrid);
        if (originalGrid != '') {
            $("#ApproverExpenseRequestGrid").empty();
            $.each(originalGrid, function (key, value) {
                var newRow = '<tr class="row_main"><td data-pin-nopin="true">' + value.RequestBy + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate)) + '</td><td>' + value.RequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.TripName + '">' + value.TripName + '</span></td> <td>' + value.TravelDestination + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.TravelStartDate)) + '</td><td>' + value.RequestStatus + '</td><td><a class="btn btn-info">' + value.Action + '</a></td><td class="rze-table-mob"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details</a></td></tr><tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a href="#" tabindex="1" onClick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.TripName + '\',\'Associate\')" class="btn btn-primary">View Details / Take Action</a></div></tr>';
                $("#ApproverExpenseRequestGrid").append(newRow);
                $("#hdnShowCount").val(parseInt(originalGrid.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + originalGrid.length + " " + "of " + originalGrid.length);
                $("#hdnTotalResultsCount").val(parseInt(originalGrid.length));

            });
            if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                $("#ApproverExpenseRequestGrid").append(ViewAllRow);
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

function ApprExpenseRequestViewItem(status) {
    debugger;
    PageIndex = 1;
    ////$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var criteria = new Array();
    var id = '';
    var type = '';
    var isPushedToCriteria = 'false';
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        type = "exp-";
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    type = "itr.-";
        //}
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
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        var s = status.split(' ')[2];
        status = "EXP-" + s[0].toUpperCase() + s.slice(1);
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    var s = status.split(' ')[1];
        //    status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        //}
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
    $('#ApproverExpenseRequestGrid').empty();
    $('#dashboardMyApprovalsTabResultCount').empty();
    if (status == "Itr.-Review") {
        var RequestStatus = $('#RequestStatus').val("6");
        $('#hdnStatusFilterOnCount').val('ITR-Pending');
    }

    else if (status == "EXP-Submitted")
    {
        var RequestStatus = $('#RequestStatus').val("2");
        $('#hdnStatusFilterOnCount').val('ERPending');
    }
    if (status == "EXP-Approved")
    {
        var RequestStatus = $('#RequestStatus').val("3");
        $('#hdnStatusFilterOnCount').val('ERApproved');
    }
    else if (status == "EXP-Rejected")
    {
        var RequestStatus = $('#RequestStatus').val("4");
        $('#hdnStatusFilterOnCount').val('ERRejected');
    }
        //else if (status == "Itr.-Approved") {
        //    var RequestStatus = $('#RequestStatus').val("7");
        //    $('#hdnStatusFilterOnCount').val('ITR-Approved');
        //}
        //else if (status == "Itr.-Rejected") {
        //    var RequestStatus = $('#RequestStatus').val("8");
        //    $('#hdnStatusFilterOnCount').val('ITR-Rejected');
        //}
    else { }
    FilterRequest('Associates', true);
    //////ApplyStatusFilter(criteria); //sethu demo
    ////$.unblockUI();
}

function SelfExpenseRequestViewItem(status) {

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    PageIndex = 1;
    var criteria = new Array();
    var id = '';
    var type = '';
    var isPushedToCriteria = 'false';
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        type = "exp-";
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    type = "itr.-";
        //}
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
    if (status.toLowerCase().indexOf('expense request') >= 0) {
        var s = status.split(' ')[2];
        status = "EXP-" + s[0].toUpperCase() + s.slice(1);
    }
        //else if (status.toLowerCase().indexOf('itinerary') >= 0) {
        //    var s = status.split(' ')[1];
        //    status = "Itr.-" + s[0].toUpperCase() + s.slice(1);
        //}
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
    $('#SelfExpenseRequestGrid').empty();
    $('#myselfTabResultCount').empty();
    if (status == "EXP-Draft")
    {
        var RequestStatus = $('#RequestStatus').val("1");
    }
    else if (status == "EXP-Submitted")
    {
        var RequestStatus = $('#RequestStatus').val("2");
    }
    else if (status == "EXP-Approved")
    {
        var RequestStatus = $('#RequestStatus').val("3");
    }
    else if (status == "EXP-Rejected")
    {
        var RequestStatus = $('#RequestStatus').val("4");
    }

    else { }
    $('#hdnStatusFilterOnCount').val(RequestStatus);
    FilterRequest('Self', true);
    //////ApplyStatusFilterSelf(criteria);   //sethu demo cgs
    //$.unblockUI();
}
function ExpenseBillCurrencyOnChange()
{
    debugger;
    $('#ExpenseBillCurrencyError').html('');
    var ExpBillCurr = $('#ExpenseBillCurrency').val();
    var ExpRemCurr = $('#ExpenseReportReimburseCurrency').val();
    if(ExpBillCurr==ExpRemCurr)
    {
        alert('same')
    }
    else
    {

    }
}
function ExpenseReportReimburseCurrencyOnChange()
{
    debugger;
    $('#ExpenseReportReimburseCurrencyError').html('')
    var ExpBillCurr = $('#ExpenseBillCurrency').val();
    var ExpRemCurr = $('#ExpenseReportReimburseCurrency').val();
    if (ExpBillCurr == ExpRemCurr)
    {
        alert('same')
    }
    else
    {

    }
}
function LoadStatus() {
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke("ExpenseRequest/ExpenseRequest/GetExpenseRequestStatus",
    "POST",
    null,
    function (response) {
        var cnt = parseFloat('1');
        $.each(response, function (key, value) {

            if (key == '0')
                value = "All";
            else {
                if (value.indexOf("Expense Request") >= 0) {
                    value = "EXP-" + value.split(' ')[2];
                }
            }
            //if (key > 8 || value == "All") {
            //    $("#StatusFilterAdmin").append("<div id='" + cnt + "_Admin'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterAdmin(this)'>" + value + "</label></div>");
            //    $("#RequestStatus_Admin").append("<option value='" + key + "'>" + value + "</option>");
            //}
            $("#RequestStatus").append("<option value='" + key + "'>" + value + "</option>");
            $("#RequestStatus_Approver").append("<option value='" + key + "'>" + value + "</option>");
            if (value != "All") {
                $("#RequestStatus").append("<div id='" + cnt + "'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilter(this)'>" + value + "</label></div>");
                $("#RequestStatus_Approver").append("<div id='" + cnt + "_Self'><label class='checkbox-inline'><input type='checkbox' onclick='checkUncheckFilterSelf(this)'>" + value + "</label></div>");
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

    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
        //"TravelRequest/TravelRequest/GetApproverTravelRequest/632AB514-23B6-4157-99D5-281DCEE6114B/1104/" + selectedMonth + "/" + selectedYear,
    "POST",
    null,
    function (response) {

        if (response.data.length > 0) {
            if (PageIndex == 1) { $("#ApproverExpenseRequestGrid").empty(); }
            $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
            $("#hdncorporateId").val("1104");
            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
               + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
               + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
               + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Associate\');">View Details / Take Action</a></div></td></tr>';
                $("#ApproverExpenseRequestGrid").append(newRow);

            });
            $('th#' + invokingColumnId).attr("asc", sortingType);
            $("#ApproverGridheadings i").removeClass("active")
            $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
            if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                //var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='TravelRequest.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                //$("#ApproverExpenseRequestGrid").append(ViewAllRow);
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
            if (PageIndex == 1) {
                $("#hdnShowCount").val(parseInt(response.data.length));
                $("#dashboardMyApprovalsTabResultCount").html("Showing " + response.data.length + " " + "of " + response.count);
                $("#hdnTotalResultsCount").val(parseInt(response.count));
                $("#hdnConstantTotalResults").val(parseInt(response.count));

                //Dashboard status count on page load
                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
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
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
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
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#ApproverExpenseRequestGrid").empty();
                $("#dashboardMyApprovalsTabResultCount").empty();
                $("#ApproverExpenseRequestGrid").append(newRow);

                $('#TRPending').html(ConvertNumber(pendingCnt));
                $('#TRApproved').html(ConvertNumber(approvedCnt));
                $('#TRRejected').html(ConvertNumber(rejectedCnt));
                $.unblockUI();
            }
        }
        if (arrDashboardStatus[0] == 0)
            $('#TRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRPending_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense request submitted')").removeClass("rez-nolinks");
        if (arrDashboardStatus[1] == 0)
            $('#TRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRApproved_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense request approved')").removeClass("rez-nolinks");
        if (arrDashboardStatus[2] == 0)
            $('#TRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRRejected_Anchor').attr("onclick", "ApprExpenseRequestViewItem('expense request rejected')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[3] == 0)
        //    $('#IRPending_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRPending_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary review')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[4] == 0)
        //    $('#IRApproved_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRApproved_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary approved')").removeClass("rez-nolinks");
        //if (arrDashboardStatus[5] == 0)
        //    $('#IRRejected_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRRejected_Anchor').attr("onclick", "ApprExpenseRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");
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
    //$("#ApproverExpenseRequestGrid td:empty").addClass("emptytd");
    $("#SelfExpenseRequestGrid td:empty").addClass("emptytd");
}

function gototravelrequestedit(RequestNo, title, RequestType) {

    window.location = "ExpenseSavedReport.html" + "?RequestNo=" + RequestNo;
    var MatchFound = false;
    var MatchedReqType = '';
    if (sessionStorage.SavedER != undefined) {
        SavedER = $.parseJSON(sessionStorage.SavedER);
        if (SavedER != '') {
            $.each(SavedER, function (key, value) {
                var savedKey = key.split("//")[0];
                if (savedKey == RequestNo)
                    MatchFound = true;
                if (MatchFound) {
                    MatchedReqType = key.split("//")[1];
                    if (MatchedReqType != RequestType) {
                        // changing existing one.
                        var tripName = title;
                        delete SavedER[key];
                        key = RequestNo + '//' + RequestType;
                        SavedER[key] = tripName;
                        sessionStorage.SavedER = JSON.stringify(SavedER);
                    }
                }
            });
            if (!MatchFound) {
                SavedER[RequestNo + "//" + RequestType] = title;
                sessionStorage.SavedER = JSON.stringify(SavedER);
            }
        }
    }
    else {
        var obj = {};
        obj[RequestNo + "//" + RequestType] = title;
        sessionStorage.SavedER = JSON.stringify(obj);
    }
    if ($("#myTab").children().length >= DashBoardExpTabSliderLenthCnt) {
        var clickedTab = RequestNo + "//" + RequestType;
        sessionStorage.ClickedTab = JSON.stringify(clickedTab);
    }
}

function LoadNonApproverExpenseRequest(invokingColumnId) {
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

    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetNonApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + invokingColumnId + "/" + sortingType,
    "POST",
    null,
    function (response) {
        if (response.data.length > 0) {
            if (response.data.length == 0) { PageIndex = 1; }
            if (PageIndex == 1) { $("#SelfExpenseRequestGrid").empty(); }
            $("#hdnUserId").val("632AB514-23B6-4157-99D5-281DCEE6114B");
            $("#hdncorporateId").val("1104");
            $.each(response.data, function (key, value) {

                var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                 + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                 + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                $("#SelfExpenseRequestGrid").append(newRow);
                //dlo
            });
            $('th#' + invokingColumnId).attr("asc", sortingType);
            $("#SelfRequestGridheadings i").removeClass("active")
            $("#" + invokingColumnId + " label i.fa-caret-" + activeClassTo).addClass("active");
            isLoadingData = false;

            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0,0,0,0"
            }

            arrDashboardStatus = response.dashboardStatus.split(",");

            var savedCnt = parseFloat(arrDashboardStatus[0]);
            var submittedCnt = parseFloat(arrDashboardStatus[1]);
            var approvedCnt = parseFloat(arrDashboardStatus[2]);
            var rejectedCnt = parseFloat(arrDashboardStatus[3]);
            //var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
            //var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
            if (PageIndex == 1) {
                //Dashboard status count on page load

                $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                //$("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                //$("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
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
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
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
                    response.dashboardStatus = "0,0,0,0,0,0"
                }
                arrDashboardStatus = response.dashboardStatus.split(",");
                var savedCnt = parseFloat(arrDashboardStatus[0]);
                var submittedCnt = parseFloat(arrDashboardStatus[1]);
                var approvedCnt = parseFloat(arrDashboardStatus[2]);
                var rejectedCnt = parseFloat(arrDashboardStatus[3]);
                //var IRapprovedCnt = parseFloat(arrDashboardStatus[4]);
                //var IRrejectedCnt = parseFloat(arrDashboardStatus[5]);
                var newRow = "<tr><td colspan='8' data-pin-nopin='true'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#SelfExpenseRequestGrid").empty();
                $("#myselfTabResultCount").empty();
                $("#SelfExpenseRequestGrid").append(newRow);

                $('#TRSaved_Self').html(ConvertNumber(savedCnt));
                $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
                $("#TRApproved_Self").html(ConvertNumber(approvedCnt));
                $('#TRRejected_Self').html(ConvertNumber(rejectedCnt));
                //$("#IRApproved_Self").html(ConvertNumber(IRapprovedCnt));
                //$("#IRRejected_Self").html(ConvertNumber(IRrejectedCnt));
                $.unblockUI();
            }
        }

        //if (CallFrom == "calenderBack") {
        //    return false;
        //}
        if (savedCnt == 0)
            $('#TRSaved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRSaved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Request draft')").removeClass("rez-nolinks");

        if (rejectedCnt == 0)
            $('#TRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRRejected_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Request rejected')").removeClass("rez-nolinks");

        if (submittedCnt == 0)
            $('#TRSubmitted_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRSubmitted_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Request submitted')").removeClass("rez-nolinks");

        if (approvedCnt == 0)
            $('#TRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        else
            $('#TRApproved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('Expense Request approved')").removeClass("rez-nolinks");

        //if (IRapprovedCnt == 0)
        //    $('#IRApproved_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRApproved_Self_Anchor').attr("onclick", "SelfExpenseRequestViewItem('itinerary approved')").removeClass("rez-nolinks");

        //if (IRrejectedCnt == 0)
        //    $('#IRRejected_Self_Anchor').removeAttr("onclick").addClass("rez-nolinks");
        //else
        //    $('#IRRejected_Self_Anchor').attr("onclick", "SelfTravelRequestViewItem('itinerary rejected')").removeClass("rez-nolinks");

    }
 ,
    function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    },
    "json"
    );
}

function convertDate(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

function ConvertNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

function LoadCalender() {
    $('#calenderBackward').attr("onclick", "calenderBackward('');")
    $('#calenderForward').attr("onclick", "calenderForward('');")
    $('#calenderBackward_Self').attr("onclick", "calenderBackward('self');")
    $('#calenderForward_Self').attr("onclick", "calenderForward('self');")

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

function CalenderRestriction() {
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

function SelectCalender(element) {
    $('#hdnSelectCalenderMonth').html(element.innerText.split(" ")[0].split("[")[1]);
    $('#hdnSelectCalenderYear').html(element.innerText.split(" ")[1].split("]")[0]);
}

function calenderBackward(page) {

    //ResetRequest()
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

        LoadNonApproverExpenseRequest();
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
    CalenderRestriction();
}

function calenderForward(page) {
    //ResetRequest()
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

        LoadNonApproverExpenseRequest();
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

function FilterRequest(tabname, Submit)
{
    debugger;
    if ($("#rze-overlayMyExpenseSelf").hasClass("overlaybox")) {
        SearchToggle('MyExpenseSelf');
    }
    if ($("#rze-overlayMyExpensesApprovals").hasClass("overlaybox")) {
        SearchToggle('MyExpensesApprovals');
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

    if (tabname == 'Associates') {
        if ($('#hdnStatusFilterOnCount').val() != '0')
            statusFilterApplied = $('#hdnStatusFilterOnCount').val();
        else
            statusFilterApplied = "NoFilter";
    }

    if (statusFilterApplied == null || statusFilterApplied == "" || statusFilterApplied == undefined) {
        statusFilterApplied = "NoFilter";
    }

    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    var isApprover = $('#MyAssociates').hasClass("active");
    if (!isApprover)
    {
        var RequestedDate = $('#RequestedDate_Self').val();
        var RequestStatus = $('#RequestStatus').val();
        var TripName = $('#ReportName_Self').val();
        var RequestNo = $('#RequestNo_Self').val();

    }
    else
    {
        var RequestedDate = $('#RequestedDate_Approver').val();
        var RequestStatus = $('#RequestStatus_Approver').val();
        var TripName = $('#ReportName_Approver').val();
        var RequestNo = $('#RequestNo_Approver').val();

        if (statusFilterApplied != null && statusFilterApplied != "")
        {
            if (statusFilterApplied == "ERPending") {
                RequestStatus = "2";
            }
            else if (statusFilterApplied == "ERApproved") {
                RequestStatus = "3";
            }
            else if (statusFilterApplied == "ERRejected") {
                RequestStatus = "4";
            }
            else if (statusFilterApplied == "ERWithdrawn") {
                RequestStatus = "5";
            }
            $('#hdnStatusFilterOnCount').val(statusFilterApplied);
        }
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
    if (tabname == 'Associates') { //sethu uat fix
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var selectedMonth = $('#thirdMonth').text().split(" ")[0];
        var selectedYear = $('#thirdMonth').text().split(" ")[2];
        selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    }
    else if (tabname == 'Self') {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var selectedMonth = $('#thirdMonth_Self').text().split(" ")[0];
        var selectedYear = $('#thirdMonth_Self').text().split(" ")[2];
        selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    }
    var totalCount = $("#hdnConstantTotalResults").val();
    var UserId = $('#hdnUserId').val();
    var corporateId = $('#hdncorporateId').val();
    var RequestFilterCriteria =
        {
            ReportName: TripName,
            RequestNo: RequestNo,
            RequestDate: RequestedDate,
            RequestStatus: RequestStatus,
            isApprover: isApprover,
            UserId: UserId,
            corporateId: corporateId
        };
    isLoadingData = true;
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/FilterExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount + "/" + totalCount + "/" + statusFilterApplied,
    "POST",
       RequestFilterCriteria,
    function (response) {
       // $('#hdnStatusFilterOnCount').val('0');
        if (isApprover) {
            if (response.data.length > 0) {
                if (PageIndex == 1) { $("#ApproverExpenseRequestGrid").empty(); }
                $.each(response.data, function (key, value) {
                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                  + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                  + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                   + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                   + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                  + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Associate\');">View Details / Take Action</a></div></td></tr>';


                    $("#ApproverExpenseRequestGrid").append(newRow);
                });
                isLoadingData = false;
                if ($("#ApproverExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html?ApprViewAll' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#ApproverExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                SearchToggle(tabname);
                HideSearchToggle(tabname);
                $.unblockUI();
            }
            else {
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#ApproverExpenseRequestGrid").empty();
                $("#dashboardMyApprovalsTabResultCount").empty();
                $("#ApproverExpenseRequestGrid").append(newRow);
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
                if (PageIndex == 1) { $("#SelfExpenseRequestGrid").empty(); }
                $.each(response.data, function (key, value) {

                    var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                                  + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                                  + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                                   + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                                   + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                                  + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="gototravelrequestedit(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                    $("#SelfExpenseRequestGrid").append(newRow);
                });
                isLoadingData = false;
                if ($("#SelfExpenseRequestGrid").children().length > 0) {
                    var ViewAllRow = "<tr><td colspan='8' class='text-center rze-btn'><a href='ExpenseReports.html' class='btn btn-primary'>View All Requests</a></td></tr>";
                    $("#SelfExpenseRequestGrid").append(ViewAllRow);
                    GetHover();
                }
                tabname = "Self";
                SearchToggle(tabname);
                HideSearchToggle(tabname);
                $.unblockUI();
            }
            else {
                var newRow = "<tr class='row_main'><td data-pin-nopin='true' colspan='8'><h4 class='nores-msg'>Sorry, No Record Found For Your Search Criteria.</h4></td></tr>";
                $("#SelfExpenseRequestGrid").empty();
                $("#myselfTabResultCount").empty();
                $("#SelfExpenseRequestGrid").append(newRow);
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



var isLoadingData;
$(window).scroll(function ()
{

    if ($(window).scrollTop() == $(document).height() - $(window).height() && !isLoadingData)
    {
        debugger;
        isLoadingData = true;
        $('#hdnIsScroll').val("true");
        var columnForSorting = $("#lastSortedColumn").val();
        var IsFilterApplied = $('#hdnIsFilterApplied').val();

        var totalCnt = $("#hdnTotalResultsCount").val();
        var showCnt = $("#hdnShowCount").val();
        if (showCnt == totalCnt) {
            return false;
        }
        if (IsFilterApplied == "false") {
            PageIndex++;
            if ($('#hdnCalledByAdminDashboard').val() == "true") { LoadAdminRequest('AdminDasboard'); }
            else if ($('#MySelf').hasClass('active')) { LoadNonApproverExpenseRequest(columnForSorting); }
            else { LoadApproverTravelRequest(columnForSorting); } //$('#MyAssociates').hasClass('active')
        }
        else {
            PageIndex++;
            var FilterRequestTabType = $('#hdnFilterRequestType').val();
            FilterRequest(FilterRequestTabType);
        }
    }
});

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

















function ConvertNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}
function LoadNonApproverExpenseReport() {

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
    //var selectedMonth = "Jul";
    //var selectedYear = "2017";
    //skipCount = 0;
    //var defaultTakeCount=10;
    //selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetNonApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount,
    "POST",
    null,
    function (response) {
        if (response != null) {
            if (response.data != null && response.data != null && response.data.length == 0) { PageIndex = 1; }
            if (PageIndex == 1) { $("#SelfReportGrid_Body").empty(); }

            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                 + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                 + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="LoadSavedExpenseReport(\'' + value.RequestNo + '\',\'' + value.ReportName + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                $("#SelfReportGrid_Body").append(newRow);
                //dlo
            });
            isLoadingData = false;
            GetHover();
            if (response.dashboardStatus == "") {
                response.dashboardStatus = "0,0,0,0,0,0"
            }
            arrDashboardStatus = response.dashboardStatus.split(",");

            var savedCnt = parseFloat(arrDashboardStatus[0]);
            var submittedCnt = parseFloat(arrDashboardStatus[1]);
            $('#TRSaved_Self').html(ConvertNumber(savedCnt));
            $("#TRSubmitted_Self").html(ConvertNumber(submittedCnt));
            var originalSelfGrid = $('#SelfReportGrid tr.row_main:has(td)').map(function (i, v) {
                var $td = $('td', this);
                return {
                    id: ++i,
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
                    RequestStatus: $td.eq(6).text(),
                    Action: $td.eq(7).text()
                }
            }).get();
            GetHover();
        }
    });
}
function LoadApproverExpenseReport() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var selectedMonth = "Jul";
    var selectedYear = "2017";
    skipCount = 0;
    var defaultTakeCount = 10;
    selectedMonth = $.inArray(selectedMonth, monthNames) + 1;
    var serviceProxy = new ExpServiceProxy();
    serviceProxy.invoke(
        "ExpenseRequest/ExpenseRequest/GetApproverExpenseRequest/" + selectedMonth + "/" + selectedYear + "/" + skipCount + "/" + defaultTakeCount,
    "POST",
    null,
    function (response) {
        if (response != null) {
            $.each(response.data, function (key, value) {
                var newRow = '<tr class="row_main" ><td data-pin-nopin="true">'
                + value.RequestNo + '</td> <td>' + $.datepicker.formatDate('dd M yy', new Date(value.RequestDate))
                + '</td><td>' + value.TravelRequestNo + '</td><td><span data-toggle="tooltip" data-placement="right" title="' + value.ReportName + '">'
                 + value.ReportName + '</span></td> <td>' + value.BillAmount + '</td> <td>' + value.BillCurrency + '</td><td>' + value.RequestStatus
                 + '</td><td><a class="btn btn-info">' + value.Action + '</a></td>'
                + ' <tr class="row_sub"><td colspan="8" class="table-action text-center"><div class="rze-tablehide"><a class="btn btn-primary" onclick="LoadSavedExpenseReport(\'' + value.RequestNo + '\',\'Self\');">View Details / Take Action</a></div></td></tr>';
                $("#MyAssociatesGrid_Body").append(newRow);
                //dlo
            });
            var originalSelfGrid = $('#MyAssociatesGrid tr.row_main:has(td)').map(function (i, v) {
                var $td = $('td', this);
                return {
                    id: ++i,
                    RequestNo: $td.eq(0).text(),
                    RequestDate: $td.eq(1).text(),
                    TravelRequestNo: $td.eq(2).text(),
                    ReportName: $td.eq(3).text(),
                    BillAmount: $td.eq(4).text(),
                    BillCurrency: $td.eq(5).text(),
                    RequestStatus: $td.eq(6).text(),
                    Action: $td.eq(7).text()
                }
            }).get();
            GetHover();
        }
    });
}

function ResetMySelfRequestSearch() {

    $("#ReportName_Self").val('');
    $("#RequestNo_Self").val('');
    $("#RequestedDate_Self").val('');
    $("#RequestStatus").val('0');
}

function ResetApproverSearch() {
    $("#ReportName_Approver").val('');
    $("#RequestNo_Approver").val('');
    $("#RequestedDate_Approver").val('');
    $("#RequestStatus_Approver").val('0');
}