document.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('.container');
    const body = document.body;

    // 1. ELEMENTLƏRİN DÜZGUN TƏYİNİ
    const photoModal = document.getElementById('photoModal');
    const openPhotoBtn = document.getElementById('openPhotoBtn');
    const savePhotoBtn = document.getElementById('savePhotoBtn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const photoInput = document.getElementById('photoInput');
    const imagePreview = document.getElementById('imagePreview');
    const zoomRange = document.getElementById('zoomRange');
    const zoomPercent = document.getElementById('zoomPercent');
    const changePhotoBtn = document.getElementById('changePhotoBtn');

    // Konteynerlər (Steplər)
    const step3Container = document.getElementById('step3');
    const step4Container = document.getElementById('step4');
    const step5Container = document.getElementById('step5');

    // Siyahılar
    const experienceList = document.getElementById('experienceList');
    const educationList = document.getElementById('educationList');
    const certList = document.getElementById('step5-certificateList');
    const langList = document.getElementById('step5-languageList');
    const sendList = document.getElementById('sendList');
    const sendList1 = document.getElementById('sendList1');

    // Naviqasiya Düymələri
    const toStep3Btn = document.querySelector('.next-btn');
    const toStep4Btn = document.getElementById('toStep4');
    const toStep5Btn = document.getElementById('toStep5');
    const backToStep3Btn = document.getElementById('backToStep3');
    const backToStep4Btn = document.getElementById('backToStep4');
    const backToStep2Btn = document.getElementById('backToStep2');

    // Əlavə etmə düymələri
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const addCertBtn = document.getElementById('step5-addCertificateBtn');
    const addLangBtn = document.getElementById('step5-addLanguageBtn');

    const uploadBox2 = document.getElementById('uploadBox2');
    const fileInput2 = document.getElementById('fileInput2');
    const preview2 = document.getElementById('preview2');

    const skillsInput = document.getElementById('skillsInput');
    const profSummaryInput = document.getElementById('profSummary');

    if (profSummaryInput) {
        const MAX_CHARS = 500;
        profSummaryInput.setAttribute('maxlength', MAX_CHARS);

        const counterDisplay = document.createElement('div');
        counterDisplay.id = 'js-profSummary-counter';

        counterDisplay.style.fontSize = '12px';
        counterDisplay.style.color = '#666';
        counterDisplay.style.marginTop = '4px';
        counterDisplay.style.textAlign = 'right';
        counterDisplay.style.transition = 'color 0.2s ease, font-weight 0.2s ease';
        counterDisplay.innerText = `0 / ${MAX_CHARS}`;

        profSummaryInput.parentNode.insertBefore(counterDisplay, profSummaryInput.nextSibling);

        const updateSummaryCounter = () => {
            let currentLength = profSummaryInput.value.length;

            if (currentLength > MAX_CHARS) {
                profSummaryInput.value = profSummaryInput.value.substring(0, MAX_CHARS);
                currentLength = MAX_CHARS;
            }

            counterDisplay.innerText = `${currentLength} / ${MAX_CHARS}`;

            // Limitə çatanda vizual aydınlıq xəbərdarlığı
            if (currentLength >= MAX_CHARS) {
                counterDisplay.style.color = 'red';
                counterDisplay.style.fontWeight = 'bold';
                profSummaryInput.style.borderColor = 'red';
            } else {
                counterDisplay.style.color = '#666';
                counterDisplay.style.fontWeight = 'normal';
                profSummaryInput.style.borderColor = '';
            }
        };

        profSummaryInput.addEventListener('input', updateSummaryCounter);
        profSummaryInput.addEventListener('paste', () => setTimeout(updateSummaryCounter, 10));

        updateSummaryCounter();
    }

    // Şəkil yükləmə (uploadBox2)
    if (uploadBox2 && fileInput2) {
        uploadBox2.addEventListener('click', () => fileInput2.click());

        fileInput2.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (preview2) {
                        preview2.src = event.target.result;
                        preview2.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 2. FOTO SEÇMƏ VƏ ZOOM
    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (imagePreview) {
                    imagePreview.src = event.target.result;
                    imagePreview.style.display = 'block';
                }
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    zoomRange?.addEventListener('input', () => {
        const scale = zoomRange.value / 20;
        if (imagePreview) {
            imagePreview.style.transform = `scale(${scale})`;
            if (zoomPercent) zoomPercent.textContent = Math.round(scale * 100) + '%';
        }
    });

    // 3. FINALIZE 
    const finalizePhoto = () => {
        if (!imagePreview) return;
        const currentSrc = imagePreview.src;

        if (currentSrc && currentSrc.includes('data:image')) {
            const preview2 = document.getElementById('preview2');
            if (preview2) {
                preview2.src = currentSrc;
            }
            const iconDiv = document.querySelector('#openPhotoBtn .icon');
            if (iconDiv) {
                iconDiv.innerHTML = `<img src="${currentSrc}" style="width: 40px; height: 40px; object-fit: cover; border: 1px solid #ccc;">`;
            }
            if (photoModal) {
                photoModal.style.display = 'none';
                photoModal.classList.remove('active');
            }
            document.body.style.backgroundImage = "";
        } else {
            alert("Lütfən şəkil seçin!");
        }
    };

    // 4. EVENT LISTENER-LƏR
    openPhotoBtn?.addEventListener('click', () => {
        if (photoModal) {
            photoModal.style.display = 'flex';
            photoModal.classList.add('active');
        }
        document.body.style.backgroundImage = "url('img/ResumeTemplates/bacground2.PNG')";
    });

    photoInput?.addEventListener('change', handlePhotoSelect);
    uploadPlaceholder?.addEventListener('click', () => photoInput.click());
    changePhotoBtn?.addEventListener('click', () => photoInput.click());

    savePhotoBtn?.addEventListener('click', finalizePhoto);
    confirmBtn?.addEventListener('click', finalizePhoto);

    photoModal?.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
            document.body.style.backgroundImage = "";
        }
    });

    // QR Elementləri
    const qrCodeModal = document.getElementById('qrModal');
    const qrCodeOpenBtn = document.getElementById('openQrBoxBtn');
    const qrCodeConfirmBtn = document.getElementById('confirmQrBtn');
    const qrCodeRemoveBtn = document.getElementById('removeQrBtn');
    const qrIconPlaceholder = document.getElementById('qr-icon-placeholder');
    const uploadQrBtn = document.getElementById('uploadQrBtn');

    const generateQRCode = (content) => {
        const cvContainer = document.getElementById('qr-cv-display');
        if (cvContainer) {
            cvContainer.innerHTML = "";
            new QRCode(cvContainer, {
                text: content,
                width: 50,
                height: 50,
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        if (qrIconPlaceholder) {
            qrIconPlaceholder.innerHTML = "";
            new QRCode(qrIconPlaceholder, {
                text: content,
                width: 35,
                height: 35
            });

            const pTag = qrCodeOpenBtn?.querySelector('p');
            if (pTag) pTag.textContent = "Edit QR Data";
        }

        const modalDisplay = document.getElementById('qr-modal-display');
        if (modalDisplay) {
            modalDisplay.innerHTML = "";
            new QRCode(modalDisplay, {
                text: content,
                width: 50,
                height: 50
            });
        }
    };

    const handleQRUpdate = () => {
        const userInput = document.getElementById('qrInput')?.value || "https://makecv.pro";
        generateQRCode(userInput);

        if (qrCodeModal) {
            qrCodeModal.classList.remove('active');
            qrCodeModal.style.display = 'none';
            document.body.style.backgroundImage = "";
        }
    };

    if (qrCodeOpenBtn) {
        qrCodeOpenBtn.addEventListener('click', () => {
            if (qrCodeModal) {
                qrCodeModal.classList.add('active');
                qrCodeModal.style.display = 'flex';
                document.body.style.backgroundImage = "url('img/ResumeTemplates/bacground2.PNG')";
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundAttachment = "fixed";
            }
        });
    }

    if (qrCodeConfirmBtn) qrCodeConfirmBtn.addEventListener('click', handleQRUpdate);

    if (qrCodeRemoveBtn) {
        qrCodeRemoveBtn.addEventListener('click', () => {
            const cvDisp = document.getElementById('qr-cv-display');
            if (cvDisp) cvDisp.innerHTML = "";
            if (qrIconPlaceholder) qrIconPlaceholder.innerHTML = "🔳";
            if (qrCodeOpenBtn) {
                const pTag = qrCodeOpenBtn.querySelector('p');
                if (pTag) pTag.textContent = "Add QR Data";
            }
            const modalDisplay = document.getElementById('qr-modal-display');
            if (modalDisplay) modalDisplay.innerHTML = "";
            const qrInput = document.getElementById('qrInput');
            if (qrInput) qrInput.value = "";
            if (qrCodeModal) {
                qrCodeModal.style.display = 'none';
                document.body.style.backgroundImage = "";
            }
        });
    }

    const qrFileInput = document.createElement('input');
    qrFileInput.type = 'file';
    qrFileInput.style.display = 'none';
    qrFileInput.accept = 'image/*';
    document.body.appendChild(qrFileInput);

    if (uploadQrBtn) {
        uploadQrBtn.addEventListener('click', () => {
            qrFileInput.click();
        });

        qrFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;

                    const containers = ['qr-cv-display', 'qr-icon-placeholder', 'qr-modal-display'];
                    containers.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) {
                            const size = (id === 'qr-icon-placeholder') ? '35px' : '50px';
                            el.innerHTML = `<img src="${imageUrl}" style="width: ${size}; height: ${size}; object-fit: cover; display: block;">`;
                        }
                    });

                    const pTag = qrCodeOpenBtn?.querySelector('p');
                    if (pTag) pTag.textContent = "Edit QR Data";

                    if (qrCodeModal) {
                        qrCodeModal.style.display = 'none';
                        document.body.style.backgroundImage = "";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const createPreviewLi = (parentElement) => {
        if (!parentElement) return null;
        const li = document.createElement('li');
        li.style.marginBottom = "10px";
        parentElement.appendChild(li);
        return li;
    };

    // --- 1. İŞ TƏCRÜBƏSİ ---
  const addExperienceBlock = () => {
    const experienceList = document.getElementById('experienceList');
    const addBtn = document.getElementById('addExperienceBtn');
    
    const currentCount = experienceList.querySelectorAll('.experience-block').length;
    if (currentCount >= 3) return;

    const sendList = document.getElementById('sendList');
    if (!experienceList) return;

    const block = document.createElement('div');
    block.className = 'experience-block';
    block.innerHTML = `
        <button class="remove-btn" type="button">×</button>
        <div class="input-row">
            <div class="input-with-icon"><input type="text" placeholder="Job Title" data-type="title"></div>
            <div style="display: flex; flex-direction: column; flex: 1; gap: 5px;">
                <div style="display: flex; gap: 5px;">
                    <input type="date" data-type="start" style="width: 48%;">
                    <input type="date" data-type="end" style="width: 48%;">
                    <label style="font-size: 10px; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" data-type="current"> Still working here
                    </label>
                </div>
            </div>
        </div>
        <div class="input-row">
            <div class="input-with-icon"><input type="text" placeholder="Company Name" data-type="company"></div>
            <div class="input-with-icon"><input type="text" placeholder="Location" data-type="loc"></div>
        </div>
        <textarea placeholder="Key Responsibilities..." data-type="desc"></textarea>`;

    experienceList.appendChild(block);

    if (experienceList.querySelectorAll('.experience-block').length >= 3) {
        addBtn.style.display = 'none';
    }

    const previewLi = createPreviewLi(sendList);

    const updatePreview = () => {
        if (!previewLi) return;
        const title = block.querySelector('[data-type="title"]').value || 'Job Title';
        const company = block.querySelector('[data-type="company"]').value || 'Company';
        const start = block.querySelector('[data-type="start"]').value || 'Start';
        const endInput = block.querySelector('[data-type="end"]');
        const isCurrent = block.querySelector('[data-type="current"]').checked;
        const loc = block.querySelector('[data-type="loc"]').value || '';
        const desc = block.querySelector('[data-type="desc"]').value || '';

        endInput.disabled = isCurrent;
        const endValue = isCurrent ? "Present" : (endInput.value || "End");

        const points = desc.split('\n')
            .filter(item => item.trim() !== "")
            .map(item => `<li style="margin-left: 15px;">${item.trim()}</li>`)
            .join("");

        previewLi.innerHTML = `
            <div style="font-weight: bold; font-size: 11px;">${title}</div>
            <div style="font-size: 9px; color: #555;">${company}${loc ? ', ' + loc : ''} | ${start} - ${endValue}</div>
            <ul style="margin: 0; padding: 0; font-size: 9px;">${points}</ul>`;
    };

    block.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreview));

    block.querySelector('.remove-btn').addEventListener('click', () => {
        block.remove();
        previewLi?.remove();
        addBtn.style.display = ''; 
    });
};

addExperienceBtn?.addEventListener('click', addExperienceBlock);

    // --- 2. TƏHSİL ---
   const addEducationBlock = () => {
    const educationList = document.getElementById('educationList');
    const sendList1 = document.getElementById('sendList1');
    if (!educationList) return;

    // 1. Limit yoxlanışı: Əgər artıq 2 və ya daha çoxdursa, əlavə etmə
    const currentCount = educationList.querySelectorAll('.experience-block').length;
    if (currentCount >= 2) return;

    const block = document.createElement('div');
    block.className = 'experience-block';
    block.innerHTML = `
        <button class="remove-btn" type="button">×</button>
        <div class="input-row">
            <input type="text" placeholder="Degree/ Major" data-type="degree">
            <div style="display: flex; flex-direction: column; flex: 1; gap: 5px;">
                <div style="display: flex; gap: 5px;">
                    <input type="date" data-type="edu-start" style="width: 48%;">
                    <input type="date" data-type="edu-end" style="width: 48%;">
                    <label style="font-size: 10px; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" data-type="edu-current"> Still studying here
                    </label> 
                </div>
            </div>
        </div>
        <div class="input-row">
            <input type="text" placeholder="University/ School" data-type="uni">
        </div>`;

    educationList.appendChild(block);

    // 2. Əlavə edildikdən sonra yoxla: Əgər 2-yə çatıbsa düyməni gizlət
    if (educationList.querySelectorAll('.experience-block').length >= 2) {
        addEducationBtn.style.display = 'none';
    }

    const previewLi = createPreviewLi(sendList1);

    const updatePreview = () => {
        if (!previewLi) return;
        const degree = block.querySelector('[data-type="degree"]').value || 'Degree';
        const uni = block.querySelector('[data-type="uni"]').value || 'University';
        const start = block.querySelector('[data-type="edu-start"]').value || 'Start';
        const endInput = block.querySelector('[data-type="edu-end"]');
        const isCurrent = block.querySelector('[data-type="edu-current"]').checked;

        endInput.disabled = isCurrent;
        const endValue = isCurrent ? "Present" : (endInput.value || "End");

        previewLi.innerHTML = `
            <div style="font-weight: bold; font-size: 11px;">${degree}</div>
            <div style="font-size: 9px;">${uni} | ${start} - ${endValue}</div>`;
    };

    block.querySelectorAll('input').forEach(el => el.addEventListener('input', updatePreview));
    
    // 3. Silmə düyməsinə basdıqda düyməni geri gətir
    block.querySelector('.remove-btn').addEventListener('click', () => { 
        block.remove(); 
        previewLi?.remove();
        addEducationBtn.style.display = ''; 
    });
};
    const createCertRow = () => {
        if (!certList) return;
        const div = document.createElement('div');
        div.className = 'step5-input-row';
        div.innerHTML = `
            <div class="step5-input-wrapper">
                <span class="step5-star">★</span>
                <input type="text" placeholder="Add Certificate or Award">
            </div>
            <button class="step5-remove-btn" type="button">×</button>`;
        certList.appendChild(div);
        div.querySelector('.step5-remove-btn').addEventListener('click', () => div.remove());
    };

    // --- 3. DİLLƏR ---
    const proficiencyBox = document.querySelector('.step5-proficiency-box');
    let lastFocusedInput = null;

    const updateLangPreview = () => {
        const langPreviewUl = document.getElementById('itemListLanguage_right1');
        if (!langPreviewUl || !langList) return;

        langPreviewUl.innerHTML = "";

        const rows = langList.querySelectorAll('.step5-input-row');
        rows.forEach(row => {
            const input = row.querySelector('input');
            const langName = input ? input.value.trim() : "";
            const level = input ? (input.dataset.level || "") : "";

            if (langName) {
                const li = document.createElement('li');
                li.style.listStyle = "none";
                li.style.marginBottom = "3px";
                li.style.fontSize = "8px";
                li.innerHTML = `<strong>${langName}</strong> ${level ? ' — ' + level : ''}`;
                langPreviewUl.appendChild(li);
            }
        });
    };

    const createLangRow = () => {
        if (!langList) return;
        if (proficiencyBox) proficiencyBox.classList.remove('show');

        const div = document.createElement('div');
        div.className = 'step5-input-row';
        div.innerHTML = `
            <div class="step5-input-wrapper">
                <span class="step5-star">★</span>
                <input type="text" placeholder="Language (e.g., English)" data-level="">
            </div>
            <button class="step5-remove-btn" type="button">×</button>`;

        langList.appendChild(div);
        const input = div.querySelector('input');

        input.addEventListener('focus', () => {
            lastFocusedInput = input;
            if (proficiencyBox) proficiencyBox.classList.add('show');

            const currentLevel = input.dataset.level || "";
            document.querySelectorAll('.step5-level-chip').forEach(btn => {
                btn.classList.toggle('active', btn.textContent === currentLevel);
            });
        });

        input.addEventListener('input', updateLangPreview);

        div.querySelector('.step5-remove-btn').addEventListener('click', () => {
            if (lastFocusedInput === input) {
                lastFocusedInput = null;
                if (proficiencyBox) proficiencyBox.classList.remove('show');
            }
            div.remove();
            updateLangPreview();
        });
    };

    document.querySelectorAll('.step5-level-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!lastFocusedInput) {
                alert("Please select a language field first!");
                return;
            }
            document.querySelectorAll('.step5-level-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            lastFocusedInput.dataset.level = e.target.textContent;
            updateLangPreview();
        });
    });

    document.getElementById('step5-addLanguageBtn')?.addEventListener('click', createLangRow);

    // --- 4. STEP KEÇİDLƏRİ ---
    backToStep2Btn?.addEventListener('click', () => {
        step3Container.classList.add('hidden');
        step3Container.style.display = 'none';
        mainForm.classList.remove('hidden');
        mainForm.style.display = 'block';
    });

    toStep3Btn?.addEventListener('click', () => {
        mainForm.classList.add('hidden');
        if (step3Container) {
            step3Container.classList.remove('hidden');
            step3Container.style.display = 'block';
        }
        if (experienceList && experienceList.children.length === 0) addExperienceBlock();
    });

    toStep4Btn?.addEventListener('click', () => {
        step3Container.classList.add('hidden');
        step3Container.style.display = 'none';
        if (step4Container) {
            step4Container.classList.remove('hidden');
            step4Container.style.display = 'block';
        }
        if (educationList && educationList.children.length === 0) addEducationBlock();
    });

    toStep5Btn?.addEventListener('click', () => {
        step4Container.classList.add('hidden');
        step4Container.style.display = 'none';
        if (step5Container) {
            step5Container.classList.remove('hidden');
            step5Container.style.display = 'block';
        }
        if (certList && certList.children.length === 0) { for (let i = 0; i < 3; i++) createCertRow(); }
        if (langList && langList.children.length === 0) createLangRow();
    });

    backToStep3Btn?.addEventListener('click', () => {
        step4Container.classList.add('hidden');
        step4Container.style.display = 'none';
        step3Container.classList.remove('hidden');
        step3Container.style.display = 'block';
    });

    backToStep4Btn?.addEventListener('click', () => {
        step5Container.classList.add('hidden');
        step5Container.style.display = 'none';
        step4Container.classList.remove('hidden');
        step4Container.style.display = 'block';
    });

    addExperienceBtn?.addEventListener('click', addExperienceBlock);
    addEducationBtn?.addEventListener('click', addEducationBlock);
    addCertBtn?.addEventListener('click', createCertRow);
    addLangBtn?.addEventListener('click', createLangRow);

    // --- 5. DELEGATION ---
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('step5-level-chip')) {
            const container = e.target.parentElement;
            container.querySelectorAll('.step5-level-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
        }
        if (e.target.classList.contains('step5-tag') || e.target.classList.contains('tag')) {
            if (skillsInput) {
                const val = e.target.innerText;
                skillsInput.value = skillsInput.value ? `${skillsInput.value}, ${val}` : val;
            }
        }
    });

    // --- 6. FINISH CV & PDF ---
    const handleFinishCV = () => {
        const cvPreview = document.querySelector('.section_right');
        const step5 = document.getElementById('step5');

        cvPreview?.classList.add('active');
        step5?.classList.add('hidden');
        if (step5) step5.style.display = 'none';

        const safeSet = (id, targetId, isValue = true) => {
            const el = document.getElementById(id);
            const target = document.getElementById(targetId);
            if (el && target) isValue ? target.value = el.value : target.textContent = el.value;
        };

        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const fullName = `${firstName} ${lastName}`.trim();

        const nameToCV = document.getElementById('nameToCV');
        if (nameToCV) nameToCV.value = fullName;

        safeSet('phoneNumber', 'phoneR');
        safeSet('emailAddress', 'emailR');
        safeSet('locationCity', 'adressR');
        safeSet('profSummary', 'autoTextarea');
        safeSet('linkedinProfile', 'linkedinR');

        const adjustAutoTextareaHeight = (element) => {
            if (!element) return;
            element.style.height = 'auto';
            const scHeight = element.scrollHeight;
            element.style.height = `${Math.max(scHeight, 100)}px`;
        };
        const txtArea = document.getElementById('autoTextarea');
        if (txtArea) {
            txtArea.addEventListener('input', (e) => adjustAutoTextareaHeight(e.target));
            adjustAutoTextareaHeight(txtArea);
        }

        // Sertifikatlar
        const certInputContainer = document.getElementById('step5-certificateList');
        const cvCertList = document.getElementById('itemListCertificate_right1');
        const certSection = document.getElementById('certificate');

        if (certInputContainer && cvCertList) {
            const certInputs = certInputContainer.querySelectorAll('input');
            let certHtml = '';

            certInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    certHtml += `<li>${input.value.trim()}</li>`;
                }
            });

            cvCertList.innerHTML = certHtml;

            if (certHtml === '') {
                if (certSection) certSection.style.display = 'none';
            } else {
                if (certSection) certSection.style.display = 'block';
            }
        }

        // Skills
        const skillsVal = skillsInput?.value;
        const cvSkillList = document.getElementById('entry_list');
        if (cvSkillList && skillsVal) {
            cvSkillList.innerHTML = skillsVal.split(',')
                .map(s => s.trim() ? `<li>${s.trim()}</li>` : '')
                .join('');
        }

        cvPreview?.scrollIntoView({ behavior: 'smooth' });
    };

    document.getElementById('finishBtn')?.addEventListener('click', handleFinishCV);

    // --- PDF YÜKLƏMƏ ---
    const downloadCVAsPDF = () => {
        const element = document.querySelector(".section_right_top");
        const rightSide2 = document.querySelector('.section_right_side_2');
        if (rightSide2) rightSide2.style.height = 'auto';

        const opt = {
            margin: 0,
            filename: `CV_Export_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            html2canvas: {
                scale: 3,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const clonedCounter = clonedDoc.getElementById('js-profSummary-counter');
                    if (clonedCounter) {
                        clonedCounter.remove();
                    }

                    const clonedTAs = clonedDoc.querySelectorAll('.outputArea');
                    clonedTAs.forEach(ta => {
                        const div = clonedDoc.createElement('div');
                        div.className = ta.className;
                        div.style.cssText = window.getComputedStyle(ta).cssText;
                        div.style.height = 'auto';
                        div.style.display = 'block';
                        div.style.overflow = 'visible';
                        div.style.whiteSpace = 'pre-wrap';
                        div.style.wordBreak = 'break-word';
                        div.innerText = ta.value;
                        if (ta.parentNode) ta.parentNode.replaceChild(div, ta);
                    });

                    const cvBase = clonedDoc.querySelector(".section_right_top");
                    if (cvBase) {
                        cvBase.style.height = 'auto';
                        cvBase.style.minHeight = '297mm';
                        cvBase.style.display = 'flex';
                        cvBase.style.flexDirection = 'row';
                    }

                    const columns = clonedDoc.querySelectorAll('.section_right_l_side, .section_right_r_side');
                    columns.forEach(col => {
                        col.style.height = 'auto';
                        col.style.minHeight = '297mm';
                        col.style.flex = "1";
                    });
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            if (rightSide2) rightSide2.style.height = "";
        });
    };

    document.getElementById("download-pdf")?.addEventListener("click", downloadCVAsPDF);
});