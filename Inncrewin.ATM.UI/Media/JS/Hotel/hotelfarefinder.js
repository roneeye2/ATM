$(function () {

    try {
        $.widget("custom.catcomplete", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                var that = this,
                  more = "",
                  morecount = 0,
                  currentCategory = "",
                  searchKey = items[1].value;
                ul.attr("class", "rez-ac-wrapper");
                $.each(items[0], function (index, item) {
                    var li;
                    if (item.Caption != currentCategory) {
                        if (currentCategory !== "")
                            //ul.append( "<li class='rez-ac-more'>"+more+" </li>" );	
                            if (item.Count > 0)
                                more = '...<a href="#" onclick="javascript:getLocationDataByType(' + item.DisplayOrder + ',&quot;' + searchKey + '&quot;, &quot;' + item.Caption + '&quot;);">' + item.Count + '  more   </a>';
                        //  ul.append( "<li class='rez-ac-group'>" + item.Caption + " </li>" );
                        currentCategory = item.Caption;
                    }
                    li = that._renderItemData(ul, item);
                    if (item.Caption) {
                        li.attr("aria-label", item.Caption + " : " + item.Name);
                        var newText = String(item.Name).replace(
                            new RegExp(that.term, "gi"),
                            "<span>$&</span>");
                        li.html(newText);
                    }
                });
                if (currentCategory !== "")
                    ul.append("<li class='rez-ac-more'>" + more + " </li>");
                //ul.append( "<li class='rez-ac-ins'>Keep typing to refine search or use<span> more </span>option to view total list. </li>" );
            }
        });

        $("#textLocation").catcomplete({
            delay: 0,
            minLength: 3,
            source: function (request, response) {
                var _term = request.term;
                $.when(LoadCountries(request.term)).then(
                function (r) {
                    response({ data: r, searchKey: _term });
                }, function (error) {


                })
            },
            select: selectLocation
        });

        // Set date picker.
        $("#CheckInDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "CheckInDate")
            },
            numberOfMonths: [1, 2],
            minDate: moment().format(sessionStorage.DateFormatForMoment),
            onSelect: function (curDate, instance) {
                var chkoutDate = moment(curDate, sessionStorage.DateFormatForMoment).add(2, "days").format(sessionStorage.DateFormatForMoment)
                $('#CheckOutDate').val(chkoutDate)
                //$("#txtDate").val($.format.date(date, 'dd M yy'));
            },
        });
        $("#CheckInDate").mask(sessionStorage.CultureMaskFormat);

        function convert(dateString) {
            alert(dateString)
            var date = new Date(dateString),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [mnth, day, date.getFullYear()].join("/");
        }



        $("#CheckOutDate").datepicker({
            dateFormat: sessionStorage.CultureDateFormat, yearRange: "1900:2200",
            onClose: function (event) {
                validateB2EDate(event, "CheckOutDate")
            },
            numberOfMonths: [1, 2],
            minDate: moment().format(sessionStorage.DateFormatForMoment)
        });
        $("#CheckOutDate").mask(sessionStorage.CultureMaskFormat);

        $(document).on('change', "input[name='search']:radio", function (event) {
            selectLocation(event, {
                item: {
                    Name: $(this).attr('location'),
                    CityCode: $(this).attr('CityCode'),
                    CountryCode: $(this).attr('CountryCode'),
                    Caption: ''
                }
            });
            $('#tremp-search').modal('hide');
        });
    } catch (error) {
        $().Logger.error("HotelFarefinder.js function()-->" + error)
    }
});

//Prepare dialog and load.
function showDialog(title, body, width, height) {
    try {
        if (width)
            $('.modal-dialog').css('width', width);
        if (height)
            $('.modal-Hotel-fareFinder-content').css('height', height)
        $('.modal-title').html(title);
        $('.modal-Hotel-fareFinder-content').html(body);
        $('#tremp-search').modal('show');
    } catch (error) {
        $().Logger.error("HotelFarefinder.js showDialog()-->" + error)
    }
}

//Room Dropdown change Handler
function roomSelect(element) {
    try {
        var roomlength = document.getElementsByClassName('rooms')[0].children.length;
        var requestedRooms = element.options[element.selectedIndex].value;
        var template = '<div class="row room-#">' +
                                                    '<div class="form-group col-sm-4 col-md-4">' +

                                                    '</div>' +
                                                    '<div class="form-group col-sm-2 col-md-2">' +
                                                        '<span style="vertical-align: middle;"> Room # </span>' +
                                                    '</div>' +
                                                    '<div class="form-group col-sm-4 col-md-4">' +
                                                        '<select class="form-control" id="Adult" name="Adult[#]" onchange="validateTravelRequestCountry(); LoadStates()">' +
                                                            '<option value="1">1</option>' +
                                                            '<option value="2">2</option>' +
                                                            '<option value="3">3</option>' +
                                                            '<option value="4">4</option>' +
                                                            '<option value="5">5</option>' +
                                                            '<option value="6">6</option>' +
                                                            '<option value="7">7</option>' +
                                                            '<option value="8">8</option>' +
                                                            '<option value="9">9</option>' +
                                                            '<option value="10">10</option>' +
                                                            '<option value="11">11</option>' +
                                                            '<option value="12">12</option>' +
                                                            '<option value="13">13</option>' +
                                                            '<option value="14">14</option>' +
                                                            '<option value="15">15</option>' +
                                                        '</select>' +
                                                        '<label id="lblAdult" class="error"></label>' +
                                                    '</div>' +
                                                '</div>';

        if (roomlength < requestedRooms) {
            for (i = roomlength; i < requestedRooms; i++) {
                $('.rooms')[0].append($(template.replace(new RegExp('#', 'g'), i + 1))[0]);
            }
        }
        else {
            for (i = 5; i > parseInt(requestedRooms) && i > 1; i--) {
                $('.room-' + i).remove();
            }
        }
    } catch (error) {
        $().Logger.error("HotelFarefinder.js roomSelect()-->" + error)
    }
}

function selectLocation(event, ui) {
    try {
        if (ui.item) {
            $('#textLocation').val(ui.item.Name);
            $('#hdnCityCode').val(ui.item.CityCode);
            $('#hdnCountryCode').val(ui.item.CountryCode);
            $('#hdnLocation1').val(ui.item.Caption);
        }
        return false;
    } catch (error) {
        $().Logger.error("HotelFarefinder.js selectLocation()-->" + error)
    }
}

// Countries.
function LoadCountries(key, category) {
    try {
        var dfd = jQuery.Deferred();
        var serviceProxy = new ServiceProxy();
        serviceProxy.invoke(
        "Hotel/Location/" + key + (category != undefined ? "/" + category : ""),
        "GET",
        "",
        function (response) {
            if (response != null && response.length > 0) {
                dfd.resolve(response);
                //result = response;
                //$("#TravelRequestCountry").append("<option value='" + response[count].LocationId + "'>" + response[count].LocationValue + "</option>");
            }
        }, function (XMLHttpRequest, textStatus, errorThrown) { },
        "json"
        );
        return dfd.promise();
    } catch (error) {
        $().Logger.error("HotelFarefinder.js LoadCountries()-->" + error)
    }
}

//...more Handler
function getLocationDataByType(a, b, c) {
    try {
        $('.modal-Hotel-fareFinder-content').html('<p>Loading...</p>');
        var temp = { category: a, searchKey: b };
        $('.modal-title').html(c);
        $.when($('#tremp-search').modal('show')).then(function (e, d, f) {
            LoadMoreSearchResult(temp);
        });
    } catch (error) {
        $().Logger.error("HotelFarefinder.js getLocationDataByType()-->" + error)
    }
}

function LoadMoreSearchResult(temp) {
    try {
        $.when(LoadCountries(temp.searchKey, temp.category)).then(function (d, e, f) {
            var ul = $('<ul></ul>')
            $.each(d, function (index, item) {
                ul.append('<input type="radio" name="search" coordinates="" location="' + item.Name + '" CityCode="' + item.CityCode + '" CountryCode="' + item.CountryCode + '" />');
                ul.append('<li coordinates="">' + item.Name + '</li>');
            });
            $('.modal-Hotel-fareFinder-content').html(ul);
        });
    } catch (error) {
        $().Logger.error("HotelFarefinder.js LoadMoreSearchResult()-->" + error)
    }
}





// $('input[required], input[required="required"]').each(function(i, e)
// {
// e.oninput = function(el)
// {
// el.target.setCustomValidity("");

// // if (el.target.type == "email")
// // {
// // if (el.target.validity.patternMismatch)
// // {
// // el.target.setCustomValidity("E-mail format invalid.");

// // if (el.target.validity.typeMismatch)
// // {
// // el.target.setCustomValidity("An e-mail address must be given.");
// // }
// // }
// // }
// };

// e.oninvalid = function(el)
// {
// el.target.setCustomValidity("");
// if(!el.target.validity.valid){
// //el.target.setCustomValidity(e.attributes.requiredmessage.value );
// showDialog('Message',e.attributes.requiredmessage.value,'300px','55px');
// }else{
// el.target.setCustomValidity("");
// }
// };
// });