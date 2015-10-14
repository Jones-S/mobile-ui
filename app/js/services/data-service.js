app.factory('dataService', function() {
    var exercises = [
        {
            id: 1,
            title: "Push Ups",
            type: "repetition",
            predefined: { rep: '10' },
            imgSrc: "pushups.svg"
        },
        {
            id: 2,
            title: "Pull Ups",
            type: "repetition",
            predefined: { rep: '22' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 3,
            title: "Shoulder Frontlift",
            type: "weight",
            predefined: { rep: '3' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 4,
            title: "Plank",
            type: "time",
            predefined: { min: '0', sec: '2' },
            imgSrc: "plank.svg"

        },
        {
            id: 5,
            title: "Side Hip Raises",
            type: "repetition",
            predefined: { rep: '4' },
            imgSrc: "sidehipraises.svg"
        }
    ];

    var service = {
        getExercises: function() {
            return exercises;
        }
    };
    return service;
});
