<!-- 2238-CSE-5335-001-WEB DATA MANAGEMENT -->
<!-- ARVIND RAMAN -->
<!-- 1002050501 -->

<!DOCTYPE html>
<html>
<head>
    <title>Movie Search</title>
</head>
<body>

<?php

// Main function to control the flow
if (isset($_GET['inputMovieName'])) {
    showSearchPage($_GET['inputMovieName']);
    getMovieList($_GET['inputMovieName']);
} elseif (isset($_GET['id'])) {
    $movieId = $_GET['id'];
    showSearchPage();
    getMovieInfo($movieId);
} else {
    showSearchPage();
}

// Function to display the initial search page with search field and 'Display Info' button
function showSearchPage($inputText = "") {
    echo '<form method="GET" action="movies.php">';
    echo '<label><strong>Movie title: </strong><input type="text" name="inputMovieName" value="' . htmlspecialchars($inputText) . '"/></label>';
    echo '<input type="submit" value="Display Info">';
    echo '</form>';
}

// Function to fetch the list of movies with the user input
function getMovieList($movieName) {
    $apiKey = '81989b841423bd68fbf4cc1733575c70';
    
    $movieName = urlencode($movieName);
    $movieSearchUrl = "https://api.themoviedb.org/3/search/movie?api_key={$apiKey}&query={$movieName}";
    
    $tmdbResponse = file_get_contents($movieSearchUrl);
    $movieList = json_decode($tmdbResponse, true);

    showMovieListPage($movieList);
}

// Function to display the fetched movie list from above
function showMovieListPage($movieList) { 
    echo '<h2>Search Results</h2>';
    if (isset($movieList['results']) && count($movieList['results']) > 0) {
        echo '<table>';
        echo '<tr><th>Title</th><th>Year</th></tr>';
        $movie = $movieList['results'];
        for ($i = 0; $i < count($movie); $i++) {
            echo '<tr><td><a href="movies.php?id=' . $movie[$i]['id'] . '">'.($i+1).") " . $movie[$i]['title'] . '</a></td>';
            echo '<td>' . substr($movie[$i]['release_date'], 0, 4) . '</td></tr>';
        }
        echo '</table>';
    } else {
        echo 'No movies found!<br> Please try again!';
    }
}

// Function to fetch the information about the movie clicked by the user
function getMovieInfo($movieId) {
    $apiKey = '81989b841423bd68fbf4cc1733575c70';
    
    $movieIdUrl = "https://api.themoviedb.org/3/movie/{$movieId}?api_key={$apiKey}";
    $movieCastUrl = "https://api.themoviedb.org/3/movie/{$movieId}/credits?api_key={$apiKey}";

    $tmdbMovieInfoResponse = file_get_contents($movieIdUrl);
    $tmdbMovieCastResponse = file_get_contents($movieCastUrl);

    $movieInfo = json_decode($tmdbMovieInfoResponse, true);
    $movieCast = json_decode($tmdbMovieCastResponse, true);

    showMovieInfoPage($movieInfo, $movieCast);
}

// Function to display the information about the movie fetched above
function showMovieInfoPage($movieInfo, $movieCast) {
    echo '<h2>Movie Details</h2>';
    echo '<div style="display: flex; align-items: top;">';

    echo '<div style="margin-right: 20px;">';
    echo '<img src="http://image.tmdb.org/t/p/w185/' . $movieInfo['poster_path'] . '" alt="' . $movieInfo['title'] . '">';
    echo '</div>';
    
    echo '<div>';
    echo '<h3>' . $movieInfo['title'] . '</h3>';
    echo '<p><strong>Genres: </strong>' . implode(', ', array_column($movieInfo['genres'], 'name')) . '</p>';
    
    echo '<div style="max-width: 900px; text-align: left;">';
    echo '<p><strong>Overview: </strong>' . $movieInfo['overview'] . '</p>';
    echo '</div>';
    
    echo '<h3>Cast Members</h3>';
    echo '<ol>';
    $cast = $movieCast['cast'];
    for ($i = 0; $i < min(5, count($cast)); $i++) {
        echo '<li>' . $cast[$i]['name'] . '</li>';
    }
    echo '</ol>';
    echo '</div>';
    echo '</div>'; 
}

?>

</body>
</html>