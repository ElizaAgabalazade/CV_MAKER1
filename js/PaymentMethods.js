// ==================== 1. ELEMENTLƏRİN SEÇİLMƏSİ ====================
const paymentButtons = {
    card: document.getElementById("card"),
    paypal: document.getElementById("paypalBtn"),
    apple: document.getElementById("apple"),
    google: document.getElementById("google"),
    bank: document.getElementById("bank"),
    klarna: document.getElementById("klarna")
};

const paymentDivs = {
    card: document.getElementById("pay_with_card"),
    paypal: document.getElementById("pay_with_paypal"),
    apple: document.getElementById("pay_with_apple"),
    google: document.getElementById("pay_with_google"),
    bank: document.getElementById("pay_with_bank"),
    klarna: document.getElementById("pay_with_klarna")
};

// ==================== 2. ÜMUMİ FUNKSİYALAR ====================

// Bütün ödəniş bölmələrini gizlətmək
const hideAllPayments = () => {
    Object.values(paymentDivs).forEach(div => {
        if (div) div.style.display = "none";
    });
};

// Seçilmiş bölməni göstərmək
const showPayment = (key) => {
    hideAllPayments();
    if (paymentDivs[key]) {
        paymentDivs[key].style.display = "block";
    }
};

// Overlay (Pəncərə) aç/bağla funksiyası
const toggleOverlay = (el, show = true) => {
    if (!el) return;
    if (el.id === 'klarnaOverlay') {
        show ? el.classList.add("active") : el.classList.remove("active");
    } else {
        el.style.display = show ? 'flex' : 'none';
    }
};

// Şəkillərə klikləmə hadisələri
Object.keys(paymentButtons).forEach(key => {
    if (paymentButtons[key]) {
        paymentButtons[key].addEventListener("click", () => {
            showPayment(key);
            if (key === 'google' && typeof initGooglePayButton === "function") {
                initGooglePayButton();
            }
        });
    }
});

// ==================== 3. STRIPE KART ÖDƏNİŞİ ====================
const stripe = Stripe('pk_test_51Pxxxxxxxxxxxxxxxxxxxx'); 
const elements = stripe.elements();

const elementStyles = {
    base: {
        fontSize: '16px',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': { color: '#868693' },
    },
    invalid: { color: '#fa755a' }
};

const cardNumber = elements.create('cardNumber', { style: elementStyles });
const cardCvc = elements.create('cardCvc', { style: elementStyles });

if (document.getElementById('card-number')) cardNumber.mount('#card-number');
if (document.getElementById('card-cvc-element')) cardCvc.mount('#card-cvc-element');

const expMonthInput = document.getElementById("exp-month");
const expYearInput = document.getElementById("fake-year");

expMonthInput?.addEventListener("input", () => {
    let val = expMonthInput.value.replace(/\D/g, '');
    if (val > 12) val = 12;
    if (val.length === 1 && val > 1) val = "0" + val;
    expMonthInput.value = val;
    if (val.length === 2) expYearInput.focus();
});

expYearInput?.addEventListener("input", () => {
    expYearInput.value = expYearInput.value.replace(/\D/g, '');
});

const payBtn = document.getElementById("pay_btn");
payBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const cardholderName = document.getElementById("cardholder-name").value;
    
    if (!cardholderName || expMonthInput.value.length !== 2 || expYearInput.value.length !== 4) {
        alert("Zəhmət olmasa bütün məlumatları düzgün daxil edin.");
        return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: { name: cardholderName }
    });

    if (error) {
        alert("Xəta: " + error.message);
    } else {
        alert("Ödəniş uğurludur! ID: " + paymentMethod.id);
    }
});

// ==================== 4. PAYPAL MƏNTİQİ ====================
const paypalOverlay = document.getElementById('paypalOverlay');
document.querySelector('.pay_with_paypal a')?.addEventListener('click', e => {
    e.preventDefault();
    toggleOverlay(paypalOverlay, true);
});

document.querySelector('.paypal-overlay .cansel')?.addEventListener('click', () => {
    toggleOverlay(paypalOverlay, false);
});

document.querySelector('.paypal-overlay .login-pay')?.addEventListener('click', e => {
    e.preventDefault();
    const email = document.querySelector('.paypal-overlay .email').value;
    const password = document.querySelector('.paypal-overlay .password').value;

    fetch('/api/paypal-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Payment confirmed!');
            toggleOverlay(paypalOverlay, false);
        } else {
            alert('Login failed');
        }
    }).catch(err => console.error(err));
});

// ==================== 5. APPLE PAY MƏNTİQİ ====================
const appleOverlay = document.querySelector('.pay_with_apple_overlay');
document.getElementById('apple_proceed')?.addEventListener('click', e => {
    e.preventDefault();
    toggleOverlay(appleOverlay, true);
});

document.querySelector('.close_black_google')?.addEventListener('click', () => {
    toggleOverlay(appleOverlay, false);
});

document.querySelector('.pay_wiht_apple_middle_2 button')?.addEventListener('click', async () => {
    if (!window.ApplePaySession) {
        alert("Apple Pay bu cihazda dəstəklənmir.");
        return;
    }
    // Apple Pay Session kodun bura daxildir (Fetch-lər olduğu kimi qalır)
    const paymentRequest = {
        countryCode: 'US',
        currencyCode: 'USD',
        total: { label: 'Your Company', amount: '10.00' },
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS']
    };
    const session = new ApplePaySession(3, paymentRequest);
    session.onvalidatemerchant = async (event) => { /* fetch logic */ };
    session.onpaymentauthorized = async (event) => { /* fetch logic */ };
    session.begin();
});

// ==================== 6. KLARNA MƏNTİQİ ====================
const klarnaOverlay = document.getElementById("klarnaOverlay");
document.querySelector("#pay_with_klarna a")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleOverlay(klarnaOverlay, true);
});

document.querySelector(".klarna_close")?.addEventListener("click", () => {
    toggleOverlay(klarnaOverlay, false);
});

klarnaOverlay?.addEventListener("click", (e) => {
    if (e.target === klarnaOverlay) toggleOverlay(klarnaOverlay, false);
});

// ==================== 7. BANK TRANSFER MƏNTİQİ ====================
const bankOverlay = document.getElementById("bankOverlay");
const bankRefEl = document.getElementById("bankRef");
let currentBankReference = null;

const loadBankReferenceCode = async () => {
    if (!bankRefEl) return;
    bankRefEl.innerText = "Yüklənir...";
    try {
        const res = await fetch("/api/get-bank-ref");
        const data = await res.json();
        currentBankReference = data.reference_code;
        bankRefEl.innerText = currentBankReference;
    } catch (err) {
        bankRefEl.innerText = "Xəta baş verdi";
    }
};

document.querySelector("#pay_with_bank a")?.addEventListener("click", e => {
    e.preventDefault();
    toggleOverlay(bankOverlay, true);
    loadBankReferenceCode();
});

document.querySelector("#bankOverlay .close_black")?.addEventListener("click", () => {
    toggleOverlay(bankOverlay, false);
});

// ==================== 8. GOOGLE PAY MƏNTİQİ ====================
const googlePayOverlay = document.getElementById("googlePayOverlay");
document.getElementById("googlePayLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleOverlay(googlePayOverlay, true);
});

document.getElementById("closeGooglePay")?.addEventListener("click", () => {
    toggleOverlay(googlePayOverlay, false);
});

document.querySelector('.pay_wiht_google_middle_2 button')?.addEventListener('click', () => {
    const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    // Google Pay Request obyektin bura daxildir...
    // paymentsClient.loadPaymentData(paymentDataRequest)...
});