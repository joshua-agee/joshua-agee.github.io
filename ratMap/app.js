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
let results = undefined;

//This call returns data on rat sightings between 2/2/20 and 6/15/20
const getData = () =>{
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/erm2-nwe9.json?complaint_type=Rodent&descriptor=Rat Sighting",
        type: "GET",
        data: {
            "$where" : "created_date between '2020-02-02T12:00:00' and '2020-06-15T12:00:00'",
            "$limit" : 50000,
            "$$app_token" : ratMapAppToken
        }
    }).then(function(data) {
        console.log("Retrieved " + data.length + " records from the dataset!");
        console.log(data);
        results = data;
    }), (error) => {
        console.log(error);
    };
}
// this function will parse the data to get call counts by day
const parseData = (data) => {

}
$(()=>{
    getData();

})


