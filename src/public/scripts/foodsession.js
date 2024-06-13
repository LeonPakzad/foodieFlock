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