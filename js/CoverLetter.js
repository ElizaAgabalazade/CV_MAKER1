// PDF.js worker tənzimləməsi
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

window.lastSelectedFile = null;
window.lastExtractedText = "";

// --- 1. KÖMƏKÇİ FUNKSİYALAR ---

const adjustOverallHeight = () => {
    const editors = document.querySelectorAll('.cv-editor');
    editors.forEach(textarea => {
        if (textarea) {
            textarea.style.height = 'auto';
            const scHeight = textarea.scrollHeight;
            const newHeight = Math.max(scHeight, 150);
            textarea.style.height = newHeight + 'px';
        }
    });
};

const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(" ");
        }
        return fullText;
    } catch (err) {
        console.error("PDF extraction error:", err);
        throw err;
    }
};




const fillDataFromText = (text) => {
    if (!text) return;

    // KÖHNƏ PROBLEMİN HƏLLİ: Sətirləri təmiz ayırmaq üçün əvvəlcə mətni təmizləyirik
    // Çoxlu boşluqları tək boşluğa salırıq, lakin sətir sonlarını qoruyuruq
    const lines = text
        .split(/[\r\n]+/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // E-mail tapılması (Daha dəqiq regex)
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";

    // Telefon nömrəsi tapılması
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{2,3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
    const phone = phoneMatch ? phoneMatch[0] : "";

    // LinkedIn profili tapılması
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_\/\p{L}]+/u);
    const linkedin = linkedinMatch ? linkedinMatch[0] : "";
    let name = "";

    // Ad olmayan sözlər
    const blacklist = [
        "university",
        "faculty",
        "education",
        "experience",
        "certificate",
        "certification",
        "academy",
        "school",
        "department",
        "bachelor",
        "master",
        "engineer",
        "developer",
        "manager",
        "specialist",
        "resume",
        "cv",
        "curriculum",
        "vitae",
        "email",
        "phone",
        "contact",
        "linkedin",
        "address",
        "skills",
        "projects",
        "summary",
        "profile"
    ];

    // İlk 10 sətri yoxlayırıq
    for (let i = 0; i < Math.min(lines.length, 10); i++) {

        let currentLine = lines[i]
            .replace(/\s+/g, ' ')
            .trim();

        // rəqəm varsa keç
        if (/\d/.test(currentLine)) continue;

        // çox qısa və uzun sətrləri keç
        if (currentLine.length < 5 || currentLine.length > 30) continue;

        const lowerLine = currentLine.toLowerCase();

        // blacklist varsa keç
        if (blacklist.some(word => lowerLine.includes(word))) {
            continue;
        }

        const words = currentLine.split(/\s+/);

        // yalnız 2 və ya 3 söz
        if (words.length < 2 || words.length > 3) {
            continue;
        }

        // hər söz böyük hərflə başlamalıdır
        const isValidName = words.every(word =>
            /^[A-ZƏÖĞÜŞÇİ][a-zəöğüşçı'-]+$/u.test(word)
        );

        if (isValidName) {
            name = words.join(' ');
            break;
        }
    }

    // fallback
    if (!name) {

        const possibleName = text.match(
            /\b[A-ZƏÖĞÜŞÇİ][a-zəöğüşçı'-]+\s+[A-ZƏÖĞÜŞÇİ][a-zəöğüşçı'-]+\b/u
        );

        if (possibleName) {
            name = possibleName[0];
        }
    }

    if (!name) {
        for (let i = 0; i < Math.min(lines.length, 3); i++) {
            if (!/\d/.test(lines[i]) && lines[i].length > 5 && lines[i].length < 30) {
                name = lines[i].toUpperCase();
                break;
            }
        }
    }

    // ÜNVANIN (LOCATION) TAPILMASI STRATEGİYASI:
    let location = "";
    const locationMatch = text.match(/(?:Bakı|Baku|Gəncə|Sumqayıt|Azerbaijan|Azərbaycan|City|District|Str\.)[^,\n]*/i);
    if (locationMatch) {
        location = locationMatch[0];
    } else {
        const generalLocMatch = text.match(/[A-Z][a-z\u0400-\u04FF]+(?:\s+[A-Z][a-z\u0400-\u04FF]+)*,\s*[A-Z][a-z\u0400-\u04FF]+/);
        location = generalLocMatch ? generalLocMatch[0] : "";
    }

    const data = {
        email: email,
        phone: phone,
        linkedin: linkedin,
        name: name,
        location: location,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    console.log("Düzəldilmiş Struktur Məlumatları:", data);

    // --- ELEMENTLƏRİ DOLDURMA HİSSƏSİ ---
    document.querySelectorAll('.date').forEach(el => el.value = data.date);

    document.querySelectorAll('textarea, input').forEach(el => {
        const cls = el.className;

        if (cls.includes('cv-editor') || cls.includes('overall') || el.classList.contains('corporate-overall') || el.classList.contains('elegant-overall') || el.classList.contains('modern-overall') || el.classList.contains('minimalist-overall')) {
            return;
        }

        if (cls.includes('email') && data.email) {
            if (el.value.length > 30 && !el.value.includes('@')) return;
            el.value = data.email;
        }

        if (cls.includes('phone') && data.phone) {
            if (el.value.length > 25) return;
            el.value = data.phone;
        }

        if (cls.includes('address') && data.location) {
            if (el.value.length > 50) return;
            el.value = data.location;
        }

        if ((cls.includes('linkedn') || cls.includes('linkedin')) && data.linkedin) {
            el.value = data.linkedin;
        }

        // Ad doldurma (Burada xüsusi yoxlama: əgər mövcud dəyər addan uzundursa toxunmuruq)
        if (cls.includes('name1') && !cls.includes('subject') && data.name) {
            el.value = data.name;
        }
    });

    // Subject (Mövzu) sahələri
    document.querySelectorAll('textarea').forEach(el => {
        const cls = el.className;
        if (cls.includes('subject') && (cls.includes('name1') || cls.includes('address'))) {
            if (data.name) {
                el.value = `${data.name}\n${data.location || ""}`;
            }
        }
    });

    // Alt kontaktlar
    const defaultContacts = document.querySelectorAll('.bottom-contact-item');
    if (defaultContacts.length >= 4) {
        if (defaultContacts[0] && data.email) defaultContacts[0].value = data.email;
        if (defaultContacts[1] && data.phone) defaultContacts[1].value = data.phone;
        if (defaultContacts[2] && data.location) defaultContacts[2].value = data.location;
        if (defaultContacts[3] && data.linkedin) defaultContacts[3].value = data.linkedin;
    }
};

// --- 2. CV SEÇİMİ (Lokal Fayl) ---
const handleCvSelection = async (file) => {
    const modal = document.getElementById('upload-modal');
    const section2 = document.getElementById('section_2');

    try {
        window.lastSelectedFile = file;
        const text = await extractTextFromPDF(file);
        window.lastExtractedText = text;
        fillDataFromText(text);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://api.makecv.pro:5001/api/Cv/upload-your-cv', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            console.log("CV successfully uploaded.");
            const uploadBtn = document.getElementById('upload-cv-btn');
            if (uploadBtn) {
                uploadBtn.style.background = '#28a745';
                uploadBtn.style.color = '#fff';
                uploadBtn.innerHTML = '✓ CV Uploaded';
            }
            if (modal) modal.style.display = 'none';
            if (section2) section2.style.display = 'block';
        }
    } catch (err) {
        console.error("Selection Error:", err);
    }
};

// --- 3. SERVERDƏKİ CV-LƏR ---
const selectServerCV = async (cvId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://api.makecv.pro:5001/api/Cv/get-content/${cvId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        const textContent = data.extractedText || data.content || "";
        window.lastExtractedText = textContent;
        window.lastSelectedFile = "SERVER_CV";

        fillDataFromText(textContent);

        if (document.getElementById('upload-modal')) document.getElementById('upload-modal').style.display = 'none';
        if (document.getElementById('section_2')) document.getElementById('section_2').style.display = 'block';
    } catch (err) {
        console.error("Fetch Error:", err);
    }
};

const loadSavedCVs = async () => {
    const cvListUl = document.getElementById('cv-list');
    if (!cvListUl) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('https://api.makecv.pro:5001/api/Cv/my-cvs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("CV loading failed with status:", response.status);
            return;
        }

        const savedCVs = await response.json();
        cvListUl.innerHTML = "";
        savedCVs.forEach(cv => {
            const li = document.createElement('li');
            li.className = 'cv-card-wrapper';
            li.innerHTML = `
                <div class="cv-card-main" onclick="selectServerCV('${cv.id}')">
                    <div class="cv-pdf-icon">PDF</div>
                    <div class="cv-details">
                        <span class="cv-name">${cv.fileName || cv.name}</span>
                    </div>
                </div>`;
            cvListUl.appendChild(li);
        });
    } catch (err) {
        console.log("Error loading saved CVs:", err);
    }
};

// --- 4. ƏSAS DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-cv-btn');
    const modal = document.getElementById('upload-modal');
    const section2 = document.getElementById('section_2');
    const closeModal = document.querySelector('.close-modal');
    const fileInput = document.getElementById('file-input');
    const generateBtn = document.getElementById('generate-btn');
    const jobTextarea = document.getElementById('job-description');

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.style.display = 'block';
            if (section2) section2.style.display = 'none';
        });
    }

    if (closeModal) {
        closeModal.onclick = () => {
            if (modal) modal.style.display = 'none';
            if (section2) section2.style.display = 'block';
        };
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleCvSelection(file);
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const jobDesc = jobTextarea ? jobTextarea.value.trim() : "";

            generateBtn.disabled = true;
            generateBtn.innerHTML = "Generating...";

            try {
                const response = await fetch('https://api.makecv.pro:5001/api/CoverLetter/cover-letter-with-job-desc-cv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ jobDescription: jobDesc })
                });

                if (response.ok) {
                    const data = await response.json();
                    let coverLetterText = data.coverLetter || "";

                    const fullName = localStorage.getItem('user_fullname') || "";
                    if (fullName && coverLetterText.includes("[Your Name]")) {
                        coverLetterText = coverLetterText.replaceAll("[Your Name]", fullName);
                    }

                    document.querySelectorAll('.cv-editor').forEach(editor => {
                        editor.value = coverLetterText;
                    });

                    setTimeout(adjustOverallHeight, 100);

                    const section12 = document.querySelector('.section_1_2');
                    const designContainer = document.getElementById('design-container');

                    if (section12) section12.style.display = 'none';
                    if (designContainer) designContainer.style.display = 'block';

                } else {
                    alert("Server error. Failed to generate.");
                }
            } catch (err) {
                console.error("Generation Error:", err);
                alert("Error during generation.");
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = "Generate";
            }
        });
    }

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('cv-editor')) {
            adjustOverallHeight();
        }
    });

    // DİZAYN DƏYİŞDİRMƏ
    const changeBtn = document.getElementById('change-design');
    const container = document.getElementById('design-container');
    const themes = [
        'theme-default', 'theme-modern', 'theme-elegant',
        'theme-corporate', 'theme-minimalist', 'theme-corporate-alt',
        'theme-modern-side', 'theme-luxury-side'
    ];
    let currentIdx = 0;

    if (changeBtn && container) {
        changeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.classList.remove(themes[currentIdx]);
            currentIdx = (currentIdx + 1) % themes.length;
            container.classList.add(themes[currentIdx]);
            setTimeout(adjustOverallHeight, 50);
        });
    }

    // DOWNLOAD (PRİNT) LOGİKASI
    // DOWNLOAD (PRİNT) LOGİKASI - ABSOLYUT HƏLL
    const downloadCLBtn = document.getElementById("downloadCoverLetter");
    if (downloadCLBtn) {
        downloadCLBtn.addEventListener('click', () => {
            if (typeof adjustOverallHeight === "function") {
                adjustOverallHeight();
            }

            const container = document.getElementById("design-container");
            if (!container) return;

            // Bütün mövzu bloklarının selektorları
            const allBlocksSelectors = [
                '.default-theme-block', '.modern-theme-block', '.elegant-theme-block',
                '.corporate-theme-block', '.minimalist-theme-block', '.corporate-alt-theme-block',
                '.modern-side-theme-block', '.luxury-side-theme-block'
            ];

            const themeBlocks = container.querySelectorAll(allBlocksSelectors.join(','));
            let activeBlock = null;

            // 1. Aktiv (görünən) bloku tapırıq
            themeBlocks.forEach(block => {
                if (block.offsetHeight > 0 || block.getBoundingClientRect().height > 0) {
                    activeBlock = block;
                }
            });

            if (!activeBlock && themeBlocks.length > 0) {
                activeBlock = themeBlocks[0];
            }

            if (!activeBlock) {
                console.error("Aktiv dizayn bloku tapılmadı.");
                return;
            }

            // 2. Aktiv blok daxilindəki input/textarea-ları div-ə çeviririk (Mətni qorumaq üçün)
            const targetedInputs = activeBlock.querySelectorAll('textarea, input, div.cv-editor');
            const savedStates = [];

            targetedInputs.forEach((textarea) => {
                if (textarea.tagName.toLowerCase() === 'div' && !textarea.classList.contains('cv-editor')) return;
                if (textarea.style.display === 'none') return;

                const val = textarea.tagName.toLowerCase() === 'div' ? textarea.innerText : textarea.value;
                const displayStyle = textarea.style.display;
                const displayImportance = textarea.style.getPropertyPriority('display');

                const tempDiv = document.createElement('div');
                tempDiv.className = textarea.className + ' html2pdf-temp-div';
                tempDiv.innerText = val;

                const computedStyle = window.getComputedStyle(textarea);

                tempDiv.style.whiteSpace = 'pre-wrap';
                tempDiv.style.wordBreak = 'break-word';
                tempDiv.style.width = '100%';
                tempDiv.style.minHeight = textarea.offsetHeight + 'px';
                tempDiv.style.fontFamily = computedStyle.fontFamily;
                tempDiv.style.fontSize = computedStyle.fontSize;
                tempDiv.style.color = computedStyle.color;
                tempDiv.style.lineHeight = computedStyle.lineHeight;
                tempDiv.style.fontWeight = computedStyle.fontWeight;
                tempDiv.style.padding = computedStyle.padding;
                tempDiv.style.margin = computedStyle.margin;
                tempDiv.style.textAlign = computedStyle.textAlign;

                textarea.style.setProperty('display', 'none', 'important');
                textarea.parentNode.insertBefore(tempDiv, textarea.nextSibling);

                savedStates.push({ textarea, tempDiv, displayStyle, displayImportance });
            });

            // 3. AKTİV OLMAYAN BLOKLARI MÜVƏQQƏTİ SİLİRİK (Ağ səhifə xətasının qarşısını alan əsas hissə)
            const removedBlocksInfo = [];
            themeBlocks.forEach(block => {
                if (block !== activeBlock) {
                    removedBlocksInfo.push({
                        parent: block.parentNode,
                        nextSibling: block.nextSibling,
                        element: block
                    });
                    block.remove(); // DOM-dan tamamilə çıxarırıq ki html2pdf onu görməsin
                }
            });

            // 4. html2pdf tənzimləmələri
            const options = {
                margin: 0,
                filename: 'Cover_Letter.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    scrollY: 0,
                    scrollX: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Hər şeyi ilkin vəziyyətinə qaytaran bərpa funksiyası
            const restoreAllStates = () => {
                // Silinmiş blokları dəqiq öz yerlərinə qaytarırıq
                removedBlocksInfo.forEach(({ parent, nextSibling, element }) => {
                    if (parent) {
                        parent.insertBefore(element, nextSibling);
                    }
                });

                // Inputları/textarea-ları bərpa edirik
                savedStates.forEach(({ textarea, tempDiv, displayStyle, displayImportance }) => {
                    if (displayStyle) {
                        textarea.style.setProperty('display', displayStyle, displayImportance);
                    } else {
                        textarea.style.removeProperty('display');
                    }
                    if (tempDiv.parentNode) {
                        tempDiv.parentNode.removeChild(tempDiv);
                    }
                });
            };

            // Bütün strukturu saxlayan container-i göndəririk (artıq daxilində digər mövzular yoxdur!)
            html2pdf().set(options).from(container).save().then(() => {
                restoreAllStates();
                if (typeof loadSavedCVs === "function") {
                    loadSavedCVs();
                }
            }).catch(err => {
                restoreAllStates();
                console.error("PDF generation error:", err);
            });
        });
    }
});