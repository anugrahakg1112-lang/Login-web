"use strict";

/*
=========================================================
  ANIMATED LOGIN
  Rive + HTML/CSS/JavaScript
=========================================================

  Rive file:
  assets/auth_teddy.riv

  Artboard:
  Login Machine

  State Machine:
  Login Machine

  Inputs:
  isFocus
  numLook
  isPrivateField
  isPrivateFieldShow
  successTrigger
  failTrigger
=========================================================
*/

const RIVE_FILE = "assets/auth_teddy.riv";
const ARTBOARD = "Login Machine";
const STATE_MACHINE = "Login Machine";

/* Demo credentials.
   Ganti sesuai kebutuhan. */
const LOGIN_EMAIL = "admin@example.com";
const LOGIN_PASSWORD = "12345678";


/* ======================================================
   ELEMENTS
====================================================== */

const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailGroup = document.getElementById("emailGroup");
const passwordGroup = document.getElementById("passwordGroup");

const passwordToggle =
  document.getElementById("passwordToggle");

const eyeIcon =
  document.getElementById("eyeIcon");

const loginButton =
  document.getElementById("loginButton");

const status =
  document.getElementById("status");

const riveWrapper =
  document.querySelector(".rive-wrapper");

const forgotPassword =
  document.getElementById("forgotPassword");


/* ======================================================
   RIVE
====================================================== */

let riveInstance = null;

let isFocusInput = null;
let numLookInput = null;
let isPrivateFieldInput = null;
let isPrivateFieldShowInput = null;

let successTrigger = null;
let failTrigger = null;


/* ======================================================
   START RIVE
====================================================== */

function initRive() {

  if (typeof rive === "undefined") {
    enableFallback();
    return;
  }

  try {

    riveInstance = new rive.Rive({

      src: RIVE_FILE,

      canvas:
        document.getElementById("riveCanvas"),

      autoplay: true,

      artboard: ARTBOARD,

      stateMachines: STATE_MACHINE,

      fit: rive.Fit.Contain,

      alignment: rive.Alignment.Center,

      onLoad: () => {

        try {

          const inputs =
            riveInstance.stateMachineInputs(
              STATE_MACHINE
            );

          if (!inputs || !inputs.length) {
            enableFallback();
            return;
          }

          inputs.forEach(input => {

            switch (input.name) {

              case "isFocus":
                isFocusInput = input;
                break;

              case "numLook":
                numLookInput = input;
                break;

              case "isPrivateField":
                isPrivateFieldInput = input;
                break;

              case "isPrivateFieldShow":
                isPrivateFieldShowInput = input;
                break;

              case "successTrigger":
                successTrigger = input;
                break;

              case "failTrigger":
                failTrigger = input;
                break;

            }

          });

        } catch (error) {
          console.warn("Rive input error:", error);
          enableFallback();
        }

      },

      onLoadError: () => {
        enableFallback();
      }

    });

  } catch (error) {

    console.warn("Rive initialization failed:", error);

    enableFallback();

  }

}


/* ======================================================
   FALLBACK
====================================================== */

function enableFallback() {
  riveWrapper.classList.add("rive-failed");
}


/* ======================================================
   EMAIL FOCUS
====================================================== */

emailInput.addEventListener("focus", () => {

  riveWrapper.classList.add("active");
  riveWrapper.classList.remove("password-focus");

  if (isFocusInput) {
    isFocusInput.value = true;
  }

  if (isPrivateFieldInput) {
    isPrivateFieldInput.value = false;
  }

  if (isPrivateFieldShowInput) {
    isPrivateFieldShowInput.value = false;
  }

});


emailInput.addEventListener("input", () => {

  if (!numLookInput) return;

  const value =
    emailInput.value.trim();

  /*
    Convert text length into a smooth
    0–100 movement value.
  */

  const length =
    Math.min(value.length, 30);

  numLookInput.value =
    Math.min(100, length / 30 * 100);

});


/* ======================================================
   PASSWORD FOCUS
====================================================== */

passwordInput.addEventListener("focus", () => {

  riveWrapper.classList.add("active");
  riveWrapper.classList.add("password-focus");

  if (isFocusInput) {
    isFocusInput.value = false;
  }

  if (isPrivateFieldInput) {
    isPrivateFieldInput.value = true;
  }

  if (isPrivateFieldShowInput) {
    isPrivateFieldShowInput.value =
      passwordInput.type === "text";
  }

});


/* ======================================================
   PASSWORD TOGGLE
====================================================== */

passwordToggle.addEventListener("click", () => {

  const showing =
    passwordInput.type === "text";

  passwordInput.type =
    showing ? "password" : "text";

  passwordToggle.setAttribute(
    "aria-label",
    showing ? "Show password" : "Hide password"
  );

  if (showing) {

    eyeIcon.innerHTML = `
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/>
      <circle cx="12" cy="12" r="2.5"/>
    `;

  } else {

    eyeIcon.innerHTML = `
      <path d="M3 3l18 18"/>
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.2 3.9"/>
      <path d="M6.1 6.1C3.5 8 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1"/>
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
    `;

  }

  if (isPrivateFieldShowInput) {
    isPrivateFieldShowInput.value = !showing;
  }

});


/* ======================================================
   BLUR
====================================================== */

emailInput.addEventListener("blur", () => {

  if (!passwordInput.matches(":focus")) {

    riveWrapper.classList.remove("active");

    if (isFocusInput) {
      isFocusInput.value = false;
    }

  }

});


passwordInput.addEventListener("blur", () => {

  if (!emailInput.matches(":focus")) {

    riveWrapper.classList.remove("active");

    if (isPrivateFieldInput) {
      isPrivateFieldInput.value = false;
    }

  }

});


/* ======================================================
   VALIDATION
====================================================== */

function clearErrors() {

  document
    .querySelectorAll(".input-group")
    .forEach(group => {

      group.classList.remove(
        "error",
        "success"
      );

      const error =
        group.querySelector(".error-message");

      if (error) {
        error.textContent = "";
      }

    });

}


function showError(group, message) {

  group.classList.remove("success");
  group.classList.add("error");

  const error =
    group.querySelector(".error-message");

  if (error) {
    error.textContent = message;
  }

}


function showSuccess(group) {

  group.classList.remove("error");
  group.classList.add("success");

}


/* ======================================================
   FORM SUBMIT
====================================================== */

form.addEventListener("submit", async event => {

  event.preventDefault();

  clearErrors();

  status.className = "status";
  status.textContent = "";

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  let valid = true;


  /* EMAIL */

  if (!email) {

    showError(
      emailGroup,
      "Email wajib diisi."
    );

    valid = false;

  } else if (!isValidEmail(email)) {

    showError(
      emailGroup,
      "Format email tidak valid."
    );

    valid = false;

  } else {

    showSuccess(emailGroup);

  }


  /* PASSWORD */

  if (!password) {

    showError(
      passwordGroup,
      "Password wajib diisi."
    );

    valid = false;

  } else if (password.length < 6) {

    showError(
      passwordGroup,
      "Password minimal 6 karakter."
    );

    valid = false;

  } else {

    showSuccess(passwordGroup);

  }


  if (!valid) {

    triggerFail();

    status.className = "status error";
    status.textContent =
      "Periksa kembali data login.";

    return;

  }


  /* LOADING */

  setLoading(true);

  await wait(900);


  /*
    DEMO LOGIN

    Ganti bagian ini dengan API/backend
    jika login sudah menggunakan database.
  */

  if (
    email === LOGIN_EMAIL &&
    password === LOGIN_PASSWORD
  ) {

    triggerSuccess();

    loginButton.classList.remove("loading");
    loginButton.classList.add("success");

    status.className = "status success";
    status.textContent =
      "Login berhasil.";

    await wait(900);

    /*
      Pindah halaman setelah login.
      Contoh:

      window.location.href = "home.html";
    */

  } else {

    triggerFail();

    setLoading(false);

    loginButton.classList.add("fail");

    status.className = "status error";
    status.textContent =
      "Email atau password salah.";

    setTimeout(() => {
      loginButton.classList.remove("fail");
    }, 400);

  }

});


/* ======================================================
   RIVE SUCCESS
====================================================== */

function triggerSuccess() {

  try {

    if (successTrigger) {
      successTrigger.fire();
    }

  } catch (error) {

    console.warn(
      "Success trigger tidak tersedia:",
      error
    );

  }

}


/* ======================================================
   RIVE FAIL
====================================================== */

function triggerFail() {

  try {

    if (failTrigger) {
      failTrigger.fire();
    }

  } catch (error) {

    console.warn(
      "Fail trigger tidak tersedia:",
      error
    );

  }

}


/* ======================================================
   HELPERS
====================================================== */

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


function wait(milliseconds) {

  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });

}


function setLoading(value) {

  if (value) {

    loginButton.classList.add("loading");
    loginButton.disabled = true;

  } else {

    loginButton.classList.remove("loading");
    loginButton.disabled = false;

  }

}


/* ======================================================
   FORGOT PASSWORD
====================================================== */

forgotPassword.addEventListener("click", event => {

  event.preventDefault();

  status.className = "status";
  status.textContent =
    "Fitur reset password belum dihubungkan.";

});


/* ======================================================
   START
====================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initRive();
  }
);
