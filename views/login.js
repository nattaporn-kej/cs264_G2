window.onload = function(){
    var apiUsername = document.getElementById('apiUser')
    var apiPassword = document.getElementById('apiPass')
    var submitButton = document.getElementById('submit-button')

    submitButton.addEventListener('click', () =>{
           var data = {
                  'username': apiUsername.value,
                  'password': apiPassword.value
           }
           
    })
    console.log(hello)
}
