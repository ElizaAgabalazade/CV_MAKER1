const threeDot = document.getElementById("threeDotDiv");
const menu = document.getElementById("dropdownMenu");

threeDot.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});








function download() {
  alert("Invoice downloaded!");
}

/* PLAN */
function openPlanModal() {
  document.getElementById("planModal").style.display = "block";
}

function closePlanModal() {
  document.getElementById("planModal").style.display = "none";
}

/* METHOD */
function openMethodModal() {
  document.getElementById("methodModal").style.display = "block";
}

function closeMethodModal() {
  document.getElementById("methodModal").style.display = "none";
}

/* CARD */
function openCardModal() {
  document.getElementById("cardModal").style.display = "block";
}

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
}

/* OUTSIDE CLICK */
window.addEventListener("click", function (e) {
  if (e.target.id === "planModal") closePlanModal();
  if (e.target.id === "methodModal") closeMethodModal();
  if (e.target.id === "cardModal") closeCardModal();
});

/* PLAN SELECT */
function selectPlan(btn) {
  document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
  btn.parentElement.classList.add("active");
}