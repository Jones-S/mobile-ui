app.factory('dataService', function() {
    var exercises = [
        {
            id: 1,
            title: "Push Ups",
            type: "repetition",
            imgSrc: "pushups.svg"
        },
        {
            id: 2,
            title: "Pull Ups",
            type: "repetition",
            imgSrc: "frontlift.svg"
        },
        {
            id: 3,
            title: "Shoulder Frontlift",
            type: "weight",
            imgSrc: "frontlift.svg"
        },
        {
            id: 4,
            title: "Side Hip Raises",
            type: "repetition",
            imgSrc: "sidehipraises.svg"
        },
        {
            id: 5,
            title: "Plank",
            type: "time",
            imgSrc: "plank.svg"
        }
    ];

    var service = {
        getExercises: function() {
            return exercises;
        }
    };
    return service;
});
