// pdf_this_template.js — yalnız bu template üçün
document.getElementById('download-pdf')?.addEventListener('click', () => {
    // Kontakt textarea-larını müvəqqəti div-ə çevir
    const contactTextareas = document.querySelectorAll('.contact-info textarea');
    const replaced = [];

    contactTextareas.forEach(ta => {
        const div = document.createElement('div');
        div.className = ta.className;
        div.style.cssText = window.getComputedStyle(ta).cssText;
        div.style.writingMode = 'vertical-rl';
        div.style.transform = 'rotate(90deg)';
        div.style.webkitWritingMode = 'vertical-rl';
        div.style.width = '10px';
        div.style.minHeight = '60px';
        div.style.height = 'auto';
        div.style.whiteSpace = 'nowrap';
        div.style.fontSize = '8px';
        div.style.color = '#555';
        div.style.overflow = 'visible';
        div.style.display = 'block';
        div.style.background = 'transparent';
        div.style.border = 'none';
        div.style.padding = '0';
        div.innerText = ta.value;
        ta.parentNode.insertBefore(div, ta);
        ta.style.display = 'none';
        replaced.push({ ta, div });
    });

    // PDF yüklə
    const element = document.querySelector('.section_right_top');
    html2pdf().set({
        margin: 0,
        filename: `CV_Export_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save().then(() => {
        // Bərpa et
        replaced.forEach(({ ta, div }) => {
            ta.style.display = '';
            div.remove();
        });
    });
});