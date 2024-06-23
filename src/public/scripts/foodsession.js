function toggleSessionTimeInput() {
    var individualTimes = document.getElementsByClassName("individual-time");
    var collectiveSessionTimeContainer = document.getElementById("collective-session-time-container");
    var isIndividualTimeSwitch = document.getElementById("individual-time-switch");

    console.log(isIndividualTimeSwitch.checked)
    if(isIndividualTimeSwitch.checked)
    {
        Array.from(individualTimes).forEach((element) => {
            element.style.display= "block"
        });

        collectiveSessionTimeContainer.style.display = "none";
    }
    else
    {
        Array.from(individualTimes).forEach((element) => {
            element.style.display= "none";
        });
        collectiveSessionTimeContainer.style.display = "block";
    }
}

function setFoodSessionDecisionType() {
    var foodsessionAppointmentTypeSelect = document.getElementById("foodsession-appointment-type");

    var weeklyFoodingContainer = document.getElementById("weekly-fooding-container");
    var singleSessionContainer = document.getElementById("single-session-container");

    var rouletteContainer = document.getElementById("roulette-container");
    var pollContainer = document.getElementById("poll-container");
    var swypingContainer = document.getElementById("swyping-container");

    switch(foodsessionAppointmentTypeSelect.value)
    {
        case "single-session":
            singleSessionContainer.style.display = "flex";    
            weeklyFoodingContainer.style.display = "none";   
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;

        case "weekly-fooding":
            weeklyFoodingContainer.style.display = "flex";    
            singleSessionContainer.style.display = "none";
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;
        default:
            weeklyFoodingContainer.style.display = "none";    
            singleSessionContainer.style.display = "none";
            
            // single decision elements
            rouletteContainer.style.display = "none";    
            pollContainer.style.display = "none";    
            swypingContainer.style.display = "none"; 
        break;
    }
}

function setFoodsessionAppointmentType() {    
    var decisionSelect = document.getElementById("foodsession-decision-type");

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