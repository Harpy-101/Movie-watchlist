const searchBtn = document.getElementById(`search-btn`)
const userInput = document.getElementById(`user-input`)
// const mainEl = document.querySelector(`main`)
 //const myWatchlist = document.getElementById(`my-watchlist`)
const headerEl = document.getElementById(`header`)
const omdbApiKey = import.meta.env.VITE_OMDB_API_KEY
//const mainEl = document.querySelector("main");  // Replace #main with your actual ID or class
//const myWatchlist = document.querySelector("#my-watchlist");  // Ensure this targets the watchlist header
const myWatchlist = document.getElementById("my-watchlist"); // Update if using another selector
const mainEl = document.getElementById("main"); 
const currPage = document.getElementById(`curr-page`)

let searchResults = [];
 //localStorage.clear(); 
 //console.log(JSON.parse(localStorage.getItem(`watchlist`))) 
mainEl.innerHTML = "<div>Test Content</div>";

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

myWatchlist.addEventListener(`click`, (e) => {
    
    let target = e.target.classList.contains(`in-watchlist`)
    if (target) {
        mainEl.innerHTML = `
            <div class="empty-state-text">
                <i class="fa-solid fa-film fa-2xl"></i>
                <h3>Strat exploring</h3>
            </div>
        `

        myWatchlist.classList.remove(`in-watchlist`)
        myWatchlist.textContent = `My Watchlist`
    }
    else {renderWatchlist()}
})

document.addEventListener(`click`, e => {
    let target = e.target.closest(`[data-inwatchlist]`)
    // if (target) {
    //     mainEl.innerHTML = `
    //         <div class="empty-state-text">
    //             <i class="fa-solid fa-film fa-2xl"></i>
    //             <h3>Strat exploring</h3>
    //         </div>
    //     `
    //     myWatchlist.removeAttribute(`data-inwatchlist`)
    //     myWatchlist.textContent = `My Watchlist`
    //     //myWatchlist.innerHTML = `<h1 class="my-watchlist" id="my-watchlist">My Watchlist</h1>`
    //     userInput.value = ``;
    // }

    // let target = e.target.closest(`[data-inwatchlist]`);
    // if (target) {
    //     mainEl.innerHTML = `
    //         <div class="empty-state-text">
    //             <i class="fa-solid fa-film fa-2xl"></i>
    //             <h3>Start exploring</h3>
    //         </div>
    //     `;
        
    //     // Remove "watchlist-active" class from myWatchlist to toggle the view
    //     myWatchlist.classList.remove("watchlist-active");
    //     myWatchlist.textContent = "My Watchlist";
    //     userInput.value = ""; // Clear search input
    // }

    // target = e.target.classList.contains(`in-watchlist`)
    // if (target) {
    //     mainEl.innerHTML = `
    //         <div class="empty-state-text">
    //             <i class="fa-solid fa-film fa-2xl"></i>
    //             <h3>Strat exploring</h3>
    //         </div>
    //     `

    //     myWatchlist.classList.remove(`in-watchlist`)
    // }

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

    myWatchlist.textContent = `Search for movies`
    //myWatchlist.setAttribute(`data-inwatchlist`, `some`)
    //myWatchlist.removeAttribute(`data-inwatchlist`)
    //myWatchlist.dataset.inwatchlist = `inwatchlist`
    mainEl.innerHTML = movieArr
    myWatchlist.classList.add(`in-watchlist`)
    // myWatchlist.textContent = ``
    //yWatchlist.setAttribute(`hi`, `uo`)
    // myWatchlist.innerHTML = `` 
    // myWatchlist.innerHTML = `
    //     <h1 class="my-watchlist" id="my-watchlist" data-inwatchlist="inwatchlist">Search for movies</h1>
    //   `
}

function isInLocalStorage(watchlist, id) {
    for (let movie of watchlist) {
        if (movie.imdbID === id) {
            return true
        }
    }
    return false
}

// function renderWatchlist() {
//     //console.log("renderWatchlist called");

//     // Retrieve watchlist from localStorage
//     const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

//     // Check if there are items in the watchlist
//     if (watchlist.length === 0) {
//         mainEl.innerHTML = `<div class="empty-state-text">
//                                 <i class="fa-solid fa-film fa-2xl"></i>
//                                 <h3>Start exploring</h3>
//                             </div>`;
//         console.log("No items in watchlist.");
//         return;
//     }

//     // Clear any existing content in mainEl
//     mainEl.innerHTML = ""; // Ensure it's cleared before updating

//     // Build the HTML for watchlist items
//     const movieArr = watchlist.map(movie => `
//         <div class="movie">
//             <img src="${movie.Poster}" alt="${movie.Title} Poster">
//             <div class="movie-text">
//                 <h3>${movie.Title}</h3>
//                 <div class="text-flex-container">
//                     <p>${movie.Runtime}</p>
//                     <p>${movie.Genre}</p>
//                     <div class="icon-container">
//                         <i class="fa-regular fa-circle-xmark" data-remove="${movie.imdbID}"></i>
//                         <p>Remove</p>
//                     </div>
//                 </div>
//                 <span class="plot-text">${movie.Plot}</span>
//             </div>
//         </div>
//         <hr>
//     `).join(""); // Join array items into a single string of HTML

//     // Update mainEl's innerHTML with movieArr
//     mainEl.innerHTML = movieArr;
//     currPage.textContent = `Inside Watchlist`
//     myWatchlist.textContent = `Search movies`
//     myWatchlist.addEventListener(`click`, loadSearchPage)
//     //myWatchlist.setAttribute(`data-inwatchlist`, `inwatchlist`)
//     //console.log("Watchlist rendered:", mainEl.innerHTML);
// }




// // Toggle watchlist view on click
// document.addEventListener('click', e => {
//     // Detect click on elements with watchlist-active class
//     if (myWatchlist.classList.contains("watchlist-active")) {
//         console.log("Removing watchlist view");
//         mainEl.innerHTML = `
//             <div class="empty-state-text">
//                 <i class="fa-solid fa-film fa-2xl"></i>
//                 <h3>Start exploring</h3>
//             </div>
//         `;
        
//         // Remove "watchlist-active" class and reset text
//         myWatchlist.classList.remove("watchlist-active");
//         myWatchlist.textContent = "My Watchlist";
//         userInput.value = ""; // Clear search input
//     }
// });

// // Render Watchlist and Set Class
// function renderWatchlist() {
//     console.log("Rendering watchlist");

//     // Retrieve watchlist from localStorage
//     const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
//     // Check if there are items in the watchlist
//     if (watchlist.length === 0) {
//         mainEl.innerHTML = `<div class="empty-state-text">
//                                 <i class="fa-solid fa-film fa-2xl"></i>
//                                 <h3>Start exploring</h3>
//                             </div>`;
//         console.log("No items in watchlist.");
//         return;
//     }

//     // Add "watchlist-active" class to myWatchlist and set toggle text
//     myWatchlist.classList.add("watchlist-active");
//     myWatchlist.textContent = "Return to Main Page";
//     console.log("Class 'watchlist-active' added to myWatchlist");

//     // Build the HTML for watchlist items
//     const movieArr = watchlist.map(movie => `
//         <div class="movie">
//             <img src="${movie.Poster}" alt="${movie.Title} Poster">
//             <div class="movie-text">
//                 <h3>${movie.Title}</h3>
//                 <div class="text-flex-container">
//                     <p>${movie.Runtime}</p>
//                     <p>${movie.Genre}</p>
//                     <div class="icon-container">
//                         <i class="fa-regular fa-circle-xmark" data-remove="${movie.imdbID}"></i>
//                         <p>Remove</p>
//                     </div>
//                 </div>
//                 <span class="plot-text">${movie.Plot}</span>
//             </div>
//         </div>
//         <hr>
//     `).join("");

//     // Update mainEl's innerHTML with movieArr
//     mainEl.innerHTML = movieArr;
//     console.log("Watchlist content loaded into mainEl");
// }


function loadSearchPage() {
    mainEl.innerHTML = `
        <div class="empty-state-text">
            <i class="fa-solid fa-film fa-2xl"></i>
            <h3>Start exploring</h3>
        </div>
    `
}