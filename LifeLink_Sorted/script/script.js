// This file contains all general, reusable JavaScript for the entire website.

// Simulate user sign-in status and user data
let isUserSignedIn = true; // Set to true by default for easier testing
let currentUserData = {
    fullName: "Jane Doe",
    studentId: "1234567890",
    branch: "COMPS",
    email: "jane.doe@dbit.in",
    bloodGroup: "O+",
    mobile: "9876543210",
    pinCode: "400070",
    lastDonated: "2024-03-15"
};

// DOM Elements
const mainContentSections = document.getElementById('main-content-sections');
const donationPage = document.getElementById('donation-page');
const donationSuccessMessage = document.getElementById('donation-success-message');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const summaryModal = document.getElementById('summary-modal');

// All Modals (Sign In, Register, Options, Message Box)
const signInModal = document.getElementById('signin-modal');
const registerModal = document.getElementById('register-modal');
const receiveOptionsModal = document.getElementById('receive-options-modal');
const donateOptionsModal = document.getElementById('donate-options-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const messageBox = document.getElementById('message-box');

// Buttons and Links
const openSignInBtn = document.getElementById('open-signin-btn');
const openRegisterBtn = document.getElementById('open-register-btn');
const openDonateCta = document.getElementById('open-donate-cta');
const openReceiveCta = document.getElementById('open-receive-cta');

const closeSignInBtn = document.getElementById('close-signin-btn');
const closeRegisterBtn = document.getElementById('close-register-btn');
const closeReceiveOptionsBtn = document.getElementById('close-receive-options-btn');
const closeDonateOptionsBtn = document.getElementById('close-donate-options-btn');
const closeForgotPasswordBtn = document.getElementById('close-forgot-password-btn');
const closeMessageBoxBtn = document.getElementById('close-message-box');
const closeSummaryModalBtn = document.getElementById('close-summary-modal');
const okMessageBoxBtn = document.getElementById('message-box-ok-btn');

const switchToRegisterLink = document.getElementById('switch-to-register');
const switchToSignInLink = document.getElementById('switch-to-signin');
const forgotPasswordLink = document.getElementById('forgot-password-link');

const goToRegisterBtn = document.getElementById('go-to-register-btn');
const goToSignInBtn = document.getElementById('go-to-signin-btn');

const nextToAppointmentBtn = document.getElementById('next-to-appointment-btn');
const backToInfoBtn = document.getElementById('back-to-info-btn');
const confirmDonationBtn = document.getElementById('confirm-donation-btn');
const finalConfirmBtn = document.getElementById('final-confirm-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const backFromSummaryBtn = document.getElementById('back-from-summary-btn');

// Donation Booking Form Elements (Main Page)
const donationInfoForm = document.getElementById('donation-info-form');
const donationAppointmentForm = document.getElementById('donation-appointment-form');
const bookNameMain = document.getElementById('book-name-main');
const bookStudentIdMain = document.getElementById('book-student-id-main');
const bookBranchMain = document.getElementById('book-branch-main');
const bookEmailMain = document.getElementById('book-email-main');
const bookBloodGroupMain = document.getElementById('book-blood-group-main');
const bookMobileMain = document.getElementById('book-mobile-main');
const bookPincodeMain = document.getElementById('book-pincode-main');
const bookLastDonated = document.getElementById('book-last-donated');
const donationDateMain = document.getElementById('donation-date-main');
const timeSlotMain = document.getElementById('time-slot-main');
const donationConsentMain = document.getElementById('donation-consent-main');

// Summary Display Elements
const summaryName = document.getElementById('summary-name');
const summaryBloodGroup = document.getElementById('summary-blood-group');
const summaryMobile = document.getElementById('summary-mobile');
const summaryDate = document.getElementById('summary-date');
const summaryTime = document.getElementById('summary-time');

// Edit Info Button
const editInfoBtn = document.getElementById('edit-info-btn');

// Forgot Password Form Elements
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotPasswordStep1 = document.getElementById('forgot-password-step-1');
const forgotPasswordStep2 = document.getElementById('forgot-password-step-2');
const forgotPasswordStep3 = document.getElementById('forgot-password-step-3');
const requestOtpBtn = document.getElementById('request-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const resendOtpLink = document.getElementById('resend-otp-link');
const newPasswordInput = document.getElementById('new-password');
const confirmNewPasswordInput = document.getElementById('confirm-new-password');


// Function to show a custom message box instead of alert()
function showMessageBox(title, message, type = 'info') {
    if (!messageBox) return; // Ensure messageBox exists

    messageBox.classList.remove('premium-message-box-success', 'premium-message-box-error');
    messageBox.classList.add('premium-message-box');

    if (type === 'success') {
        messageBox.classList.add('premium-message-box-success');
    } else if (type === 'error') {
        messageBox.classList.add('premium-message-box-error');
    }

    if (document.getElementById('message-box-title')) document.getElementById('message-box-title').textContent = title;
    if (document.getElementById('message-box-text')) document.getElementById('message-box-text').textContent = message;
    messageBox.classList.add('show');
}

// Function to show a specific page/section and hide others
function showPage(pageId) {
    if (mainContentSections) mainContentSections.style.display = 'none';
    if (donationPage) donationPage.style.display = 'none';
    if (donationSuccessMessage) donationSuccessMessage.classList.remove('show');
    if (summaryModal) summaryModal.classList.remove('show');

    if (signInModal) signInModal.classList.remove('show');
    if (registerModal) registerModal.classList.remove('show');
    if (receiveOptionsModal) receiveOptionsModal.classList.remove('show');
    if (donateOptionsModal) donateOptionsModal.classList.remove('show');
    if (messageBox) messageBox.classList.remove('show');
    if (forgotPasswordModal) forgotPasswordModal.classList.remove('show');

    if (pageId === 'home') {
        if (mainContentSections) mainContentSections.style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else if (pageId === 'donation-page') {
        if (donationPage) {
            donationPage.style.display = 'flex';
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showDonationStep(1);
        }
    } else if (pageId === 'donation-success') {
        if (donationPage) {
            donationPage.style.display = 'flex';
            if (donationSuccessMessage) donationSuccessMessage.classList.add('show');
            if (step1) step1.classList.add('hidden');
            if (step2) step2.classList.add('hidden');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}

// Function to manage the step-by-step donation page flow
function showDonationStep(stepNumber) {
    const steps = [step1, step2];
    if (steps[0]) { // Check if step1 exists, implying donation page elements are present
        steps.forEach((step, index) => {
            if (!step) return; // Skip if element doesn't exist
            const isTarget = (index + 1 === stepNumber);
            if (isTarget) {
                step.classList.remove('hidden');
                step.classList.add('fading-in');
            } else {
                step.classList.add('hidden');
                step.classList.remove('fading-in');
            }
        });
    }
    if (summaryModal) summaryModal.classList.remove('show');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Function to toggle readonly state of info fields
function setInfoFieldsReadonly(readonlyState) {
    if (bookNameMain) bookNameMain.readOnly = readonlyState;
    if (bookStudentIdMain) bookStudentIdMain.readOnly = readonlyState;
    if (bookEmailMain) bookEmailMain.readOnly = readonlyState;
    if (bookBloodGroupMain) bookBloodGroupMain.readOnly = readonlyState;
    if (bookMobileMain) bookMobileMain.readOnly = readonlyState;
    if (bookPincodeMain) bookPincodeMain.readOnly = readonlyState;
    if (bookLastDonated) bookLastDonated.readOnly = readonlyState;
    if (bookBranchMain) bookBranchMain.disabled = readonlyState;

    const infoFields = [bookNameMain, bookStudentIdMain, bookEmailMain, bookBloodGroupMain, bookMobileMain, bookPincodeMain, bookLastDonated, bookBranchMain];
    infoFields.forEach(field => {
        if (field) {
            if (readonlyState) {
                field.classList.add('form-group-readonly');
            } else {
                field.classList.remove('form-group-readonly');
            }
        }
    });
}


// --- Hero Slider Logic ---
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const sliderContainer = document.getElementById('hero-slider');
if (slides.length > 0 && sliderContainer) { // Ensure elements exist
    const totalSlides = slides.length;
    sliderContainer.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => slide.style.width = `${100 / totalSlides}%`);
}

function showSlide(index) {
    if (slides.length > 0 && sliderContainer) { // Ensure elements exist
        const totalSlides = slides.length;
        if (index >= totalSlides) currentSlide = 0;
        else if (index < 0) currentSlide = totalSlides - 1;
        else currentSlide = index;
        sliderContainer.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    }
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

if (slides.length > 0) { // Only set interval if slides exist
    setInterval(() => changeSlide(1), 5000);
}


// --- Blood Type Compatibility Logic ---
const compatibilityData = {
    "A+": {
        donate: ["A+", "AB+"],
        receive: ["A+", "A-", "O+", "O-"]
    },
    "A-": {
        donate: ["A+", "A-", "AB+", "AB-"],
        receive: ["A-", "O-"]
    },
    "B+": {
        donate: ["B+", "AB+"],
        receive: ["B+", "B-", "O+", "O-"]
    },
    "B-": {
        donate: ["B+", "B-", "AB+", "AB-"],
        receive: ["B-", "O-"]
    },
    "AB+": {
        donate: ["AB+"],
        receive: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    "AB-": {
        donate: ["AB+", "AB-"],
        receive: ["AB-", "A-", "B-", "O-"]
    },
    "O+": {
        donate: ["O+", "A+", "B+", "AB+"],
        receive: ["O+", "O-"]
    },
    "O-": {
        donate: ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"],
        receive: ["O-"]
    }
};

const selectorContainer = document.getElementById('blood-type-selector');
const donateList = document.getElementById('donate-list');
const receiveList = document.getElementById('receive-list');

if (selectorContainer && donateList && receiveList) { // Ensure all elements exist
    selectorContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.blood-type-button');
        if (!button) return;
        document.querySelectorAll('.blood-type-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const bloodType = button.dataset.type;
        const data = compatibilityData[bloodType];

        const updateList = (listElement, types) => {
            listElement.innerHTML = '';
            if (types.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No data available for this blood type.';
                listElement.appendChild(p);
            } else {
                types.forEach(type => {
                    const span = document.createElement('span');
                    span.textContent = type;
                    listElement.appendChild(span);
                });
            }
        };
        updateList(donateList, data.donate);
        updateList(receiveList, data.receive);
    });
}

// Function to pre-fill donation form fields on the main donation page
function prefillDonationFormMain() {
    if (currentUserData && bookNameMain) { // Check if currentUserData and a key element exist
        if (bookNameMain) bookNameMain.value = currentUserData.fullName || '';
        if (bookStudentIdMain) bookStudentIdMain.value = currentUserData.studentId || '';
        if (bookBranchMain) bookBranchMain.value = currentUserData.branch || '';
        if (bookEmailMain) bookEmailMain.value = currentUserData.email || '';
        if (bookBloodGroupMain) bookBloodGroupMain.value = currentUserData.bloodGroup || '';
        if (bookMobileMain) bookMobileMain.value = currentUserData.mobile || '';
        if (bookPincodeMain) bookPincodeMain.value = currentUserData.pinCode || '';
        if (bookLastDonated) bookLastDonated.value = currentUserData.lastDonated || '';

        const fixedDonationDate = "2025-10-26";
        if (donationDateMain) donationDateMain.value = fixedDonationDate;
    }
}

// Function to update the summary card
function updateSummary() {
    if (summaryName) summaryName.textContent = bookNameMain.value || 'N/A';
    if (summaryBloodGroup) summaryBloodGroup.textContent = bookBloodGroupMain.value || 'N/A';
    if (summaryMobile) summaryMobile.textContent = bookMobileMain.value || 'N/A';
    if (summaryDate) summaryDate.textContent = donationDateMain.value ? new Date(donationDateMain.value).toDateString() : 'N/A';
    if (summaryTime) summaryTime.textContent = timeSlotMain.value || 'N/A';
}

// --- Event Listeners for Modals ---
if (openSignInBtn) openSignInBtn.onclick = () => signInModal.classList.add('show');
if (openRegisterBtn) openRegisterBtn.onclick = () => registerModal.classList.add('show');

if (openDonateCta) openDonateCta.onclick = () => {
    if (isUserSignedIn) {
        showPage('donation-page');
        prefillDonationFormMain();
        setInfoFieldsReadonly(true);
        if(editInfoBtn) {
            editInfoBtn.textContent = 'Edit';
            editInfoBtn.classList.remove('save');
        }
    } else {
        if (donateOptionsModal) donateOptionsModal.classList.add('show');
    }
};

if (openReceiveCta) openReceiveCta.onclick = () => {
    if (receiveOptionsModal) receiveOptionsModal.classList.add('show');
};


// Close Modals
if (closeSignInBtn) closeSignInBtn.onclick = () => signInModal.classList.remove('show');
if (closeRegisterBtn) closeRegisterBtn.onclick = () => registerModal.classList.remove('show');
if (closeReceiveOptionsBtn) closeReceiveOptionsBtn.onclick = () => receiveOptionsModal.classList.remove('show');
if (closeDonateOptionsBtn) closeDonateOptionsBtn.onclick = () => donateOptionsModal.classList.remove('show');
if (closeMessageBoxBtn) closeMessageBoxBtn.onclick = () => messageBox.classList.remove('show');
if (closeSummaryModalBtn) closeSummaryModalBtn.onclick = () => summaryModal.classList.remove('show');
if (okMessageBoxBtn) okMessageBoxBtn.onclick = () => messageBox.classList.remove('show');
if (closeForgotPasswordBtn) closeForgotPasswordBtn.onclick = () => {
    if (forgotPasswordModal) forgotPasswordModal.classList.remove('show');
    if (forgotPasswordStep1) forgotPasswordStep1.style.display = 'block';
    if (forgotPasswordStep2) forgotPasswordStep2.style.display = 'none';
    if (forgotPasswordStep3) forgotPasswordStep3.style.display = 'none';
};


// Switch between Auth Modals from links
if (switchToRegisterLink) switchToRegisterLink.onclick = () => {
    if (signInModal) signInModal.classList.remove('show');
    if (registerModal) registerModal.classList.add('show');
};

if (switchToSignInLink) switchToSignInLink.onclick = () => {
    if (registerModal) registerModal.classList.remove('show');
    if (signInModal) signInModal.classList.add('show');
};

if (forgotPasswordLink) forgotPasswordLink.onclick = (e) => {
    e.preventDefault();
    if (signInModal) signInModal.classList.remove('show');
    if (forgotPasswordModal) forgotPasswordModal.classList.add('show');
};

// Switch from Donate Options Modal
if (goToRegisterBtn) goToRegisterBtn.onclick = () => {
    if (donateOptionsModal) donateOptionsModal.classList.remove('show');
    if (registerModal) registerModal.classList.add('show');
};
if (goToSignInBtn) goToSignInBtn.onclick = () => {
    if (donateOptionsModal) donateOptionsModal.classList.remove('show');
    if (signInModal) signInModal.classList.add('show');
};

// Donation Page Step Navigation
if (nextToAppointmentBtn) nextToAppointmentBtn.addEventListener('click', () => {
    if (!donationInfoForm || !donationInfoForm.checkValidity()) {
        showMessageBox('Missing Information', 'Please fill in all required fields in Your Information.', 'error');
        return;
    }
    showDonationStep(2);
});

if (backToInfoBtn) backToInfoBtn.addEventListener('click', () => {
    showDonationStep(1);
});

if (editInfoBtn) editInfoBtn.addEventListener('click', () => {
    if (!bookNameMain) return; // Ensure bookNameMain exists
    const isCurrentlyReadonly = bookNameMain.readOnly;
    setInfoFieldsReadonly(!isCurrentlyReadonly);

    if (isCurrentlyReadonly) {
        editInfoBtn.textContent = 'Save';
        editInfoBtn.classList.add('save');
    } else {
        if (!donationInfoForm || !donationInfoForm.checkValidity()) {
            showMessageBox('Validation Error', 'Please ensure all fields are correctly filled before saving.', 'error');
            setInfoFieldsReadonly(false);
            return;
        }

        currentUserData.fullName = bookNameMain.value;
        currentUserData.studentId = bookStudentIdMain.value;
        currentUserData.branch = bookBranchMain.value;
        currentUserData.email = bookEmailMain.value;
        currentUserData.bloodGroup = bookBloodGroupMain.value;
        currentUserData.mobile = bookMobileMain.value;
        if(bookPincodeMain) currentUserData.pinCode = bookPincodeMain.value;
        currentUserData.lastDonated = bookLastDonated.value;

        showMessageBox('Information Updated', 'Your personal details have been updated.', 'success');
        editInfoBtn.textContent = 'Edit';
        editInfoBtn.classList.remove('save');
    }
});


if (confirmDonationBtn) confirmDonationBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (!donationAppointmentForm || !donationAppointmentForm.checkValidity() || !donationConsentMain || !donationConsentMain.checked) {
        showMessageBox('Consent Required', 'Please select a time slot and confirm your commitment to donate blood.', 'error');
        return;
    }
    updateSummary();
    if (summaryModal) summaryModal.classList.add('show');
});

if (backFromSummaryBtn) backFromSummaryBtn.addEventListener('click', () => {
    if (summaryModal) summaryModal.classList.remove('show');
    showDonationStep(2);
});

if (finalConfirmBtn) finalConfirmBtn.addEventListener('click', async () => {
    if (!finalConfirmBtn) return; // Ensure button exists
    finalConfirmBtn.disabled = true;
    finalConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    const donationData = {
        userId: currentUserData.studentId,
        donorName: bookNameMain.value,
        donorEmail: bookEmailMain.value,
        bloodGroup: bookBloodGroupMain.value,
        mobile: bookMobileMain.value,
        donationDate: donationDateMain.value,
        timeSlot: timeSlotMain.value,
        consentGiven: donationConsentMain.checked
    };

    console.log('Final Confirmation Submitted:', donationData);

    setTimeout(() => {
        if (finalConfirmBtn) {
            finalConfirmBtn.disabled = false;
            finalConfirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Final Confirmation';
        }
        if (summaryModal) summaryModal.classList.remove('show');
        showPage('donation-success');
    }, 1500);
});

if (backToHomeBtn) backToHomeBtn.onclick = () => {
    showPage('home');
    if(donationInfoForm) donationInfoForm.reset();
    if(donationAppointmentForm) donationAppointmentForm.reset();
    if(donationConsentMain) donationConsentMain.checked = false;
    prefillDonationFormMain();
    setInfoFieldsReadonly(true);
    if(editInfoBtn) {
      editInfoBtn.textContent = 'Edit';
      editInfoBtn.classList.remove('save');
    }
};

if (document.getElementById('signin-form')) {
    document.getElementById('signin-form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Sign In Attempt:', {
            email: this['signin-email'].value,
            password: this['signin-password'].value
        });
        isUserSignedIn = true;
        if (signInModal) signInModal.classList.remove('show');
        showMessageBox('Sign In Successful', 'You have successfully signed in!', 'success');
    });
}

if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function (event) {
        event.preventDefault();
        if (!this.consent || !this.consent.checked) {
            showMessageBox('Consent Required', 'Please agree to the data usage terms to register.', 'error');
            return;
        }
        console.log('Register Attempt:', {
            fullName: this.name.value,
            studentId: this['student-id'].value,
            branch: this.branch.value,
            email: this['register-email'].value,
            bloodGroup: this['blood-group'].value,
            dob: this.dob.value,
            weight: this.weight.value,
            mobile: this.mobile.value,
            pincode: this['register-pincode'] ? this['register-pincode'].value : null,
            lastDonated: this['last-donated'].value,
            password: this['register-password'].value,
            consent: this.consent.checked
        });
        isUserSignedIn = true;
        currentUserData = {
            fullName: this.name.value,
            studentId: this['student-id'].value,
            branch: this.branch.value,
            email: this['register-email'].value,
            bloodGroup: this['blood-group'].value,
            mobile: this.mobile.value,
            pinCode: this['register-pincode'] ? this['register-pincode'].value : null,
            lastDonated: this['last-donated'].value
        };
        if (registerModal) registerModal.classList.remove('show');
        showMessageBox('Registration Successful', 'Welcome to LifeLink! You can now book your donation.', 'success');
    });
}

// Window click to close any open modal
window.onclick = (event) => {
    if (event.target == signInModal) signInModal.classList.remove('show');
    if (event.target == registerModal) registerModal.classList.remove('show');
    if (event.target == receiveOptionsModal) receiveOptionsModal.classList.remove('show');
    if (event.target == donateOptionsModal) donateOptionsModal.classList.remove('show');
    if (event.target == messageBox) messageBox.classList.remove('show');
    if (event.target == summaryModal) summaryModal.classList.remove('show');
    if (event.target == forgotPasswordModal) {
        if (forgotPasswordModal) forgotPasswordModal.classList.remove('show');
        if (forgotPasswordStep1) forgotPasswordStep1.style.display = 'block';
        if (forgotPasswordStep2) forgotPasswordStep2.style.display = 'none';
        if (forgotPasswordStep3) forgotPasswordStep3.style.display = 'none';
    }

    // Close dropdowns
    if (!event.target.matches('.dropbtn')) {
        document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
            openDropdown.classList.remove('show');
        });
    }
};

// --- Click-based Dropdown Logic ---
document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation();
        const currentDropdownContent = this.nextElementSibling;
        document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
            if (openDropdown !== currentDropdownContent) {
                openDropdown.classList.remove('show');
            }
        });
        currentDropdownContent.classList.toggle('show');
    });
});

// Function to handle smooth scrolling to sections on the home page
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
    }
}

// Update nav-link event listeners for scrolling within the home page
document.querySelectorAll('.nav-center .nav-link, .footer-links .nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = link.dataset.target;
        // Check if the link is an internal anchor link
        if (link.href.includes('#') && link.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            if (targetId === 'hero-section') { // 'Home' link points to hero-section
                showPage('home');
            } else {
                // Ensure main content is visible before scrolling to a section within it
                if (mainContentSections && mainContentSections.style.display !== 'block') {
                    showPage('home');
                    setTimeout(() => scrollToSection(targetId), 100);
                } else {
                    scrollToSection(targetId);
                }
            }
        }
        // External links will be handled by default browser behavior
    });
});

// Event listener for LifeLink logo (Home functionality)
if (document.querySelector('.navbar .logo')) {
    document.querySelector('.navbar .logo').addEventListener('click', () => {
        showPage('home');
    });
}

// --- Forgot Password Steps Logic ---
if (requestOtpBtn) {
  requestOtpBtn.addEventListener('click', () => {
    const emailPhoneInput = document.getElementById('forgot-email-phone');
    if (emailPhoneInput && emailPhoneInput.checkValidity()) {
      if(forgotPasswordStep1) forgotPasswordStep1.style.display = 'none';
      if(forgotPasswordStep2) forgotPasswordStep2.style.display = 'block';
      console.log(`OTP requested for: ${emailPhoneInput.value}`);
    } else {
      if (emailPhoneInput) emailPhoneInput.reportValidity();
    }
  });
}

if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener('click', () => {
    const otpInput = document.getElementById('otp');
    if (otpInput && otpInput.checkValidity() && otpInput.value === "123456") {
      if(forgotPasswordStep2) forgotPasswordStep2.style.display = 'none';
      if(forgotPasswordStep3) forgotPasswordStep3.style.display = 'block';
      console.log(`OTP verified!`);
    } else {
      if (otpInput) otpInput.reportValidity();
      console.error('Invalid OTP. Please try again.');
    }
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput ? newPasswordInput.value : '';
    const confirmNewPassword = confirmNewPasswordInput ? confirmNewPasswordInput.value : '';
    if (newPassword === confirmNewPassword && newPassword.length >= 6) {
      console.log('Password reset successfully!');
      if (forgotPasswordModal) forgotPasswordModal.classList.remove('show');
      showMessageBox('Success', 'Your password has been reset successfully! Please sign in with your new password.', 'success');
      if (forgotPasswordForm) forgotPasswordForm.reset();
      if(forgotPasswordStep1) forgotPasswordStep1.style.display = 'block';
      if(forgotPasswordStep2) forgotPasswordStep2.style.display = 'none';
      if(forgotPasswordStep3) forgotPasswordStep3.style.display = 'none';
    } else {
      showMessageBox('Error', 'New passwords do not match or are too short. Please try again.', 'error');
    }
  });
}

if (resendOtpLink) {
  resendOtpLink.addEventListener('click', (e) => {
    e.preventDefault();
    const emailPhoneInput = document.getElementById('forgot-email-phone');
    const emailPhoneValue = emailPhoneInput ? emailPhoneInput.value : '';
    console.log(`Resending OTP to: ${emailPhoneValue}`);
    showMessageBox('OTP Re-sent', 'A new OTP has been sent to your contact.', 'info');
  });
}

// Initial load: ensure main content is visible and donation page is hidden
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    if (isUserSignedIn) {
        prefillDonationFormMain();
    }
});
