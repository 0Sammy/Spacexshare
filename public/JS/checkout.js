function copy() {
    // Get the text field
    const text = document.getElementById("wallet");
    const copyText = text.innerText;
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
  
    // Alert the copied text
    alert("You copied the text: " + copyText + " to your clipboard");
  }