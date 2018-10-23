function watertime() {
  var apprate = parseFloat($("#apprate").val()),
    deficit = parseFloat($("#deficit").html()),
    minutes = ((deficit / apprate) * 60.0) / 0.9;
  $("#dwatertime").html("Watering time: " + minutes.toFixed(0) + " minutes");
}

function displayResults(finalDeficit) {
  var recommend,
    nogif =
      "http://www.nrcc.cornell.edu/industry/lawn_water/images/dont_sprinkle.gif",
    yesgif =
      "http://www.nrcc.cornell.edu/industry/lawn_water/images/asprinkler.gif";
  $("#inputSection").hide();
  $("#resultsSection").show();
  if (finalDeficit <= 0.5) {
    recommend = "No need to water today";
    $(".wateringBox").hide();
  } else if (finalDeficit >= 1.5) {
    recommend = "Add 1.50 inches of water";
    $(".wateringBox").show();
  } else {
    recommend = "Add " + finalDeficit.toFixed(2) + " inches of water";
    $(".wateringBox").show();
  }
  $("#deficit").html(Math.max(finalDeficit, 0.0).toFixed(2));
  $("#recommend").html(recommend);
  $("#sprinkler").attr("src", finalDeficit <= 0.5 ? nogif : yesgif);
}

function calcDeficit(pcpn, values_pet, dates_pet) {
  var precip = [],
    pet = [],
    initDeficit = 0.0,
    soilcap = "medium",
    croptype = 1; //grass
  $.each(pcpn, function(i, dp) {
    var mmdd = dp[0].slice(-5).replace("-", "/"),
      pos = $.inArray(mmdd, dates_pet),
      dpet = pos === -1 ? -999 : values_pet[pos];
    if (dpet !== -999 && precip !== -999) {
      precip.push(dp[1]);
      pet.push(dpet);
      $("#lastday").html(mmdd);
    }
  });

  // calculate the daily water deficits
  deficitResults = runWaterDeficitModel(
    precip,
    pet,
    initDeficit,
    soilcap,
    croptype
  );

  if (deficitResults.deficitDaily.length > 0) {
    var finalDeficit =
      -1.0 *
      deficitResults.deficitDaily[deficitResults.deficitDaily.length - 1];
    displayResults(finalDeficit);
  } else {
    $("#errmsg")
      .show()
      .html("Error calculating daily water deficit.");
    console.log("Deficit calc error");
  }
}

function getPET(latlng, yy, pcpn) {
  var year = rdate.substr(0, 4),
    url =
      "http://tools.climatesmartfarming.org/irrigationtool/datahdf5/?lat=" +
      latlng.lat +
      "&lon=" +
      latlng.lng +
      "&year=" +
      yy;
  $.ajax(url, {
    type: "POST",
    dataType: "jsonp",
    success: function(results) {
      calcDeficit(pcpn, results.pet, results.dates_pet);
    },
    error: function(ierr) {
      $("#errmsg")
        .show()
        .html("Error retrieving PET data for requested location/date.");
      console.log("PET call error: " + ierr);
    }
  });
}

function getPcpn(latlng) {
  var ll = [latlng.lng, latlng.lat],
    today = new Date(),
    tymd =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate(),
    rdate = $("#rdate").val(),
    input_params = {
      loc: ll,
      sdate: rdate,
      edate: tymd,
      grid: "3",
      elems: "pcpn"
    },
    args = { params: JSON.stringify(input_params), output: "json" },
    url = "http://data.rcc-acis.org/GridData";
  $.ajax(url, {
    type: "POST",
    data: args,
    dataType: "json",
    crossDomain: true,
    success: function(results) {
      getPET(latlng, today.getFullYear(), results.data);
    },
    error: function(ierr) {
      $("#errmsg")
        .show()
        .html(
          "Error retrieving precipitation data for requested location/date."
        );
      console.log("GridData call error: " + ierr);
    }
  });
}

function getLocation(addr) {
  var url =
    "https://www.mapquestapi.com/geocoding/v1/address?location=" +
    addr +
    "&inFormat=kvp&outFormat=json&thumbMaps=false&key=VryyEpEEJ1NvAeg9EkBRBGMuADPKd4sj";
  $.ajax(url, {
    type: "POST",
    success: function(results) {
      var latlng = results.results[0].locations[0].latLng;
      if (
        latlng.lng < -82.7 ||
        latlng.lat < 37.2 ||
        latlng.lng > -66.9 ||
        latlng.lat > 47.6
      ) {
        $("#errmsg")
          .show()
          .html("Location must be in the northeastern United States.");
        $("input[name=zipcode]").val("");
      } else {
        $("#station_name").html(
          results.results[0].locations[0].adminArea5 +
            ", " +
            results.results[0].locations[0].adminArea3
        );
        getPcpn(latlng);
      }
    },
    error: function(ierr) {
      $("#errmsg")
        .show()
        .html("Error finding location for requested address or zip code.");
      console.log("Location call error: " + ierr);
    }
  });
}

function checkDate() {
  var today = new Date(),
    yy = parseInt($("input[name=year]").val() || today.getFullYear()),
    mm = parseInt($("input[name=month]").val() || "03"),
    dd = parseInt($("input[name=day]").val() || "01");
  if (isNaN(yy) || yy < 1950 || yy > today.getFullYear()) {
    $("#errmsg")
      .show()
      .html(
        "Illegal year - must be between 1950 and " + today.getFullYear() + "."
      );
    $("input[name=year]").val("");
    return false;
  } else if (isNaN(mm) || mm < 3 || mm > 12) {
    $("#errmsg")
      .show()
      .html("Illegal month - must be between 3 and 12.");
    $("input[name=month]").val("");
    return false;
  } else if (isNaN(dd) || dd < 1 || dd > new Date(yy, mm, 0).getDate()) {
    $("#errmsg")
      .show()
      .html("Illegal day for requested month.");
    $("input[name=day]").val("");
    return false;
  } else {
    rdate = [yy, mm, dd].join("-");
    $("#rdate").val(rdate);
    return true;
  }
}
$(document).ready(function() {
  $("#submit").click(function() {
    var addr = $("input[name=zipcode]").val() || "14850";
    $("#errmsg").hide();
    if (checkDate()) {
      getLocation(addr);
    }
  });
  $("#calcwatertime").click(function() {
    watertime();
  });
  $("#restart").click(function() {
    $("#inputSection").show();
    $("#station_name").html("");
    $("#lastday").html("");
    $("#deficit").html("");
    $("#recommend").html("");
    $("#sprinkler").attr("src", "");
    $("#dwatertime").html("");
    $(".wateringBox").css("display", "none");
    $("#resultsSection").hide();
  });
  $("input[name=zipcode]").change(function() {
    $("input[name=inputstring]").val($("input[name=zipcode]").val());
  });
  $("#clear").click(function() {
    $("input[name=zipcode]").val("");
    $("input[name=month]").val("");
    $("input[name=day]").val("");
    $("input[name=year]").val("");
  });
});
