
function LoadProjects() {
    //$.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
    try
    {
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "TravelRequest/Project/Projects",
        "GET",
        null,
        function (response) {
            if (response != null && response.length > 0) {
                $("#TravelRequestProject").autocomplete({
                    source: response[0],
                    select: function (event, ui) {
                        if (ui.item === null) {
                            $(this).val('');
                            $('#lblTravelRequestProject').html('Please search valid project.');
                        }
                        else {
                            if ($("#hdnProjectId").val() != "" && $("#hdnProjectId").val() != ui.item.id) {
                                var count = parseInt($("#hdnTravellerTypeCount").val());
                                for (var i = 1; i <= count; i++) {
                                    if ($("#hdnEmployeeId" + i).length > 0) {
                                        $("#textTravellerName" + i).val('');
                                        $("#hdnEmployeeId" + i).val('');
                                        $("#hdnGrade" + i).val('');
                                        DeleteTravellers(i);
                                    }
                                }
                            }
                            $('#lblTravellerError').html('');
                            $("#TravelRequestProject").val(ui.item.value);
                            $("#hdnProjectId").val(ui.item.id);
                            $('#lblTravelRequestProject').html('');
                            $('#IsEditFlow').val('false');
                            LoadTravellers(1);
                        }
                    }
                });
                //$.unblockUI();
            }
        },
        function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("LoadProjects");
            console.log(XMLHttpRequest);
        },
        "json"
        );
    }
    catch(error)
    {
        $().Logger.error("LoadProject.js loadproject() --> " + error);

    }
}