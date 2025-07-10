const btnShare = document.getElementById("btnShare");
btnShare.addEventListener("click", async e => {
    if (navigator.share) {
        await navigator.share({
            title: document.title,
            text: document.description,
            url: window.location.href
        });
    } else {
        alert("this device does not allow sharing");
    }
});
