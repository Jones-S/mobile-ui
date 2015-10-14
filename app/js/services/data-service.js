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
            predefined: { rep: '11' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 3,
            title: "Shoulder Frontlift",
            type: "weight",
            predefined: { rep: '12' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 4,
            title: "Side Hip Raises",
            type: "repetition",
            predefined: { rep: '13' },
            imgSrc: "sidehipraises.svg"
        },
        {
            id: 5,
            title: "Plank",
            type: "time",
            predefined: { rep: '14' },
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
