# [NYC Rodent Sightings](https://joshua-agee.github.io/ratMap/)

## Purpose
This application pulls data from the open data source [data.cityofnewyork.us](https://data.cityofnewyork.us/), an API that provides a wealth of information about city activities.  This application pulls 311 calls of rodent sightings (a dataset that goes back to October 2011) and totals them by borough and by date, in addition they are plotted on a map using the [mapbox API](https://www.mapbox.com/).  The app takes a start and end date and then returns the results, which are then filterable by borough.  

This was inspired by recent news stories about the effects of the COVID-19 shutdowns causing rats that live on restaurant waste to struggle for food.  
https://www.nationalgeographic.com/animals/2020/03/urban-rats-search-for-food-coronavirus/
https://www.nbcnews.com/politics/national-security/starving-angry-cannibalistic-america-s-rats-are-getting-desperate-amid-n1180611

## Data Source
This data portal comprises a vast wealth of information about municipal activities in NYC.  Many other cities offer some form of open data as well, including Chicago.  I had originally intended to use [Chicago](https://data.cityofchicago.org) for their rodent complaints data, but while the quality of the data was as good, including lots of information and location, the currency of their data wasn't as good as NYC's.  

Rodent complaints are a service available through the city's 311 portal where residents can report problems and get information.  The data for pest control includes calls for both mice and rats, and for conditions that promote their infestation.  I opted to use only data where the description was "Rat Sighting", excluding "Mouse Sighting" and others.  This data includes a great deal of information as shown here:

```javascript
{
    "unique_key": "46477011",
    "created_date": "2020-06-15T00:48:55.000",
    "agency": "DOHMH",
    "agency_name": "Department of Health and Mental Hygiene",
    "complaint_type": "Rodent",
    "descriptor": "Rat Sighting",
    "location_type": "Other (Explain Below)",
    "incident_zip": "10472",
    "incident_address": "NOBLE AVENUE",
    "street_name": "NOBLE AVENUE",
    "cross_street_1": "EAST  172 STREET",
    "cross_street_2": "NOBLE AVENUE",
    "intersection_street_1": "EAST  172 STREET",
    "intersection_street_2": "NOBLE AVENUE",
    "status": "In Progress",
    "community_board": "09 BRONX",
    "borough": "BRONX",
    "x_coordinate_state_plane": "1020121",
    "y_coordinate_state_plane": "242571",
    "open_data_channel_type": "MOBILE",
    "park_facility_name": "Unspecified",
    "park_borough": "BRONX",
    "latitude": "40.83240391105416",
    "longitude": "-73.87037547241478",
    "location": {
      "latitude": "40.83240391105416",
      "longitude": "-73.87037547241478",
      "human_address": "{\"address\": \"\", \"city\": \"\", \"state\": \"\", \"zip\": \"\"}"
    }
  }
```

## Methods
To summarize this information, I extracted date and borough from the returned JSON and added it to an array, that I then looped over to count the occurrences by borough, by date.  The summary data was then looped over to build the HTML table that displays the results.  I then added filters by borough as clickable divs on the page which trigger a re-query from the API using the borough as a filter. The returned results are again summarized and table built.

To extend this and make it more visual, I wanted to display the results on a map.  I chose Mapbox to do this.  Creating a map is relatively straightforward, given a container size and starting center point and zoom, and specifying a style.  This requires the map related javascript and HTML to be on the index.html file, not in the app.js file.  Attempts to split them broke the map. This ultimately led to me shifting key pieces of my javascript code to index.html to make it all work.  

One useful feature of Mapbox is that it is able to use GeoJSON data, which is also available from the NYC data API. The methods available to do this require a url or json file to be passed to it to work correctly, and this presented a challenge since the construction of the url is tied to the query terms specified by the user.  I could find no method in jQuery to return the url used in the AJAX call, so I had to shift how I was constructing the url before the AJAX call and copying it to a variable accessible by the script on the index.html page. Thus, the app now makes a call from both the JSON and GeoJSON endpoints.  *(This is an opportunity for refactoring to make it only require one API call, and will be addressed in further optimization work.)*  The GeoJSON data is then passed to the Mapbox map instance as a data source and then layered on the map along with layer styling information.  The style is a heatmap style that needs further refinement to make it work at the scale I am using it.  

With the map added and displaying results correctly, including the borough filters, I thought it would be nice to zoom the map to the borough chosen when filtering, and since the map must be re-instantiated for the new search it was relatively straightforward to include a new center point and zoom for each borough.  

## Opportunities for further enhancement
My original idea was to try to see if there was a change in rodent sighting report patters as a result of the virus related city-wide shutdown.  This is not clear in one screen as the app is currently configured.  I considered trying to configure side-by-side maps/tables, which could work.  Another option that may be effective would be a line chart of occurrences over time - which would be easy from a data standpoint as the app is already doing most of the calculations required, it would need to be plotted on a graph. (chart.js is an option)   Further data refinement is also an opportunity.  The API has another endpoint for 311 call data with duplicate calls removed, however it is not updated as frequently/promptly. 
