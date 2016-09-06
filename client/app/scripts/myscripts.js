jQuery(document).ready(function() {
  jQuery('#navbarToggle').on('blur', function() {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      jQuery("#navbar").collapse('hide');
    }
  });
});