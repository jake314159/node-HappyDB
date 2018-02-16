const api = require('api-quick').init(8080, {
    compress: true,
    maxDepth: 0,
    consoleLog: 'info',
});
const csv = require('csvtojson');
const cite = "Akari Asai, Sara Evensen, Behzad Golshan, Alon Halevy, Vivian Li, Andrei Lopatenko, Daniela Stepanov, Yoshihiko Suhara, Wang-Chiew Tan, Yinzhan Xu, ``HappyDB: A Corpus of 100,000 Crowdsourced Happy Moments'', LREC '18, May 2018. (to appear)"

// Array of the "happy moments"
var data = [];

// Filepath to the csv to load
var csvFile = "./happydb/data/cleaned_hm.csv"
if(false) {
    // Test file
    csvFile = "./happydb/data/short_cleaned_hd.csv";
}

// Load all the data into the data array
// Don't wait for it to finish before setting up the endpoint, even if we haven't loaded all of
//     them we can still serve the ones we do have
csv().fromFile(csvFile)
.on('json',(jsonObj)=>{
    /* Example jsonObj
    { hmid: '27679',
      wid: '195',
      reflection_period: '24h',
      original_hm: 'I made a new recipe for peasant bread, and it came out spectacular!',
      cleaned_hm: 'I made a new recipe for peasant bread, and it came out spectacular!',
      modified: 'True',
      num_sentence: '1',
      ground_truth_category: '',
      predicted_category: 'achievement' }
    */
    data.push({
        id: jsonObj.hmid,
        text: jsonObj.cleaned_hm,
        period: jsonObj.reflection_period,
        cat: jsonObj.predicted_category,
        num_sentence: jsonObj.num_sentence * 1
    })
}).on('done',(error)=>{
    console.log('JSON loaded');
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

