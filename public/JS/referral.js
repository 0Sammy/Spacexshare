function copy() {

    // Get the text field
    const text = document.getElementById("referral-link");
    const copyText = text.innerText;

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    text.innerText = "Copied"

    // Alert the copied text
    alert("You copied the text: " + copyText + " to your clipboard");
}