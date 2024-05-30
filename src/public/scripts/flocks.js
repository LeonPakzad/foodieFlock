var addFlockForm = document.getElementById('add-flock-form');

if(addFlockForm != null)
{
    addFlockForm.addEventListener('submit', async function(event) {
    
        var flockErrorMessage = document.getElementById("flock-error-message");
    
        event.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');

        try 
        {
            const response = await fetch('/flock-create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (response.ok) 
            {
                window.location.replace('/flock-index');
            } 
            else 
            {
                flockErrorMessage.style.display = 'initial';

                throw new Error(data.message || 'creation failed');
            }
        } 
        catch (error) 
        {
            console.error('flock error:', error.message);
        }
    });
}

var inviteFriendToFlockForm = document.getElementById('invite-friend-to-flock-form');

if(inviteFriendToFlockForm != null)
{
    inviteFriendToFlockForm.addEventListener('submit', async function(event) {
    
        event.preventDefault();

        const formData = new FormData(this);
        const userId = formData.get('userId');
        const flockSalt = formData.get('flockSalt');

        try 
        {
            const response = await fetch('/invite-friend-to-flock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, flockSalt})
            });

            const data = await response.json();

            if (!response.ok) 
            {
                throw new Error(data.message || 'adding failed');
            } 
        } 
        catch (error) 
        {
            console.error('flock error:', error.message);
        }
    });
}

function copyInviteLink() 
{
    var copyText = document.getElementById("invite-link");
    var textCopyed = document.getElementById("invite-link-copyed");
    textCopyed.style.display = "block";

    navigator.clipboard.writeText(copyText.innerHTML);

} 