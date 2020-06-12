class User {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.loginErrors = document.getElementById('loginErrors');
        this.usernameInput = document.getElementById('usernameInput');
        this.passwordInput = document.getElementById('passwordInput');
    }
    submitLoginForm() {
        if(this.usernameInput.value !== '' && this.passwordInput.value !== '') {
            localStorage.setItem('username', JSON.stringify(this.usernameInput.value));
            this.loginErrors.innerHTML = ``;
            window.location.href = "/index.html";
        } else {
            this.loginErrors.innerHTML = `<li>Insert username and password</li>`;
        }
    }
    
}
    
const loginForm = document.getElementById('loginForm');
const user = new User();
// login form submit
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    user.submitLoginForm();
});