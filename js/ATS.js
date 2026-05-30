// 1. Datalar
let globalSelectedFile = null;
const files = [
    { name: "Senior Developer Cover Letter", size: "256 KB" },
    { name: "Senior Developer cover", size: "128 KB" },
    { name: "Graphic designer", size: "347 KB" }
];

const matchingSkills = ["Portfolio", "Freelance Experience", "Senior Developer", "Project Delivery", "Software Development", "Practical Application", "Technical Skills", "Collaboration"];
const missingSkills = ["Professional Portfolio link\\QR code", "CI/CD", "Software Architecture", "System Design", "Microservices", "Cloud Computing", "Leadership", "Quantifiable Results"];

// 2. Şablonlar üçün Yardımçı Funksiya
const createFileRow = (file, index, mode) => {
    const isSelectMode = mode === 'select';
    return `
        <div class="file-uploaded-ui" onclick="${isSelectMode ? `this.querySelector('input').click()` : ''}">
            <div class="file-info">
                <span class="pdf-icon">PDF</span>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${file.size}</span>
                </div>
            </div>
            ${isSelectMode
            ? `<input type="radio" name="selectedFile" class="select-input" ${index === 0 ? 'checked' : ''}>`
            : `<button class="delete-file-btn" onclick="event.stopPropagation(); removeFileRow(this)">
                    <i class="fa-solid fa-trash-can"></i>
                   </button>`
        }
        </div>`;
};

// 3. Şablonlar Obyekti
const MODES = {
    upload: () => `
        <div class="upload-ui">
            <div class="circle-plus">+</div>
            <span>Click to upload your document</span>
        </div>`,
    uploadedFile: (fileName, index = 0) => createFileRow({ name: fileName, size: "256 KB" }, index, 'upload'),
    text: () => `<textarea id="jobInput" class="job-textarea" placeholder="Enter details here..."></textarea>`,
    select: () => `
        <div class="file-list-container">
            ${files.map((file, index) => createFileRow(file, index, 'select')).join('')}
        </div>`,
    default: () => MODES.upload()
};

// 4. Silmə Funksiyası
const removeFileRow = (btn) => {
    const section = btn.closest('.section-card');
    const contentBox = section ? (section.id === 'section-jd' ? document.getElementById('job_text') : section.querySelector('.content-box')) : document.getElementById('job_text');

    if (contentBox) {
        contentBox.innerHTML = '';
        contentBox.classList.add('hidden');
        contentBox.style.setProperty('display', 'none', 'important');
        delete contentBox.dataset.currentMode;
    }
};

// 5. Əsas Event Listener (BÜTÜN KOD BURADA OLMALIDIR)
document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scanB');
    const jdContainer = document.getElementById('job_text');
    const jdSection = document.getElementById('section-jd');

    // --- DEFAULT OLARAQ ---
    if (jdContainer && jdSection) {
        jdContainer.innerHTML = MODES.text();
        jdContainer.classList.remove('hidden');
        jdContainer.style.display = 'block';
        jdContainer.dataset.currentMode = 'text';

        const btn = jdSection.querySelector('[class^="btn-select"]');
        if (btn) btn.firstChild.textContent = 'Enter text ';
    }

    // --- CLICK EVENTLERI ---
    document.addEventListener('click', (e) => {
        const target = e.target;

        // --- Dropdown Menyu Aç/Bağla ---
        const currentBtn = target.closest('[class^="btn-select"]');
        if (currentBtn) {
            e.stopPropagation();
            const section = currentBtn.closest('.section-card');
            const menu = currentBtn.nextElementSibling;
            const arrow = currentBtn.querySelector('.arrow');
            const contentBox = section.id === 'section-jd' ? document.getElementById('job_text') : section.querySelector('.content-box');

            const isNowOpen = (arrow.textContent === '▲');

            document.querySelectorAll('[class^="menu-list"]').forEach(m => m.style.display = 'none');
            document.querySelectorAll('.arrow').forEach(a => a.textContent = '▼');

            if (!isNowOpen) {
                menu.style.display = 'block';
                arrow.textContent = '▲';
            } else {
                menu.style.display = 'none';
                arrow.textContent = '▼';

                // Seçim yoxdursa gizlət
                const currentMode = contentBox.dataset.currentMode;
                if (!currentMode || currentMode === "" || contentBox.querySelector('.upload-ui')) {
                    contentBox.innerHTML = "";
                    contentBox.style.setProperty('display', 'none', 'important');
                    contentBox.classList.add('hidden');
                    delete contentBox.dataset.currentMode;
                }
            }
            return;
        }

        // --- Menyudan Seçim Etmək ---
        const uploadItem = e.target.closest('[data-mode="upload"]');
if (uploadItem) {
    const section = uploadItem.closest('.section-card');
    const contentBox =
        section.id === 'section-jd'
            ? document.getElementById('job_text')
            : section.querySelector('.content-box');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';

    fileInput.onchange = (ev) => {
        const file = ev.target.files[0];

        if (file) {
            globalSelectedFile = file;
            contentBox.classList.remove("hidden");
            contentBox.style.display = "block";
            contentBox.innerHTML = `
                📄 <strong>${file.name}</strong>
            `;

            contentBox.dataset.currentMode = 'uploadedFile';
        }
    };

    fileInput.click();
    return;
}
        // --- Upload Klik ---
        const uploadBtn = target.closest('.upload-ui');
        if (uploadBtn) {
            const section = uploadBtn.closest('.section-card');
            const contentBox = section.id === 'section-jd' ? document.getElementById('job_text') : section.querySelector('.content-box');
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/pdf';
            fileInput.onchange = (ev) => {
                const file = ev.target.files[0];
                if (file) {
                    globalSelectedFile = file;
                    contentBox.innerHTML = MODES.uploadedFile(file.name);
                    contentBox.dataset.currentMode = 'uploadedFile';
                }
            };
            fileInput.click();
            return;
        }

        // --- "X" düymələri ilə bağlama ---
        if (target.classList.contains('close-card-btn')) {
            const card = target.closest('.keyword-card') || target.closest('#analysis-section') || target.closest('#advice-section');
            if (card) card.classList.add('hidden');
        }
    });

    // --- SCAN DÜYMƏSİ MƏNTİQİ ---
    scanBtn?.addEventListener('click', async () => {
        const jdTextarea = document.querySelector('#jobInput');
        const jobDescription = jdTextarea ? jdTextarea.value.trim() : "";

        if (!jobDescription) return alert("Zəhmət olmasa vəzifə təsvirini daxil edin!");
        if (!globalSelectedFile) return alert("Zəhmət olmasa CV faylını (PDF) yükləyin!");

        const setStatus = (text) => {
            scanBtn.innerHTML = `<div class="spinner"></div> <span id="status-text">${text}</span>`;
        };

        scanBtn.disabled = true;

        try {
            // --- Vizual Gözləmə Mərhələləri ---
            setStatus("Reading file...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus("Scanning...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus("Analyzing...");

            // --- Real API Sorğusu ---
            const formData = new FormData();
            formData.append('Cv', globalSelectedFile);
            formData.append('Description', jobDescription);

            const response = await fetch('https://api.makecv.pro:5001/api/ats/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Server xətası!');

            const result = await response.json();

            // 1. JSON parsing - Content-i təmizləyirik
            const contentString = result.choices[0].message.content;
            const cleanJson = contentString.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson); // parsed burada təyin olundu

            // 2. Nəticələrin ekrana yazılması
            document.getElementById('scoreValue').innerText = `${parsed.score}%`;
            document.getElementById('feedbackText').innerText = parsed.quick_feedback;

            // 3. Proqress dairəsinin rənglənməsi (parsed artıq mövcuddur)
            const circle = document.querySelector('.circular-progress');
            if (circle) {
                let color = parsed.score < 50 ? "#e74c3c" : parsed.score < 70 ? "#f1c40f" : "#2ecc71";
                circle.style.background = `conic-gradient(${color} ${parsed.score * 3.6}deg, #eef2f6 0deg)`;
            }
            // 4. Nəticə blokunu göstərmək və aşağı scroll etmək
            const resultDiv = document.getElementById('compatibility-result');
            if (resultDiv) {
                // Əvvəlcə gizliliyi qaldırırıq
                resultDiv.classList.remove('hidden');

              // BURAYA ƏLAVƏ ET:
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100); // 100ms gözləmək məsləhətdir ki, 'hidden' silinsin və hündürlük hesablansın
            }

        } catch (error) {
            console.error("Xəta baş verdi:", error);
            alert("Xəta: Məlumatları analiz etmək mümkün olmadı.");
        } finally {
            scanBtn.disabled = false;
            scanBtn.innerHTML = "Scan";
        }
    });
    // --- Analiz Düyməsi ---
    document.querySelector('.btn-errors')?.addEventListener('click', () => {
        const analysisSection = document.getElementById('analysis-section');

        if (analysisSection) {
            // 1. Ana bölməni göstər
            analysisSection.classList.remove('hidden');

            // 2. Daxildəki gizlədilmiş kartları (matching və missing) tap və onları da göstər
            analysisSection.querySelectorAll('.keyword-card').forEach(card => {
                card.classList.remove('hidden');
            });

            // 3. Kontenti yenilə
            const matchTags = document.getElementById('matchTags');
            const missingTags = document.getElementById('missingTags');

            if (matchTags) {
                matchTags.innerHTML = matchingSkills.map(s => `<span class="tag-match">${s}</span>`).join('');
            }

            if (missingTags) {
                missingTags.innerHTML = missingSkills.map(s => `<span class="tag-missing">${s}</span>`).join('');
            }

            // 4. Səhifəni həmin hissəyə sürüşdür
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Advice Düyməsi ---
    document.getElementById('adviceB')?.addEventListener('click', () => {
        const adviceSection = document.getElementById('advice-section');
        adviceSection?.classList.remove('hidden');
        adviceSection?.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Update Düyməsi ---
    const updateBtn = document.getElementById('updateBtn');
    const updateMenu = document.getElementById('updateMenu');
    updateBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = updateMenu.classList.toggle('show');
        updateMenu.style.display = isShown ? 'block' : 'none';
        const arrow = updateBtn.querySelector('.arrow');
        if (arrow) arrow.textContent = isShown ? '▲' : '▼';
    });

}); 