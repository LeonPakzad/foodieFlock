function toggleSessionTimeInput() {
    var individualTimes = document.getElementsByClassName("individual-time");
    var collectiveSessionTimeContainer = document.getElementById("collective-session-time-container");
    var isIndividualTimeSwitch = document.getElementById("individual-time-switch");

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

function setFoodsessionAppointmentType() {
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

function setFoodsessionDecisionType() {    
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

var updateFoodsessionForm = document.getElementById('update-foodsession-form');
if(updateFoodsessionForm != null)
{
    updateFoodsessionForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const foodsessionID = formData.get('foodsession-id');

        const foodsessionAppointmentType    = formData.get('foodsession-appointment-type');
        const isIndividualTimeSwitchChecked = document.getElementById("individual-time-switch").checked;
        const foodsessionDecisionType       = formData.get('foodsession-decision-type');
        const collectiveSessionTime         = formData.get('collective-session-time');
        const individualTimes               = formData.getAll('individual-time');
        const rouletteRadius                = formData.get('roulette-radius');
        const swypeRadius                   = formData.get('swype-radius');
        const singleSessionTime             = formData.get('single-session-time');

        const isMondaySwitchChecked         = document.getElementById('is-monday-switch').checked;
        const isTuesdaySwitchChecked        = document.getElementById('is-tuesday-switch').checked;
        const isWednesdaySwitchChecked      = document.getElementById('is-wednesday-switch').checked;
        const isThursdaySwitchChecked       = document.getElementById('is-thursday-switch').checked;
        const isFridaySwitchChecked         = document.getElementById('is-friday-switch').checked;
        const isSaturdaySwitchChecked       = document.getElementById('is-saturday-switch').checked;
        const isSundaySwitchChecked         = document.getElementById('is-sunday-switch').checked;

        const isPollMultipleAnswersChecked  = document.getElementById('is-poll-multiple-answers').checked;
        const isPollAnswersAnonymousChecked = document.getElementById('is-poll-answers-anonymous').checked;
        const pollAnswers = Array.from(document.querySelectorAll('.poll-item-text').values()).map(element => element.textContent);

        try 
        {
            const response = await fetch('/foodsession-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    foodsessionID,
                    foodsessionAppointmentType,
                    isIndividualTimeSwitchChecked,
                    foodsessionDecisionType,

                    singleSessionTime,
                    collectiveSessionTime,
                    individualTimes,
                    isMondaySwitchChecked,
                    isTuesdaySwitchChecked,
                    isWednesdaySwitchChecked,
                    isThursdaySwitchChecked,
                    isFridaySwitchChecked,
                    isSaturdaySwitchChecked,
                    isSundaySwitchChecked,

                    rouletteRadius,
                    swypeRadius,

                    isPollAnswersAnonymousChecked,
                    isPollMultipleAnswersChecked,
                    pollAnswers,
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) 
            {
                throw new Error(data.message || 'updating failed');
            }
            else 
            {
                // window.location.reload();
            } 
        }
        catch(error)
        {
            console.error('foodsession error:', error.message);
        }
    });
}