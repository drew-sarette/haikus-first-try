function toggleMenu() {
    document.querySelector("nav").classList.toggle("display-none");
}

function showSubmitForm() {
    document.querySelector("form").classList.toggle("display-none");
}

function closeSubmitForm(ev) {
    // ev.preventDefault();
    document.querySelector("form").classList.toggle("display-none");
}

function clearHaiku() {

}