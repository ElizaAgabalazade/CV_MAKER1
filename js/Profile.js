const sections = [
  document.querySelector('.information'),
  document.querySelector('.left_work'),
  document.querySelector('.education_part'),
  document.querySelector('.skills'),
  document.querySelector('.language'),
];

let currentIndex = 0;

const showSection = index => {
  sections.forEach((sec, i) => {
    if (i === index) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });
};
showSection(currentIndex);
showSection(currentIndex);


// === JOB MƏLUMATLARINI KÖÇÜRMƏ FUNKSIYASI ===
const fillLeftWork = () => {

  const leftWork = document.querySelector('.left_work');
  if (!leftWork) return;

  const jobTitleInput = leftWork.querySelector('input[placeholder="Enter job title"]');
  const jobCompanyInput = leftWork.querySelector('input[placeholder="Enter your which company"]');
  const jobLocationInput = leftWork.querySelector('input[placeholder="City, Country"]');
  const startDateInput = leftWork.querySelector('#startDate');
  const endDateInput = leftWork.querySelector('#endDate');
  const stillWorkingCheck = leftWork.querySelector('#stillWorkingCheck');
  const descriptionInput = leftWork.querySelector('#targetElement');

  // OUTPUT-lar (sağ panel)
  const positionOutput = document.querySelector('.position');
  const placeOutput = document.querySelector('.place');
  const situationOutput = document.querySelector('.situation');
  const itemList = document.getElementById('itemList');

  // TITLE → POSITION
  if (jobTitleInput && positionOutput) {
    positionOutput.value = jobTitleInput.value;
  }

  // COMPANY + LOCATION → PLACE
  if (placeOutput) {
    placeOutput.value = `${jobCompanyInput.value}${jobLocationInput.value ? ', ' + jobLocationInput.value : ''}`;
  }

  // DATE → SITUATION
  let situationText = "";
  if (stillWorkingCheck.checked) {
    situationText = `${startDateInput.value} - Present`;
    endDateInput.disabled = true;
  } else {
    endDateInput.disabled = false;
    situationText = `${startDateInput.value} - ${endDateInput.value}`;
  }

  situationOutput.value = situationText;

  // DESCRIPTION → LIST
  if (descriptionInput && itemList) {
    const lines = descriptionInput.value.split("\n").map(x => x.trim()).filter(x => x !== "");
    itemList.innerHTML = "";
    lines.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      itemList.appendChild(li);
    });
  }
};
// CHECKBOX — End date disable/enable
document.getElementById('stillWorkingCheck').addEventListener('change', e => {
  const endDateInput = document.getElementById('endDate');

  if (e.target.checked) {
    endDateInput.value = "";
    endDateInput.disabled = true;
  } else {
    endDateInput.disabled = false;
  }
});











// ====== EDUCATION AUTO-FILL (BURAYA ƏLAVƏ EDİRSƏN) ======

const educationSection = sections.find(sec => sec.classList.contains('education_part'));
if (educationSection) {
  const courseInput = educationSection.querySelector('.course');
  const positionInput = educationSection.querySelector('.position');
  const cityInput = educationSection.querySelector('.city');
  const institutionInput = educationSection.querySelector('.institution');
  const placeInput = educationSection.querySelector('.place');
  const dateStart = educationSection.querySelector('.date-start');
  const dateEnd = educationSection.querySelector('.date-end');
  const situationInput = educationSection.querySelector('.situation');

  // Avtomatik doldurma input eventləri
  courseInput?.addEventListener('input', () => {
    positionInput.value = courseInput.value;
  });

  const updatePlace = () => {
    placeInput.value = `${cityInput.value}${cityInput.value && institutionInput.value ? ', ' : ''}${institutionInput.value}`;
  };
  cityInput?.addEventListener('input', updatePlace);
  institutionInput?.addEventListener('input', updatePlace);

  const updateSituation = () => {
    if (dateStart.value && dateEnd.value) {
      situationInput.value = `${dateStart.value} - ${dateEnd.value}`;
    } else {
      situationInput.value = '';
    }
  };
  dateStart?.addEventListener('input', updateSituation);
  dateEnd?.addEventListener('input', updateSituation);
}

// ====== /Next back======

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentIndex < sections.length - 1) {
    currentIndex++;
    showSection(currentIndex);
  }
});

document.getElementById('backBtn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showSection(currentIndex);
  }
});
// job 


// Placeholder funksiyalar, lazım olduqda eyni formatda doldura bilərsən
const fillEducationPart = () => {
  const educationPart = document.querySelector('.education_part');
  if (!educationPart) return;

  const courseInput = educationPart.querySelector('#course');
  const institutionInput = educationPart.querySelector('#institution');
  const cityInput = educationPart.querySelector('#city');
  const dateStart = educationPart.querySelector('#eduStart');
  const dateEnd = educationPart.querySelector('#eduEnd');

  const educationForm = document.getElementById('educationForm');
  if (!educationForm) return;

  const placeInput = educationForm.querySelector('input.place');
  const situationInput = educationForm.querySelector('input.situation');
  const positionInput = educationForm.querySelector('input.position');

  if (courseInput && positionInput) {
    positionInput.value = courseInput.value;
  }

  if (cityInput && institutionInput && placeInput) {
    placeInput.value = `${cityInput.value}${cityInput.value && institutionInput.value ? ', ' : ''}${institutionInput.value}`;
  }

  if (dateStart && dateEnd && situationInput) {
    if (dateStart.value && dateEnd.value) {
      situationInput.value = `${dateStart.value} - ${dateEnd.value}`;
    } else {
      situationInput.value = '';
    }
  }
};


const fillSkills = () => {
  const skillInput = document.getElementById('enter_your_skill');
  const skillLevelSelect = document.getElementById('skill');
  const listSkillInput = document.getElementById('list_skill');

  if (!skillInput || !skillLevelSelect || !listSkillInput) return;

  let skillList = document.getElementById('skillList');
  if (!skillList) {
    skillList = document.createElement('ul');
    skillList.id = 'skillList';
    listSkillInput.insertAdjacentElement('afterend', skillList);
  }

  const skill = skillInput.value.trim();
  const level = skillLevelSelect.value;

  if (!skill) {
    alert("Please enter a skill.");
    return;
  }
  if (!level) {
    // alert("Please select a skill level.");
    return;
  }

  const displayText = `${skill} - ${level.charAt(0).toUpperCase() + level.slice(1)}`;

  const exists = Array.from(skillList.children).some(li => li.textContent === displayText);
  if (exists) {
    alert("This skill is already added.");
    return;
  }

  const li = document.createElement('li');
  li.textContent = displayText;
  skillList.appendChild(li);

  skillInput.value = '';
  skillLevelSelect.value = '';
  skillInput.focus();
};
document.addEventListener('DOMContentLoaded', () => {
  const skillInput = document.getElementById('enter_your_skill');
  const skillLevelSelect = document.getElementById('skill');

  if (skillInput && skillLevelSelect) {
    skillInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        fillSkills();
      }
    });

    skillLevelSelect.addEventListener('change', () => {
      if (skillInput.value.trim() && skillLevelSelect.value) {
        fillSkills();
      }
    });
  }
});






const fillLanguage = () => {
  const languageInput = document.querySelector('.language input[type="text"][placeholder="Enter your language"]');
  const languageLevelSelect = document.querySelector('.language select[name="skillLevel"]');

  const itemListLanguage = document.getElementById('itemListLanguage');

  if (!languageInput || !languageLevelSelect || !itemListLanguage) return;

  const language = languageInput.value.trim();
  const level = languageLevelSelect.value;

  if (language === "" || level === "") return;

  const entryText = `${language} - ${level.charAt(0).toUpperCase() + level.slice(1)}`;

  // Mövcud listdə entryText varmı?
  const items = Array.from(itemListLanguage.querySelectorAll('li'));
  const alreadyExists = items.some(li => li.textContent === entryText);

  if (alreadyExists) {
    // Əgər varsa, əlavə etmə
    return;
  }

  // Yeni elementi əlavə et
  const li = document.createElement('li');
  li.textContent = entryText;
  itemListLanguage.appendChild(li);

  // İstəyə bağlı: input və select-u boşalda bilərsən ki, yeni daxil etməyə hazır olsunlar
  languageInput.value = "";
  languageLevelSelect.value = "";
};

const fillInformation = () => {
  const input = document.getElementById('targetElement');
  const output = document.querySelector('.outputArea');

  if (!input || !output) return;

  output.value = input.value;
};


document.querySelector('.done').addEventListener('click', e => {
  e.preventDefault();

  const currentSection = sections[currentIndex];
  if (!currentSection) return;

  if (currentSection.classList.contains('left_work')) {
     fillLeftWork();
  } else if (currentSection.classList.contains('education_part')) {
    fillEducationPart();
  } else if (currentSection.classList.contains('skills')) {
    fillSkills();
  } else if (currentSection.classList.contains('language')) {
    fillLanguage();
  } else if (currentSection.classList.contains('information')) {
    fillInformation();
  } else {
    console.log('No fill function for this section');
  }

  if (currentIndex < sections.length - 1) {
    currentIndex++;
    showSection(currentIndex);
  }
});

//  Work experience//
const experienceList = document.getElementById('itemList');
const experienceInput = document.getElementById('list_experience');

// Element əlavə etmə funksiyası (təkrarsız)
const addToExperienceList = text => {
  if (!text) return;

  const exists = Array.from(experienceList.children).some(li => li.textContent === text);
  if (exists) return; // təkrar varsa əlavə etmirik

  const li = document.createElement('li');
  li.textContent = text;
  experienceList.appendChild(li);
};

// ENTER basanda inputdakı yazını əlavə et
experienceInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const text = experienceInput.value.trim();
    if (!text) return;

    addToExperienceList(text);
    experienceInput.value = '';
  }
});

// <li> klikləndikdə inputa çevrilmə (edit)
document.addEventListener('click', e => {
  if (e.target.tagName === 'LI' && e.target.parentElement.id === 'itemList') {
    const li = e.target;
    const oldText = li.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.style.width = '90%';

    li.replaceWith(input);
    input.focus();

    // Editi Enter basanda tamamla
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') finishExperienceEdit(input);
    });

    // Editi blur olarkən tamamla
    input.addEventListener('blur', () => finishExperienceEdit(input));
  }
});

// Editdən sonra <input> → <li>
const finishExperienceEdit = input => {
  const newText = input.value.trim();
  if (!newText) {
    input.remove();
    return;
  }

  // Eyni mətn artıq varsa, əlavə etmə, sadəcə inputu sil və li bərpa et
  const exists = Array.from(experienceList.children).some(li => li.textContent === newText);
  if (exists) {
    const li = document.createElement('li');
    li.textContent = newText;
    input.replaceWith(li);
    return;
  }

  // Yeni li yarat
  const li = document.createElement('li');
  li.textContent = newText;
  input.replaceWith(li);
};





const skillList = document.getElementById('skill_list');
const listSkillInput = document.getElementById('list_skill');
const skillInput = document.getElementById('enter_your_skill');
const skillLevel = document.getElementById('skill');

// === Skill List-ə element əlavə etmək (təkrarsız) ===
const addToSkillList = (text) => {
  const exists = Array.from(skillList.children).some(li => li.textContent === text);
  if (exists) return; // təkrar varsa əlavə etmə

  const li = document.createElement('li');
  li.textContent = text;
  skillList.appendChild(li);
};

// === ENTER ilə sadə list əlavə ===
listSkillInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const text = listSkillInput.value.trim();
    if (!text) return;

    addToSkillList(text);
    listSkillInput.value = '';
  }
});

// === Skill + Level seçilibsə əlavə ===
skillLevel.addEventListener('change', () => {
  const skill = skillInput.value.trim();
  const level = skillLevel.value;

  if (!skill || !level) return;

  const display = `${skill} - ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  addToSkillList(display);

  skillInput.value = '';
  skillLevel.value = '';
});

// === <li> edit etmək ===
document.addEventListener('click', e => {
  if (e.target.tagName === 'LI' && e.target.parentElement.id === 'skill_list') {

    const li = e.target;
    const oldText = li.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.style.width = '90%';

    li.replaceWith(input);
    input.focus();

    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') finishEdit(input);
    });

    input.addEventListener('blur', () => finishEdit(input));
  }
});

// === Edit nəticəsini geri <li>-yə çevirmək ===
const finishEdit = input => {
  const newText = input.value.trim();
  if (!newText) return input.remove();

  const li = document.createElement('li');
  li.textContent = newText;

  input.replaceWith(li);
};



// === ELEMENTLƏR ===
const languageList = document.getElementById('itemListLanguage');
const listLanguageInput = document.getElementById('list_language');
const languageInput = document.querySelector('.language input[type="text"]');
const languageLevel = document.getElementById('skillanguage');

// === Language List-ə element əlavə etmək (təkrarsız) ===
const addToLanguageList = (text) => {
  const exists = Array.from(languageList.children).some(li => li.textContent === text);
  if (exists) return; // təkrar varsa STOP

  const li = document.createElement('li');
  li.textContent = text;
  languageList.appendChild(li);
};

// === ENTER ilə sadə language əlavə ===
listLanguageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const text = listLanguageInput.value.trim();
    if (!text) return;

    addToLanguageList(text);
    listLanguageInput.value = '';
  }
});

// === Language + Level seçilibsə əlavə ===
languageLevel.addEventListener('change', () => {
  const lang = languageInput.value.trim();
  const level = languageLevel.value;

  if (!lang || !level) return;

  const display = `${lang} - ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  addToLanguageList(display);

  languageInput.value = '';
  languageLevel.value = '';
});

// === <li> edit etmək ===
document.addEventListener('click', e => {
  if (e.target.tagName === 'LI' && e.target.parentElement.id === 'itemListLanguage') {

    const li = e.target;
    const oldText = li.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.style.width = '90%';

    li.replaceWith(input);
    input.focus();

    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') finishLanguageEdit(input);
    });

    input.addEventListener('blur', () => finishLanguageEdit(input));
  }
});

// === Edit-i geri <li>-yə çevirmək ===
const finishLanguageEdit = input => {
  const newText = input.value.trim();
  if (!newText) return input.remove();

  const li = document.createElement('li');
  li.textContent = newText;

  input.replaceWith(li);
};



