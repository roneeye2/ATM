$(function () {
   try {
     var hotelSearchCriteria = new Object();

    var obj = getUrlVars();
    if (!readyflag) {
        $(document.body).on('click', '.dp-PlusPaxCount', paxIncrementValue);
        $(document.body).on('click', '.dp-MinusPaxCount', paxDecrementValue);

        $(document.body).on('click', '.dp-PlusRoomCount1', roomIncrementValue);
        $(document.body).on('click', '.dp-MinusRoomCount1', roomDecrementValue);
        readyflag = true;
}
} catch(error) {
    $().Logger.error("Hotel.js function() -->" + error);
}

});

$("#resultsLoadMore").hide();
var showCount;
var totalPageCount;

var HotelsearchCriteria = [];
var isHotelNameFilter = false;
var isSortByPrice = false;
var isPriceSelected = false;
var isApplyFilter = false;
var Hcount = 0;

function roomDecrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count > 1) {
            $inputTxt.val(parseInt($inputTxt.val()) - 1);

            //Remove Content
            $(".dp-PaxClonecont .dp-PaxCol:last-child").remove();
        }
} catch (error) {
    $().Logger.error("Hotel.js roomDecrementValue() -->" + error);
    }
    //roomSelect( $(this));
}

function roomIncrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count < 5) {
            $inputTxt.val(parseInt($inputTxt.val()) + 1);

            //Load Content
            var $clonecont = $(".dp_pax-clone").html();
            var $count = $("#NoOfRoomstxt").val();

            $clonecont = $clonecont.replace("paxa", $count);
            $clonecont = $clonecont.replace("paxc", $count);
            $clonecont = $clonecont.replace("paxi", $count);
            $(".dp-PaxClonecont").append($clonecont);
        }
        roomSelect($(this));
    } catch (error) {
        $().Logger.error("Hotel.js roomIncrementValue() -->" + error);
    }
}


function roomSelect(element) {

    try {
        var roomlength = document.getElementsByClassName('dp-PaxClonecont')[0].children.length + 1;
        var requestedRooms = document.getElementById('NoOfRoomstxt').value;

        var template = $('.dp_pax-clone .dp-PaxCol');

        if (roomlength < requestedRooms) {
            for (i = roomlength; i < requestedRooms; i++) {
                $('.dp-PaxClonecont').append($(template));
            }
        }
        else {
            for (i = 5; i > parseInt(requestedRooms) && i > 1; i--) {
                $('.dp-PaxCol:eq(' + i + ')').remove();
            }
        }
        } catch (error) {
            $().Logger.error("Hotel.js roomSelect() -->" + error);
    }
}


function paxDecrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count > 0) {
            $inputTxt.val(parseInt($inputTxt.val()) - 1);
        }
    } catch (error) {
         $().Logger.error("Hotel.js paxDecrementValue() -->" +error);
    }
}

function paxIncrementValue() {
    try {
        var $inputTxt = $(this).parent().find("input");
        var $count = $inputTxt.val();
        if ($count < 7) {
            $inputTxt.val(parseInt($inputTxt.val()) + 1);
        }
    } catch (error) {
        $().Logger.error("Hotel.js paxIncrementValue() -->" + error);
    }
}

function HotelSearch() {
    
   try {
     ResetHotelFilter();
    var hotelBudegt = $('#FFHotelBudget').text();
    var requestorId = $('#FFTravelRequestNo').text();
    var model = new Object();

    model.CountryCode = $('#hdnCountryCode').val();
    model.CityCode = $('#hdnCityCode').val();
    model.CheckIn = $('#CheckInDate').val();
    model.CheckOut = $('#CheckOutDate').val();
    model.NoofRooms = $('#NoOfRoomstxt').val();


    model.Budget = hotelBudegt;
    if (requestorId != null && requestorId != "") {
        model.RequestorId = requestorId;
    }

    if ($('#hdnSelectedHotelCount').val() > 0)
        model.HasHotels = true;
    var adultCount =[];
    for (i = 1; i <= model.NoofRooms; i++) {
        var a = $('#NoOfAdultstxt-2').val();
        var b = '#NoOfAdultstxt' + '-' +i;
        adultCount.push($('#NoOfAdultstxt' + '-' +i).val());
    }
    model.AdultCount = adultCount;
    var filterModel = new Object();
    filterModel.PageCount = $('#hdnResultsCount').val();
    filterModel.isSortAscending = true;
    filterModel.DefaultPageSize = parseInt($("#hdnDefaultPageSize").val());
    // Reset filters
    $('#rating1 input:checkbox').removeAttr('checked');

    var sort = $('#btnSort1').attr("class");
        {
            if (sort == "fa fa-sort-amount-desc") {
            $("#btnSort1").removeClass("fa fa-sort-amount-desc");
            $("#btnSort1").addClass("fa fa-sort-amount-asc");
}
    }
    isHotelNameFilter = false;
    // isApplyFilter = false;
    LoadStarRating();
    model.HotelFilter = filterModel;
    hotelSearchCriteria = model;
    $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>'
    });

    var serviceProxy = new ServiceProxy();
    serviceProxy.invoke(
     "Hotel/GetHotelSearch",
     "POST",
    $.postifyData(model),
    function (response) {
        $('#isHotelSearchPerformed').val('true');
        BuildResponse(response, false);
        isLoadingData = false;

    },
    function (XMLHttpRequest, textStatus, errorThrown) {
}
    );
    return false;
   } catch (error) {
       $().Logger.error("Hotel.js HotelSearch() -->" + error);
    }
}

var readyflag = false;

$(window).unload(function () {

});

function ClearDataTxtLocation() {
  try {
      if ($('#textLocation').val() == 'Enter destination') {
        $('#textLocation').val('').removeClass('watermark');
        $('#textLocation').css("color", "#696969");
    }
  } catch (error) {
      $().Logger.error("Hotel.js ClearDataTxtLocation() -->" + error);
    }
}

function ClearDataTxtCheckInDate() {
    try {
        if ($("#CheckInDate").val() == 'Select  date') {
            $('#CheckInDate').val('').removeClass('watermark');
            $('#CheckInDate').css("color", "#696969");
        }
    } catch (error) {
 $().Logger.error("Hotel.js ClearDataTxtCheckInDate() -->" +error);
    }
}

function SearchHotel() {
    try {
        if ($.trim($('#textLocation').val()) == "" || $('#textLocation').val() == 'Enter destination') {
            var watermark = 'Enter destination';
            $('#textLocation').val(watermark).addClass('watermark');
            $('#textLocation').css("color", "red");
            return false;
        }
        var checkInDate = new Date(moment($("#CheckInDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
        if (checkInDate == null || checkInDate == "" || checkInDate == undefined || checkInDate == "Invalid Date") {
            $("#CheckInDate").val("");
            $("#CheckInDate").parent("div").css('border', '1px solid #f00');
            return false;
        }
        var checkOutDate = new Date(moment($("#CheckOutDate").val(), sessionStorage.DateFormatForMoment).format("MM/DD/YYYY"));
        if (checkOutDate == null || checkOutDate == "" || checkOutDate == undefined || checkOutDate == "Invalid Date") {
            $("#CheckOutDate").val("");
            $("#CheckOutDate").parent("div").css('border', '1px solid #f00');
            return false;
        }
        if (IsInvalidDateRange($("#CheckInDate").val(), $("#CheckOutDate").val())) {
            alertmsg("Check-In date is greater than Check-Out date.")
            return false;
        }
        if ($("#CheckInDate").val() == "" || $("#CheckInDate").val() == 'Select  date') {
            var watermark = 'Select  date';
            $('#CheckInDate').val(watermark).addClass('watermark');
            $('#CheckInDate').css("color", "red");
            return false;
        }
        $("#hdnSelectedHotelCount").val(0);
        $('#hdnResultsCount').val(parseInt(10));

        var NoOfRooms = $('#NoOfRoomstxt').val();
        var AdultCountSum = 0;
        for (i = 1; i <= parseInt(NoOfRooms) ; i++) {
            var AdultCount = parseInt($('#NoOfAdultstxt-' + i).val());
            AdultCountSum = AdultCountSum + AdultCount;
        }
        if (AdultCountSum > 7) {
            //$('.rze-hotelcontwrap').html('Adult Count shouldnt be greater then 7');
            $('#dialog').html('Total passenger for all rooms should be 7');
            //alertmsg('Total passenger for all rooms should be 7');
            $('#dialog').dialog({
                modal: true,
                show: {
                    duration: 10
                },
                hide: {
                    duration: 10
                },
                buttons: { "OK": function () { $(this).dialog("close"); } }
            });
            $("#dialog").show();
        }
        else {
            isApplyFilter = false;
            isPriceSelected = false;
            HotelSearch();
        }
    } catch (error) {
        $().Logger.error("Hotel.js SearchHotel() -->" +error);
    }
}

function CheckHotelItineraryExists() {
    try {
        HotelSearch();
    } catch (error) {
        $().Logger.error("Hotel.js CheckHotelItineraryExists() -->" +error);
    }

}

//StarRating
function StarRating() {

 try {
    //$(".starnull").html('<span>Unrated</span>');
 $(".starnull").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star50").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span>');
 $(".star40").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star30").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star20").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star10").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');

 $(".star45").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span>');
 $(".star35").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star25").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star"></i></span> <span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star15").html('<span><i class="fa fa-star"></i> </span><span><i class="fa fa-star-half-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".star05").html('<span><i class="fa fa-star-half-o"></i> </span><span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span> <span><i class="fa fa-star-o"></i></span>');
 $(".starunrated").html('<span>without a star</span>');
 } catch (error) {
     $().Logger.error("Hotel.js StarRating() -->" +error);
 }
}

function CheckHotelItineraryExists() {
    try {
        var RequestNo = $('#FFTravelRequestNo').text();
        if (RequestNo === undefined) {
            return;
        }
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
           "TravelItinerary/HotelItinerary/CheckHotelItineraryExists/" + RequestNo,
           "POST",
       null,
       function (response) {
           var ItineraryCount;
           if (response != null && response.ItineraryHotels != null && response.ItineraryHotels.length > 0) {
               var ItineraryCount = response.HotelItineraryCount;
               //if ($('#FlightTab').hasClass('disabled')) {
               //    if (response.ItineraryHotels.length - 5 > 0)
               //        ItineraryCount = response.ItineraryHotels.length - 5;
               //    else
               //        ItineraryCount = 0;
               $("#hdnSelectedHotelCount").val(parseInt(ItineraryCount));
               //}
               //else {
               //    ItineraryCount = parseInt(response.ItineraryHotels.length);
               //    $("#hdnSelectedHotelCount").val(parseInt(response.ItineraryHotels.length) - 1);
               //}
               Hcount = ItineraryCount;
               return ItineraryCount;
           }
       }, function (XMLHttpRequest, textStatus, errorThrown) { }, "json", false);
    } catch (error) {
        $().Logger.error("Hotel.js CheckHotelItineraryExists() -->" + error);
    }
}

function fnSelectHotel(HotelCode, RoomType, Meal, TotalRate, HasRoomChanged) {
    try {
        var count = $('#hdnSelectedHotelCount').val();
        var _class = $("#labelbook_" + HotelCode).attr("class");
        if (_class == "btn btn-primary pull-right SelectFlight") {
            $("#hdnSelectedHotelCount").val(parseInt(count) - 1);
            $("#labelbook_" + HotelCode).removeClass("SelectFlight");
            var length = HotelsearchCriteria.length;
            for (var i = 0; i < HotelsearchCriteria.length; i++) {

                if (HotelsearchCriteria[i].HotelCode === HotelCode)
                    HotelsearchCriteria.splice(i, 1);
            }

        }
        else {
            // Allowing the employee to select only one, if employee belongs to grade approval exceptions.
            var isExc = getUrlVars()["IsExc"];
            if (isExc === "true" && count > 0) {
                alertmsg('You can select only 1 Hotel');
                return false;
            }

            if (count < 4) {
                $("#hdnSelectedHotelCount").val(parseInt(count) + 1);
                $("#labelbook_" + HotelCode).addClass("SelectFlight");
                AddHotel(HotelCode, RoomType, Meal, TotalRate, HasRoomChanged)
            }
            else {
                if (count >= 5) {
                    alertmsg('you have already added 5 hotels to Itinerary.');
                    return false;
                }
                else {
                    alertmsg('Selection of hotel allowed upto 4.');
                    return false;
                }
            }

        }
    } catch (error) {
        $().Logger.error("Hotel.js fnSelectHotel() -->" + error);
    }

}

function CreateHotelItinerary() {
    try {
        var count = $('#hdnSelectedHotelCount').val();
        if (Hcount >= 5) {
            alertmsg('you have already added 5 hotels to Itinerary.');
            return false;
        }
        else if (count >= 5) {
            alertmsg('you have already added 5 hotels to Itinerary.');
            return false;
        }
        var model = new Object;
        model.TravelRequestId = $('#FFTravelRequestNo').text();
        model.Hotels = HotelsearchCriteria;
        model.IsHotelStarRatingPolicyViolated = $("#hdnHasHotelStarRatingPolicyViolated").val();

        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });

        model.CorporatePolicyIDs = $("#hdnCorporatePolicies").val();
        model.PreferredHotelId = $("#PreferredHotelId").val();

        model.GradeLevelPreferredHotelId = $("#hdnPreferredHotelCode").val();

        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
         "TravelItinerary/Itinerary/AddHotel",
         "POST",
        $.postifyData(model),
        function (response) {

            if (response != false) {
                window.location.href = "TravelRequestDetail?RequestNo=" + model.TravelRequestId + "&Itinerary=true";
            }
            else {
                alertmsg('Hotel itinerary creating failed for travel request id:' + model.TravelRequestId);
            }
            $.unblockUI();
        }, function (XMLHttpRequest, textStatus, errorThrown) { });

    } catch (error) {
        $().Logger.error("Hotel.js CreateHotelItinerary() -->" + error);
    }
}

function AddHotel(HotelCode, RoomType, Meal, TotalRate, hasRoomChanged) {

    try {
        var count = $('#hdnSelectedHotelCount').val();
        if (count > 5) {
            alertmsg('Selection Hotel allowed upto 5.');
            return false;
        }

        var model = new Object();
        model.HotelCode = HotelCode;
        model.CountryCode = $('#hdnCountryCode').val();
        model.CityCode = $('#hdnCityCode').val();
        model.CheckIn = $('#CheckInDate').val();
        model.CheckOut = $('#CheckOutDate').val();
        model.RoomType = RoomType;
        model.MealType = Meal;
        model.TotalRate = TotalRate;
        model.HasRoomChanged = hasRoomChanged
        model.NoofRooms = $('#NoOfRoomstxt').val();
        var adultCount = [];
        for (i = 1; i <= model.NoofRooms; i++) {
            var a = $('#NoOfAdultstxt-2').val();
            var b = '#NoOfAdultstxt' + '-' + i;
            adultCount.push($('#NoOfAdultstxt' + '-' + i).val());
        }
        model.AdultCount = adultCount;
        HotelsearchCriteria.push(model);
    } catch (error) {
        $().Logger.error("Hotel.js AddHotel() -->" + error);
    }
}

function showRooms(element, hCode) {

    try {
        if ($("#HotelRoomTypes_" + hCode).html().length > 0) {

            toggleRoomTab(hCode);

        }
        else {
            $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
            loadRooms(hCode);
        }
    } catch (ex) {
        //$().Logger.error("Hotel.js showRooms() -->" + ex.message);
    }

}

var loadRooms = function (hCode) {


    try {
        var searchRequest = searchRequestfn(hCode);
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Hotel/GetHotelSearch",
        "POST",
        searchRequest,
        function (response) {
            if (response != null && response.Hotel != null) {
                if (response.Hotel.length > 0) {
                    hotelRooms = response.Hotel;
                    loadTemplate(response.Hotel);
                    $('#mySelect').fSelect();
                }
            }
            else {

                $("#HotelRoomTypes_" + hCode).empty();
                $("#HotelRoomTypes_" + hCode + "").append('<tr><td colspan="4">no rooms available</td></tr>')
                toggleRoomTab(hCode);
                $.unblockUI();
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
       "json", false);
    } catch (error) {
        $.unblockUI();
        $().Logger.error("Hotel.js hCode() -->" + error);
    }
};

var loadTemplate = function (hotel) {

    //$("#HotelRoomTypes").empty();

    try {
        if (hotel) {
            $("#HotelRoomTypes_" + hotel[0].HotelCode).empty();
            var arr = hotel[0].AdultCount;
            var hotelCode = hotel[0].HotelCode;

            $.each(hotel[0].RoomType, function (a, b, c) {

                var roomType = b.RoomTypeName;
                var roomTypeClass;
                var requestorId = $('#FFTravelRequestNo').text();
                if (a == 0) {
                    roomTypeClass = "btn btn-primary btn-sm selected";
                }
                else {
                    roomTypeClass = "btn btn-primary btn-sm";
                }
                if (requestorId != null && requestorId != "") {

                    var RoomTypeRow = ' <tr><td> ' + b.RoomTypeName + ' </td><td> ' + b.MealType + ' </td><td>' + "IDR" + " " + b.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + '</td><td class="rze-selectroom">' +
                    "<button type='button' id='roomType_" + b.RoomTypeName + "' class='" + roomTypeClass + "' onclick='ChangeRoom(" + '"' + hotel[0].HotelCode + '"' + "," + '"' + b.RoomTypeName + '"' + "," + '"' + b.MealType + '"' + "," + '"' + b.TotalRate + '"' + "," + '"' + hotel[0].CurrencySymbol + '"' + ");'> " + "Select" + "</button></td></tr>"
                }
                else {
                    var RoomTypeRow = ' <tr><td> ' + b.RoomTypeName + ' </td><td> ' + b.MealType + ' </td><td>' + "IDR" + " " + b.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + '</td><td class="hide">' +
                     "</td></tr>"
                }
                var html1 = $("#HotelRoomTypes_" + hotelCode + "");
                console.log(html1);
                var html = $("#HotelRoomTypes_" + hotelCode + "").append(RoomTypeRow)

                $("#HotelRoomTypes").show();

            });
        }
        toggleRoomTab(hotelCode);
        roomDetailsSelectbnt()
        $.unblockUI();
        } catch(error) {
            $().Logger.error("Hotel.js loadTemplate() -->" + error);
    }
};


function setPosition(e, elementSelector) {
    try {
        var cordinates = $(e).position();
        $(elementSelector).
            //css({ 'top': cordinates.top + 20, 'left': cordinates.left, 'position': 'absolute', 'border': '1px solid black' }).
            show();
            } catch (error) {
                $().Logger.error("Hotel.js setPosition() -->" +error);
    }
}

function hideRooms() {
    try {
        $('#room-tab').hide();
        } catch (error) {
            $().Logger.error("Hotel.js hideRooms() -->" + error);
    }
}

function ResetHotel() {
  try {
      $('#isHotelSearchPerformed').val('false');
    $('#HotelSearchResultGrid').empty();
    $('#dvhotelSearchResults').hide();
    $('#textLocation').val("");
    $('#CheckInDate').val("");
    $('#CheckOutDate').val("");
    $('#NoOfAdultstxt-1').val(1);
    var noOfRooms = parseFloat($('#NoOfRoomstxt').val());
    if (noOfRooms > 1) {
        for (i = noOfRooms; i > 1; i--) {
        //Removal of the lastchild element each time
            $(".dp-PaxClonecont .dp-PaxCol:last-child").remove();
        }
        $('#NoOfRoomstxt').val(1);
    }
    else {
        $('#NoOfRoomstxt').val(1);
    }

    $('#dvhotelSearchResults').hide();
    $('#hotelfilters').hide();
  } catch (error) {
      $().Logger.error("Hotel.js ResetHotel() -->" +error);
    }
}

function LoadFilters(minPrice, maxPrice, HotelNames, isSortAscending) {

    try {
        if ($("#product-price-range").length > 0) {


            if ($("#MaxPrice") != null && $("#MaxPrice").val() != undefined && $("#MaxPrice").val() != '') {
                var maxRange = Math.round(parseInt($("#MaxPrice").val()));
                var currencySymbol = $("#CurrencySymbol").val();
                var minRange = Math.round(parseInt($("#MinPrice").val()));
                var minSelected = parseInt($.trim($("#txtStartPriceRange").val()));
                var maxSelected = parseInt($.trim($("#txtEndPriceRange").val()));
                $('#txtStartPriceRange').val(minPrice);
                $('#txtEndPriceRange').val(maxPrice);

                ($("#product-price-range")).slider({
                    range: true,
                    min: minPrice,
                    max: maxPrice,
                    values: [minPrice, maxPrice],
                    slide: function (event, ui) {
                        isPriceSelected = true;
                        $("#txtStartPriceRange").val(ui.values[0]);
                        $("#txtEndPriceRange").val(ui.values[1]);
                    },
                    stop: function (event, ui) {

                        $("#txtStartPriceRange").val(ui.values[0]);
                        $("#txtEndPriceRange").val(ui.values[1]);
                        //LoadProductResultsControl(control + "?pageIndex=" + pageIndex + "&sortExpression=" + sortExpression + "&sortDirection=" + sortDirection + "&IsGalleryView=" + $("#IsGalleryView").val() + "&" + $('#frmCategoryFilter').serialize())
                        LoadProductResultsControl(false)
                    }
                });
            }
        }
        $("#Hotels").empty();

        LoadHotelNames(HotelNames, true);
        LoadStarRating();
    } catch (error) {
        $().Logger.error("Hotel.js LoadFilters() -->" + error);
    }


}

function LoadProductResultsControl(isPagination) {

    try {
        var hotelBudegt = $('#FFHotelBudget').text();
        var requestorId = $('#FFTravelRequestNo').text();
        var model = new Object();
        model.CountryCode = $('#hdnCountryCode').val();
        model.CityCode = $('#hdnCityCode').val();
        model.CheckIn = $('#CheckInDate').val();
        model.CheckOut = $('#CheckOutDate').val();
        model.NoofRooms = $('#NoOfRoomstxt').val();


        model.Budget = hotelBudegt;
        if (requestorId != null && requestorId != "") {
            model.RequestorId = requestorId;
        }
        var adultCount = [];
        for (i = 1; i <= model.NoofRooms; i++) {
            var a = $('#NoOfAdultstxt-2').val();
            var b = '#NoOfAdultstxt' + '-' + i;
            adultCount.push($('#NoOfAdultstxt' + '-' + i).val());
        }
        model.AdultCount = adultCount;
        var min = parseInt($("#txtStartPriceRange").val());
        var max = parseInt($("#txtEndPriceRange").val());
        var hotels = [];
        var starRating = [];
        var filterModel = new Object();
        filterModel.PageCount = $('#hdnResultsCount').val();
        filterModel.isSortAscending = true;
        filterModel.DefaultPageSize = parseInt($("#hdnDefaultPageSize").val());
        filterModel.MinPrice = min;
        filterModel.MaxPrice = max;
        filterModel.IsPagination = isPagination;
        $('#mySelect :selected').each(function (i, selected) {
            hotels[i] = $(selected).text();
            isHotelNameFilter = true;
        });


        $('input:checkbox[name=StarRating]').each(function () {
            if ($(this).is(':checked'))
                starRating.push(($(this).val()));
        });
        filterModel.StarRating = starRating;
        filterModel.Hotels = hotels;
        filterModel.Hotel = $("#txtHotelName").val();
        filterModel.isApplyFilter = true;
        isApplyFilter = true;


        if (isSortByPrice) { filterModel.isSortAscending = false; }
        else { filterModel.isSortAscending = true; }

        model.HotelFilter = filterModel;
        $.blockUI({ message: '<h1> <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i> Just a moment...</h1>' });
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Hotel/GetHotelSearch",
         "POST",
        $.postifyData(model),
        function (response) {

            $("#hdnResultsCount").val(parseInt(0));
            BuildResponse(response, filterModel.isApplyFilter, isPagination);
            isLoadingData = false;
        }, function (XMLHttpRequest, textStatus, errorThrown) { });
        return false;
        } catch(error) {
            $().Logger.error("Hotel.js LoadProductResultsControl() -->" + error);
    }
}

function BuildResponse(response, isApplyFilter, isPagination) {
    // Corporate employee grade approver exception.
    try {
        var isExc = getUrlVars()["IsExc"];

        $("#dvhotelSearchResults").show();
        if (response != null && response.Hotel != null && response.Hotel.length > 0) {

            if (response.CorporatePolicyIDs != null || response.CorporatePolicyIDs != '') {
                var $hdnCorporatePolicies = $('<input/>', { type: 'hidden', id: 'hdnCorporatePolicies', value: response.CorporatePolicyIDs });
                $hdnCorporatePolicies.appendTo("#dvhotelSearchResults");
            }

            //if isExc is true for Grade level changes, set preferred hotel code to a field, to find the selected hotel
            if (isExc == "true") {
                CheckHotelItineraryExists();
                var count = $('#hdnSelectedHotelCount').val();
                $('#hdnPreferredHotelCode').val(response.Hotel[0].HotelCode);
            }

            $("#hotelResults").show();
            var requestorId = $('#FFTravelRequestNo').text();
            if (!isApplyFilter) {

                LoadFilters(response.HotelFilter.MinPrice, response.HotelFilter.MaxPrice, response.HotelFilter.Hotels, response.HotelFilter.isSortAscending);
            }
            if (isApplyFilter) {
                LoadHotelNames(response.HotelFilter.Hotels, response.HotelFilter.isApplyFilter);
            }
            //filter

            //$("#divFilternav a").on("click", Filter);


            var inputSelect = $("#mySelect").val();
            var isStarRatingChecked = false;

            $('input:checkbox[name=StarRating]').each(function () {
                if ($(this).is(':checked'))
                    isStarRatingChecked = true;
                return;
            });


            // fSelect();
            if ($("#hdnResultsCount").val() <= 10) {
                if (!isPagination) { $("#HotelSearchResultGrid").empty(); }
                $("#NoSearchResults").hide();
                $("#hotelResults").show();
                $("#hotelfilters").show();
                $("#HotelNameFilter").hide();
                if ((isApplyFilter) && (inputSelect == null) && (isStarRatingChecked == false) && (isPriceSelected == false)) {

                    $("#HotelNameFilter").hide();
                }
                else if (isApplyFilter) {

                    $("#HotelNameFilter").show();
                    $('#mySelect').fSelect();
                }

                //Policy message 
                if (response != null && response.IsPolicyAppliedResultsNotAvailable && (requestorId != null && requestorId != "")) {
                    var $hasHotelStarRatingPolicyViolated = $('<input/>', { type: 'hidden', id: 'hdnHasHotelStarRatingPolicyViolated', value: true });
                    $hasHotelStarRatingPolicyViolated.appendTo("#HotelSection");
                    var PolicyControl = '<div class="rze-pollabel"><a href="javascript:return void(0)" class="show">Out of Policy</a><span class="tooltip">Hotel star rating policy is violated.</span></div>';
                }
                else {
                    var PolicyControl = "";
                }
                var preferredHotelId = "";

                $.each(response.Hotel, function (key, value) {

                    var mapDetails = "";
                    var policyDetails = "";
                    var viewDetailsTab = "";
                    var otherInfo = "<tr>";
                    var generalDes = ["general", "hoteldescription"];

                    var viewdetailid = "Viewdetails_" + value.HotelCode;
                    var galleryid = "gallery_" + value.HotelCode;
                    var mapid = "maps_" + value.HotelCode;
                    var policiesid = "policies_" + value.HotelCode;



                    var otherDes = ["rooms", "location", "restaurant", "pleasenote", "location detail", "locationdescription"];
                    if (value.LongDescription != null && value.LongDescription.length > 0) {
                        var des = value.LongDescription.split('?/');
                        if (des.length > 0) {
                            viewDetailsTab = "<tr>";

                            for (i = 0; i < des.length; i++) {
                                // loading general description.
                                if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), generalDes) >= 0) {
                                    viewDetailsTab += "<h4>" + "OVERVIEW" + ": </h4>" +
                                                        "<p>" + des[i].split('=')[1] + "</p>";
                                }
                                else // loading extra information.
                                {
                                    if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), otherDes) >= 0) {
                                        otherInfo += "<h4>" + des[i].split('=')[0] + ": </h4>" +
                                                           "<p>" + des[i].split('=')[1] + "</p>";
                                    }
                                }
                            }
                        }
                    }
                    if (viewDetailsTab != "") {
                        viewDetailsTab += "</tr>";
                        if (otherInfo != "<tr>") {
                            otherInfo += "</tr>";
                            viewDetailsTab += otherInfo;
                        }
                    }

                    var imageGallery = "";
                    if (value.ImageGallery != null && value.ImageGallery.length > 0) {
                        imageGallery = "<tr>";
                        for (i = 0; i < value.ImageGallery.length; i++) {
                            //if (value.ImageGallery[i].URL == '')
                            //    value.ImageGallery[i].URL = "http://images.gta-travel.com/HH/Images/EM/AUHth/AUH-GRA1-1.jpg";
                            var row = "<td>" + "<div class='rze-galimg'>" + "<div class='rze-galimglbl hide'>" + value.ImageGallery[i].Description + "</div>" + "<img src='" + value.ImageGallery[i].URL + "' title='" + value.ImageGallery[i].Description + "' class='img-responsive'>" + "</img>" + "</div>" + "</td>";
                            imageGallery += row;
                        }
                    }
                    if (imageGallery != '')
                        imageGallery += "</tr>";


                    if (viewDetailsTab == '')
                        viewDetailsTab = "No details to show";
                    if (imageGallery == '')
                        imageGallery = "No images to show";
                    if (mapDetails == '')
                        mapDetails = "No maps to show";
                    if (policyDetails == '')
                        policyDetails = "No cancellation policy to show";

                    if (requestorId != null && requestorId != "") {
                        if ($('#hdnSelectedHotelCount').val() == undefined) {
                            $("#hdnSelectedHotelCount").val(parseInt(0));
                            //("#hdnSelectedHotelCount").val("0");
                        }

                        $("#createItinerary").show();
                        // If isExc is false, Need to show preferred as selected.
                        // If not, Need not show as selected.
                        if (key == 0 && isExc === "false") {
                            if (value.IsPreferred) {
                                preferredHotelId = value.HotelCode;
                                //console.log(value.HotelCode + "H" + value.IsPreferred);
                                //$("#PreferredHotelId").val(value.HotelCode);
                            }
                            else {
                                console.log(value.HotelCode + "H" + value.IsPreferred);
                            }
                            $("#preferredResult").show();
                            $("#HotelSearchResults").hide();
                            var row = '<div class="rze-prdcontwrap"> ' +
                                        '<div class="col-xs-12 rze-prdcont row_main"> ' +
                                            '<div class="col-xs-12 col-md-2 rze-prdimg">' +
                                                '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive" />' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10">' +
                                                '<div class="row">' +
                                                    '<div class="col-xs-12 col-md-7">' +
                                                        '<div class="row"> ' +
                                                            '<div class="col-xs-12 col-md-8 rze-prdtittle" title="' + value.HotelName + '"><label>' + value.HotelName + '</label><span>' + PolicyControl + '</span></div> ' +
                                                            '<div class="col-xs-12 col-md-4 text-center"><span class="star' + value.StarRating + '">' + value.StarRating + '</span></div>' +
                                                            '<div class="col-xs-12 col-md-8 rze-hotelcin">' +
                                                                '<div class="date_l">' + value.CheckIn + "</div>  " +
                                                                "<div class='date_r'> " + value.CheckOut + '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div> ' +
                                                    '<div class="col-xs-12 col-md-5 nopadding"> ' +
                                                        '<div class="rze-pricingcont row">' +
                                                            '<div class="rze-price col-xs-12 col-md-7">' +
                                                                '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' + "<span>" + "Total Price" + '</span>' +
                                                                    '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3>" +                                                                 
                                                                '</div>' +
                                                            '</div>' +
                                                            '<div class="rze-select col-xs-12 col-md-5">' +
                                                                '<label class="btn btn-default pull-right hotel-select rze-selectedbtn xs-nofloat">' + "Selected" + '</label>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont"><div class="rze-prdnav" id="rze-prdnav">' +
                                               '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                //'<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                            '</div></div>' +
                                        '</div>' +
                                       '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +
                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +
                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +
                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +
                                            '{{policies}}' +
                                        '</div> ' +
                                         //'<div class="rze-tabcontainer panel-group roomTabs" id="room-tab_' + value.HotelCode + '"> ' +
                                        '</div> ' +
                                        '</div>' +
                                      '</div>';
                            row = row.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                            row = row.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                            row = row.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                            row = row.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                            $("#preferredResult").html(row);
                            if (!isPagination) {
                                HotelsearchCriteria = [];
                            }
                            selectedcount = $('#hdnSelectedHotelCount').val();
                            if (isPagination) {
                                $('#hdnSelectedHotelCount').val(selectedcount);
                            }
                            else {
                                CheckHotelItineraryExists();
                            }
                            if (isApplyFilter && !isPagination && Hcount == 0) {
                                $('#hdnSelectedHotelCount').val(0);
                            }
                            var count = $('#hdnSelectedHotelCount').val();
                            if (!isPagination) {
                                if (count < 5 && Hcount == 0) {
                                    AddHotel(value.HotelCode, value.RoomType[0].RoomTypeName, value.Meal, value.TotalRate);
                                }
                            }
                        }
                        else {
                            $("#HotelSearchResults").show();
                          
                            var hotelCode = value.HotelCode;
                            var newRow = '<div class="rze-prdcontwrap">' +
                                            '<div class="col-xs-12 rze-prdcont row_main"> ' +
                                                '<div class="col-xs-12 col-md-2 rze-prdimg">' +
                                                    '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive"/>' +
                                                '</div>' +
                                            '<div class="col-xs-12 col-md-10"> ' +
                                                '<div class="row"> ' +
                                                    '<div class="col-xs-12 col-md-7">' +
                                                        '<div class="row">' +
                                                            '<div class="col-xs-12 col-md-8 rze-prdtittle" title="' + value.HotelName + '"><label>' +
                                                                value.HotelName + '</label><span>' + PolicyControl + '</span></div> ' +
                                                        '<div class="col-xs-12 col-md-4 text-center"><span class="star' + value.StarRating + '">'
                                                            + value.StarRating +
                                                        '</span></div> ' +
                                                        '<div class="col-xs-12 col-md-8 rze-hotelcin">' +
                                                            '<div class="date_l">' + value.CheckIn + '</div>' +
                                                            "<div class='date_r'>" + value.CheckOut + '</div>' +
                                                        '</div> ' +
                                                    '</div> ' +
                                                '</div>' +
                                                '<div class="col-xs-12 col-md-5 nopadding">' +
                                                    '<div class="rze-pricingcont row"> ' +
                                                        '<div class="rze-price col-xs-12 col-md-7"> ' +
                                                            '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' +
                                                                '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3> " +
                                                                "<span>" + "Total Price" + '</span> ' +
                                                            '</div> ' +
                                                        '</div> ' +
                                                    '<div class="rze-select col-xs-12 col-md-5">' +
                                                        "<div id='divHoteltPreferred_" + value.HotelCode + "'> " +
                                                            "<label class='btn btn-primary pull-right xs-nofloat'  id='labelbook_" + value.HotelCode + "' onclick='fnSelectHotel(" + '"' + value.HotelCode + '"' + "," + '"' + value.RoomType[0].RoomTypeName + '"' + "," + '"' + value.Meal + '"' + "," + '"' + value.TotalRate + '"' + ");'> " +
                                                                "Select & Book " +
                                                            "</label> " +
                                                        "</div>" +
                                                    '</div> ' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont"><div class="rze-prdnav" id="rze-prdnav">' +
                                                '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                            '</div></div>' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +

                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +

                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +

                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +

                                            '{{policies}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer roomTabs responsive rzeroomdetails" id="room-tab_' + value.HotelCode + '"> <table class="table table-bordered rzeroomdetails"><tr><th>Room Type</th><th>Room Inculsion</th><th>Price</th><th class="rze-thselectroom"></th></tr><tbody id="HotelRoomTypes_' + value.HotelCode + '">' +

                                        '</tbody></table></div> ' +
                                    '</div>';
                            //newRow = newRow.replace(new RegExp('{{rooms}}', 'g'), '| <a href="#" onclick="showRooms(this, \'' + value.HotelCode + '\')">Rooms</a> |');
                            newRow = newRow.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                            newRow = newRow.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                            newRow = newRow.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                            newRow = newRow.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                            // $("#HotelSearchResultGrid").html(row);
                            $("#HotelSearchResultGrid").append(newRow);
                        }
                    }
                    else {

                        var newRow = '<div class="rze-prdcontwrap">' +
                                        '<div class="col-xs-12 rze-prdcont row_main">' +
                                            ' <div class="col-xs-12 col-md-2 rze-prdimg">' + '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive"/> ' + ' </div>' +
                                                '<div class="col-xs-12 col-md-10">' +
                                                    '<div class="row"> ' +
                                                        '<div class="col-xs-12 col-md-8"> ' +
                                                            '<div class="row">' +
                                                                '<div class="col-xs-12 col-md-8 rze-prdtittle" title="' + value.HotelName + '"><label>' + value.HotelName + '</label></div>' +
                                                                '<div class="col-xs-12 col-md-4 text-center"><span class="star' + value.StarRating + '">' + value.StarRating + '</span></div>' +
                                                                '<div class="col-xs-12 col-md-8 rze-hotelcin"><div class="date_l">' + value.CheckIn + '</div><div class="date_r">' + value.CheckOut + '</div></div>' +
                                                            //'</div>' +
                                                        '</div>' +
                                                    '</div> ' +
                                                    '<div class="col-xs-12 col-md-4 nopadding">' +
                                                        ' <div class="rze-pricingcont row">' +
                                                            '<div class="rze-price col-xs-12 col-md-11">' +
                                                                 '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' + "<span>" + "Total Price" + '</span>' +
                                                                    '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3>" +                                                                    
                                                                '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont">' +
                                                '<div class="rze-prdnav" id="rze-prdnav">' +
                                                    '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                    '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                    '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                    '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                    '<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +
                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +
                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +
                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +
                                            '{{policies}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer roomTabs responsive rzeroomdetails" id="room-tab_' + value.HotelCode + '"> <table class="table table-bordered rzeroomdetails"><tr><th>Room Type</th><th>Room Inculsion</th><th>Price</th><th class="hide"></th></tr><tbody id="HotelRoomTypes_' + value.HotelCode + '">' +
                                        '</tbody></table></div> ' +
                                     '</div>';


                        newRow = newRow.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                        newRow = newRow.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                        newRow = newRow.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                        newRow = newRow.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                        $("#HotelSearchResultGrid").append(newRow);
                    }
                });
            }
            else {

                $("#hotelResults").show();
                $("#NoSearchResults").hide();

                //NEW S
                $.each(response.Hotel, function (key, value) {

                    var mapDetails = "";
                    var policyDetails = "";
                    var viewDetailsTab = "";
                    var otherInfo = "<tr>";
                    var generalDes = ["general", "hoteldescription"];
                    var otherDes = ["rooms", "location", "restaurant", "pleasenote", "location detail", "locationdescription"];
                    if (value.LongDescription != null && value.LongDescription.length > 0) {
                        var des = value.LongDescription.split('?/');
                        if (des.length > 0) {
                            viewDetailsTab = "<tr>";

                            for (i = 0; i < des.length; i++) {
                                // loading general description.
                                if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), generalDes) >= 0) {
                                    viewDetailsTab += "<h4>" + "OVERVIEW" + ": </h4>" +
                                                        "<p>" + des[i].split('=')[1] + "</p>";
                                }
                                else // loading extra information.
                                {
                                    if (des[i] != '' && $.inArray(des[i].split('=')[0].toLowerCase(), otherDes) >= 0) {
                                        otherInfo += "<h4>" + des[i].split('=')[0] + ": </h4>" +
                                                           "<p>" + des[i].split('=')[1] + "</p>";
                                    }
                                }
                            }
                        }
                    }
                    if (viewDetailsTab != "") {
                        viewDetailsTab += "</tr>";
                        if (otherInfo != "<tr>") {
                            otherInfo += "</tr>";
                            viewDetailsTab += otherInfo;
                        }
                    }

                    var imageGallery = "";
                    if (value.ImageGallery != null && value.ImageGallery.length > 0) {
                        imageGallery = "<tr>";
                        for (i = 0; i < value.ImageGallery.length; i++) {

                            var row = "<td>" + "<div class='rze-galimg'>" + "<div class='rze-galimglbl hide'>" + value.ImageGallery[i].Description + "</div>" + "<img src='" + value.ImageGallery[i].URL + "' title='" + value.ImageGallery[i].Description + "' class='img-responsive'>" + "</img>" + "</div>" + "</td>";
                            imageGallery += row;
                        }
                    }
                    if (imageGallery != '')
                        imageGallery += "</tr>";


                    if (viewDetailsTab == '')
                        viewDetailsTab = "No details to show";
                    if (imageGallery == '')
                        imageGallery = "No images to show";
                    if (mapDetails == '')
                        mapDetails = "No maps to show";
                    if (policyDetails == '')
                        policyDetails = "No cancellation policy to show";

                    if (requestorId != null && requestorId != "") {
                        if ($('#hdnSelectedHotelCount').val() == undefined) {
                            $("#hdnSelectedHotelCount").val(parseInt(0));
                            //("#hdnSelectedHotelCount").val("0");
                        }

                        $("#createItinerary").show();
                        // If isExc is false, Need to show preferred as selected.
                        // If not, Need not show as selected.
                        if (key == 0 && isExc === "false") {
                            $("#preferredResult").show();
                            $("#HotelSearchResults").hide();
                            if (value.IsPreferred) {
                                //console.log(value.HotelCode+"H" + value.IsPreferred);
                                //$("#PreferredHotelId").val(value.HotelCode);
                                preferredHotelId = value.HotelCode;
                            }
                            else {
                                console.log(value.HotelCode + "H" + value.IsPreferred);
                            }
                            var row = '<div class="rze-prdcontwrap"> ' +
                                        '<div class="col-xs-12 rze-prdcont row_main"> ' +
                                            '<div class="col-md-2 rze-prdimg">' +
                                                '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive"/>' +
                                            '</div>' +
                                            '<div class="col-md-10">' +
                                                '<div class="row">' +
                                                    '<div class="col-md-7">' +
                                                        '<div class="row"> ' +
                                                            '<div class="col-xs-12 col-md-8 rze-prdtittle" title="' + value.HotelName + '">' + value.HotelName + '</div> ' +
                                                            '<div class="col-xs-12 col-md-4 text-center"><span class="star' + value.StarRating + '">' + value.StarRating + '</span></div>' +
                                                            '<div class="col-xs-12 col-md-8 rze-hotelcin">' +
                                                                '<div class="date_l">' + value.CheckIn + "</div>  " +
                                                                "<div class='date_r'> " + value.CheckOut + '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div> ' +
                                                    '<div class="col-xs-12 col-md-5 nopadding"> ' +
                                                        '<div class="rze-pricingcont row">' +
                                                            '<div class="rze-price col-md-7">' +
                                                                 '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' + "<span>" + "Total Price" + '</span>' +
                                                                    '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3>" +
                                                                '</div>' +
                                                            '</div>' +
                                                            '<div class="rze-select  col-md-5">' +
                                                                '<label class="btn btn-default pull-right hotel-select rze-selectedbtn xs-nofloat">' + "Selected" + '</label>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont"><div class="rze-prdnav" id="rze-prdnav">' +
                                                '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                            '</div></div>' +
                                        '</div>' +
                                       '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +
                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +
                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +
                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +
                                            '{{policies}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer panel-group roomTabs" id="room-tab_' + value.HotelCode + '"> ' +
                                        '</div> ' +
                                        '</div>' +
                                      '</div>';
                            row = row.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                            row = row.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                            row = row.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                            row = row.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                            $("#preferredResult").html(row);

                            HotelsearchCriteria = [];
                            CheckHotelItineraryExists();
                            var count = $('#hdnSelectedHotelCount').val();
                            if (count < 5) {
                                AddHotel(value.HotelCode, value.RoomType[0].RoomTypeName, value.Meal, value.TotalRate);
                            }
                        }
                        else {
                            $("#HotelSearchResults").show();
                            
                            var hotelCode = value.hotelCode;
                            var newRow = '<div class="rze-prdcontwrap">' +
                                            '<div class="col-xs-12 rze-prdcont row_main"> ' +
                                                '<div class="col-md-2 rze-prdimg">' +
                                                    '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive"/>' +
                                                '</div>' +
                                            '<div class="col-md-10"> ' +
                                                '<div class="row"> ' +
                                                    '<div class="col-md-7">' +
                                                        '<div class="row">' +
                                                            '<div class="col-md-8 rze-prdtittle" title="' + value.HotelName + '">' +
                                                                value.HotelName +
                                                            '</div> ' +
                                                        '<div class="col-md-4 text-center"><span class="star' + value.StarRating + '">'
                                                            + value.StarRating +
                                                        '</span></div> ' +
                                                        '<div class="col-md-8 rze-hotelcin">' +
                                                            '<div class="date_l">' + value.CheckIn + '</div>' +
                                                            "<div class='date_r'>" + value.CheckOut + '</div>' +
                                                        '</div> ' +
                                                    '</div> ' +
                                                '</div>' +
                                                '<div class="col-md-5 nopadding">' +
                                                    '<div class="rze-pricingcont row"> ' +
                                                        '<div class="rze-price col-md-7"> ' +
                                                            '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' + "<span>" + "Total Price" + '</span> ' +
                                                                '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3> " +
                                                            '</div> ' +
                                                        '</div> ' +
                                                    '<div class="rze-select col-xs-12  col-md-5">' +
                                                        "<div id='divHoteltPreferred_" + value.HotelCode + "'> " +
                                                            "<label class='btn btn-primary pull-right xs-nofloat'  id='labelbook_" + value.HotelCode + "' onclick='fnSelectHotel(" + '"' + value.HotelCode + '"' + "," + '"' + value.RoomType[0].RoomTypeName + '"' + "," + '"' + value.Meal + '"' + "," + '"' + value.TotalRate + '"' + ");'> " +
                                                                "Select & Book " +
                                                            "</label> " +
                                                        "</div>" +
                                                    '</div> ' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont"><div class="rze-prdnav" id="rze-prdnav">' +
                                                '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                            '</div></div>' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +

                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +

                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +

                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +

                                            '{{policies}}' +
                                        '</div> ' +
                                         '<div class="rze-tabcontainer" id="room-tab_' + value.HotelCode + '"> ' +

                                        '</div> ' +
                                    '</div>';
                            //newRow = newRow.replace(new RegExp('{{rooms}}', 'g'), '| <a href="#" onclick="showRooms(this, \'' + value.HotelCode + '\')">Rooms</a> |');
                            newRow = newRow.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                            newRow = newRow.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                            newRow = newRow.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                            newRow = newRow.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                            // $("#HotelSearchResultGrid").html(row);
                            $("#HotelSearchResultGrid").append(newRow);
                        }
                    }
                    else {
                        var newRow = '<div class="rze-prdcontwrap">' +
                                        '<div class="col-xs-12 rze-prdcont row_main">' +
                                            ' <div class="col-md-2 rze-prdimg">' + '<img id="theImg" src="' + value.DefaultImg + '" class="img-responsive"/> ' + ' </div>' +
                                                '<div class="col-md-10">' +
                                                    '<div class="row"> ' +
                                                        '<div class="col-md-8"> ' +
                                                            '<div class="row">' +
                                                                '<div class="col-md-8 rze-prdtittle" title="' + value.HotelName + '">' + value.HotelName + '</div>' +
                                                                '<div class="col-md-4 text-center"><span class="star' + value.StarRating + '">' + value.StarRating + '</span></div>' +
                                                                '<div class="col-md-8 rze-hotelcin"><div class="date_l">' + value.CheckIn + '</div><div class="date_r">' + value.CheckOut + '</div></div>' +
                                                            //'</div>' +
                                                        '</div>' +
                                                    '</div> ' +
                                                    '<div class="col-md-4 nopadding">' +
                                                        ' <div class="rze-pricingcont row">' +
                                                            '<div class="rze-price col-md-11">' +
                                                                 '<div class="rze-priceval" id="TotalRate_' + value.HotelCode + '">' + "<span>" + "Total Price" + '</span>' +
                                                                    '<h3>' + value.CurrencySymbol + " " + value.TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3>" +
                                                                '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 col-md-10 rze-prdnavcont">' +
                                                '<div class="rze-prdnav" id="rze-prdnav">' +
                                                '<a data-tabid="#Viewdetails_' + value.HotelCode + '" onclick="showDetails(\'' + viewdetailid + '\')">' + ' View Details' + ' </a> ' + ' <span>|</span>' +
                                                '<a data-tabid="#gallery_' + value.HotelCode + '" onclick="showDetails(\'' + galleryid + '\')">' + ' Photo Gallery' + ' </a>' + '<span>|</span>' +
                                                '<a class="hidden" data-tabid="#maps_' + value.HotelCode + '" onclick="showDetails(\'' + mapid + '\')">' + ' Maps' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a class="hidden" data-tabid="#policies_' + value.HotelCode + '"onclick="showDetails(\'' + policiesid + '\')">' + ' Policies' + ' </a>' + '<span class="hidden">|</span>' +
                                                '<a data-tabid="#room-tab_' + value.HotelCode + '" onclick="showRooms(this, \'' + value.HotelCode + '\')">' + ' Rooms' + ' </a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer" id="Viewdetails_' + value.HotelCode + '"> ' +
                                            '{{viewdetails}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer rze-gallery" id="gallery_' + value.HotelCode + '">' +
                                            '{{photos}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="maps_' + value.HotelCode + '">' +
                                            '{{maps}}' +
                                        '</div>' +
                                        '<div class="rze-tabcontainer hidden" id="policies_' + value.HotelCode + '"> ' +
                                            '{{policies}}' +
                                        '</div> ' +
                                        '<div class="rze-tabcontainer panel-group roomTabs" id="room-tab_' + value.HotelCode + '"> ' +
                                        '</div> ' +
                                     '</div>';

                        //newRow = newRow.replace(new RegExp('{{rooms}}', 'g'), '| <a href="#" onclick="showRooms(this, \'' + value.HotelCode + '\')">Rooms</a> |');
                        newRow = newRow.replace(new RegExp('{{viewdetails}}', 'g'), viewDetailsTab);
                        newRow = newRow.replace(new RegExp('{{photos}}', 'g'), imageGallery);
                        newRow = newRow.replace(new RegExp('{{maps}}', 'g'), imageGallery);
                        newRow = newRow.replace(new RegExp('{{policies}}', 'g'), imageGallery);
                        $("#HotelSearchResultGrid").append(newRow);
                    }
                });
                //NEW E

            }
            $("#hotelTabResultCount").html("Showing " + response.HotelFilter.PageCount + " " + "of " + response.HotelFilter.TotalResults + " " + "Results");
            $("#hdnResultsCount").val(parseInt(response.HotelFilter.PageCount) + 10);
            $("#hdnShowCount").val(parseInt(response.HotelFilter.PageCount));
            $("#hdnTotalResultsCount").val(parseInt(response.HotelFilter.TotalResults));
            $("#PreferredHotelId").val(preferredHotelId);

        }
        else {

            if (response != null && response.ErrorMessage != null && response.ErrorCode == 1001) {
                var $hasPolicyChanged = $('<input/>', { type: 'hidden', id: 'hdnhasPolicyChanged', value: response.ErrorCode });
                $hasPolicyChanged.appendTo("#divFilternav");

                $("#hotelTabResultCount").hide();
                $("#hotelResults").hide();
                $("#NoSearchResults").show();
                $("#NoSearchResults").html(response.ErrorMessage);
            }
            else {
                $("#hotelResults").hide();
                $("#NoSearchResults").show();
                $("#NoSearchResults").html("No hotels results found");
                $("#hotelTabResultCount").html("");
                $("#resultsLoadMore").hide();
            }
        }
        /*hotel tab*/
        $(".rze-tabcontainer").hide();
        $(".rze-gallery .rze-galimg img").click(function () {

            $(".overlaynew").remove();
            $("body").append("<div class='overlaynew'></div>");
            var newimgurl = $(this).attr("src");
            var newimgtitle = $(this).attr("title");
            $("body").append("<div class='rze-newzoomimage'><div class='rze-newzoomimageinn'><div><h4>" + newimgtitle + "</h4></div><img src=" + newimgurl + "></img> </div></div>");
            $(".rze-newzoomimageinn").append("<div id='imgclose'>X close</div>");
            console.log(newimgurl);
            closeimg()
        });
        function closeimg() {
            $("#imgclose").click(function () {
                $("body .overlaynew").remove();
                $("body .rze-newzoomimage").remove();
            });
        }
        StarRating();
        $.unblockUI();
            } catch (error) {
                $().Logger.error("Hotel.js Build() -->" + error);
    }
}

function clearHotelFilters() {
   try {
     $('#hotelfilters').hide();
    $('#dvhotelSearchResults').hide();
   } catch (error) {
       $().Logger.error("Hotel.js clearHotelFilters() -->" +error);
    }
}

function sortByDirection() {
    try {
        $("#hdnSelectedHotelCount").val(parseInt(0));
        var sort = $('#btnSort1').attr("class");
        if (sort == "fa fa-sort-amount-asc") {
            $("#btnSort1").removeClass("fa fa-sort-amount-asc");
            $("#btnSort1").addClass("fa fa-sort-amount-desc");
            isSortByPrice = true;
        }
        else {
            $("#btnSort1").removeClass("fa fa-sort-amount-desc");
            $("#btnSort1").addClass("fa fa-sort-amount-asc");
            isSortByPrice = false;
        }
        LoadProductResultsControl(false);
        return false;
    } catch (error) {
            $().Logger.error("Hotel.js sortByDirection() -->" +error);
    }
}


function LoadHotelNames(HotelNames, isApplyfilter) {

    try {
        if (!isHotelNameFilter) {
            $("#Hotels").empty();
            var x = document.createElement("SELECT");
            x.setAttribute("id", "mySelect");
            x.setAttribute("multiple", "multiple");
            document.body.appendChild(x);
            $.each(HotelNames, function (key, value) {
                var z = document.createElement("option");
                z.setAttribute("value", value);
                var t = document.createTextNode(value);
                z.appendChild(t);
                document.getElementById("mySelect").appendChild(z);

            });
            document.getElementById("Hotels").appendChild(x);
        }
        } catch (error) {
             $().Logger.error("Hotel.js LoadHotelNames() -->" +error);
}
}

var isLoadingData;

$(window).scroll(function () {
try {

    if ($("#hdnhasPolicyChanged").val() == 1001) {
        return false;
    }
    var isHotelSearchPerformed = $('#isHotelSearchPerformed').val();
    if ($('#HotelTab').hasClass('active')) {
        if (isHotelSearchPerformed == 'true') {
            if (isLoadingData != undefined) {
                if ($(window).scrollTop() == $(document).height() -$(window).height() && !isLoadingData) {
                    isLoadingData = true;
                    showCount = parseInt($("#hdnShowCount").val());
                    totalPageCount = parseInt($("#hdnTotalResultsCount").val());
                    if (showCount == totalPageCount) {
                        return false;
                }
                    //$('#resultsLoadMore').trigger('click');
                    LoadProductResultsControl(true, false);
            }
                //fSelect();
    }
}
}
    } catch (error) {
        $().Logger.error("Hotel.js scroll() -->" +error);
}
});


var searchRequestfn = function (hCode) {
    try {
        hotelSearchCriteria.HotelCode = hCode;
        return hotelSearchCriteria;
    } catch (error) {
        $().Logger.error("Hotel.js searchRequestfn() -->" +error);
    }
};


var onRoomSelect = function () {
    try {

        var any = hotelRooms;
        } catch (error) {
            $().Logger.error("Hotel.js onRoomSelect() -->" + error);
    }
}

function ChangeRoom(hotelCode, RoomType, MealType, TotalRate, CurrencySymbol) {
try {

    for (var i = 0; i < HotelsearchCriteria.length; i++) {

        if (HotelsearchCriteria[i].HotelCode === hotelCode)
            HotelsearchCriteria.splice(i, 1);
    }
    $('#divHoteltPreferred_' +hotelCode).html("");
    $('#divHoteltPreferred_' + hotelCode).append("<label class='btn btn-primary pull-right xs-nofloat'  id='labelbook_" + hotelCode + "' onclick='fnSelectHotel(" + '"' + hotelCode + '"' + "," + '"' + RoomType + '"' + "," + '"' + MealType + '"' + "," + '"' + TotalRate + '"' + "," + true + ");'>  Select & Book " +
                                                        "</label> ");
    $('#TotalRate_' +hotelCode).html("");
    $('#TotalRate_' + hotelCode).append("<h3>" + CurrencySymbol + " " + TotalRate.toLocaleString(sessionStorage.CultureTypeInfo) + "</h3>" +
    "<span>" + "Total Price" + '</span>');

    return false;
} catch (error) {
     $().Logger.error("Hotel.js ChangeRoom() -->" +error);
}
}


function ShowFilter() {
    try {
        Filter();
    } catch (error) {
        $().Logger.error("Hotel.js ShowFilter() -->" + error);
    }

}

function Filter() {

  try {
      $("#HotelNameFilter").slideToggle();
    $('#mySelect').fSelect();
  } catch (error) {
      $().Logger.error("Hotel.js Filter() -->" + error);
    }

}

function LoadStarRating() {
    try {
        $("#rating").empty();
        for (var i = 0; i <= 5 ; i++) {

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "StarRating";
            checkbox.value = i;
            checkbox.id = "id";
            var label = document.createElement('label')
            label.htmlFor = "id";
            label.appendChild(document.createTextNode(i));
            document.getElementById("rating").appendChild(checkbox);
            document.getElementById("rating").appendChild(label);
        }
    } catch (error) {
        $().Logger.error("Hotel.js LoadStarRating() -->" + error);
    }
}

function ResetHotelFilter() {
    // Reset filters
    try {
        $('#rating1 input:checkbox').removeAttr('checked');

        var sort = $('#btnSort1').attr("class");
        {
            if (sort == "fa fa-sort-amount-desc") {
                $("#btnSort1").removeClass("fa fa-sort-amount-desc");
                $("#btnSort1").addClass("fa fa-sort-amount-asc");
            }
        }
        isHotelNameFilter = false;
        isPriceSelected = false;
        isApplyFilter = false;
        $("#hdnResultsCount").val(parseInt(10));
    } catch (error) {
        $().Logger.error("Hotel.js ResetHotelFilter() -->" + error);
    }
}

function tabid() {
    try {
    $("#rze-prdnav a").click(function () {
        $(".rze-tabcontainer").hide();
        if ($(this).hasClass("selected")) {
            var tabidval = $(this).attr("data-tabid");
            $(tabidval).slideUp();
            $(this).removeClass("selected");
        }
        else {
            $("#rze-prdnav a").removeClass("selected")
            $(this).addClass("selected")
            var tabid = $(this).attr("data-tabid");
            console.log(tabid);
            $(tabid).show();
        }
        $(".rze-tabclose").click(function () {
            $(".rze-tabcontainer").slideUp();
});
});
    } catch (error) {
        $().Logger.error("Hotel.js tabid() -->" + error);
}

}

function toggleRoomTab(hotelCode) {
    
    try {
        $(".rze-tabcontainer").hide();
        if ($('#room-tab_' + hotelCode).hasClass('selected')) {
            $('#room-tab_' + hotelCode).slideUp();
            ($('#room-tab_' + hotelCode).removeClass('selected'))
        }
        else {
            $(".rze-tabcontainer").removeClass('selected');
            ($('#room-tab_' + hotelCode).addClass('selected'))
            $('#room-tab_' + hotelCode).show();
        }
    } catch (error) {
        $().Logger.error("Hotel.js toggleRoomTab() -->" + error);
    }

}

function roomDetailsSelectbnt() {
    try {
        $(".rze-selectroom button").click(function () {
            $(".rze-selectroom button").removeClass("selected");
            $(this).addClass("selected");
        })
    } catch (error) {
        $().Logger.error("Hotel.js roomDetailsSelectbnt() -->" +error);
    }
}


function showDetails(element) {

  
    try {

        $(".rze-tabcontainer").hide();
        if ($('#' + element).hasClass('selected')) {
            $('#' + element).slideUp();
            ($('#' + element).removeClass('selected'))
        }
        else {
            $(".rze-tabcontainer").removeClass('selected');
            ($('#' + element).addClass('selected'))
            $('#' + element).show();
        }
    } catch (error) {
         $().Logger.error("Hotel.js showDetails() -->" +error);
    }

}



