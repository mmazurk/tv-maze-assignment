"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${term}`
  );
  console.log("Here is the response", response);
  // console.log("Id is", response.data[0].show.id);
  // console.log("Name is", response.data[0].show.name);
  // console.log("Summary is", response.data[0].show.summary);
  // console.log("Image is", response.data[0].show.image.original);
  // const { data } = response;
  // console.log(data);

  const dataExtract = response.data.map(function (item) {
    const show = item.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image
        ? show.image.medium
        : "https://source.unsplash.com/S4tm-mox-xQ/",
    };
  });

  console.log("here is data extract", dataExtract);
  return dataExtract;

  // console.log(dataExtract);

  // return data;

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}

// const returnedData = await getShowsByTerm('enterprise');
// const { data } = returnedData;

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  console.log(term);
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on('click', 'button', function () {
        // console.log("clicked!")
        // console.log("My id is", $(this).closest('.Show').data())
        const showId = $(this).closest('.Show').data();
        console.log(showId.showId);
        getEpisodesOfShow(showId.showId);   
          })

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// id, name, season, number

async function getEpisodesOfShow(id) {
  const episodeList = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  console.log("Here is the response", episodeList);
  const returnList = episodeList.data.map(function (item) {
    return {
      id: item.id,
      name: item.name,
      season: item.season,
      number: item.number,
    };
  });
  // console.log(returnList);
  populateEpisodes(returnList);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $("#episodes-area").css("display", "");
  $("#episodes-list").empty()
  // console.log(episodes);
  for (let item of episodes) {
    // console.log(
    //   `<li>${item.name} (season ${item.season}, number ${item.number})</li>`
    // );
    const $epi = `<li>${item.name} (season ${item.season}, number ${item.number})</li>`;
    $("#episodes-list").append($epi);
  }
}

