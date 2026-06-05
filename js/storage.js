const saveToStorage = () => {
    const data = {};

    // Sadə input/textarea sahələri
    document.querySelectorAll('input, textarea').forEach(input => {
        if (input.id) {
            data[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        }
    });

    // Foto
    const preview2 = document.getElementById('preview2');
    if (preview2 && preview2.src && preview2.src.startsWith('data:image')) {
        data['preview2_src'] = preview2.src;
    }

    // Preview HTML-ləri (section_right_top üçün)
    data.sendListHTML  = document.getElementById('sendList')?.innerHTML                   || '';
    data.sendList1HTML = document.getElementById('sendList1')?.innerHTML                  || '';
    data.certListHTML  = document.getElementById('itemListCertificate_right1')?.innerHTML || '';
    data.langListHTML  = document.getElementById('itemListLanguage_right1')?.innerHTML    || '';
    data.skillListHTML = document.getElementById('entry_list')?.innerHTML                 || '';

    // İş təcrübəsi bloklarını ayrıca saxla
    const experienceBlocks = [];
    document.querySelectorAll('#experienceList .experience-block').forEach(block => {
        experienceBlocks.push({
            title   : block.querySelector('[data-type="title"]')?.value        || '',
            company : block.querySelector('[data-type="company"]')?.value      || '',
            start   : block.querySelector('[data-type="start"]')?.value        || '',
            end     : block.querySelector('[data-type="end"]')?.value          || '',
            current : block.querySelector('[data-type="current"]')?.checked    || false,
            loc     : block.querySelector('[data-type="loc"]')?.value          || '',
            desc    : block.querySelector('[data-type="desc"]')?.value         || '',
        });
    });
    data.experienceBlocks = experienceBlocks;

    // Təhsil bloklarını ayrıca saxla
    const educationBlocks = [];
    document.querySelectorAll('#educationList .experience-block').forEach(block => {
        educationBlocks.push({
            degree  : block.querySelector('[data-type="degree"]')?.value         || '',
            uni     : block.querySelector('[data-type="uni"]')?.value            || '',
            start   : block.querySelector('[data-type="edu-start"]')?.value      || '',
            end     : block.querySelector('[data-type="edu-end"]')?.value        || '',
            current : block.querySelector('[data-type="edu-current"]')?.checked  || false,
        });
    });
    data.educationBlocks = educationBlocks;

    // Sertifikat sıralarını ayrıca saxla
    const certificateRows = [];
    document.querySelectorAll('#step5-certificateList .step5-input-row input').forEach(input => {
        certificateRows.push(input.value || '');
    });
    data.certificateRows = certificateRows;

    // Dil sıralarını ayrıca saxla
    const languageRows = [];
    document.querySelectorAll('#step5-languageList .step5-input-row input').forEach(input => {
        languageRows.push({
            name  : input.value         || '',
            level : input.dataset.level || '',
        });
    });
    data.languageRows = languageRows;

    localStorage.setItem('userCVData', JSON.stringify(data));
};


const loadFromStorage = () => {
    const savedData = JSON.parse(localStorage.getItem('userCVData'));
    if (!savedData) return;

    // 1. Sadə input/textarea sahələri
    Object.keys(savedData).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = savedData[id];
            } else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
                el.value = savedData[id];
            }
        }
    });

    // 2. Foto
    const preview2 = document.getElementById('preview2');
    if (preview2 && savedData['preview2_src']) {
        preview2.src = savedData['preview2_src'];
        preview2.style.display = 'block';
    }

    // 3. Preview HTML-ləri (section_right_top-da görünən hissə)
    const htmlFields = {
        'sendList'                   : savedData.sendListHTML,
        'sendList1'                  : savedData.sendList1HTML,
        'itemListCertificate_right1' : savedData.certListHTML,
        'itemListLanguage_right1'    : savedData.langListHTML,
        'entry_list'                 : savedData.skillListHTML,
    };
    Object.entries(htmlFields).forEach(([id, html]) => {
        const el = document.getElementById(id);
        if (el && html) el.innerHTML = html;
    });

    const certSection = document.getElementById('certificate');
    if (certSection) {
        certSection.style.display = savedData.certListHTML ? 'block' : 'none';
    }

    // 4. İş təcrübəsi bloklarını yenidən qur
    if (Array.isArray(savedData.experienceBlocks)) {
        savedData.experienceBlocks.forEach(exp => {
            window.addExperienceBlock?.();
            const blocks = document.querySelectorAll('#experienceList .experience-block');
            const block  = blocks[blocks.length - 1];
            if (!block) return;

            block.querySelector('[data-type="title"]').value     = exp.title   || '';
            block.querySelector('[data-type="company"]').value   = exp.company || '';
            block.querySelector('[data-type="start"]').value     = exp.start   || '';
            block.querySelector('[data-type="end"]').value       = exp.end     || '';
            block.querySelector('[data-type="current"]').checked = exp.current || false;
            block.querySelector('[data-type="loc"]').value       = exp.loc     || '';
            block.querySelector('[data-type="desc"]').value      = exp.desc    || '';

            block.querySelectorAll('input, textarea')
                .forEach(el => el.dispatchEvent(new Event('input')));
        });
    }

    // 5. Təhsil bloklarını yenidən qur
    if (Array.isArray(savedData.educationBlocks)) {
        savedData.educationBlocks.forEach(edu => {
            window.addEducationBlock?.();
            const blocks = document.querySelectorAll('#educationList .experience-block');
            const block  = blocks[blocks.length - 1];
            if (!block) return;

            block.querySelector('[data-type="degree"]').value        = edu.degree  || '';
            block.querySelector('[data-type="uni"]').value           = edu.uni     || '';
            block.querySelector('[data-type="edu-start"]').value     = edu.start   || '';
            block.querySelector('[data-type="edu-end"]').value       = edu.end     || '';
            block.querySelector('[data-type="edu-current"]').checked = edu.current || false;

            block.querySelectorAll('input')
                .forEach(el => el.dispatchEvent(new Event('input')));
        });
    }

    // 6. Sertifikat sıralarını yenidən qur
    if (Array.isArray(savedData.certificateRows)) {
        savedData.certificateRows.forEach(cert => {
            window.createCertRow?.();
            const rows = document.querySelectorAll('#step5-certificateList .step5-input-row');
            const row  = rows[rows.length - 1];
            if (row) row.querySelector('input').value = cert || '';
        });
    }

    // 7. Dil sıralarını yenidən qur
    if (Array.isArray(savedData.languageRows)) {
        savedData.languageRows.forEach(lang => {
            window.createLangRow?.();
            const rows  = document.querySelectorAll('#step5-languageList .step5-input-row');
            const row   = rows[rows.length - 1];
            if (!row) return;
            const input = row.querySelector('input');
            input.value         = lang.name  || '';
            input.dataset.level = lang.level || '';
        });
        window.updateLangPreview?.();
    }

    // 8. autoTextarea hündürlüyü
    const txtArea = document.getElementById('autoTextarea');
    if (txtArea && txtArea.value) {
        txtArea.style.height = 'auto';
        txtArea.style.height = Math.max(txtArea.scrollHeight, 100) + 'px';
    }
};