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

class MOVIE_DATA
{
    id = 0;
    original_title = '';
    backdrop_path = '';
    poster_path = '';
    overview = '';
    release_date = '';
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
        .then(data => console.log(data))
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

getMovieBannerURLByID(1003596).then(url => {featuredMovie.src = url;});