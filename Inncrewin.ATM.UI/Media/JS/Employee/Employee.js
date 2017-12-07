$(function () {
    try {
        $("#DateOfBirth").datepicker({
            maxDate: '-18y', changeMonth: true, changeYear: true, yearRange: "1900:2200", dateFormat: sessionStorage.CultureDateFormat,
            onClose: function (event) {
                validateB2EDate(event, "DateOfBirth")
            }
        });
        $("#DateOfBirth").mask(sessionStorage.CultureMaskFormat);
        $("#PassportExpiryDate").datepicker({
            minDate: '+1D', changeMonth: true, changeYear: true, yearRange: "1900:2200", dateFormat: sessionStorage.CultureDateFormat,
            onClose: function (event) {
                validateB2EDate(event, "PassportExpiryDate")
            }
        });
        $("#PassportExpiryDate").mask(sessionStorage.CultureMaskFormat);
        $("#ApproverStartDate").datepicker({
            changeMonth: true, changeYear: true, yearRange: "1900:2200", dateFormat: sessionStorage.CultureDateFormat,
            onClose: function (event) {
                validateB2EDate(event, "ApproverStartDate")
            }
        });
        $("#ApproverStartDate").mask(sessionStorage.CultureMaskFormat);
        $("#ApproverEndDate").datepicker({
            changeMonth: true, changeYear: true, yearRange: "1900:2200", dateFormat: sessionStorage.CultureDateFormat,
            onClose: function (event) {
                validateB2EDate(event, "ApproverEndDate")
            }
        });
        $("#ApproverEndDate").mask(sessionStorage.CultureMaskFormat);

        $("#FirstLevelApproverBlock").hide();
        $("#SecondLevelApproverBlock").hide();
        $("#ThirdLevelApproverBlock").hide();
        $("#FirstLevelExpenseApproverBlock").hide();
        $("#SecondLevelExpenseApproverBlock").hide();
        $("#ThirdLevelExpenseApproverBlock").hide();
        $("#header-emp").load('header.html', function () {
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
                            document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>TR' + ReqNo + '<small title="' + value + '">' + value + '</small><i onclick="closetab(\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';
                        else
                            document.getElementById('element_' + ReqNo + '_' + RequestType).innerHTML = '<a>' + value + '<small title="' + value + '">' + value + '</small><i onclick="closetab(\'' + ReqNo + '\',\'' + RequestType + '\');" class="fa fa-times-circle close-btn closeTab"></i></a>';

                        if ($("#myTab").children().length > 3) {
                            $(".slider").attr("id", "slider1");
                        }
                        $('#slider1').tinycarousel();
                    });

                }
            }
            $('#myNavbar li.active').each(function () {
                $(this).removeClass("active");
            });
        });

        LoadEmployee();

        $("#IsApprover").click(function () {
            var corporateId = $("#CorporateCode").val();
            if (corporateId != 0) {
                if ($(this).is(":checked")) {
                    $("#SubstituteApproverBlock").show();
                }
                else {
                    $("#SubstituteApproverBlock").hide();
                }
            }
        });
    }

    catch (error) {
        $().Logger.error("Employee.js EmpAgeValidation() -->" + error.message);
    }
});

function LoadEmployee() {
    try {
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Employee/EmployeeProfile",
        "GET",
        null,
        function (response) {
            if (response != null) {
                //Mapping the Data 
                $("#EmployeeCode").val(response.EmployeeCode);
                $("#EmployeeName").val(response.EmployeeFirstName + " " + response.EmployeeLastName);
                $("#EmailID").val(response.EmailId);
                $("#PrimaryContactNumber").val(response.PrimaryContactNumber);
                $("#AlternateContactNumber").val(response.AlternateContactNumber);
                $("#PasswordField").hide();
                //$("#Password").val("");
                //  $("#Password").val("Rez@123");
                $("#DateOfBirth").datepicker({
                    maxDate: '-18y', dateFormat: sessionStorage.CultureDateFormat, changeMonth: true, changeYear: true, yearRange: "1900:2200", onClose: function (event) {
                        validateB2EDate(event, "DateOfBirth")
                    }
                }).datepicker('setDate', new Date(response.DateOfBirth));
                $("#DateOfBirth").mask(sessionStorage.CultureMaskFormat);
                $("#PassportExpiryDate").datepicker({
                    minDate: '+1D', dateFormat: sessionStorage.CultureDateFormat, changeMonth: true, changeYear: true, yearRange: "1900:2200", onClose: function (event) {
                        validateB2EDate(event, "PassportExpiryDate")
                    }
                }).datepicker('setDate', new Date(response.PassportExpiryDate));
                $("#PassportExpiryDate").mask(sessionStorage.CultureMaskFormat);
                $("#ApproverStartDate").datepicker({
                    dateFormat: sessionStorage.CultureDateFormat, changeMonth: true, changeYear: true, yearRange: "1900:2200", onClose: function (event) {
                        validateB2EDate(event, "ApproverStartDate")
                    }
                }).datepicker('setDate', new Date());
                $("#ApproverStartDate").mask(sessionStorage.CultureMaskFormat);
                $("#ApproverEndDate").datepicker({
                    dateFormat: sessionStorage.CultureDateFormat, changeMonth: true, changeYear: true, yearRange: "1900:2200", onClose: function (event) {
                        validateB2EDate(event, "ApproverEndDate")
                    }
                }).datepicker('setDate', new Date());
                $("#ApproverEndDate").mask(sessionStorage.CultureMaskFormat);
                $("#PassportNo").val(response.PassportNo);
                $('#PassportIssueLocation').val(response.PassportIssuedLocation);
                $("#MealsPreference").val(response.MealPreference);
                $("#OtherPreference").val(response.OtherInfo);
                $("#VisaDetails").val(response.VisaInfo);
                $("#FirstLevelApprover").val(response.FirstLevelApproverName);
                $("#SecondLevelApprover").val(response.SecondLevelApproverName);
                $("#ThirdLevelApprover").val(response.ThirdLevelApproverName);
                $("#FirstLevelApproverId").val(response.FirstLevelApproverId);
                $("#SecondLevelApproverId").val(response.SecondLevelApproverId);
                $("#ThirdLevelApproverId").val(response.ThirdLevelApproverId);
                $("#FirstLevelExpenseApprover").val(response.FirstLevelExpenseApproverName);
                $("#SecondLevelExpenseApprover").val(response.SecondLevelExpenseApproverName);
                $("#ThirdLevelExpenseApprover").val(response.ThirdLevelExpenseApproverName);

                $("#CurrentDate").val(response.CurrentDate)

                LoadDropDownList("#CorporateCode", response.Corporates, response.CorporateId);
                LoadDropDownList("#Grade", response.Grades, response.Grade);
                LoadDropDownList("#Project", response.Projects, response.Project);
                LoadDropDownList("#ProjectList", response.ProjectList, response.ProjectList);
                LoadDropDownList("#Designation", response.Designations, response.Designation);
                LoadDropDownList("#WorkLocation", response.WorkLocations, response.WorkLocation);
                LoadDropDownList("#Roles", response.Roles, response.Role);
                LoadDropDownList("#Department", response.Departments, response.Department);
                LoadDropDownList("#Gender", response.Genders, response.Gender);
                LoadDropDownList("#MaritalStatus", response.Maritals, response.MaritalStatus);
                LoadDropDownList("#Nationality", response.Countries, response.Nationality);
                LoadDropDownList("#SeatPreference", response.SeatPreferences, response.SeatPreference);
                var corporateid = response.corporateId;


                //Is Not Approver
                if (!response.IsApprover) {
                    $("#SubstituteApproverBlock").hide();
                    //$("#SubstituteApproverBlock").hide();
                    $("#IsApprover").prop("checked", false);
                }
                else {
                    SettingSubstituteApprover(response.CorporateId, response.ApproverLevel);
                    AddSubstituteApprovers(response.SubstituteApproverList);
                    $("#SubstituteApproverBlock").show();
                    $("#IsApprover").prop("checked", true);
                    //$("#SubstituteApproverBlock").css("display", "block");

                }
                //if (response.SubstituteApproverList.length > 0) {
                //    AddSubstituteApprovers(response.SubstituteApproverList);
                //    SettingSubstituteApprover(response.CorporateId, response.ApproverLevel);
                //}
                //else
                //{
                //    $("#SubstituteApproverBlock").hide();
                //}

                window.Password = "Rez@123";
                window.ApproverLevel = response.ApproverLevel;
                window.isapprover = response.IsApprover;
                window.isPasswordDisable = false;
                window.empId = response.EmployeeId;
                window.IsActive = response.IsActive;

                if (response.CorporateId != 0) {
                    switch (response.ApproverLevel) {
                        case 1:
                            $("#FirstLevelApproverBlock").show();
                            break;
                        case 2:
                            $("#FirstLevelApproverBlock").show();
                            $("#SecondLevelApproverBlock").show();
                            break;
                        case 3:
                            $("#FirstLevelApproverBlock").show();
                            $("#SecondLevelApproverBlock").show();
                            $("#ThirdLevelApproverBlock").show();
                            break;
                    }
                    switch (response.ExpenseApproverLevel) {
                        case 1:
                            $("#FirstLevelExpenseApproverBlock").show();
                            break;
                        case 2:
                            $("#FirstLevelExpenseApproverBlock").show();
                            $("#SecondLevelExpenseApproverBlock").show();
                            break;
                        case 3:
                            $("#FirstLevelExpenseApproverBlock").show();
                            $("#SecondLevelExpenseApproverBlock").show();
                            $("#ThirdLevelExpenseApproverBlock").show();
                            break;
                    }
                }
                //if (response.CorporateId != 0) {
                //    LoadApprover(response.CorporateId, response.ApproverLevel);
                //}
            }
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json",
        false
        );
    }
    catch (error) {
        $().Logger.error("Employee.js LoadEmployee() -->" + error.message);
    }
}

// Approver.
function LoadApprover(corporateId, level) {
    try {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Employee/GetApproverLevel/" + corporateId.toString() + "/" + level.toString(),
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                var firstLevelApprover = response[0];
                var secondLevelApprover = response[1];
                var thirdLevelApprover = response[2];
                if (firstLevelApprover != undefined) {
                    $("#FirstLevelApproverBlock").show();
                    //$("#FirstLevelApproverName").val("");
                    $("#FirstLevelApprover").autocomplete({
                        source: firstLevelApprover,
                        change: function (event, ui) {
                            if (ui.item === null) {
                                $(this).val('');
                                $('#firstlevelapprmsg').html('Please search valid approver');
                            }
                            else {
                                $("#FirstLevelApprover").val(ui.item.value);
                                $("#FirstLevelApproverId").val(ui.item.id);
                                $('#firstlevelapprmsg').html('');
                            }
                        }
                    });
                }
                if (secondLevelApprover != undefined) {
                    $("#SecondLevelApproverBlock").show();
                    //$("#SecondLevelApproverName").val("");
                    $("#SecondLevelApprover").autocomplete({
                        source: secondLevelApprover,
                        change: function (event, ui) {
                            if (ui.item === null) {
                                $(this).val('');
                                $('#secondlevelapprmsg').html('Please search valid approver');
                            }
                            else {
                                $("#SecondLevelApprover").val(ui.item.value);
                                $("#SecondLevelApproverId").val(ui.item.id);
                                $('#secondlevelapprmsg').html('');
                            }
                        }
                    });
                }
                if (thirdLevelApprover != undefined) {
                    $("#ThirdLevelApproverBlock").show();
                    //$("#ThirdLevelApproverName").val("");
                    $("#ThirdLevelApprover").autocomplete({
                        source: thirdLevelApprover,
                        change: function (event, ui) {
                            if (ui.item === null) {
                                $(this).val('');
                                $('#thirdlevelapprmsg').html('Please search valid approver');
                            }
                            else {
                                $("#ThirdLevelApprover").val(ui.item.value);
                                $("#ThirdLevelApproverId").val(ui.item.id);
                                $('#thirdlevelapprmsg').html('');
                            }
                        }
                    });
                }
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );

    }
    catch (error) {
        $().Logger.error("Employee.js LoadApprover() -->" + error);
    }
}

function SettingSubstituteApprover(corporateId, Apprlevel) {
    try {
        if ($('#IsApprover').is(":checked")) {
            $("#SubstituteApproverBlock").css("display", "block");
        }
        else {
            $("#SubstituteApproverBlock").css("display", "none");
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Employee/GetSubstituteApproverLevel/" + corporateId.toString() + "/" + Apprlevel.toString(),
        "GET",
        null,
        function (response) {
            if (response != null) {
                var Approver = response;
                $("#SubApproverName").autocomplete({
                    source: Approver,
                    change: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#substituteApproverMessage').html('Please search valid approver');
                        }
                        else {
                            $("#SubApproverName").val(ui.item.value);
                            $("#SubstitueEmployeeId").val(ui.item.id);
                        }
                    }
                });
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
    }
    catch (error) {
        $().Logger.error("Employee.js SettingSubstituteApprover() -->" + error);
    }
}

function AddSubstituteApprover() {
    try {
        var StartDate = $("#ApproverStartDate").val();
        var EndDate = $("#ApproverEndDate").val();
        var SubApproverName = $("#SubApproverName").val();
        if (StartDate != "" && EndDate != "" && SubApproverName != "") {
            var StartDateExist = "false";
            var EndDateExist = "false";
            var ApproverNameExist = "false";
            $('#SubApproverGrid .subapprstartdate').each(function () {
                if ($(this).text() == StartDate)
                    StartDateExist = "true";
            });
            $('#SubApproverGrid .subapprenddate').each(function () {
                if ($(this).text() == EndDate)
                    EndDateExist = "true";
            });
            $('#SubApproverGrid .subapprname').each(function () {
                if ($(this).text() == SubApproverName)
                    ApproverNameExist = "true";
            });
            if (IsInvalidDateRange(StartDate, EndDate)) {
                alertmsg("End Date should be greater than the Start Date");
            }
            else {
                if (StartDateExist == "true" && EndDateExist == "true" && ApproverNameExist == "true") {
                    $("#substituteApproverMessage").attr("class", "alert alert-danger");
                    $("#substituteApproverMessage").html("Substitute Approver already exist");
                    $("#ApproverStartDate").val("");
                    $("#ApproverEndDate").val("");
                    $("#SubApproverName").val("");
                }
                else {
                    if ($('#SubApproverGrid tr:last').attr('value') == undefined) {
                        SubtituteApproverCount = 1;
                    } else {
                        SubtituteApproverCount = parseFloat($('#SubApproverGrid tr:last').attr('value')) + 1;
                    }
                    var hiddenId = $("#SubstitueEmployeeId").val();
                    var newRow = "<tr value='" + SubtituteApproverCount + "' id='SubtituteApprover" + SubtituteApproverCount + "'><td >" + (SubtituteApproverCount) + "</td><td class='subapprstartdate' ><input type='text' style='display:none' id='SubtituteApproverStartDate" + SubtituteApproverCount + "' value='" + StartDate + "'>" + StartDate +
                        "</td><td  class='subapprenddate' ><input type='text' style='display:none' id='SubtituteApproverEndDate" + SubtituteApproverCount + "' value='" + EndDate + "'>" + EndDate + "</td><td class='subapprname' ><input type='text' style='display:none' id='subApprName" + SubtituteApproverCount + "' value='" + SubApproverName + "'>" + SubApproverName + "</td><td  ><input type='text' style='display:none' id='SubstitueEmployeeId" + SubtituteApproverCount + "' value='" + hiddenId + "'></td></tr>";
                    $("#SubApproverGrid").append(newRow);
                    $("#ApproverStartDate").val("");
                    $("#ApproverEndDate").val("");
                    $("#SubApproverName").val("");
                    $("#substituteApproverMessage").attr("class", "alert alert-success");
                    $("#substituteApproverMessage").html("Substitute approver is added successfully.");
                    $(window).scrollTop(0);
                }
            }
        }
        else {
            $("#substituteApproverMessage").attr("class", "alert alert-danger");
            $("#substituteApproverMessage").html("Please enter mandatory field.");
        }
        $(window).scrollTop(0);
    }
    catch (error) {
        $().Logger.error("Employee.js AddSubstituteApprover() -->" + error);
    }
}

function AddSubstituteApprovers(list) {
    try {
        var SubtituteApproverCount = 0;
        for (count in list) {
            SubtituteApproverCount++;
            var newRow = "<tr value='" + SubtituteApproverCount + "' id='SubtituteApprover" + SubtituteApproverCount + "'><td >" + (SubtituteApproverCount) + "</td><td class='subapprstartdate'><input type='text' style='display:none' id='SubtituteApproverStartDate" + SubtituteApproverCount + "' value='" + moment(list[count].StartDate).format(sessionStorage.DateFormatForMoment) + "'>" + moment(list[count].StartDate).format(sessionStorage.DateFormatForMoment) +
                "</td><td  class='subapprenddate'  ><input type='text' style='display:none' id='SubtituteApproverEndDate" + SubtituteApproverCount + "' value='" + moment(list[count].EndDate).format(sessionStorage.DateFormatForMoment) + "'>" + moment(list[count].EndDate).format(sessionStorage.DateFormatForMoment) + "</td><td class='subapprname' ><input type='text' style='display:none' id='subApprName" + SubtituteApproverCount + "' value='" + list[count].ApproverName + "'>" + list[count].ApproverName + "</td><td><input style='display:none' id='SubstitueEmployeeId" + SubtituteApproverCount + "' value='" + list[count].SubstitueEmployeeId + "'></td></tr>";
            $("#SubApproverGrid").append(newRow);
        }
    }
    catch (error) {
        $().Logger.error("Employee.js AddSubstituteApprovers() -->" + error);
    }
}

function LoadDropDownList(dropDownId, list, value) {
    try {
        $(dropDownId).html("");
        for (count in list) {
            $(dropDownId).append("<option value='" + list[count].Value.toString() + "'>" + list[count].Text.toString() + "</option>");
        }
        $(dropDownId).val(value);
    }
    catch (error) {
        $().Logger.error("Employee.js LoadDropDownList() -->" + error);
    }
}

function ClearErrorMsg() {
    try {
        $('#passwordmsg').html('');
        var password = $("#Password").val();
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{7,})");
        if (!strongRegex.test(password)) {
            $('#passwordmsg').html('Password should be atleast 7 characters with a-z and A-Z and 0-9 and Special Character');
        }
    }
    catch (error) {
        $().Logger.error("Employee.js ClearErrorMsg() -->" + error);
    }
}

function validateEmployeeProfileForm() {
    try {
        var error = false;
        if ($('#ChkChangePassword').is(":checked") && $("#Password").val() == "") {
            $('#passwordmsg').html('Please enter password');
            error = true;
        }
        if ($('#Gender').val() == 0) {
            $("#EmpGenderErrorMessage").html('Select Gender');
            error = true;
        }
        if ($('#Nationality').val() == '00000000-0000-0000-0000-000000000000') {
            $('#EmpNationalityErrorMessage').html('Select Nationality');
            error = true;
        }
        error = EmpPassportNoValidation() || error;
        error = EmpAgeValidation() || error;
        if (error)
            return error;

        var model = new Object();
        model.CorporateId = $("#CorporateCode").val();
        model.EmployeeId = window.empId;
        model.IsActive = window.IsActive;
        model.EmployeeCode = $("#EmployeeCode").val();
        var name = $("#EmployeeName").val().split(" ");
        model.EmployeeFirstName = name[0];
        model.EmployeeLastName = name[1];
        model.Grade = $("#Grade").val();
        model.Designation = $("#Designation").val();
        model.Department = $("#Department").val();
        model.Project = $("#Project").val();
        model.WorkLocation = $("#WorkLocation").val();
        model.Role = $("#Roles").val();
        model.EmailId = $("#EmailID").val();
        model.PrimaryContactNumber = $("#PrimaryContactNumber").val();
        model.AlternateContactNumber = $("#AlternateContactNumber").val();
        model.Password = $("#Password").val();
        model.FirstLevelApproverId = $("#FirstLevelApproverId").val();
        model.FirstLevelApproverName = $("#FirstLevelApprover").val();
        model.SecondLevelApproverId = $("#SecondLevelApproverId").val();
        model.SecondLevelApproverName = $("#SecondLevelApprover").val();
        model.ThirdLevelApproverId = $("#ThirdLevelApproverId").val();
        model.ThirdLevelApproverName = $("#ThirdLevelApprover").val();
        model.DateOfBirth = $("#DateOfBirth").val();
        model.Gender = $("#Gender").val();
        model.MaritalStatus = $("#MaritalStatus").val();
        model.Nationality = $("#Nationality").val();
        model.PassportNo = $("#PassportNo").val();
        model.MealPreference = $("#MealsPreference").val();
        model.SeatPreference = $("#SeatPreference").val();
        model.OtherInfo = $("#OtherPreference").val();
        model.VisaInfo = $("#VisaDetails").val();
        model.ApproverLevel = window.ApproverLevel;
        model.IsApprover = window.isapprover;
        model.PassportExpiryDate = $("#PassportExpiryDate").val();
        model.PassportIssuedLocation = $("#PassportIssueLocation").val();
        model.HasPasswordChanged = $('#ChkChangePassword').is(":checked");
        model.arrProjectList = $("#ProjectList").val();


        if (!($('#SubApproverGrid tr:last').attr('value') == undefined)) {
            subcount = parseFloat($('#SubApproverGrid tr:last').attr('value'));
            model.SubstituteApproverList = new Array();
            for (i = 1; i <= subcount; i++) {
                var sub = new Object();
                sub.StartDate = $("#SubtituteApproverStartDate" + i).val();
                sub.EndDate = $("#SubtituteApproverEndDate" + i).val();
                sub.ApproverName = $("#subApprName" + i).val();
                sub.SubstitueEmployeeId = $("#SubstitueEmployeeId" + i).val();
                model.SubstituteApproverList.push(sub);
            }
        }

        var data = $.postifyData(model);
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Employee/AddEmployee",
        "POST",
        data,
        function (response) {
            $("#employeeProfileMessage").attr("class", "alert alert-success");
            $(window).scrollTop(0);
            $("#employeeProfileMessage").html("Saved successfully.");
            $("#substituteApproverMessage").removeClass();
            $("#substituteApproverMessage").html('');
            $("#PasswordField").hide();
            $('#ChkChangePassword').attr('checked', false);
        }, function (XMLHttpRequest, textStatus, errorThrown) { }, null
        );
    }
    catch (error) {
        $().Logger.error("Employee.js validateEmployeeProfileForm() -->" + error);
    }
}

function ChangePassword() {
    try {
        if ($('#ChkChangePassword').is(":checked")) {
            $("#PasswordField").show();
            window.isPasswordDisable = false;
            $("#Password").prop('disabled', false);
            $('#Password').val("");
            $('#Password').focus();
        }
        else {
            //$('#isPasswordDisable').val("True");
            window.isPasswordDisable = true;
            $("#Password").prop('disabled', true);
            //$("#Password").val(window.Password);
            $("#PasswordField").hide();
        }
    }
    catch (error) {
        $().Logger.error("Employee.js ChangePassword() -->" + error);
    }
}

//function formatDate(date) {
//    try{    
//    var newStartDate = new Date(date);
//    var d = newStartDate.getDate().toLocaleString();
//    if (d.length == 1) {
//        d = "0" + d;
//    }

//    var m = (newStartDate.getMonth() + 1).toLocaleString();
//    if (m.length == 1) {
//        m = "0" + m;
//    }
//    return m + "/" + d + "/" + newStartDate.getFullYear();
//    }
//    catch (error) {
//        $().Logger.error("Employee.js formatDate() -->" + error);
//    }
//}

function EmpGenderValidation() {
    try {
        if ($('#Gender').val() == 0)
            $("#EmpGenderErrorMessage").html('Select Gender');
        else
            $("#EmpGenderErrorMessage").html('');
    }
    catch (error) {
        $().Logger.error("Employee.js EmpGenderValidation() -->" + error);
    }
}

function EmpNationalityValidation() {
    try {
        if ($('#Nationality').val() == '00000000-0000-0000-0000-000000000000')
            $('#EmpNationalityErrorMessage').html('Select Nationality');
        else
            $('#EmpNationalityErrorMessage').html('');
    }
    catch (error) {
        $().Logger.error("Employee.js EmpNationalityValidation() -->" + error);
    }
}

function EmpPassportNoValidation() {
    try {
        var anyError = false;
        if ($('#PassportNo').val().length > 15) {
            $('#EmpPassportNoError').html('Max upto 15 characters only');
            anyError = true;
        }
        else {
            $('#EmpPassportNoError').html('');
            anyError = false;
        }
    }
    catch (error) {
        $().Logger.error("Employee.js EmpPassportNoValidation() -->" + error);
    }
}

function EmpAgeValidation() {
    try {
        var anyError = false;
        var serverCurrentDate = $("#CurrentDate").val();
        var dateOfBirth = new Date(moment($("#DateOfBirth").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
        var minAge = new Date(moment($("#CurrentDate").val()).subtract(18, 'years').format("MM/DD/YYYY"));
        if (dateOfBirth == null || dateOfBirth == undefined || dateOfBirth == "Invalid Date" || $("#DateOfBirth").val() == "") {
            anyError = true;
            $("#EmpErrorMessageDateOfBirth").html("Required");
            return anyError;
        }
        if (minAge < dateOfBirth) {
            anyError = true;
            $("#EmpErrorMessageDateOfBirth").html('Age should be above 18 years');
        }
        else {
            anyError = false;
            $("#EmpErrorMessageDateOfBirth").html('');
        }
        return anyError;
    }
    catch (error) {
        $().Logger.error("Employee.js EmpAgeValidation() -->" + error);
    }
}
