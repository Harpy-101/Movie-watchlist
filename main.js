const searchBtn = document.getElementById(`search-btn`)
const userInput = document.getElementById(`user-input`)
const mainEl = document.querySelector(`main`)
const myWatchlist = document.getElementById(`my-watchlist`)
const headerEl = document.getElementById(`header`)
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY

let searchResults = [];
 //localStorage.clear(); 
 //console.log(JSON.parse(localStorage.getItem(`watchlist`))) 

searchBtn.addEventListener(`click`, async () => {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${userInput.value}&plot`)
    const data = await response.json()

    let movieArr =``
            
    for (let movie of data.Search) {
        const movieInfo = await getPlot(movie.imdbID)
        const watchlist = JSON.parse(localStorage.getItem(`watchlist`)) || []
        
        const isInWatclist = isInLocalStorage(watchlist, movie.imdbID)
        console.log(`The title: "${movie.Title}" is is local Storage: "${isInWatclist}"`)

        searchResults.push(movieInfo)
        const iconContainerHTML = isInWatclist
            ? `<i class="fa-solid fa-check-circle" data-watchlist="${movie.imdbID}"></i><p>In Watchlist</p>`
            : `<i class="fa-solid fa-circle-plus" data-watchlist="${movie.imdbID}"></i><p>Watchlist</p>`;

        movieArr += `
            <div class="movie">
                <img src="${movie.Poster}">
                <div class="movie-text">
                    <h2>${movie.Title}</h2>
                    <div class="text-flex-container">
                        <p>${movieInfo.Runtime}</p>
                        <p>${movieInfo.Genre}</p>
                        <div class="icon-container">
                           ${iconContainerHTML}
                        </div>
                    </div>
                    <span class="plot-text">${movieInfo.Plot}</span>
                </div>
            </div>
            <hr>
        `
                
    }
    mainEl.innerHTML = movieArr
})

async function getPlot(id) {
    const call = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${id}`)
    const response = call.json()
    return response   
}

myWatchlist.addEventListener(`click`, renderWatchlist)

document.addEventListener(`click`, e => {
   let target = e.target.closest(`[data-inwatchlist]`)
    if (target) {
        mainEl.innerHTML = `
            <div class="empty-state-text">
                <i class="fa-solid fa-film fa-2xl"></i>
                <h3>Strat exploring</h3>
            </div>
        `
        //console.log(`inside target`)
        myWatchlist.setAttribute(`hi`, `uo`)
        myWatchlist.removeAttribute(`data-inwatchlist`)
        //data-inwatclist
        myWatchlist.textContent = `My Watchlist`
        //myWatchlist.innerHTML = `<h1 class="my-watchlist" id="my-watchlist">My Watchlist</h1>`
        userInput.value = ``;
    }

    if (e.target.dataset.watchlist) {
        const movieId = e.target.dataset.watchlist
        const movie = searchResults.find(m => m.imdbID === movieId)
        if (movie) {
            handleWatchlistClick(movie)
            updateIcon(e.target)
        }
    }

    target = e.target.closest((`[data-remove]`))
    if (target) {
        console.log(e.target.dataset.remove)
        let watchlist = JSON.parse(localStorage.getItem(`watchlist`)) || []
        watchlist = watchlist.filter(movie => movie.imdbID !== e.target.dataset.remove)
        localStorage.setItem(`watchlist`, JSON.stringify(watchlist))
        renderWatchlist()
    }
})

function handleWatchlistClick(movie) {
   let watchlist = JSON.parse(localStorage.getItem(`watchlist`)) || []
   
   if (!watchlist.some(item => item.imdbID === movie.imdbID)) {
        watchlist.unshift(movie)
        localStorage.setItem(`watchlist`, JSON.stringify(watchlist))
        console.log(`Movie with ID ${movie.imdbID} added to the watchlist.`);
   }
}

function updateIcon(iconElement) {
    iconElement.classList.replace('fa-circle-plus', 'fa-check-circle')
    iconElement.nextElementSibling.textContent = 'In Watchlist'
}

    
function renderWatchlist() {
    console.log(`here`)
    let watchlist = JSON.parse(localStorage.getItem(`watchlist`)) || []
    
    let movieArr = ``;
    watchlist.forEach(movie => {
        movieArr += `
            <div class="movie">
                <img src="${movie.Poster}">
                <div class="movie-text">
                    <h3>${movie.Title}</h2>
                    <div class="text-flex-container">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <div class="icon-container">
                            <i class="fa-regular fa-circle-xmark" data-remove="${movie.imdbID}"></i>
                            <p>Remove</p>
                        </div>
                    </div>
                    <span class="plot-text">${movie.Plot}</span>
                </div>
            </div>
            <hr>
        `
    })
    //console.log(`why is this shit so bad!!!`)

    myWatchlist.textContent = `hi`
    //myWatchlist.setAttribute(`data-inwatchlist`, `some`)
    //myWatchlist.dataset.inwatchlist = `inwatchlist`
    mainEl.innerHTML = movieArr
    // myWatchlist.textContent = ``
    //yWatchlist.setAttribute(`hi`, `uo`)
    // myWatchlist.innerHTML = `` 
    myWatchlist.innerHTML = `
        <h1 class="my-watchlist" id="my-watchlist" data-inwatchlist="inwatchlist">Search for movies</h1>
      `
}

function isInLocalStorage(watchlist, id) {
    for (let movie of watchlist) {
        if (movie.imdbID === id) {
            return true
        }
    }
    return false
}


