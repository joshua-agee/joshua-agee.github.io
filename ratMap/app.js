
// This is the API location for NYC 311 data
const baseURL = `https://data.cityofnewyork.us/resource/erm2-nwe9.json`;
const ratMapAppToken = `uLbsfv6dXywYNOLKuYOyZ0rEb`
const baseGeoJSONdataURL = `https://data.cityofnewyork.us/resource/erm2-nwe9.geojson?complaint_type=Rodent&descriptor=Rat%20Sighting&`
const theBoroughs = [
    'BRONX',
    'BROOKLYN',
    'MANHATTAN',
    'QUEENS',
    "'STATEN ISLAND'",
]
let results;
let resultGeoJSON;
let url = ""; //variable to pass to mapping function for geojson data

//This call returns data on rat sightings between given dates with optional borough id parameter
const getData = (...args) =>{
    if (args.length == 2){
        url = baseGeoJSONdataURL+`%24where=created_Date%20between%20%27${args[0]}T00%3A00%3A00%27%20and%20%27${args[1]}T23%3A59%3A00%27&%24limit=50000&%24%24app_token=${ratMapAppToken}`;
        $.ajax({
            url: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?complaint_type=Rodent&descriptor=Rat Sighting",
            type: "GET",
            data: {
                "$where" : `created_date between '${args[0]}T00:00:00' and '${args[1]}T23:59:00'`,
                "$limit" : 50000,
                "$$app_token" : ratMapAppToken
            }
        }).then(function(data) {
            return new Promise (function (resolve) {
                results = data; //stash data for table re-render without new ajax call
                let boroughDateCount = parseMyData(data);
                resolve (
                    makeBoroughDateCountTable(boroughDateCount)
                    );
                });
            }), (error) => {
                console.log(error);
            };
    } 


    if (args.length == 3) {
        url = baseGeoJSONdataURL+`borough=${theBoroughs[args[2]]}&%24where=created_Date%20between%20%27${args[0]}T00%3A00%3A00%27%20and%20%27${args[1]}T23%3A59%3A00%27&%24limit=50000&%24%24app_token=${ratMapAppToken}`;
        $.ajax({
            url: `https://data.cityofnewyork.us/resource/erm2-nwe9.json?complaint_type=Rodent&descriptor=Rat Sighting&borough=${theBoroughs[args[2]]}`,
            type: "GET",
            data: {
                "$where" : `created_date between '${args[0]}T00:00:00' and '${args[1]}T23:59:00'`,
                "$limit" : 50000,
                "$$app_token" : ratMapAppToken
            }
        }).then(function(data) {
            return new Promise (function (resolve) {
                results = data; //stash data for table re-render without new ajax call
                let boroughDateCount = parseMyData(data);
                resolve (
                    makeBoroughDateCountTable(boroughDateCount)
                    //console.log(boroughDateCount)
                    );
                    
                });
               
            }), (error) => {
                console.log(error);
            };
    }
}
    // this function will parse the data to get call counts by day
    // data is array of objects with following keys of interest :
    // borough: "QUEENS"
    // 
    // latitude: "40.72308983950738"
    // latitude: "40.72308983950738"​
    // longitude: "-73.91165819809213"​
    //================================
    // output data to array of borough, date, long and lat of call. 
    // [["queens", "2020-04-28"], ["bronx", ]
    
const parseMyData = (results) => {
    let parsedData = [];
    let boroughDateArr;
    let boroughDateCount = [];
    for (let i=0; i<results.length; i++){
        //extract the borough name and date for each row into an arr of objects.
        parsedData.push({borough: results[i].borough, date: results[i].created_date.slice(0,10), longitude: results[i].longitude, latitude: results[i].latitude});
        boroughDateArr = parsedData;
    }
    //sort by borough
    boroughDateArr = boroughDateArr.sort(function(a,b){
        if (a.borough < b.borough){
            return -1;
        }
        if (a.borough > b.borough){
            return 1;
        }
        return 0;
    });
    //sort data by date
    boroughDateArr = boroughDateArr.sort(function (a,b){
        if (a.date < b.date){
            return -1;
        }
        if (a.date > b.date){
            return 1;
        }
        return 0;
    });
    //create a count by date array
    let counter = 1;
    for (let i=0; i<boroughDateArr.length-1; i++){
        if (boroughDateArr[i].borough === boroughDateArr[i+1].borough && boroughDateArr[i].date === boroughDateArr[i+1].date){
            counter++;
        } else {
            boroughDateCount.push({borough: boroughDateArr[i].borough, date: boroughDateArr[i].date, count: counter });
            counter = 1;
        }
    }
    
    return boroughDateCount;
}

//a function to append the data to the body
//sample code from w3d3 lessons
//this code builds the html table from the data in the array

const makeBoroughDateCountTable = (arr) =>{
    let sum = 0
    for (let i=0; i<arr.length; i++){
        sum += arr[i].count;
    }
    let $stats = $('<h3>').text(`There are a total of ${sum} Rodent Sightings for the given date range`)
    $('.container').append($stats);
    let $table = $('<table>');
    $table.html(
        `<thead>
//         <tr>
//           <th>Borough</th>
//           <th>Date</th>
//           <th>Count</th>
//         </tr>
//       </thead>`
    );
    for (let call of arr) {
        const $row = $('<tr>');
        const $boroughCell = $('<td>').text(call.borough);
        const $dateCell = $('<td>').text(call.date);
        const $countCell = $('<td>').text(call.count);
        $row.append($boroughCell, $dateCell, $countCell);
        $table.append($row);
    }
    $('.container').append($table);
    
}



//on load set event listeners
$(()=>{
    //moved to index. for proper map loading.
    
    
    
})


