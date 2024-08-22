export const sortAlphabetically = (movies, option) => {
    if (!option)
        return movies
    if (option) {
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
    }
    return movies

}
export const searchInMovies = (movies, searchKey) => {
    let filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchKey.toLowerCase())
    );
    return filteredMovies;

}

export const sortByRating = (movies, option) => {
    if (!option) {
        return movies;
    }
    if (option)
        movies.sort(function (a, b) {
            return b.rating - a.rating;
        });
    return movies;
}

export const filterByGenre = (movies, genre) => {
    if (genre == "All") {
        return movies;
    }
    return movies.filter((movie) => {
        return movie.genre.includes(genre);
    });
};

export const filterByLanguage = (movies, language) => {
    if (language == "All") {
        return movies;
    }
    return movies.filter((movie) => {
        return movie.language.includes(language);
    });
};

export const sortByStatus = (movies, option) => {
    if (option == "") {
        return movies;
    }
    return movies.filter((movie) => movie.status === option)
};