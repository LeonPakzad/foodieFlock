function setFoodSessionType() {
    
    var foodsessionSelect = document.getElementById("foodsession-type");
    var decisionContainer = document.getElementById("decision-container");
    var dailyFoolingContainer = document.getElementById("daily-fooding-container");
    var singleSessionContainer = document.getElementById("single-session-container");

    switch(foodsessionSelect.value)
    {
        case "single-session":
            singleSessionContainer.style.display = "flex";    
            decisionContainer.style.display = "none";    
            dailyFoolingContainer.style.display = "none";    
        break;
        case "daily-fooding":
            dailyFoolingContainer.style.display = "flex";    
            decisionContainer.style.display = "none";    
            singleSessionContainer.style.display = "none";  
        break;
        case "decision":
            decisionContainer.style.display = "flex";    
            dailyFoolingContainer.style.display = "none";    
            singleSessionContainer.style.display = "none";  
        break;
        default:
        break;
    }
}