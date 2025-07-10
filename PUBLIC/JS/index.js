let metaDescription = document
    .querySelector("meta[name='description']")
    .getAttribute("content");

const btnShare = document.getElementById("btnShare");
btnShare.addEventListener("click", async e => {
    if (navigator.share) {
        await navigator.share({
            title: document.title,
            text: metaDescription,
            url: window.location.href
        });
    } else {
        alert("this device does not allow sharing");
    }
});

let socials = {
    whatsapp: `https://wa.me/?text=${document.title}%0A${metaDescription}%0A${window.location.href}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    twitter: `https://x.com/intent/tweet?url=${window.location.href}&text=${document.title}%0A${metaDescription}`
};

let shareIcons = document.querySelectorAll(".share-icon");
shareIcons.forEach(icon => {
    icon.href = socials[icon.getAttribute("id")];
});
