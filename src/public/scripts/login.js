var loginForm = document.getElementById('loginForm');
var registerForm = document.getElementById('registerForm');

function toggleAuth(){
    if (loginForm.style.display === "none") 
    {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } 
    else 
    {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

if(loginForm != null)
{
    loginForm.addEventListener('submit', async function(event) {
    
        var loginErrorMessage = document.getElementById("login-error-message");
        var loginSuccessMessage = document.getElementById("login-success-message");
    
        if(loginForm && loginErrorMessage && loginSuccessMessage != null)
        {
            event.preventDefault();
    
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
    
            try 
            {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await response.json();
    
                if (response.ok) 
                {
                    window.location.replace('/profile');
                } 
                else 
                {
                    loginErrorMessage.style.display = 'initial';
                    loginSuccessMessage.style.display = "none";
    
                    throw new Error(data.message || 'Login failed');
                }
            } 
            catch (error) 
            {
                console.error('Login error:', error.message);
            }
        }
    });
}

if(registerForm != null)
{
    registerForm.addEventListener('submit', async function(event) {
    
        var registerErrorMessage = document.getElementById("register-error-message");
        var registerSuccessMessage = document.getElementById("register-success-message");

        event.preventDefault();

        const formData = new FormData(this);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordRetype = formData.get('password-retype');

        try 
        {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, passwordRetype })
            });

            const data = await response.json();

            if (response.ok) 
            {
                registerForm.style.display = 'none';
                registerErrorMessage.style.display = 'none';
                registerSuccessMessage.style.display = "initial";
            } 
            else 
            {
                registerErrorMessage.style.display = 'initial';
                registerSuccessMessage.style.display = "none";

                throw new Error(data.message || 'Registration failed');
            }
        } 
        catch (error) 
        {
            console.error('Register error:', error.message);
        }
    });
}