
function autofill()
{
    $('.item-project').each(function(){
        $(this).height($('.item-project').width());
    });
}

$(document).ready(function() {


    var curscroll = $(window).scrollTop();
    $(window).scroll(function(){
        if( $(window).scrollTop() > 10 && curscroll != $(window).scrollTop() ) {
            $(".title-letter").addClass("smaller");
        }
        else
        {
            $(".title-letter").removeClass("smaller");
        }
        curscroll = $(window).scrollTop();
    });
    

    autofill();
     
    $( window ).resize(function() {
        autofill();
    });

    $(window).on("popstate", function (event, state) {
        $("#veil").css("visibility","hidden");
    });

    $(".view").click(function() {
        $("#show").height($(window).height());
        var url = $(this).attr("url");
        $("#show-image").css("cursor","");
        $("#show-image").click(function(){
            return false;
        });
        $("#show-image").removeClass("fill-wide");
        $("#show-image").removeClass("fill-tall");
        $("#show-image").attr("src", $(this).attr("img")).on('load', function() {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                } else {
                    if(url != "")
                    {
                        $("#show-image").css("cursor","pointer");
                        $("#show-image").click(function(){
                            window.open(url,'_blank');
                            return false;
                        });
                    }
                    if(this.naturalWidth > $(window).width())
                    {
                        if(this.naturalHeight > $(window).height()){                
                            $("#show-image").removeClass("fill-wide-show");
                            $("#show-image").addClass("fill-tall-show");
                        }
                        else
                        {
                            $("#show-image").addClass("fill-wide-show");
                            $("#show-image").removeClass("fill-tall-show");
                        }
                    }
                    else
                    {
                        $("#show-image").removeClass("fill-wide-show");
                        $("#show-image").addClass("fill-tall-show");
                    }
                    $("#veil").css("visibility","visible");
                }
            });
        var imgArr = $(this).attr("img").split("/");
        var imgName = imgArr[imgArr.length - 1]
        history.pushState({page: 1}, imgName, "?view="+imgName)
    });

    $(".close").click(function() {
        $("#veil").css("visibility","hidden");
        window.history.back();
    });
    
    $(document).keyup(function(e) {
      if (e.keyCode === 27) $("#veil").css("visibility","hidden");   // esc
    });

    
});