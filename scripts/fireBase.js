var config = {
    // don't you even try! (please...)
    apiKey: "AIzaSyD-M-TKd_dAhW2czpoOhjyDQvrJAwGhnJo",
    authDomain: "snakegame-8d6e1.firebaseapp.com",
    databaseURL: "https://snakegame-8d6e1.firebaseio.com",
    storageBucket: "snakegame-8d6e1.appspot.com",
    messagingSenderId: "269985805123"
};
firebase.initializeApp(config);

var database = firebase.database();
var highScoreRef = database.ref('highscores');
var scores;

function getHighScores() {
    scores = highScoreRef.once('value', function(data){
        scores = [];
        var scoreList = data.val();
        var keys = Object.keys(scoreList);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var hs = {
                name: scoreList[key].name,
                score: scoreList[key].score
            };
            scores.push(hs);
        }
        scores.sort( function(a,b){
            return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
        });

    }, function(err){ console.log(err) } );
}

function submitHighScore() {
    var name = window.prompt("Enter your name to submit highscore");
    if (name) {
        hasSubmitted = true;
        var score = {
            name: name,
            score: snake.size - 1
        };
        highScoreRef.push(score);
    }
}
