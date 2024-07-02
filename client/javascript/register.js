const submitRegister = async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let firstnameMsgErr = document.getElementById('error-firstname')
    firstnameMsgErr.innerHTML = ''
    let lastnameMsgErr = document.getElementById('error-lastname')
    lastnameMsgErr.innerHTML = ''
    let emailMsgErr = document.getElementById('error-email')
    emailMsgErr.innerHTML = ''
    let passwordMsgErr = document.getElementById('error-password')
    passwordMsgErr.innerHTML = ''
    let cfPwdMsgErr = document.getElementById('error-cfpassword')
    cfPwdMsgErr.innerHTML = ''

    if (password !== confirmPassword) {
        cfPwdMsgErr.innerHTML = 'Passwords do not match'
        return
    }
    let userData = {
        role_id: 2,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    // console.log(userData)
    try {
        const response = await axios.post(
            'http://localhost:8000/register',
            userData
        )
        // console.log('response data', response.data)
        alert(response.data.message)
        window.location.href = './login.html'
    } catch (error) {
        let errors = error.errors || []
        let errorMessage = error.message

        // Add Code for taking error message from server(BE)
        if (error.response && error.response.data) {
            errors = error.response.data.errors
            errorMessage = error.response.data.message      //something wrong
            // console.log('1:',errors)
            // console.log('2:',errorMessage)
        }
        
        if (errors && errors.length > 0) {
            for (let i=0; i < errors.length; i++) {
                let msgErr = errors[i].split(":")
                if (msgErr[0] === "1") { firstnameMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "2") { lastnameMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "3") { emailMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "4") { passwordMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "5") { emailMsgErr.innerHTML = msgErr[1] }
            }
        }

        if (errors.length == 0 && errorMessage.split(" ")[0] === "Duplicate") {
            emailMsgErr.innerHTML = "This email is already in use"
            alert("This email is already in use")
        }
    }
}
