var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(element) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (element == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

//Showing the deposit pages
const bank = document.getElementById('bankOption');
const crypto = document.getElementById('cryptoOption');
const defaultOption = document.getElementById('default');
const bankButton = document.getElementById('bankButton');
const cryptoButton = document.getElementById('cryptoButton');
const bankIcon = document.getElementById("bankIcon");
const cryptoIcon = document.getElementById("cryptoIcon");
const bankText = document.getElementById("bankText");
const cryptoText = document.getElementById("cryptoText");


//For Crypto
cryptoButton.addEventListener("click", () =>{
  crypto.classList.remove("hidden")
  bank.classList.add("hidden")
  defaultOption.classList.add("hidden")
  cryptoButton.classList.add("border-l-4" , "border-lightBlue")
  cryptoText.classList.add("font-semibold" , "text-lightBlue")
  cryptoIcon.src = "../Images/cryptoHover.svg"
  if (bankText.classList.contains("font-semibold")) {
    bankText.classList.remove("font-semibold" , "text-lightBlue")
    bankIcon.src = "../Images/bank.svg";
    bankButton.classList.remove("border-l-4" ,"border-lightBlue")
  }
})
//For Bank
bankButton.addEventListener("click", () =>{
  crypto.classList.add("hidden")
  bank.classList.remove("hidden")
  defaultOption.classList.add("hidden")
  bankButton.classList.add("border-l-4" ,"border-lightBlue")
  bankText.classList.add("font-semibold" , "text-lightBlue")
  bankIcon.src = "../Images/bankHover.svg"
  if (cryptoText.classList.contains("font-semibold")){
    cryptoText.classList.remove("font-semibold" , "text-lightBlue")
    cryptoIcon.src = "../Images/crypto.svg";
    cryptoButton.classList.remove("border-l-4" ,"border-lightBlue")
  }
})

