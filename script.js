// TV Schedule example

//This function was prewritten by the codebar tutorial. It basically corrects the time and date formatting.
function formatDate(start, end) {

    var start_date = new Date(start);
    var end_date = new Date(end);

    var day = start_date.getDate();
    var month = start_date.getMonth() + 1; // the returned months are 0-11
    var year = start_date.getFullYear();

    var start_hour = start_date.getHours();
    var start_mins = start_date.getMinutes();

    var end_hour = end_date.getHours();
    var end_mins = end_date.getMinutes();

    var date = day + "/" + month + "/" + year + " ";

    // add leading 0 and return last two characters to make sure we use 00:00 format
    date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
        ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2);

    return date;
}

//Connects to the server and retrieves the list of genres befor appending it to the page.
function retrieveGenres()   {
    $.ajax({
        url: 'http://www.bbc.co.uk/tv/programmes/genres.json',
        dataType: 'json',
        beforeSend: function()  {
            $('#genres').append('<img id="pending" src="spinner.gif">');
        }
    }).done(function(data)   {
            $('#pending').remove();
//For each genre received, append to the page
    data.categories.forEach(function(element) {
//How the code reads Genres
        var genreKey = element.key;
//How the human read Genres
        var genreTitle = element.title;
        $('#genres').append('<li id="' + genreKey + '">' + genreTitle + '</li>');
    })
    }).fail(function()  {
        $('#genres').text('Failed to load data (BBCs json data is probably offline)' );
    }).always(function()    {
    });
}

//Gets tomorrows schedule based on a given genre
function getTomorrowsSchedule(genre)   {
    $.ajax({
        url: 'http://www.bbc.co.uk/tv/programmes/genres/'+ genre +'/schedules/tomorrow.json',
        dataType: 'json',
        beforeSend: function()  {
            $('#programmes').empty();
            $('#programmes').append('<img id="pending2" src="spinner.gif">');
        }
    }).done(function(data)   {
        $('#pending2').remove();
//For each episode append using the processEpisode method
        data.broadcasts.forEach(function(episode)   {
       $('#programmes').append(processEpisode(episode));
    })
    }).fail(function()  {
        $('#programmes').text('Failed to load data (BBCs json data is probably offline)');
    }).always(function()    {
    });
}

//This groovy method makes a string of html elements for each episode using the json data
function processEpisode(episode) {
  var item_html = '<li class>';
  item_html += '<h2>' + episode.programme.display_titles.title + '</h2>';
  item_html += '<h4>' + episode.programme.short_synopsis + '</h4>';
  if (episode.programme.image.pid) {
  item_html += '<img src=http://ichef.bbci.co.uk/images/ic/272x153/' + episode.programme.image.pid + '.jpg />';
  } else {
  item_html += '<img src="http://placehold.it/272x153" />';
  }
  item_html += '<h5>' + formatDate(episode.start, episode.end) + '</h5>';
  item_html += '<h5>' + episode.duration/60 + ' mins</h5>';
  item_html += '<span>' + episode.service.title + '</span>';
  item_html += '</li>';
return item_html;
}

//When the page loads it runs the function that retrieves and appends the genres
$(document).ready(  function()  {
    retrieveGenres();
})

//When click on a genre, it runs the function that gets the T.V episodes and appends them to the page
$(document).on('click', '#genres li', function()   {
    getTomorrowsSchedule(this.getAttribute('id'));
//Lets you know which genre has been clicked on by changing it's color
    $('#genres li').removeClass('active');
    $(this).addClass('active');
})