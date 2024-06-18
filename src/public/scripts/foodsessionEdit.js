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

    var value = document.getElementById("add-poll-option-input").value;

    //Create an input type dynamically.
    var row = document.createElement("div");
    row.setAttribute("class", "col-size-2 row");

    var pollItemText = document.createElement("div");
    pollItemText.setAttribute("class", "poll-item-text");
    pollItemText.innerHTML = value;

    var link = document.createElement("div");
    link.setAttribute("class", "link-button");

    //Create Labels
    var label = document.createElement("Label");
    label.innerHTML = "New Label";     
    
    //Assign different attributes to the element.
    element.setAttribute("type", "text");
    element.setAttribute("value", "");
    element.setAttribute("name", "Test Name");
    element.setAttribute("style", "width:200px");
    
    label.setAttribute("style", "font-weight:normal");
    
    // 'foobar' is the div id, where new fields are to be added
    var pollList = document.getElementById("fooBar");
    
    //Append the element in page (in span).
    pollList.appendChild(label);
    pollList.appendChild(element);
}

function deletePollOption(id) {
    console.log(id)
}