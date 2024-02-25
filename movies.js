// 2238-CSE-5335-001-WEB DATA MANAGEMENT
// ARVIND RAMAN
// 1002050501

function initialize() {
}

function sendRequest() {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         var json = JSON.parse(this.responseText);
         var searchResult = json["results"]
         var moviesTable = ""
         // validation to check there are no results found
         if (searchResult.length == 0) {
            moviesTable = "</br>NO MOVIE FOUND!</br>Please try again."
         } else {
            moviesTable = createSearchTable(moviesTable)
            moviesTable = getMoviesList(moviesTable, searchResult)
            moviesTable = createMovieInfoTable(moviesTable)
         }
         document.getElementById("output").innerHTML = moviesTable
      }
   };
   xhr.send(null);
}

function createSearchTable(moviesTable) {
   // creating the searched movie list table
   moviesTable += "<table style=\"width:100%\" id=\"info\"><tr><td style=\"width:30%\" rowspan=\"2\">"
   moviesTable += "<table id=\"list\" style=\"width:100%\"><tr><th style=\"width:75%\">Title</th><th style=\"width:25%\">Year of release</th></tr>"
   return moviesTable;
}

function getMoviesList(moviesTable, searchResult) {
   // iterating through the search results to tabulate the movie list
   for (i = 0; i < searchResult.length; i++) {
      moviesTable += "<tr><td>"
      moviesTable += "<span id=\"" + searchResult[i]["id"] + "\" onclick=\"getBasicMovieInfo(this.id)\" style=\"cursor: pointer\">"
      moviesTable += (i+1) + ") " + searchResult[i]["title"]
      moviesTable += "</span>"
      moviesTable += "</td><td style=\"text-align: center;\">"
      moviesTable += searchResult[i]["release_date"].split("-")[0]
      moviesTable += "</td></tr>"
   }
   return moviesTable;
}

function createMovieInfoTable(moviesTable) {
   // creating the table for the specific movie information
   moviesTable += "</table></td>";
   moviesTable += "<td style=\"width:20%\" rowspan=\"2\"><div id=\"imageHolder\" style=\"text-align:center\"></div></td>"
   moviesTable += "<td id=\"basicMovieInfo\" style=\"vertical-align: bottom;height: 50%\"></td></tr><tr><td id=\"movieCastInfo\" style=\"vertical-align: top;\"></td></tr></table>"
   return moviesTable;
}

function getBasicMovieInfo(movieID) {
   // To highlight the selected row for better visibility
   var rows = document.querySelectorAll("span");
   for (var i = 0; i < rows.length; i++) {
     rows[i].removeAttribute("style");
   }
   var selectedRow = document.getElementById(movieID);
   selectedRow.style.backgroundColor = "cyan";

   // sending request to get movie information
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?method=/3/movie/" + movieID);
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         var json = JSON.parse(this.responseText)
         // adding html text to insert the json data into a tabular form
         movieImage = "<img src=\"http://image.tmdb.org/t/p/w185/" + json["poster_path"] + "\">"
         movieInfoText = "<table style=\"text-align: bottom;\">"
         movieInfoText += "<tr><td><strong>Title: </strong></td><td>" + json["title"] + "</td></tr>"
         movieInfoText += "<tr><td><strong>Genre: </strong></td><td>"
         genreList = json["genres"]
         genreInfoText = ""
         for (var i = 0; i < genreList.length; i++) {
            genreInfoText += genreList[i]["name"]
            if (i != genreList.length - 1) {
               genreInfoText += ", "
            }
         }
         movieInfoText += genreInfoText + "</td></tr>"
         movieInfoText += "<tr><td><strong>Summary: </strong></td><td>" + json["overview"] + "</td></tr></table>"
         
         document.getElementById("basicMovieInfo").innerHTML = movieInfoText;
         document.getElementById("imageHolder").innerHTML = movieImage;
      }
   };
   getCastInformation(movieID)
   xhr.send(null);
}

function getCastInformation(movieID) {
   // sending request to get cast information of the selected movie
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?method=/3/movie/" + movieID + "/credits");
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         var json = JSON.parse(this.responseText)
         castList = json["cast"]
         movieCastText = "<strong>Cast members:</strong></br></br>"
         for (var i = 0; i < castList.length && i < 5; i++) {
            movieCastText += (i+1) + ") " + castList[i]["name"] + "</br>"
         }
         document.getElementById("movieCastInfo").innerHTML = movieCastText;
      }
   };
   xhr.send(null);
}