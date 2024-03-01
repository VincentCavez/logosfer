

function importcsv(event){
  if(d3.select("iframe").empty()==false){//player a été remplacé par l'iframe
   /*
    d3.dsv(";","notes.csv").then(function(data){
        var n = data.length;
        var p = data.columns.length;
        console.log(data)
        window.datamap=new Map();
        for(var i=0;i<n;i++){
          window.datamap.set(data[i].timeStamp+"_"+data[i].speaker_id,data[i])
        }
        
        
        clearTimeline()
        uploadNotesToTimeline(data)
        
    })
    */
    var file = event.target.files[0]; 
    
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    
 
    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      
      var content = readerEvent.target.result; // this is the content!
      
      const psv = d3.dsvFormat(";")
      let data=psv.parse(content)                               // rejoin lines

      var n = data.length;
      var p = data.columns.length;
      
      window.datamap=new Map();
      for(var i=0;i<n;i++){
        window.datamap.set(data[i].timeStamp+"_"+data[i].speaker_id,data[i])
      }
      
      clearTimeline()
      uploadNotesToTimeline(data)
    }

  }else {
    alert('Please load a video and then your notes')
  }

}

function downloadcsv(){
  
  var myStr="timeStamp;speaker_id;title;content"
  var cols=["timeStamp","speaker_id","title","content"];
      // Creating each row
  myStr = myStr+"\r\n";
  
  for(let key of datamap.keys()){//rows
    var row = ""
    for(let i = 0; i<4; i++){//cols
    
      if(datamap.get(key)[cols[i]]){
        row += datamap.get(key)[cols[i]]+";"
      }else{
        row += ";"
      }
      console.log(row)
    }
    myStr += row.slice(0, -1)+"\r\n";//pour enlever le dernier ; de chaque ligne et le remplacer par un saut a la ligne
  }
  
 
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", myStr]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "notes.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);


}

function darkerimport(){
  d3.select("#importbackground").style("background-color","green")
}

function lighterimport(){
  d3.select("#importbackground").style("background-color","#28a745")
}