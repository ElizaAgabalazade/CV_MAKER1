const modal = document.getElementById('changePasswordModal');
const menuBtn = document.getElementById('changePasswordMenu');
const closeBtn = document.getElementById('closeBtn');
const updateBtn = document.getElementById('updatePasswordBtn');

menuBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if(e.target === modal) modal.style.display = 'none';
});

updateBtn.addEventListener('click', () => {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const repeat = document.getElementById('repeatPassword').value;

    if (!current || !newPass || !repeat) {
        alert("Zəhmət olmasa bütün sahələri doldurun!");
        return;
    }

    if(newPass !== repeat){
        alert("New Password və Repeat Password eyni olmalıdır!");
        return;
    }

   
    alert("Şifrə uğurla dəyişdirildi!");

    
    modal.style.display = 'none';

   
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('repeatPassword').value = '';
});




 
  const menuItems = document.querySelectorAll('.menu-item');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-btn');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const modalId = item.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if(modal) modal.style.display = 'flex';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });

    modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if(e.target === modal) modal.style.display = 'none';
    });
  });