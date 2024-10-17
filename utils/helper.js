//helper functions
const relatedPostsFunc = (arr) => {
  let relatedPosts = new Array();
  for (let i = 0; i < 5; i++) {
    // Declared `i` variable
    let randomIndex = Math.floor(Math.random() * arr.length);

    if (!relatedPosts.includes(arr[randomIndex])) {
      relatedPosts.push(arr[randomIndex]);
    }
  }
  //console.log(relatedPosts) // Removed unnecessary log
  return relatedPosts;
};


const readTime =(content)=>{
  const words = content.split(' ').length
  const speed = 200

  const readTime = Math.ceil
    (words/speed) + ' min read'

  
  return readTime
}


const changeImageUrl = async () => {
    let linksArr = [
        "https://images.unsplash.com/photo-1660672415776-02f2b8188d66",
        //great wall
        "https://images.unsplash.com/photo-1680728334778-22f29613407c",
        //marie curie
        "https://images.unsplash.com/flagged/photo-1558954157-7104f14c2ecc",
        //travel tips
        "https://images.pexels.com/photos/2061168/pexels-photo-2061168.jpeg",
        //ai
        "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?",
        //music
        "https://images.unsplash.com/photo-1637203725059-53f993d6ae02",
        //world
        "https://images.unsplash.com/photo-1610023709598-3881e09811c2",
        //davinci
        "https://images.unsplash.com/photo-1493836512294-502baa1986e2",
        //mental health
        "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
        //internet
        "https://images.unsplash.com/photo-1657092587270-3c9d9a138f50",
        //mandela
        "https://images.unsplash.com/photo-1699119060375-9de92d173ac7",
        //space
        "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg",
        //olympics
        "https://plus.unsplash.com/premium_photo-1664304936422-4b3b09f047e6",
        //education
        "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
        //john lennon
        "https://images.unsplash.com/photo-1576430321818-7eb0a95038e3",
        //social media
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f"
    ];
    try {
        let postArr = await post.find({}, { imageUrl: 1 }).then(data => {
            return data;
        });
        for (i = 0; i < linksArr.length; i++) {
          await post.updateOne({_id: postArr[i]._id}, {
            $set:{
              imageUrl: linksArr[i]
            }
          })
        console.log(postArr[i].imageUrl, "updated")
        }
      
    } catch (err) {
      console.error(err)
    }
};




module.exports = {relatedPostsFunc, readTime, changeImageUrl}
