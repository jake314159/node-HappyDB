const Csv = require('csvtojson');
const cite = "Akari Asai, Sara Evensen, Behzad Golshan, Alon Halevy, Vivian Li, Andrei Lopatenko, Daniela Stepanov, Yoshihiko Suhara, Wang-Chiew Tan, Yinzhan Xu, ``HappyDB: A Corpus of 100,000 Crowdsourced Happy Moments'', LREC '18, May 2018. (to appear)"

var data = []; // Array of the "happy moments"

// Filepath to the csv to load
var csvFile = "./happydb/data/cleaned_hm.csv"
if(false) {
    // Test file
    csvFile = "./happydb/data/short_cleaned_hd.csv";
}

// Load all the data into the data array
// Don't wait for it to finish before setting up the endpoint, even if we haven't loaded all of
//     them we can still serve the ones we do have
Csv().fromFile(csvFile)
.on('json',(jsonObj)=>{
    data.push({
        id: jsonObj.hmid,
        text: jsonObj.cleaned_hm,
        period: jsonObj.reflection_period,
        cat: jsonObj.predicted_category,
        num_sentence: jsonObj.num_sentence * 1,
        num_words: jsonObj.cleaned_hm.split(/[ ,.!?]+/).length
    });
}).on('done',(error)=>{
    console.log('JSON loaded');
});


// Need to add the header Access-Control-Allow-Origin: *
// Note: I hacked the node_modules for now -,-

var api = require('api-quick').init(8080, {
    compress: true,
    maxDepth: 0,
    consoleLog: 'info',
    prettyJson: true
});

// Endpoint: http://localhost:8080/happy
var endpoints = {};
endpoints.happy = function() {
    if(data.length === 0) {
        // We were probably hit before we loaded the data
        return {"error": "No Happy Moments found, please try again."};
    }
    var randomMoment = data[Math.floor(Math.random() * data.length)];
    return {
        data: randomMoment,
        cite: cite
    };
};
api.addEndpoints(endpoints);

