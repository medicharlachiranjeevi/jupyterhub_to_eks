$('#logout').hide();

$('a').attr('target', '_self');
require(["base/js/namespace"], function (Jupyter) {
Jupyter._target = '_self';
});

