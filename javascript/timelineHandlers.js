function moveTimeLine(){//On était en pause, on passe en Play
    var oldx=get_x_transform(d3.select("#movingTimeline"))//on va bouger d'un pas de temps en une seconde
    d3.select("#movingTimeline").transition()
    d3.select("#movingTimeline").transition().duration(1000).ease(d3.easeLinear).attr("transform","translate("+(oldx-spaceBetweenBars)+",0)")//.style("left",(-window.L)+"px") 
    
}


function stopTimeLine(){//On était en play, on passe en Pause
    
    d3.select("#movingTimeline").transition()
    d3.select("#movingTimeline").transition().duration(50).attr("transform","translate("+((-window.t*window.spaceBetweenBars)+window.innerWidth/2)+",0)")

}






function addSpeakerToTimeline(){
    
    if(window.N<5){
        var n=d3.selectAll(".speaker").size();
        window.N=n+1;//nouveau nombre de speakers

        var totalHeight=190.75;

        //on bouge toutes les lignes et les points existants
        d3.selectAll(".speaker").each(function(d,i){

            d3.select(this).attr("y1",(i+1)/(N+1)*totalHeight).attr("y2",(i+1)/(N+1)*totalHeight)

            var speaker_id=d3.select(this).attr("speaker_id");
            d3.selectAll(".point").filter(function(){
                return d3.select(this).attr("speaker_id")==speaker_id;
            }).attr("cy",(i+1)/(N+1)*totalHeight)
        })

        //var color=randomHexColour();
   
        //on ajoute la nouvelle ligne
        d3.select("#movingTimeline").append("line").style("stroke",colorsVector[window.N-1]).style("position","absolute")
                .attr("class","speaker").attr("x1",0).attr("x2",T*spaceBetweenBars)
                .attr("y1",N/(N+1)*totalHeight).attr("y2",N/(N+1)*totalHeight)
                .attr("speaker_id",window.N)
                .attr("onclick","createPoint(event)")
                .attr("onmouseover","thickLine(event)")
                .attr("onmouseleave","thinLine(event)")
    }

    
}

function createPoint(event){
    window.shiftX=get_x_transform(d3.select("#movingTimeline"));
    var x=event.x-window.shiftX-15;
    var y=d3.select(event.target).attr("y1")//pourcentage
    var speaker_id=d3.select(event.target).attr("speaker_id")
    var timeStamp=Math.round(x/spaceBetweenBars)
    
    d3.select("#movingTimeline").append("circle").style("position","absolute").attr("class","point").attr("id","p"+timeStamp)
    .attr("cx",x).attr("cy",y)
    .attr("r",7)
    .style("fill","black").style("stroke",colorsVector[speaker_id-1]).style("stroke-width",3)
    .attr("speaker_id",speaker_id)

    createNote(speaker_id,timeStamp)

}

function placePointAt(timeStamp,speaker_id){
    window.shiftX=get_x_transform(d3.select("#movingTimeline"));
    var x=timeStamp*spaceBetweenBars;
    var y=Number(d3.selectAll(".speaker").filter(function(){
        return Number(d3.select(this).attr("speaker_id"))==speaker_id;
    }).attr("y1"))//pourcentage
    
    
    d3.select("#movingTimeline").append("circle").attr("cx",x).attr("cy",y).attr("r",7).style("fill","black").style("stroke",colorsVector[speaker_id-1]).style("stroke-width",3).attr("id","p"+timeStamp)
    .attr("class","point").attr("speaker_id",speaker_id)

 

}

function thickLine(event){
    d3.select(event.target).style("stroke-width",6)
}

function thinLine(event){
    d3.select(event.target).style("stroke-width",3)
}

function clearTimeline(){
    d3.select("#movingTimeline").selectAll(".speaker,.point").remove()
}