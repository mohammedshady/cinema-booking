export const sortAlphabetically = (movies, option) => {
    if (option === "Asc") {
        movies.sort(function (a, b) {
            let titleA = a.title.toUpperCase();
            let titleB = b.title.toUpperCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
    } else if (option === "Des") {
        movies.sort(function (a, b) {
            let titleA = a.title.toUpperCase();
            let titleB = b.title.toUpperCase();
            if (titleA > titleB) {
                return -1;
            }
            if (titleA < titleB) {
                return 1;
            }
            return 0;
        });
    }
    return movies;
}
export const searchInMovies = (movies, searchKey) => {
    let filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    return filteredMovies;

}

export const sortByRating = (movies, option) => {
    if (option === "High")
        movies.sort(function (a, b) {
            return b.rating - a.rating;
        });
    else {
        movies.sort(function (a, b) {
            return a.rating - b.rating;
        });
    }
    return movies;
}