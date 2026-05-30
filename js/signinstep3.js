function selectPlan(element){
    const plans = document.querySelectorAll(".plan");
    plans.forEach(p => p.classList.remove("active"));
    element.classList.add("active");
}