document.addEventListener('DOMContentLoaded', () => {
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

    // 🔥 --- FULL FIXED NORMALIZE ---
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

    // =====================
    // 📌 CONTACT (robust)
    // =====================
    const email = extract(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phone = extract(/(\+994|0)[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/i);
    const linkedin = extract(/linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);

    // =====================
    // 📌 NAME (more stable)
    // =====================
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

    // =====================
    // 📌 ABOUT (better isolation)
    // =====================
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

    // =====================
    // 📌 SECTION DETECTION (IMPORTANT)
    // =====================
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


    // --- UI ---
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
        sectionBottom.classList.add('hidden'); 
        sectionBottom.style.display = 'none';
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
            fileInput.value = "";
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Zəhmət olmasa əvvəlcə fayl seçin.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        fileListContainer.innerHTML = `<p style="color:#4e54ff;">Analiz edilir...</p>`;

        try {
            const response = await fetch('https://api.makecv.pro:5001/api/Cv/upload-pdf-cv', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error();

            const data = await response.json();

            const normalized = normalizeCVData(data);
            localStorage.setItem('parsedCvData', JSON.stringify(normalized));

            console.log("FINAL CLEAN DATA:", normalized);

            sectionBottom?.classList.remove('hidden');
            sectionBottom.style.display = 'flex';

            fileListContainer.innerHTML = `<p style="color:#2ecc71;">Hazırdır ✔ Stil seç</p>`;

        } catch {
            fileListContainer.innerHTML = `<p style="color:red;">Xəta baş verdi</p>`;
        }
    };

    document.querySelectorAll('.select-style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = "index.html?mode=update";
        });
    });

    fileInput?.addEventListener('change', e => prepareUpload(e.target.files[0]));
    confirmBtn?.addEventListener('click', handleUpload);

    document.querySelector('.dashed_border')?.addEventListener('drop', e => {
        e.preventDefault();
        prepareUpload(e.dataTransfer.files[0]);
    });

    document.querySelector('.dashed_border')?.addEventListener('dragover', e => e.preventDefault());
});