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

//This call returns data on rat sightings between given dates
const getData = (startDate , endDate) =>{
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?complaint_type=Rodent&descriptor=Rat Sighting",
        type: "GET",
        data: {
            "$where" : `created_date between '${startDate}T00:00:00' and '${endDate}T23:59:00'`,
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
    let boroughDateArr;
    let boroughDateCount = [];
    for (let i=0; i<results.length; i++){
        //extract the borough name and date for each row into an arr of objects.
        parsedData.push({borough: results[i].borough, date: results[i].created_date.slice(0,10)});
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
// const buildTable = () => {
//     const $infoTable = $('<table>').addClass('info-table')
//     $infoTable.html(
//       `<thead>
//         <tr>
//           <th>Name</th>
//           <th>Location</th>
//         </tr>
//       </thead>`
//     )
//     for (let contact of contacts) {
//       console.log(contact)
//     }
//   }
//   $(() => {
//     buildTable()
//   })
// const makeBoroughDateTable = (arr) => {
//     $('.container').empty();
//     let $table = $('<table>');
//     $table.html(
//         `<thead>
// //         <tr>
// //           <th>Borough</th>
// //           <th>Date</th>
// //         </tr>
// //       </thead>`
//     );
//     for (event of arr) {
//         const $row = $('<tr>');
//         const $boroughCell = $('<td>').text(event.borough);
//         const $dateCell = $('<td>').text(event.date);
//         $row.append($boroughCell, $dateCell);
//         $table.append($row);
//     }
//     $('.container').append($table);
// }

const makeBoroughDateCountTable = (arr) =>{
    let sum = 0
    for (let i=0; i<arr.length; i++){
        sum += arr[i].count;
    }
    let $stats = $('<h3>').text(`There are a total of ${sum} Rat Sightings`)
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
$(()=>{
    $('.borough').on('click', (event)=>{
        console.log($(event.currentTarget).attr('id'));
        console.log(event);
        
    })
    $('#submit').on('click', (event)=>{
        //console.log($('#startDate').val());
        //console.log($('#endDate').val());
        $('.container').empty();
        getData($('#startDate').val(), $('#endDate').val());
        event.stopPropagation();
        event.preventDefault();
    })
    
})


