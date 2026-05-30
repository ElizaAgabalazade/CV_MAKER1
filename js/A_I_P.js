// HTML elementlərini seçirik
const editIcon = document.getElementById('editIcon');  // `editIcon`'u doğru şəkildə seçirik
const nameInput = document.getElementById('nameInput'); // `nameInput`'u doğru şəkildə seçirik

// Image kliklə input sahəsini redaktə edilə bilən hala gətiririk
editIcon.addEventListener('click', () => {
    // Input'u readonly vəziyyətdən çıxarırıq
    nameInput.removeAttribute('readonly'); // readonly atributunu silirik
    nameInput.focus(); // Fokusla
});

// Fayl yükləmə funksiyasını qururuq
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const uploadBox = document.getElementById('uploadBox');

uploadBox.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            uploadBox.classList.add('full');  // class əlavə et ki div böyüsün
        };
        reader.readAsDataURL(file);
    }
});

// kliklemekle edit btn-u acib label-leri deyisdirmek
const sections = document.querySelectorAll(".section_1_2");

sections.forEach(section => {
    const arrow = section.querySelector(".arrow_click");
    const editBtn = section.querySelector(".edit_btn");
    const label = section.querySelector(".profile_label");
    const profileInput = section.querySelector(".profile_input");
    const newEntry = section.querySelector(".new_entry");
    const addEntryBtn = section.querySelector(".add_entry_btn");

    let isOpen = false;

    // Arrow kliklə elementi göstər/gizlət
arrow.addEventListener("click", () => {
    isOpen = !isOpen;
    console.log("isOpen:", isOpen);
    arrow.classList.toggle('rotated');

    if (isOpen) {
        editBtn.style.display = "block";
        newEntry.style.display = "block";
        addEntryBtn.style.display = "block";
    } else {
        editBtn.style.display = "none";
        newEntry.style.display = "none";
        addEntryBtn.style.display = "none";

        if (profileInput.style.display !== "inline-block") {
            profileInput.style.display = "none";
            label.style.display = "block";
        }
    }
});

    // Edit klik → label gizlənir, input açılır, value-lar sync edilir
    // Edit klik → label gizlənir, input açılır, value-lar sync edilir
    editBtn.addEventListener("click", (e) => {
    e.preventDefault(); // form-un submit edilməsini dayandır
    profileInput.value = label.innerText;
    label.style.display = "none";
    profileInput.style.display = "inline-block";
    profileInput.focus();
});
    // Inputda Enter basılanda → input gizlənir, label yenilənir və görünür
    profileInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && profileInput.value.trim() !== "") {
            label.innerText = profileInput.value.trim();
            profileInput.style.display = "none";
            label.style.display = "block";
            newEntry.style.display = "block";
        }
    });








    
// Bütün inputların dəyərlərini götürən funksiya (arrow)
const getAllEntryValues = () =>
  Array.from(document.querySelectorAll(".new_entry"))
    .map(inp => inp.value.trim())
    .filter(v => v !== "");

// Yeni input yaradan funksiya (arrow)
const createNewInput = beforeElement => {
  const extraInput = document.createElement("input");
  extraInput.type = "text";
  extraInput.placeholder = "New Entry";
  extraInput.className = "new_entry";
  extraInput.style.display = "block";
  extraInput.style.margin = "10px 0 1rem 2.3rem";

  // Enter ilə əlavə etmə (arrow)
  extraInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();

      const text = extraInput.value.trim();
      const values = getAllEntryValues();

      if (text === "") return;                // boş yazılıbsa yaratma
      if (values.includes(text)) {            // təkrar yazılıbsa yaratma
        alert("Already exists!");
        return;
      }

      createNewInput(extraInput); // yeni input
    }
  });

  beforeElement.parentNode.insertBefore(extraInput, beforeElement);
  extraInput.focus(); // fokus yeni inputda olsun
};

// Add Entry click (arrow)
addEntryBtn.addEventListener("click", e => {
  e.preventDefault();

  const lastInput = document.querySelector(".new_entry:last-of-type");

  if (lastInput) {
    const text = lastInput.value.trim();
    const values = getAllEntryValues();

    if (text === "") {
      alert("Zəhmət olmasa boş buraxmayın!");
      return;
    }

    if (values.filter(v => v === text).length > 1) {
      alert("Bu dəyər artıq mövcuddur!");
      return;
    }
  }

  createNewInput(addEntryBtn);
});
});


















document.addEventListener('DOMContentLoaded', () => {
    // Form elementləri
    const infoForm = document.getElementById('infoForm');
    const profileForm = document.getElementById('profileForm');

    // Formların submit edilməsini dinləyirik
    infoForm.addEventListener('submit', (event) => {
        event.preventDefault();  // Formun normal submit edilməsini dayandırırıq

        // Form məlumatlarını alırıq
        const formData = new FormData(infoForm); // infoForm-dan məlumatları alırıq

        // fetch ilə POST sorğusu göndəririk
        fetch('https://yourserver.com/submit', {
            method: 'POST',
            body: formData,  // Formu olduğu kimi göndəririk
        })
            .then(response => response.json())  // Serverdən gələn cavabı JSON olaraq təhlil edirik
            .then(data => {
                console.log('Success:', data);  // Serverdən gələn məlumatları konsola yazırıq
                alert('Information successfully submitted!');
            })
            .catch(error => {
                console.error('Error:', error);  // Hata mesajını konsola yazırıq
                alert('An error occurred. Please try again.');
            });
    });

    // Profile formunun əlavə edilməsi üçün başqa bir fetch istifadə edə bilərik
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();  // Submit etməyi dayandırırıq

        const profileData = new FormData(profileForm); // profileForm məlumatlarını alırıq

        fetch('https://yourserver.com/submit-profile', {
            method: 'POST',
            body: profileData, 
        })
            .then(response => response.json())
            .then(data => {
                console.log('Profile Added:', data);
                alert('Profile entry successfully added!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add profile entry. Try again.');
            });
    });
});
