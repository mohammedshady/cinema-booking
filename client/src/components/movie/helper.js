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
}
export const searchInMovies = (movies, searchKey) => {
    let filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    console.log(filteredMovies)
    return filteredMovies;
}