function toggleSessionTimeInput() {
    var individualTimes = document.getElementsByClassName("individual-time");
    var groupTimeContainer = document.getElementById("group-time-container");
    var isIndividualTimeSwitch = document.getElementById("individual-time-switch");

    console.log(isIndividualTimeSwitch.checked)
    if(isIndividualTimeSwitch.checked)
    {
        Array.from(individualTimes).forEach((element) => {
            element.style.display= "block"
        });

        groupTimeContainer.style.display = "none";
    }
    else
    {
        Array.from(individualTimes).forEach((element) => {
            element.style.display= "none";
        });
        groupTimeContainer.style.display = "block";
    }
}

function setFoodSessionType() {
    var foodsessionSelect = document.getElementById("foodsession-type");

    var dailyFoolingContainer = document.getElementById("daily-fooding-container");
    var singleSessionContainer = document.getElementById("single-session-container");

    var rouletteContainer = document.getElementById("roulette-container");
    var pollContainer = document.getElementById("poll-container");
    var swypingContainer = document.getElementById("swyping-container");

    switch(foodsessionSelect.value)
    {
        case "single-session":
            singleSessionContainer.style.display = "flex";    
            dailyFoolingContainer.style.display = "none";   
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;

        case "daily-fooding":
            dailyFoolingContainer.style.display = "flex";    
            singleSessionContainer.style.display = "none";
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;
        default:
            dailyFoolingContainer.style.display = "none";    
            singleSessionContainer.style.display = "none";
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;
    }
}

function setDecisionType() {    
    var decisionSelect = document.getElementById("decision-type");

    var rouletteContainer = document.getElementById("roulette-container");
    var pollContainer = document.getElementById("poll-container");
    var swypingContainer = document.getElementById("swyping-container");

    var individualContainer = document.getElementById("individual-container");

    switch(decisionSelect.value)
    {
        case "roulette":
            rouletteContainer.style.display = "flex";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none";
            individualContainer.style.display = "none";  
        break;
        case "poll":
            pollContainer.style.display = "flex";    
            rouletteContainer.style.display = "none";    
            swypingContainer.style.display = "none";  
            individualContainer.style.display = "none";  
        break;
        case "swyping":
            swypingContainer.style.display = "flex";  
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            individualContainer.style.display = "none";  

        break;
        case "individual":
            individualContainer.style.display = "flex";  
            swypingContainer.style.display = "none";  
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";   
        break;
        default:
            individualContainer.style.display = "none";  
            swypingContainer.style.display = "none";  
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";   
        break;
    }
}

function updateDistanceSelect()
{
    if (distanceSelect.value === 'custom') 
    {
        distanceInput.style.display = 'inline-block';
        distanceInput.value = '';
        distanceInput.focus();
    } 
    else 
    {
        distanceInput.style.display = 'none';
    }
}

function addPollOption() {
    var pollOptionInput = document.getElementById("add-poll-option-input");
    if (pollOptionInput.value == "") return;

    var pollList = document.getElementById("poll-options-container");
    var pollListLength = pollList.childElementCount;

    var bodyrow = document.createElement("div");
    bodyrow.setAttribute("class", "body-row");
    bodyrow.setAttribute("id", "poll-option-container-" + pollListLength);
    bodyrow.setAttribute("data-number", pollListLength);

    var rowOne = document.createElement("div");
    rowOne.setAttribute("class", "col-size-2");
    var rowTwo = document.createElement("div");
    rowTwo.setAttribute("class", "col-size-2");

    var pollItemText = document.createElement("div");
    pollItemText.setAttribute("class", "poll-item-text");
    pollItemText.innerHTML = pollOptionInput.value;

    var link = document.createElement("div");
    link.setAttribute("class", "link-button");
    link.setAttribute("onclick", "deletePollOption(" + pollListLength + ")");

    var linkImage = document.createElement("img");
    linkImage.setAttribute("title", "delete poll option");
    linkImage.setAttribute("alt", "delete poll option");
    linkImage.setAttribute("src", "/public/assets/icon-delete-white.png");

    pollList.appendChild(bodyrow);
    bodyrow.appendChild(rowOne);
    bodyrow.appendChild(rowTwo);
    rowOne.appendChild(pollItemText);
    rowTwo.appendChild(link);
    link.appendChild(linkImage);

    pollOptionInput.value = "";
}


function deletePollOption(id) {
    var pollOptionContainer = document.getElementById("poll-option-container-" + id);
    if (pollOptionContainer) {
        pollOptionContainer.remove();
    }
}