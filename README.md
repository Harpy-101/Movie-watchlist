# Movie Watchlist App

A simple movie search application that lets users browse for movies and TV shows, view details, and save items to a watchlist. The app leverages the OMDb API to fetch data, stores watchlist data in the browser's local storage, and provides a smooth user experience with features like loading animations and error handling.

To try out the app [click here](https://timely-cheesecake-2fccb4.netlify.app)
## Features

- **Movie Search:** Enter movie or show titles in the search bar to view search results, including movie posters, runtime, genre, and IMDb ratings.
- **Watchlist:** Save movies or shows to your personal watchlist. The watchlist is stored in local storage, so it persists across sessions.
- **Error Handling:** Custom error messages handle common API errors, such as movie not found or missing data.
- **Loading Animation:** Displays a loading spinner while fetching movie data for a smooth user experience.

## Tech Stack

- **HTML/CSS:** For basic structure and styling.
- **JavaScript:** Handles API calls, event handling, and DOM manipulation.
- **Local Storage:** Persists the user's watchlist across sessions.
- **OMDb API:** Used to fetch movie data, including details such as ratings, plot, and genre.

## Future Enhancements

- **Filtering and Sorting:** Add options to filter watchlist items by genre or rating.
- **Responsive Design:** Improve mobile support for smaller screens.