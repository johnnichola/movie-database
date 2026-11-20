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
const popout = document.getElementById('popout');
const resultGrid = document.querySelector(".grid-results");
const resultTitle = document.getElementById("result-title");

const SAVED_MOVIE = "savedMovie";
const SAVED_STATE = "savedState";
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

console.log(getMovieByID(550));
if(getState() == null || getState() == "")
{
    console.log("No State Saved, changing state to search...");
    changeState("search");
}

console.log(`Current Saved State: ${getState()}`);

document.addEventListener('DOMContentLoaded', () => 
{
    if(window.location.pathname.includes('pages/results.html'))
    {
        const _currentState = getState();
        console.log("Current State: " + _currentState);
        if(_currentState == "search")
        {
            console.log("SEARCH");
            const _input = localStorage.getItem(SAVED_MOVIE);
            resultTitle.innerText = _input;
            getMovieByName(_input).then(data => renderMovieCards(data));
        }
        if(_currentState == "top_rated")
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
        const _movieCardHTML = getCardHTML(movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.overview);
        resultGrid.insertAdjacentHTML("beforeend", _movieCardHTML);
        
        resultGrid.addEventListener("click", (event) =>
        {
            const _card = event.target.closest(".result-container");
            if(!_card) return;

            const {title, img, year, score, desc} = _card.dataset;
            showPopout(title, img, year, score, desc);
        });
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
    changeState("top_rated");
    goToResults();
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
    //#region input field checker
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
    //#endregion

    changeState("search");
    if(window.location.pathname.includes('index.html'))
    {
        if(movieInputField.value != "")
            changeSavedMovie(movieInputField.value);
        movieInputField.value = "";
    }
    if(movieInputFieldNav.value != "")
        changeSavedMovie(movieInputFieldNav.value);

    movieInputFieldNav.value = "";

    goToResults();
}

function goToResults()
{
    if(window.location.pathname.includes('pages/results.html'))
    {
        window.location.reload();
        return;
    }
    window.location.href = "pages/results.html";
}

function getCardHTML(title, imageSrc, year, score, desc)
{
    const _safeTitle = title.replace(/"/g, "&quot;");
    const _safeDesc = desc.replace(/"/g, "&quot;");

    return `<a href="#" class="result-container"
                data-title="${_safeTitle}"
                data-img=${imageSrc}"
                data-year=${year}"
                data-score="${score.toFixed(1)}"
                data-desc="${_safeDesc}">
                <div class="result-top">
                    <img src="https://image.tmdb.org/t/p/w500/${imageSrc}">
                    <p>${title}</p>
                </div>
                <div class="result-bottom">
                    <p>⭐${score.toFixed(1)}</p>
                    <p>|</p>
                    <p>${year.split("-")[0]}</p>
                </div>
            </a>`;    
}

function showPopout(title, imageSrc, date, score, desc)
{
    const _popoutHTML =  `<div class="popout-block">
                            <div id="center-body">
                                <div class="popout-exit">
                                    <button onclick="closePopout()">X</button>
                                </div>
                                <div id="inner-body" style="height: 80%; width: 80%;">
                                    <div class="popout-innerblock">
                    
                                        <div class="popout-inner-left">
                                            <img src="https://image.tmdb.org/t/p/w500/${imageSrc}" alt="${title}">
                                        </div>
                    
                                        <div class="popout-inner-right">
                                            <h1>${title}</h1>
                                            <p>${date} | ⭐${score}</p>
                                            <p>${desc}</p>
                                        </div>
                    
                                    </div>
                                </div>
                            </div>
                        </div>`;
    popout.innerHTML = "";
    popout.insertAdjacentHTML("beforeend", _popoutHTML);
}
function closePopout()
{
    popout.innerHTML = "";
}

function changeState(state)
{
    localStorage.setItem(SAVED_STATE, state);
    console.log(`Change State to ${state} || Saved State: ${getState()}`);
}
function getState()
{
    return localStorage.getItem(SAVED_STATE);
}

function changeSavedMovie(title)
{
    localStorage.setItem(SAVED_MOVIE, title);
}
function getSavedMovie()
{
    return localStorage.getItem(SAVED_MOVIE);
}