$(document).ready(function() {
  $('#navbarToggle').on('blur', function() {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#navbar").collapse('hide');
    }
  });
});