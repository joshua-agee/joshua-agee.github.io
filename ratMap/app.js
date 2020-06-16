// This is the API location for NYC 311 data
const baseURL = `https://data.cityofnewyork.us/resource/erm2-nwe9.json`;
const ratMapAppToken = `uLbsfv6dXywYNOLKuYOyZ0rEb`

const theBoroughs = [
    'MANHATTAN',
    'BROOKLYN',
    'QUEENS',
    "'STATEN ISLAND'",
    'BRONX',
]
let borough = theBoroughs[0];
let results;
let boroughDateArr;

//This call returns data on rat sightings between 2/2/20 and 6/15/20
const getData = () =>{
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?complaint_type=Rodent&descriptor=Rat Sighting&borough=MANHATTAN",
        type: "GET",
        data: {
            "$where" : "created_date between '2020-01-01T00:00:00' and '2020-06-15T23:59:00'",
            "$limit" : 50000,
            "$$app_token" : ratMapAppToken
        }
    }).then(function(data) {
        return new Promise (function (resolve, reject) {
            parseMyData(data);
            resolve (console.log(boroughDateArr));
        });
        // console.log("Retrieved " + data.length + " records from the dataset!");
        // results = data;
        //console.log(results);
        //boroughDateArr = parseMyData(results);
    }), (error) => {
        console.log(error);
    };
}
// this function will parse the data to get call counts by day
// data is array of objects with following keys of interest :
// borough: "QUEENS"
// city: "MASPETH"
// community_board: "05 QUEENS"
// complaint_type: "Rodent"
// created_date: "2020-04-28T22:58:29.000"
// cross_street_1: "58 STREET"
// cross_street_2: "58 PLACE"
// descriptor: "Rat Sighting"
// incident_address: "58-09 MASPETH AVENUE"
// landmark: "MASPETH AVENUE"
// latitude: "40.72308983950738"
// latitude: "40.72308983950738"​
// longitude: "-73.91165819809213"​
//================================
// output data to array of borough and date - no time - date object?
// [["queens", "2020-04-28"], ["bronx", ]

const parseMyData = (results) => {
    let parsedData = [];
    for (let i=0; i<results.length; i++){
        parsedData.push([results[i].borough, results[i].created_date.slice(0,10)]);
        boroughDateArr = parsedData;
        //console.log(parsedData)
    }
}

//a function to append the data to the body

$(()=>{
    getData();
    
})


