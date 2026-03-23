
const USERS = [
  { email: 'thur@demonstracao.com', password: '123456', name: 'thur' },
  { email: 'teste@demonstracao.com', password: '12456', name: 'UTeste' },
];


const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const loginAlert = document.getElementById('loginAlert');
const btnLogin = document.getElementById('btnLogin');
const btnLoader = document.getElementById('btnLoader');
const btnText = btnLogin.querySelector('.btn-text');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const forgotLink = document.getElementById('forgotLink');


window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
  }
});


togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? '🫣' : '🕶';
});


emailInput.addEventListener('input', () => validateEmail(false));
passwordInput.addEventListener('input', () => validatePassword(false));

function validateEmail(showError = true) {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    setFieldState(emailInput, emailError, showError ? 'O e-mail é obrigatório.' : '', 'neutral');
    return false;
  }
  if (!emailRegex.test(value)) {
    setFieldState(emailInput, emailError, showError ? 'Digite um e-mail válido.' : '', 'error');
    return false;
  }
  setFieldState(emailInput, emailError, '', 'success');
  return true;
}

function validatePassword(showError = true) {
  const value = passwordInput.value;

  if (!value) {
    setFieldState(passwordInput, passwordError, showError ? 'A senha é obrigatória.' : '', 'neutral');
    return false;
  }
  if (value.length < 6) {
    setFieldState(passwordInput, passwordError, showError ? 'A senha deve ter pelo menos 6 caracteres.' : '', 'error');
    return false;
  }
  setFieldState(passwordInput, passwordError, '', 'success');
  return true;
}

function setFieldState(input, errorEl, message, state) {
  errorEl.textContent = message;
  input.classList.remove('input-error', 'input-success');
  if (state === 'error') input.classList.add('input-error');
  if (state === 'success') input.classList.add('input-success');
}


forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  showAlert('em desenvolvimento', 'success');
});


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailOk = validateEmail(true);
  const passwordOk = validatePassword(true);

  if (!emailOk || !passwordOk) return;


  setLoading(true);
  hideAlert();

  await delay(1200);

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    
    const sessionData = {
      name: user.name,
      email: user.email,
      loginTime: new Date().toISOString(),
    };
    sessionStorage.setItem('loggedUser', JSON.stringify(sessionData));

    
    if (rememberMe.checked) {
      localStorage.setItem('rememberedEmail', user.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    showAlert('✅ Login realizado com sucesso! Redirecionando...', 'success');

    await delay(800);
    window.location.href = 'dashboard.html';
  } else {
    setLoading(false);
    showAlert('❌ E-mail ou senha incorretos. Tente novamente.', 'error');
    passwordInput.value = '';
    setFieldState(passwordInput, passwordError, '', 'neutral');
    passwordInput.focus();
  }
});


function setLoading(loading) {
  btnLogin.disabled = loading;
  if (loading) {
    btnText.textContent = 'Entrando...';
    btnLoader.classList.remove('hidden');
  } else {
    btnText.textContent = 'Entrar';
    btnLoader.classList.add('hidden');
  }
}

function showAlert(message, type) {
  loginAlert.textContent = message;
  loginAlert.className = `alert alert-${type}`;
}

function hideAlert() {
  loginAlert.className = 'alert';
  loginAlert.textContent = '';
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
