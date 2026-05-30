document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elementləri ---
    const nextBtn = document.getElementById('next_procedure');
    const cancelBtn = document.getElementById('cancel_btn');
    const section1 = document.querySelector('.section_1');
    const section2 = document.querySelector('.section_2');
    const section3 = document.getElementById('section_3');
    const sectionBottom = document.querySelector('.section_bottom');

    const fileInput = document.querySelector('#file_input');
    const fileListContainer = document.querySelector('#file_list_container');
    const confirmBtn = document.querySelector('#confirm_btn');

    let selectedFile = null;

    // 1. DATA NORMALIZE / REGEX PARÇALAMA FUNKSİYASI
    const normalizeCVData = (cvData) => {
        const raw = (cvData.content || cvData.data?.content || "")
            .replace(/\r/g, "")
            .replace(/•/g, " ")
            .replace(/\t/g, " ")
            .trim();

        const text = raw.replace(/\s+/g, " ");
        const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
        const extract = (regex) => text.match(regex)?.[0] || "";

        const extractAll = (keywords) => {
            const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
            return lines.filter(line => {
                const lower = line.toLowerCase();
                return keywords.some(k => lower.includes(k)) &&
                    !lower.includes("@") &&
                    lower.length > 2;
            });
        };

        const email = extract(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phone = extract(/(\+994|0)[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/i);
        const linkedin = extract(/linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);

        let name = "";
        const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
        for (let l of lines.slice(0, 8)) {
            const lower = l.toLowerCase();
            if (
                !lower.includes("@") &&
                !lower.includes("linkedin") &&
                !/\d/.test(l) &&
                l.length < 40 &&
                l.split(" ").length <= 3 &&
                !lower.includes("developer") &&
                !lower.includes("engineer") &&
                !lower.includes("manager")
            ) {
                name = l;
                break;
            }
        }

        const aboutLines = lines.filter(l =>
            !l.includes("@") &&
            !l.includes("linkedin") &&
            !/\d{2,}/.test(l)
        );
        let about = aboutLines.slice(0, 3).join(" ");
        [email, phone, linkedin, name].forEach(v => {
            if (v) about = about.replace(v, "");
        });
        about = clean(about);

        const skills = extractAll(["skill", "java", "react", "node", "python"]);
        const experience = extractAll(["experience", "intern", "developer", "engineer", "company"]);
        const education = extractAll(["university", "college", "education", "bachelor", "master"]);
        const languages = extractAll(["english", "turkish", "russian", "azerbaijani"]);

        return {
            name: clean(name),
            email,
            phone,
            linkedin,
            address: "",
            about,
            skills,
            languages,
            experience,
            education,
            certificates: []
        };
    };

    // 2. FORM SAHƏLƏRİNİ DOLDURAN FUNKSİYA (executeCVParsing)
    const executeCVParsing = () => {
        const dataString = localStorage.getItem('parsedCvData');
        if (!dataString) return;

        const cvData = JSON.parse(dataString);

        const updateField = (id, val) => {
            const el = document.getElementById(id);
            if (!el) return;
            const cleanVal = val ? String(val).trim() : "";
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
                el.value = cleanVal;
            } else {
                el.innerText = cleanVal;
            }
        };

        const fillListAndHandleSection = (listId, containerId, items) => {
            const listEl = document.getElementById(listId);
            const containerEl = document.getElementById(containerId);

            if (!items || (Array.isArray(items) && items.length === 0)) {
                if (containerEl) containerEl.style.display = "none";
                return;
            }

            if (listEl) {
                listEl.innerHTML = "";
                const itemsArray = Array.isArray(items)
                    ? items
                    : String(items).split('\n').filter(i => i.trim() !== "");

                itemsArray.forEach(text => {
                    if (text.trim()) {
                        const li = document.createElement('li');
                        li.innerText = text.trim();
                        listEl.appendChild(li);
                    }
                });
                if (containerEl) containerEl.style.display = "block";
            }
        };

        updateField('nameToCV', cvData.name);
        updateField('phoneR', cvData.phone);
        updateField('emailR', cvData.email);
        updateField('linkedinR', cvData.linkedin);
        updateField('adressR', cvData.address);
        updateField('autoTextarea', cvData.about);

        fillListAndHandleSection('entry_list', 'skills_container', cvData.skills);
        fillListAndHandleSection('itemListLanguage_right1', 'language', cvData.languages);
        fillListAndHandleSection('sendList', 'sendedParts', cvData.experience);
        fillListAndHandleSection('sendList1', 'rightSideContainer', cvData.education);
        fillListAndHandleSection('itemListCertificate_right1', 'certificate', cvData.certificates);
    };

    executeCVParsing();

    // 3. BACKEND FETCH PROSESİ (DÜZGÜN ENDPOINT İLƏ)
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Zəhmət olmasa əvvəlcə fayl seçin.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        fileListContainer.innerHTML = `<p style="color:#4e54ff;">Analiz edilir...</p>`;

        try {
            const response = await fetch('https://api.makecv.pro:5001/api/Cv/upload-your-cv', {
                method: 'POST',
                body: formData,
                headers: {
                    "Accept": "*/*"
                }
            });

            if (!response.ok) throw new Error(`Xəta statusu: ${response.status}`);

            const data = await response.json();

            const normalized = normalizeCVData(data);

            localStorage.setItem('parsedCvData', JSON.stringify(normalized));

            console.log("FINAL CLEAN DATA:", normalized);

            executeCVParsing();

            if (sectionBottom) {
                sectionBottom.classList.remove('hidden');
                sectionBottom.style.display = 'flex';
            }

            sectionBottom.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            fileListContainer.innerHTML = `<p style="color:#2ecc71;">Ready ✔ choose the style below</p>`;

        } catch (error) {
            console.error("Yükləmə/Fetch xətası:", error);
            fileListContainer.innerHTML = `<p style="color:red;">Xəta baş verdi</p>`;
        }
    };

    // 4. İNTERFEYS (UI) HADİSƏLƏRİ VƏ DRAG & DROP
    nextBtn?.addEventListener('click', () => {
        section1.classList.add('hidden');
        section2.classList.add('hidden');
        section3.classList.remove('hidden');
        document.body.classList.add('upload-mode');
    });

    cancelBtn?.addEventListener('click', () => {
        section1.classList.remove('hidden');
        section2.classList.remove('hidden');
        section3.classList.add('hidden');
        if (sectionBottom) {
            sectionBottom.classList.add('hidden');
            sectionBottom.style.display = 'none';
        }
        document.body.classList.remove('upload-mode');
        document.body.classList.remove('payment-mode');
    });

    const resetFileList = () => {
        fileListContainer.innerHTML = `
            <div class="empty_state">
                <img src="./img/box_icon.png" alt="box">
                <p>No CVs found. Upload to start!</p>
            </div>
        `;
    };

    const prepareUpload = (file) => {
        if (!file || file.type !== "application/pdf") {
            alert("Zəhmət olmasa düzgün PDF faylı seçin.");
            return;
        }

        selectedFile = file;

        fileListContainer.innerHTML = `
            <div class="file_item">
                <div class="pdf_icon">PDF</div>
                <div class="file_info">
                    <h4>${file.name}</h4>
                </div>
                <img src="./img/UpdateNew/bin.png" id="remove_selected" style="width: 35px; cursor: pointer;">
            </div>
        `;

        document.getElementById('remove_selected')?.addEventListener('click', () => {
            selectedFile = null;
            resetFileList();
            if (fileInput) fileInput.value = "";
        });
    };

    document.querySelectorAll('.select-style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = "index.html?mode=update";
        });
    });

    fileInput?.addEventListener('change', e => prepareUpload(e.target.files[0]));
    confirmBtn?.addEventListener('click', handleUpload);

    const dashedBorder = document.querySelector('.dashed_border');

    dashedBorder?.addEventListener('drop', e => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            prepareUpload(e.dataTransfer.files[0]);
        }
    });

    dashedBorder?.addEventListener('dragover', e => e.preventDefault());
});