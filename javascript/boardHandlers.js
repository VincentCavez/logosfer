function moveNotes(){//On était en pause, on passe en Play
   
    d3.select("#notes").transition().duration((window.T-window.t)*1000).ease(d3.easeLinear).attr("transform","translate("+(-window.L)+",0)")//.style("left",(-window.L)+"px") 
    
}


function stopNotes(){//On était en play, on passe en Pause
    
    d3.select("#movingTimeline").transition()
    d3.select("#movingTimeline").attr("transform","translate("+(-window.t*window.spaceBetweenBars)+",0)")

}

function uploadNotesToTimeline(df){//from csv to timeline
    
    var fixedHeight=100;//a changer
    var offsetx=15;
    var offsety=15;
    var speakers=[];
    for(var i=0;i<df.length;i++){
        var timeStamp = Number(df[i].timeStamp);
        var speaker_id = Number(df[i].speaker_id);
        /*
        var note=d3.select("#notes").append("g").attr("class","note").attr("id","n"+timeStamp).attr("timeStamp",timeStamp).attr("speaker_id",speaker_id).attr("transform","translate(0,"+(offsety+fixedHeight)*i+")");
        note.append("rect").attr("class","noteBackground")
                                            .attr("x","0").attr("y",0)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",100)
                                            .style("stroke",colorsVector[speaker_id-1]).attr("rx",10)

        note.append("text").attr("class","noteTitle")
                                            .attr("x","3%").attr("y",offsety+5)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",100)
                                            .attr("text-anchor","start")
                                            .text(df[i].title)

        note.append("text").attr("class","noteContent")
                                            .attr("x","3%").attr("y",offsety+20+5)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",100)
                                            .attr("text-anchor","start")
                                            .text(df[i].content)
                                            */
        if(speakers.includes(speaker_id)==false){
            speakers.push(speaker_id)
            addSpeakerToTimeline()
        }
        placePointAt(timeStamp,speaker_id)

    }
    
}


function addNoteToBoard(speaker_id,timeStamp){
    //on sait a ce stade que la note a ajouter n'est pas encore dans le board
   
    //on ajoute une note.
    //si on en ajoute et qu'il y en a une du MEME timestamp, on la met en dessous
    //sinon on supprime la précédente et on ajoute la nouvelle
    var offsetx=15;
    var offsety=15;
    var fixedHeight=(d3.select("#board").node().getBoundingClientRect().height-(N+1)*offsety)/N;
    
    //eventuellement les autres notes deja à ce MEME timestamp
    var notesAlreadyThere=d3.selectAll(".note").filter(function(){
        d3.select(this).attr("timeStamp")==timeStamp && d3.select(this).attr("speaker_id")!=speaker_id;
    })
    if(notesAlreadyThere.empty()==true){
        d3.selectAll(".point").transition().duration(50).attr("r",7).style("fill","black")
        d3.selectAll("#p"+timeStamp).transition().duration(50).attr("r",11).style("fill","white")
        window.currentNotes=[timeStamp+"_"+speaker_id]//on supprime les ancienne notes et on ajoute celle la comme seule current note
        d3.selectAll(".note").remove()

        var note=d3.select("#notes").append("g").attr("class","note").attr("id","n"+timeStamp).attr("timeStamp",timeStamp).attr("speaker_id",speaker_id).attr("transform","translate(0,0)")//(offsety+fixedHeight)*i+")");
        note.append("rect").attr("class","noteBackground")
                                            .attr("x","0").attr("y",0)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",fixedHeight)//682.5, a changer !
                                            .style("stroke",colorsVector[speaker_id-1]).attr("rx",10)
    
        note.append("text").attr("class","noteTitle")
                                            .attr("x","3%").attr("y",offsety+5)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",fixedHeight)
                                            .attr("text-anchor","start")
                                            .text(datamap.get(timeStamp+"_"+speaker_id).title)
    
        note.append("text").attr("class","noteContent")
                                            .attr("x","3%").attr("y",offsety+20+5)
                                            .attr("width",(682.5-2*offsetx)+"px").attr("height",fixedHeight)
                                            .attr("text-anchor","start")
                                            .text(datamap.get(timeStamp+"_"+speaker_id).content)
    } else {
        //d3.selectAll("#p"+timeStamp).attr("r",7)
        window.currentNotes.push(timeStamp+"_"+speaker_id)//on ajoute cette note à celles deja présentes
    }
    
}

function createNote(speaker_id,timeStamp){//empty popup box
    d3.selectAll(".note").style("opacity",0)
    var offsetx=15;
    var offsety=15;
    var height=d3.select("#board").node().getBoundingClientRect().height-2*offsety;
    var width=d3.select("#board").node().getBoundingClientRect().width-2*offsetx;
    var div = d3.select("#boardContainer").append("div").attr("id","newNoteContainer").style("top","0px").style("position","absolute")

    //background
    div.append("svg").attr("width",width).attr("height",height).style("left",offsetx+"px").style("top",offsety+"px").style("position","absolute")
            .append("rect").attr("class","noteEditorBackground")
                .attr("x",0).attr("y",0)
                .attr("width",width).attr("height",height)//682.5, a changer !
                .style("stroke",colorsVector[speaker_id-1]).attr("rx",10)

    //form
    var form = div.append("form").style("position","absolute").attr("x",0).attr("y",0).attr("action","/my-handling-form-page").attr("method","post").attr("id","formNote");

    form.append("input").attr("type","text").attr("id","editorTitle").attr("name","title").attr("placeholder","Title").attr("class","noteTitle")
            .style("left",2*offsetx+"px").style("top",2*offsety+"px").style("width",(width-2*offsetx)+"px")
    form.append("textarea").attr("id","editorContent").attr("name","content").text("").attr("placeholder","Description").attr("class","noteContent")
            .style("left",2*offsetx+"px").style("top",2*offsety+40+"px").style("width",(width-2*offsetx)+"px").style("height",(height-150)+"px")
    form.append("button").attr("type","button").attr("class","btn btn-success").text("Add note").style("position","absolute")
            .style("top",(height-35)+"px").style("left",(width-100)+"px").style("width",100+"px")
            .attr("onclick","extractAndSave("+speaker_id+","+timeStamp+")")
}

function extractAndSave(speaker_id,timeStamp){
    var formEl=d3.select("#formNote").node();
    var formData = new FormData(formEl);
    d3.select("#newNoteContainer").remove()
    saveNote(speaker_id,timeStamp,formData.get("title"),formData.get("content"))
    d3.selectAll(".note").style("opacity",1)
    
}

function saveNote(speaker_id,timeStamp,title,content){//from popup box to dataset AT THE RIGHT PLACE and THEN to board
   
    window.datamap.set(timeStamp+"_"+speaker_id,{"timeStamp":timeStamp.toString(),"speaker_id":speaker_id.toString(),"title":title,"content":content})
  
}

function updateNote(event){//later

}

function clearBoard(){
    d3.selectAll(".note").remove()
}
