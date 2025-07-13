
const searchCont = document.querySelector('#searchContainer')
const searchInput = document.querySelector('#searchInput')
const btnDisplaySearch = document.querySelector('#btnDisplaySearch')
//let searchContDisplay = searchCont.style.visibility

btnDisplaySearch.addEventListener('click', ()=>{
  
  if(searchCont.style.visibility !== 'visible' ){
    searchCont.style.visibility = 'visible'
    console.log('not visible')
  }
  else{
    searchCont.style.visibility = 'hidden'
    console.log('not hidden')
  }
})


const pasteText = (textId)=> {
      let textInput = document.getElementById(textId)
      console.log(textId)
      
      navigator.clipboard.readText()
      .then((data)=>{
        textInput.value = data
        console.log('clipboard text: ', data)
      })
      .catch((err) => console.log('Error:', err))
}

const copyText = (textId)=> {
      let textInput = document.getElementById(textId)
      console.log(textId)
      
      navigator.clipboard.writeText(textInput.value)
      .then((data)=>{
        
        console.log('clipboard text: ', data)
      })
      .catch((err) => console.log('Error:', err))
}


const readTime =(content)=>{
  let words = content.split(' ').length
  let speed = 200

  return Math.ceil(words/speed) + ' min read'
}
let btnSubscribe = document.getElementById("btnSubscribe");
let subscribeForm = document.getElementById("subscribeForm");
let subscribed = document.getElementById("subscribed");

subscribeForm.addEventListener("submit", () => {
    subscribed.style.display = "block";
    subscribeForm.style.display = "none";
    alert(subscribed.textContent);
});

const inputName = document.getElementById("name");
const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("emailAddress");
const inputPassword = document.getElementById("password");
const confirmPassword = document.getElementById("passwordConfirm");
const btnSubmit = document.getElementById("btnSubmit");
const form = document.getElementById("form");
const btnLogin = document.getElementById("btnLogin");
const loginForm = document.getElementById("loginForm");
const error = document.querySelectorAll(".text-error");
console.log(error);

btnLogin.addEventListener("click", async e => {
    e.preventDefault();
    if (inputPassword.value.length < 8) {
        error[3].style.visibility = "visible";
    } else {
        console.log("form validated successfully");
        // loginForm.action = "/login";
        // loginForm.submit();
    }
});

btnSubmit.addEventListener("click", e => {
    e.preventDefault();
    console.log("submit button clicked")
    if (inputName.value.length < 2) {
        error[0].style.visibility = "visible";
    } else if (inputPassword.value.length < 8) {
        error[3].style.visibility = "visible";
    } else if (inputPassword.value !== confirmPassword.value) {
        error[4].style.visibility = "visible";
    } else {
        console.log("form validated successfully");
        // form.action = "/register";
        // form.submit();
    }
});
