function parseColor(jenkinsColorCode) {

    switch (jenkinsColorCode) {
      case "blue":
          return "rgb(15, 99, 30)"; 
      case "red":
          return "#FF0000"; 
      case "blue_anim":
      case "red_anim":
      case "grey_anim":
          return"yellow";
      default:
          return "grey";
    }; 
}

function retrieveJsonForJenkinsJobURL(jenkinsJobUrl, callback) {
    var jobId = jenkinsJobUrl.split('/').last();
    var jsonUrl = jenkinsJobUrl + '/api/json?jsonp=?'
    
    $(this).attr('title2', 'jenkins job ' + jobId + ", url: " + jsonUrl);             

    $("#statusbar").append("retrieving(" + jsonUrl + ")");
    $("#statusbar").append("starting request");

    $.getJSON(jsonUrl, function(json) {
        callback(jobId, jenkinsJobUrl, json);
    });
}

Array.prototype.last = function() {return this[this.length-1];}

function updateAllJenkinsLinks() {
    $(".jenkinsJobLink").each(function(index) {
      var jobUrl = $(this).attr('href')
      var thisLink = $(this)
  
      retrieveJsonForJenkinsJobURL(jobUrl, function(jobId,jenkinsJobUrl,json) {
        var jsonStatusColorCode = json.color
        var color = parseColor(jsonStatusColorCode)
        //$("#statusbar").append(" ## jenkins status: jobId='" + jobId + "', color='" + jsonStatusColorCode + "'"); 
        thisLink.attr('title', 'jenkins job ' + jobId + "color: " + json.color);
        thisLink.css('color', color);
      });
   });
}

var secondsToReload = 2;

var auto_refresh = setInterval(function () {
    $("#statusbar").append(".");
    updateAllJenkinsLinks();
}, 2*1000); // refresh every x*1000 milliseconds


$(document).ready(updateAllJenkinsLinks);
