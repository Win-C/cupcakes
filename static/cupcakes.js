"use strict"

const $cupcakesList = $("#cupcakesList");
const $cupcakeForm = $("#cupcakeForm");
const $searchForm = $("#searchForm")
// conductor function decouple 
// get function returns the data

async function start(){
  let cupcakes = await getCupcakes();
  displayCupcakeList(cupcakes);
}

/** Get list of cupcakes and return list of cupcakes*/
async function getCupcakes() {
  let response = await axios.get("/api/cupcakes");
  return response.data.cupcakes;
}

/** Adds cupcake from cupcake list to the DOM. */
function displayCupcakeList(cupcakes) {
  // First empty cupcakeList and cupcakeForm on DOM
  $cupcakesList.empty();
  $cupcakeForm[0].reset();



  for (let cupcake of cupcakes) {
    let $image = undefined;
    let $cupcake = $('<li style="height:300px">');
    let $textField = $('<div>').addClass("col-3");
    let $imageField = $('<div style="height:300px">').addClass("col-9");
    for (let [key, value] of Object.entries(cupcake)) {

      if (key === "image") {
        $image = $(`<img src="${value}">`);
        $image.addClass("h-75")
        $imageField.append($image);
      }
      else if (key !== "id") {
        let $field = $("<p>").text(`${key}: ${value}`);
        $textField.append($field);
      }

    }
    $cupcake.append($textField);
    $cupcake.append($imageField);
    $cupcake.addClass("row");
    $cupcakesList.append($cupcake);
  }
}

/** Handles form submission to add a new cupcake. */
async function handleAddCupcake(evt) {
  evt.preventDefault();

  let data = {};

  // Grab cupcake form inputs and put into a list
  let $inputs = $('#cupcakeForm :input');

  // Create data object of form inputs
  for (let input of $inputs) {
    if (input.type !== "submit")
      data[input.name] = input.value;
  }

  await axios.post(
    "/api/cupcakes",
    data
  )
  start();
}


async function handleSearch(evt) {
  evt.preventDefault();
  let data = {};
  let $inputs = $('#searchForm :input');

  // Create data object of form inputs
  for (let input of $inputs) {
    if (input.type !== "submit")
      data[input.name] = input.value;
  }
  let resp = await axios.get(
    "/api/cupcakes/search",
    {params:data}  )
  let cupcakes = resp.data.cupcakes;
  displayCupcakeList(cupcakes);
}

start();
$cupcakeForm.on("submit", handleAddCupcake);
$searchForm.on("submit", handleSearch);
