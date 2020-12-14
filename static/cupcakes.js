"use strict"

const $cupcakesList = $("#cupcakesList");
const $cupcakeForm = $("#cupcakeForm");


/** Get list of cupcakes and call displayCupcakeList function. */
async function getCupcakes() {
  let response = await axios.get("/api/cupcakes");
  displayCupcakeList(response.data.cupcakes);
}

/** Adds cupcake from cupcake list to the DOM. */
async function displayCupcakeList(cupcakes) {
  // First empty cupcakeList and cupcakeForm on DOM
  $cupcakesList.empty();
  $cupcakeForm[0].reset();

  let $cupcake = $('<li>');

  for (let cupcake of cupcakes) {
    let $image = undefined;

    for (let [key, value] of Object.entries(cupcake)) {
      let $field = undefined;

      if (key === "image") {
        $image = $(`<img src="${value}">`)
      }
      else if (key !== "id") {
        $field = $("<p>").text(`${key}: ${value}`)
      }

      $cupcake.append($field);
    }

    $cupcake.append($image);
    $cupcakesList.append($cupcake);
  }
}

/** Handles form submission to add a new cupcake. */
async function handleAddCupcake(evt) {
  evt.preventDefault();

  let data = {};

  // Grab cucpake form values and put into a list
  let values = $('#cupcakeForm :input');

  // Create data object of values
  for (let value of values) {
    if (value.type !== "submit")
      data[value.name] = value.value;
  }

  await axios.post(
    "/api/cupcakes",
    data
  )

  getCupcakes();
}


getCupcakes();
$cupcakeForm.on("submit", handleAddCupcake);
