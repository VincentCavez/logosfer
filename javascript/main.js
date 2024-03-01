function init(){
    document.body.style.background = "rgb(164 239 255)"
    
    window.colorsVector=["rgb(226 98 100)","rgb(12 116 179)","rgb(0 164 17)","rgb(115 107 107)","rgb(255 170 0)"];

   
    //---------------------------------------------------------------------------------------------------------//
    //                                                  BOARD                                                  //
    //---------------------------------------------------------------------------------------------------------//
    
    d3.select("#boardContainer").append("svg").attr("id","board")
                                                .attr("x",0).attr("y",0)
                                                .attr("width","100%").attr("height","400")//window.innerHeight/1.8)
                                .append("rect").style("fill","rgb(215 242 247)")//"#00829d")
                                                .attr("x",0).attr("y",0)
                                                .attr("width","100%").attr("height","100%")
    var offsetx=15;
    var offsety=15;
    d3.select("#board").append("g").attr("id","notes").attr("transform","translate("+offsetx+","+offsety+")");
                                                
    
    //---------------------------------------------------------------------------------------------------------//
    //                                                TIMELINE                                                 //
    //---------------------------------------------------------------------------------------------------------//                                        
    var timeline=d3.select("#timelineContainer").append("svg").attr("id","timeline")//.attr("viewBox","0 0 1000 1000")
                                                    .attr("x",0).attr("y",0)
                                                    .attr("width","100%").attr("height",innerHeight/4)

    //BACKGROUND                                                
    timeline.append("rect").style("fill","#6adff7").attr("x",0).attr("y",0)
                                                    .attr("width","100%").attr("height","100%")//705 est la moitié de mon ecran
    

    //TRIANGLE
    d3.select("#optionsContainer").append("svg").style("position","absolute").style("left",window.innerWidth/2+5).append("path").attr("d","m 0 20 h 20 l -10 -20 l -10 20").style("fill","black")
                        
    
    window.datamap=new Map();

}