const stillCheck = document.getElementById("stillWorkingCheck");
const endDate = document.getElementById("endDate");

stillCheck.addEventListener("change", () => {
    endDate.disabled = stillCheck.checked ? true : false;
    if (stillCheck.checked) endDate.value = "";
});
const iconList = document.getElementById('iconList');
const targetElement = document.getElementById('targetElement');

iconList.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
    const action = img.dataset.action;

    if (action === 'bold') {
      // Toggle font-weight
      if (targetElement.style.fontWeight === '700' || targetElement.style.fontWeight === 'bold') {
        targetElement.style.fontWeight = 'normal';
      } else {
        targetElement.style.fontWeight = '700';
      }
    } else if (action === 'list') {
      // Siyahı funksiyası yoxdur, alert ver
      alert('Siyahı funksiyası yoxdur!');
    } else if (action === 'color') {
      // Toggle rəng: qırmızı və qara arasında
      if (targetElement.style.color === 'red') {
        targetElement.style.color = 'black';
      } else {
        targetElement.style.color = 'red';
      }
    }
  });
});
