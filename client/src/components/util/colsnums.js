export const colsnums = (total_rocks) => {
    // round down if total_rocks is a decimal number
    total_rocks = Math.floor(total_rocks);

    // calculate average value
    let average = Math.floor(total_rocks / 2);

    // check if average is an integer
    if (total_rocks % 2 === 0) {
        // divide total_rocks into 2 groups with same number of rocks
        let group1 = average;
        let group2 = average;
        // put remaining rocks in third group
        let group3 = 0;
    } else {
        // subtract rounded down average from total_rocks
        let group3 = total_rocks - average * 2;
        // divide remaining rocks into 2 groups with same number of rocks
        let group1 = Math.floor((total_rocks - group3) / 2);
        let group2 = Math.ceil((total_rocks - group3) / 2);
    }
}

