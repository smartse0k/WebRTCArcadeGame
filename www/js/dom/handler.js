function onclickConfirmNicknameButton() {
    const input = document.querySelector("#nickname-text-input");
    const nickname = input.value.trim();
    if (nickname.length === 0) {
        alert("닉네임이 입력되지 않음");
        return;
    }

    getNetwork().sendSetNickname(nickname);
}