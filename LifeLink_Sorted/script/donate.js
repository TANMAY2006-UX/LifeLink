// This file contains JavaScript specific to the donate.html page.

// Simulate user sign-in status and user data (these would typically come from a global script or API)
let isUserSignedIn = true; // Assume signed in for donation page functionality
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

// DOM Elements specific to the donation page
const donationPage = document.getElementById('donation-page');
const donationSuccessMessage = document.getElementById('donation-success-message');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const summaryModal = document.getElementById('summary-modal'); // The summary modal itself

// Buttons and Links
const nextToAppointmentBtn = document.getElementById('next-to-appointment-btn');
const backToInfoBtn = document.getElementById('back-to-info-btn');
const confirmDonationBtn = document.getElementById('confirm-donation-btn');
const finalConfirmBtn = document.getElementById('final-confirm-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const backFromSummaryBtn = document.getElementById('back-from-summary-btn');

// Donation Booking Form Elements
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

// --- Modals (re-using from global script, but defining here for clarity if global is not loaded) ---
const signInModal = document.getElementById('signin-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const messageBox = document.getElementById('message-box');

// Function to show a custom message box (should be defined in global script.js)
// Re-defining a placeholder here in case script.js is not fully loaded/accessible
function showMessageBox(title, message, type = 'info') {
    if (!messageBox) {
        alert(`${title}: ${message}`); // Fallback to alert if messageBox isn't available
        return;
    }
    messageBox.classList.remove('premium-message-box-success', 'premium-message-box-error');
    messageBox.classList.add('premium-message-box');

    if (type === 'success') {
        messageBox.classList.add('premium-message-box-success');
    } else if (type === 'error') {
        messageBox.classList.add('premium-message-box-error');
    }

    document.getElementById('message-box-title').textContent = title;
    document.getElementById('message-box-text').textContent = message;
    messageBox.classList.add('show');
}

// Function to manage the step-by-step donation page flow
function showDonationStep(stepNumber) {
    const steps = [step1, step2];
    steps.forEach((step, index) => {
        if (!step) return; // Ensure step element exists
        const isTarget = (index + 1 === stepNumber);
        if (isTarget) {
            step.classList.remove('hidden');
            step.classList.add('fading-in');
        } else {
            step.classList.add('hidden');
            step.classList.remove('fading-in');
        }
    });
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

        const fixedDonationDate = "2025-10-26"; // Fixed date as per original logic
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

// --- Event Listeners for Donation Page ---
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
    if (!bookNameMain) return;
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

        // Update currentUserData with edited values
        currentUserData.fullName = bookNameMain.value;
        currentUserData.studentId = bookStudentIdMain.value;
        currentUserData.branch = bookBranchMain.value;
        currentUserData.email = bookEmailMain.value;
        currentUserData.bloodGroup = bookBloodGroupMain.value;
        currentUserData.mobile = bookMobileMain.value;
        if(bookPincodeMain) currentUserData.pinCode = bookPincodeMain.value;
        if(bookLastDonated) currentUserData.lastDonated = bookLastDonated.value;


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
    if (!finalConfirmBtn) return;
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
        if (donationPage) donationPage.style.display = 'flex'; // Keep donationPage visible
        if (donationSuccessMessage) donationSuccessMessage.classList.add('show');
        if (step1) step1.classList.add('hidden');
        if (step2) step2.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
});

if (backToHomeBtn) backToHomeBtn.onclick = () => {
    // This button now navigates to the main index.html
    window.location.href = '../index.html';
};


// --- Initial Load Logic for Donate Page ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the donation page content is visible by default when this HTML is loaded
    if (donationPage) {
        donationPage.style.display = 'flex';
    }
    // Make sure step 1 is shown and others are hidden initially
    showDonationStep(1);
    prefillDonationFormMain();
    setInfoFieldsReadonly(true);
    if(editInfoBtn) {
        editInfoBtn.textContent = 'Edit';
        editInfoBtn.classList.remove('save');
    }
});
