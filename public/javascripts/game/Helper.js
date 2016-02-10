define(function() {
    var PIXELS_IN_METR = 30;
    var Helper = {
        toMetr : function(pixels){
            return pixels / PIXELS_IN_METR;
        },
        
        toPixels : function(metrs){
            return metrs * PIXELS_IN_METR;
        }
    }
    return Helper;
});