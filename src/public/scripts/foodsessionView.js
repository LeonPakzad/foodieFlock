
function onlyAllowOneCheckbox(checkbox) {
    var checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });
}

var pollForm = document.getElementById('poll-form');
if(pollForm != null)
{
    pollForm.addEventListener('submit', async function(event) 
    {
        event.preventDefault();

        const pollAnswers = Array.from(document.querySelectorAll("[id^='poll-answer']"));
        const foodsessionID = pollForm.elements.foodsessionID.value; 
        var pollAnswersToSend = [];	

        for(var i = 0; i < pollAnswers.length; i++)
        {
            if(pollAnswers[i].checked)
            {
                pollAnswersToSend.push(pollAnswers[i].dataset.pollid);
            }
        }

        try 
        {
            const response = await fetch('/poll-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    foodsessionID: foodsessionID, 
                    pollAnswersToSend,
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) 
            {
                throw new Error(data.message || 'updating failed');
            }
            else 
            {
                window.location.replace('/flock-show/' + encodeURIComponent(JSON.stringify({id: data.flockId})) + '/foodsession-show/' + encodeURIComponent(JSON.stringify({id: foodsessionID})));
            } 
        }
        catch(error)
        {
            console.error('foodsession error:', error.message);
        }
    });
}