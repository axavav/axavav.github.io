
const SUPABASE_URL = "https://nozkyoctxoevdlzbrxzu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K9sBA4symNyYHVLeUllwjA_3gSTrhHz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Находим элементы интерфейса
const loggedOutDiv = document.getElementById('auth-logged-out');
const loggedInDiv = document.getElementById('auth-logged-in');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const userNameSpan = document.getElementById('user-name');
const userEmailSpan = document.getElementById('user-email');
const userAvatarImg = document.getElementById('user-avatar');
// 2. ФУНКЦИЯ ВХОДА ЧЕРЕЗ GOOGLE
async function loginWithGoogle() {
    // Используем новое имя переменной здесь:
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    });

    if (error) {
        console.error('Ошибка при входе:', error.message);
        alert('Не удалось войти через Google: ' + error.message);
    }
}

// 3. ФУНКЦИЯ ВЫХОДА
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Ошибка при выходе:', error.message);
}

// 4. ОТСЛЕЖИВАНИЕ СОСТОЯНИЯ ПОЛЬЗОВАТЕЛЯ (Event Loop & State)
// Этот метод автоматически срабатывает при загрузке страницы, а также каждый раз,
// когда пользователь входит или выходит.
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
        // Пользователь авторизован
        const user = session.user;
        
        // Извлекаем данные профиля, которые передал Google
        userNameSpan.textContent = user.user_metadata.full_name || 'Пользователь';
        userEmailSpan.textContent = user.email;
        userAvatarImg.src = user.user_metadata.avatar_url || '';

        // Переключаем видимость блоков
        loggedOutDiv.style.display = 'none';
        loggedInDiv.style.display = 'block';
    } else {
        // Пользователь НЕ авторизован
        loggedOutDiv.style.display = 'block';
        loggedInDiv.style.display = 'none';
    }
});

// 5. НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ
btnLogin.addEventListener('click', loginWithGoogle);
btnLogout.addEventListener('click', logout);
