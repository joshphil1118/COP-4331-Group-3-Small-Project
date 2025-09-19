
setInterval( myTimer, 5000);
let count = 0;

function myTimer() {

  if( count === 0 ){

    document.getElementById("work").style.display = "inline";
    document.getElementById("vacation").style.display = "none";
    count++;
  }
  else {

    document.getElementById("work").style.display = "none";
    document.getElementById("vacation").style.display = "inline";
    count--;
  }
}

function openForm() {
  document.getElementById("login").style.display = "block";
}

function openForm2() {
  document.getElementById("register").style.display = "block";
}

function closeForm() {
  document.getElementById("login").style.display = "none";
} 

function closeForm2() {
  document.getElementById("register").style.display = "none";
} 