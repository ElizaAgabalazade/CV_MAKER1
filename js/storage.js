let isLoading = false;
 
// Preview konteyner və sinxronizasiya map-i
const PREVIEW_CONTAINER = '.section_right_r_side';
 
const CLASS_MAP = {
    'autoTextarea' : '.outputArea',
    'phoneR'       : '.phoneR',
    'emailR'       : '.emailR',
    'adressR'      : '.adressR',
    'linkedinR'    : '.linkedinR',
    'nameToCV'     : '.input_h1',
};
 
// Bütün preview-ları sinxronlaşdır
const syncPreview = () => {
    const container = document.querySelector(PREVIEW_CONTAINER);
    if (!container) return;
 
    Object.entries(CLASS_MAP).forEach(([sourceId, targetClass]) => {
        const source = document.getElementById(sourceId);
        const target = container.querySelector(targetClass);
        if (source && target) target.value = source.value;
    });
};
 
 
const saveToStorage = () => {
    const data = {};
 
    document.querySelectorAll('input, textarea').forEach(input => {
        if (input.id) {
            data[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        }
    });
 
    const preview2 = document.getElementById('preview2');
    if (preview2 && preview2.src && preview2.src.startsWith('data:image')) {
        data['preview2_src'] = preview2.src;
    }
 
    // sendList və sendList1 HTML-ni artıq saxlamırıq —
    // onlar experience/education blokları rebuild olunanda özü yaranır.
    // certListHTML, langListHTML, skillListHTML isə saxlanılır.
    data.certListHTML  = document.getElementById('itemListCertificate_right1')?.innerHTML || '';
    data.langListHTML  = document.getElementById('itemListLanguage_right1')?.innerHTML    || '';
    data.skillListHTML = document.getElementById('entry_list')?.innerHTML                 || '';
 
    const experienceBlocks = [];
    document.querySelectorAll('#experienceList .experience-block').forEach(block => {
        experienceBlocks.push({
            title   : block.querySelector('[data-type="title"]')?.value     || '',
            company : block.querySelector('[data-type="company"]')?.value   || '',
            start   : block.querySelector('[data-type="start"]')?.value     || '',
            end     : block.querySelector('[data-type="end"]')?.value       || '',
            current : block.querySelector('[data-type="current"]')?.checked || false,
            loc     : block.querySelector('[data-type="loc"]')?.value       || '',
            desc    : block.querySelector('[data-type="desc"]')?.value      || '',
        });
    });
    data.experienceBlocks = experienceBlocks;
 
    const educationBlocks = [];
    document.querySelectorAll('#educationList .experience-block').forEach(block => {
        educationBlocks.push({
            degree  : block.querySelector('[data-type="degree"]')?.value        || '',
            uni     : block.querySelector('[data-type="uni"]')?.value           || '',
            start   : block.querySelector('[data-type="edu-start"]')?.value     || '',
            end     : block.querySelector('[data-type="edu-end"]')?.value       || '',
            current : block.querySelector('[data-type="edu-current"]')?.checked || false,
        });
    });
    data.educationBlocks = educationBlocks;
 
    const certificateRows = [];
    document.querySelectorAll('#step5-certificateList .step5-input-row input').forEach(input => {
        certificateRows.push(input.value || '');
    });
    data.certificateRows = certificateRows;
 
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
 
    isLoading = true;
 
    // Dinamik blokları əvvəlcə təmizlə
    const expList = document.getElementById('experienceList');
    if (expList) expList.querySelectorAll('.experience-block').forEach(b => b.remove());
 
    const eduList = document.getElementById('educationList');
    if (eduList) eduList.querySelectorAll('.experience-block').forEach(b => b.remove());
 
    const certList = document.getElementById('step5-certificateList');
    if (certList) certList.querySelectorAll('.step5-input-row').forEach(r => r.remove());
 
    const langList = document.getElementById('step5-languageList');
    if (langList) langList.querySelectorAll('.step5-input-row').forEach(r => r.remove());
 
    // sendList və sendList1-i də təmizlə —
    // experience/education blokları rebuild olunanda onlar yenidən doldurulacaq.
    const sendListEl = document.getElementById('sendList');
    if (sendListEl) sendListEl.innerHTML = '';
 
    const sendList1El = document.getElementById('sendList1');
    if (sendList1El) sendList1El.innerHTML = '';
 
    // 1. Sadə input/textarea sahələri
    const skipKeys = [
        'sendListHTML', 'sendList1HTML', 'certListHTML', 'langListHTML',
        'skillListHTML', 'preview2_src', 'experienceBlocks',
        'educationBlocks', 'certificateRows', 'languageRows'
    ];
 
    Object.keys(savedData).forEach(id => {
        if (skipKeys.includes(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') {
            el.checked = savedData[id];
        } else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.value = savedData[id];
        }
    });
 
    // 2. Foto
    const preview2 = document.getElementById('preview2');
    if (preview2 && savedData['preview2_src']) {
        preview2.src = savedData['preview2_src'];
        preview2.style.display = 'block';
    }
 
    // 3. Preview HTML-lər — sendList/sendList1 artıq buradan yüklənmir
    const htmlFields = {
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
    // addExperienceBlock() özü sendList-ə <li> əlavə edir və input eventlərini qoşur —
    // buna görə sendList-i əvvəlcə təmizlədik, indi sadəcə rebuild edirik.
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
 
            // input eventini atəşlə ki preview <li> doldurulsun
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
 
    isLoading = false;
 
    // 9. Bütün preview-ları sinxronlaşdır
    syncPreview();
};