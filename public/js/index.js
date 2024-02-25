$(document).ready(function () {
  const selectedCuisineParam = window.location.search;
  let selectedCuisine = "";
  if (selectedCuisineParam.includes("cuisine")) {
    selectedCuisine = selectedCuisineParam.replace("?cuisine=", "");
    $(`option[value=${selectedCuisine}]`).attr("selected", true);
  }

  $("select[name='cuisine']").change(function () {
    const cuisine = $(this).val();
    console.log(cuisine);
    window.location = `/?cuisine=${cuisine}`;
  });
});
