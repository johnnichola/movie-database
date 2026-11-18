//#region API
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDhhY2JkNGEyMjM0YjAzMmZkMWNlZTgxMGY1MjIzNSIsIm5iZiI6MTc5NDg0MTcwNy43NTEwMDAyLCJzdWIiOiI2YWZiMWM2YmIyMDRlNmY3MjAyNzQwMTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.l-_kq3iSU4dVyZY6bVyfWbNlnhzTHIYv7EovoZlIs1k';
const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};
//#endregion

// get movie image url with image.tmdb.org/t/p/w500/<poster_path>

const featuredMovie = document.getElementById('featured-movie');
const movieInputField = document.getElementById('movieField');
const movieInputFieldNav = document.getElementById('movieFieldNav');
const resultGrid = document.querySelector(".grid-results");
const resultTitle = document.getElementById("result-title");

const SAVED_MOVIE = "savedMovie";
let currentState = "search"; // search, top_rated, tv_series

class MOVIE_DATA
{
    id = 0;
    original_title = '';
    backdrop_path = '';
    poster_path = '';
    overview = '';
    release_date = '';
}

document.addEventListener('DOMContentLoaded', () => 
{
    if(window.location.pathname.includes('pages/results.html'))
    {
        console.log("Current State: " + currentState);
        if(currentState == "search")
        {
            console.log("SEARCH");
            const _input = localStorage.getItem(SAVED_MOVIE);
            resultTitle.innerText = _input;
            getMovieByName(_input).then(data => renderMovieCards(data));
        }
        if(currentState == "top_rated")
        {
            console.log("TOP RATED");
            resultTitle.innerText = "Top Rated";
            getTopMovies().then(data => renderMovieCards(data));
        }
    }
});

function renderMovieCards(data)
{
    if(!data || !data.results) return;
    
    for(const movie of data.results)
    {
        const _movieCardHTML = getCardHTML(movie.title, movie.backdrop_path, movie.release_date);
        resultGrid.insertAdjacentHTML("beforeend", _movieCardHTML);
    }
}

function getMovieByID(id)
{
    return fetch(`https://api.themoviedb.org/3/movie/${id}`, OPTIONS)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

function getMovieByName(title)
{
    return fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, OPTIONS)
        .then(response => response.json())
        .then(data => 
            {
                console.log(data);
                return data;
            }
        )  
        .catch(err => console.error(err));
}

function getMoviePosterURLByID(id)
{
    return fetch(`https://api.themoviedb.org/3/movie/${id}`, OPTIONS)
        .then(res => res.json())
        .then(data => 
        {
            return `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
        });
}

function getMovieBannerURLByID(id)
{
    return fetch(`https://api.themoviedb.org/3/movie/${id}`, OPTIONS)
        .then(res => res.json())
        .then(data => 
        {
            console.log(`https://image.tmdb.org/t/p/w500/${data.backdrop_path}`);
            return `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`;
        })
        .catch(err => console.error(err));
}

function goToTopMovies()
{
    console.log("Go To Top Movies");
    currentState = "top_rated";
    if(window.location.pathname.includes('results.html'))
        window.location.reload();
    else
        window.location.href = 'pages/results.html';
}

function getTopMovies()
{
    return fetch(`https://api.themoviedb.org/3/movie/top_rated`, OPTIONS)
        .then(response => response.json())
        .then(data =>
        {
            console.log(data);
            return data;
        })
        .catch(err => console.error(err));
}

function searchMovie()
{
    if(window.location.pathname.includes('index.html'))
    {
        if(movieInputField.value == "" && movieInputFieldNav.value == "")
        {
            alert("Enter a Movie or TV Series");
            return;
        }
    }
    else
    {
        if(movieInputFieldNav.value == "")
        {
            alert("Enter a Movie or TV Series");
            return;
        }
    }

    if(window.location.pathname.includes('index.html'))
    {
        if(movieInputField.value != "")
            localStorage.setItem(SAVED_MOVIE, movieInputField.value);
        movieInputField.value = "";
    }
    if(movieInputFieldNav.value != "")
        localStorage.setItem(SAVED_MOVIE, movieInputFieldNav.value);

    movieInputFieldNav.value = "";

    currentState = "search";

    goToResults();
}

function goToResults()
{
    window.location.href = "pages/results.html";
    
    if(window.location.pathname.includes('pages/results.html'))
        window.location.reload();
}

function getCardHTML(title, imageSrc, year)
{
    return `<div class="result-container">
                <div class="result-top">
                    <img src="https://image.tmdb.org/t/p/w500/${imageSrc}">
                    <p>${title}</p>
                </div>
                <div class="result-bottom">${year}</div>
            </div>`;
}