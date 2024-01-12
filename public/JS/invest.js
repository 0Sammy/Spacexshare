const form = document.getElementById("form")
form.addEventListener("submit", function (event) {
    const {plan , amount} = Object.fromEntries([...new FormData(this)])
    if (!plan || !amount) {
        return event.preventDefault()
    }
    if (plan === "starter" && (amount < 100 || amount >= 5000) ){
        alert("Invalid Amount")
        event.preventDefault()
    } else if(plan === "regular" && (amount < 5000 || amount >=10000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "pro" && (amount < 10000 || amount >=50000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "elite" && (amount < 50000 || amount > 250000 ) ){
        alert("Invalid Amount")
        event.preventDefault()
    }
})

const amount = document.getElementById('amount');
const card1 = document.getElementById('card-1');
const card2 = document.getElementById('card-2');
const card3 = document.getElementById('card-3');
const card4 = document.getElementById('card-4');

card1.addEventListener("click", ()=>{
    amount.value = 4999;
})
card2.addEventListener("click", ()=>{
    amount.value = 9999;
})
card3.addEventListener("click", ()=>{
    amount.value = 49999;
})
card4.addEventListener("click", ()=>{
    amount.value = 250000;
})

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