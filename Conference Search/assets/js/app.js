// api url
const api_url =  "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences";

var confs = confs || {}

var x = document.querySelector("#sort");

function SearchByName() {  
  var input, filter, confs, conf, name, i, txtValue,searchType;
  searchType = document.getElementById('searchBy').value;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  confs = document.getElementById("confCont");
  conf = confs.getElementsByClassName('conference');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < conf.length; i++) {
    if(searchType==="name"){
        name = conf[i].getElementsByTagName("div")[1].getElementsByTagName("h2")[0];
    }
    else {
        name = conf[i].getElementsByTagName("div")[1].getElementsByTagName("h6")[0];
    }

    txtValue = name.textContent || name.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      conf[i].style.display = "";
    } else {
      conf[i].style.display = "none";
    }
  }
}

async function getapi(url)
{
    const response = await fetch(url);

    var data = await response.json();
    confs.data = data;
    console.log(data);
}

getapi(api_url);  


window.setTimeout(function() 
{
    var confs_free = confs.data["free"]
    var confs_paid = confs.data["paid"]
    var conferences = confs_free.concat(confs_paid)
    for(var i=0; i<conferences.length;i++)
    {
        conferences[i].confStartDate = conferences[i].confStartDate.replace(/,/g, '');
    }
    connect_js(conferences);

    x.addEventListener("click", function()
    {
        conferences.sort(sortbydate);
        document.getElementById("confCont").innerHTML="";
        connect_js(conferences);
    })
},4000)

function create_card(ax)
{
    var place=" "
    place+=ax["city"];
    if(ax["city"]!="")
        place+=", ";
    place+=ax["state"]
    if(ax["state"]!="")
        place+=", ";
    place+=ax["country"]

    var imgURL = ax["imageURL"]
    if(imgURL[0]=='"')
        imgURL = imgURL.slice(1, imgURL.length-1)
    if(imgURL=="")
        imgURL="https://bitsofco.de/content/images/2018/12/broken-1.png"
    const tile_cd = 
    `<div id="tile" class="conference">
        <div class="conference-preview">
            <img src=` + imgURL + ` onError="this.onerror=null;this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';" />
        </div>
        <div class="conference-info">
            <div class="progress-container">
                <span class="progress-text">` + " " + ax["confStartDate"] + `</span>
            </div>
            <h6>` + place + `</h6>
            <h2>` + " " + ax["confName"] + `</h2>
            <button class="btn-5">` + " " + ax["entryType"] + `</button>
            <a href=` + ax["confUrl"] + `><button class="btn">Details<i class="fas fa-chevron-right"></i></button></a>
        </div>
    </div>
    `

    const el = document.createElement('div');
    el.innerHTML = tile_cd;
    document.getElementById("confCont").appendChild(el.firstChild);
}


function sortbydate(a, b) 
{
    var dateA = new Date(a.confStartDate).getTime(); 
    var dateB = new Date(b.confStartDate).getTime(); 
    return dateA > dateB ? 1 : -1;  
};


function connect_js(conferences)
{   
    conferences.forEach(function(ax)
        {
            create_card(ax);
        });
}