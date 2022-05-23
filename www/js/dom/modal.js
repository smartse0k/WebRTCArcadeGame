const Modal = {
    CONNECTING: document.querySelector("#connecting-modal"),
    SET_NICKNAME: document.querySelector("#set-nickname-modal"),
}

function showModal(dom) {
    dom.style.display = "flex";
}

function hideModal(dom) {
    dom.style.display = "none";
}