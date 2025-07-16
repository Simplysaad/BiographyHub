const shareIcons = document.querySelectorAll(".share-icon");
window.onload = () => {
    shareIcons.forEach(icon => {
        let url = new URL(icon.href);
        let params = new URLSearchParams(url.search + url.hash);

        icon.href = encodeURIComponent(params.get("text"));
        console.log(icon.href)
    });
};
