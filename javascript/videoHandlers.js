
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {

    $(document).ready(function(){
        $('form').submit(function(e){
            
          e.preventDefault();
          let getURL = $('.url').val();
          let newURL = getURL.replace("https://www.youtube.com/watch?v=", "")
          newURL = newURL.split("&")[0]
          
          player = new YT.Player('player', {

            height: d3.select("#playerContainer").node().getBoundingClientRect().height,//400,//window.innerHeight/1.8,
            width: d3.select("#playerContainer").node().getBoundingClientRect().width-15,//a voir
            videoId: newURL,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
            });


            
      
        });
    });


    
}
        

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
  
    window.N=0;
    window.T=player.getDuration();//pour l'instant
    window.t=0;
    window.totalSeconds=d3.range(window.T+1)
    window.spaceBetweenBars=80;
    window.L=T*spaceBetweenBars;
    

    //VERTICAL BARS
    var middle=(window.innerWidth)/2;//15 de padding de chaque coté

    var movingTimeline=d3.select("#timeline").append("g").attr("id","movingTimeline").attr("transform","translate("+middle+",0)")
    movingTimeline.selectAll(".timeBar")
            .data(window.totalSeconds)
            .enter()
            .append("line").attr("class","timeBar")
            .attr("x1",function(d,i){return d*spaceBetweenBars})
            .attr("x2",function(d,i){return d*spaceBetweenBars})
            .attr("y1",0).attr("y2","100%")
    
    //d3.select("#timeline").append("g").attr("id","points").style("z-index",1000)
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

var playTimer=null;
var pauseTimer=null;
window.currentNotes=[];

function onPlayerStateChange(event) {
    
    if (event.data == YT.PlayerState.PLAYING) {
        
        clearInterval(pauseTimer)

        playTimer = setInterval(function () {

            if(window.t!=Math.round(player.getCurrentTime())){//si on a bougé depuis la dernière pose, on repositionne la timeline
            
                window.t=Math.round(player.getCurrentTime());
                stopTimeLine()
                moveTimeLine()
            } else {
                window.t = Math.round(player.getCurrentTime());
                moveTimeLine()
            }
            
            if(N>0){//s'il y a des speakers, on cherche pour chaque speaker s'il n'a pas une note à ce temps t
                for(var i=1;i<=N;i++){
                    if(datamap.get(t+"_"+i)!=undefined && currentNotes.includes((t+"_"+i))==false){//S'il y a une donnée dans le dataset ET qu'elle n'est pas déjà dans le board
                        
                        addNoteToBoard(i,t);
                    }
                }
            }
    
        }, 100); // 100 means repeat in 100 ms


/*
        if(window.t!=Math.round(player.getCurrentTime())){//si on a bougé depuis la dernière pose, on repositionne la timeline
            
            window.t=Math.round(player.getCurrentTime());
            stopTimeLine()
        }
        window.t=Math.round(player.getCurrentTime());//redondant si on a deja repositionné
        
        moveTimeLine()
        */
   
    } 
    if (event.data == YT.PlayerState.PAUSED) {
      
        clearInterval(playTimer)

        pauseTimer = setInterval(function () {

            window.t=Math.round(player.getCurrentTime());
            stopTimeLine()

            if(N>0){//s'il y a des speakers, on cherche pour chaque speaker s'il n'a pas une note à ce temps t
                for(var i=1;i<=N;i++){
                    if(datamap.get(t+"_"+i)!=undefined && currentNotes.includes((t+"_"+i))==false){//S'il y a une donnée dans le dataset ET qu'elle n'est pas déjà dans le board
                       
                        addNoteToBoard(i,t);
                        
                    }
                }
            }
    
        }, 100); // 100 means repeat in 100 ms
        
     
    } 

}
function stopVideo() {
  player.stopVideo();
}











