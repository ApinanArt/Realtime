document.getElementsByTagName("BODY")[0].onresize = function () { setLayout() };
function setLayout() {
    var getHeaderH = 0;
    setBoxW = $("body").width() / 6;
    setBoxH = ($("body").height() / 3) - getHeaderH;
    $(".test_component").css("width", setBoxW);
    $(".test_component").css("height", setBoxH);
}