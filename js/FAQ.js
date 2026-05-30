document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const arrow = item.querySelector('.toggle-arrow');
    const answer = item.querySelector('.faq-answer');

    arrow.addEventListener('click', () => {
      const isActive = item.classList.toggle('active');

      if (isActive) {
        answer.style.maxHeight = answer.scrollHeight + "px"; // cavabın real hündürlüyü
      } else {
        answer.style.maxHeight = 0;
      }
    });
  });
});