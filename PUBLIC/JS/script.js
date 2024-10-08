
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
