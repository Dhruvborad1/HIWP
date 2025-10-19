 // User data storage and management
        const USER_KEY = 'ayurhealth_users';
        const CURRENT_USER_KEY = 'ayurhealth_current_user';
        const JOURNAL_KEY = 'ayurhealth_journal';
        const WATER_KEY = 'ayurhealth_water';
        
        // Initialize users array in localStorage if not exists
        if (!localStorage.getItem(USER_KEY)) {
            localStorage.setItem(USER_KEY, JSON.stringify([]));
        }
        
        // Page elements
        const sections = {
            welcome: document.getElementById('welcomeSection'),
            login: document.getElementById('loginSection'),
            register: document.getElementById('registerSection'),
            dashboard: document.getElementById('dashboard')
        };
        
        // Navigation elements
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const logoutItem = document.getElementById('logoutItem');
        const showLogin = document.getElementById('showLogin');
        const showRegister = document.getElementById('showRegister');
        const startJourneyBtn = document.getElementById('startJourneyBtn');
        const welcomeRegisterBtn = document.getElementById('welcomeRegisterBtn');
        const navDashboard = document.getElementById('navDashboard');
        const userNameElement = document.getElementById('userName');
        const navHome = document.getElementById('navHome');

        
        // Form elements
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registrationForm');
        
        // Calendar elements
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthYear = document.getElementById('currentMonthYear');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        // Journal elements
        const moodOptions = document.querySelectorAll('.mood-option');
        const journalEntry = document.getElementById('journalEntry');
        const saveJournalBtn = document.getElementById('saveJournal');
        
        // Water tracker elements
        const waterGlasses = document.querySelectorAll('.water-glass');
        const resetWaterBtn = document.getElementById('resetWater');
        
        // Current date
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        // Show section and hide others
        function showSection(sectionId) {
            Object.keys(sections).forEach(key => {
                sections[key].style.display = key === sectionId ? 'block' : 'none';
            });
        }
        
        // Check if user is logged in
      function checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (currentUser) {
        showSection('dashboard');
        logoutItem.style.display = 'block';
        userNameElement.textContent = currentUser.name;
        generateCalendar(currentMonth, currentYear);
        loadJournal();
        loadWaterTracker();
        updateProfileInfo(currentUser);
    } else {
        // If trying to access dashboard without login, show welcome page
        if (window.location.hash === '#dashboard') {
            showSection('welcome');
            alert('Please login or register to access the dashboard.');
        } else {
            showSection('welcome');
        }
        logoutItem.style.display = 'none';
        clearDashboardData();
    }
}
        
        // Generate calendar for specific month and year
        function generateCalendar(month, year) {
            // Set month and year in header
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            currentMonthYear.textContent = `${monthNames[month]} ${year}`;
            
            // Get first day of month and total days in month
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Get days from previous month
            const prevMonthDays = new Date(year, month, 0).getDate();
            
            // Clear calendar
            calendarDays.innerHTML = '';
            
            // Create calendar days
            let day = 1;
            let nextMonthDay = 1;
            
            // Create 6 rows (weeks)
            for (let i = 0; i < 6; i++) {
                // Stop if we've rendered all days
                if (day > daysInMonth && i > 0) break;
                
                // Create row
                const row = document.createElement('div');
                row.className = 'row';
                
                // Create 7 columns (days)
                for (let j = 0; j < 7; j++) {
                    const col = document.createElement('div');
                    col.className = 'col calendar-day';
                    
                    // Previous month's days
                    if (i === 0 && j < firstDay) {
                        const prevDay = prevMonthDays - firstDay + j + 1;
                        col.innerHTML = `<div class="day-number">${prevDay}</div>`;
                        col.style.opacity = '0.5';
                    } 
                    // Current month's days
                    else if (day <= daysInMonth) {
                        // Check if this is today
                        const today = new Date();
                        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                        
                        col.innerHTML = `<div class="day-number ${isToday ? 'today' : ''}">${day}</div>`;
                        col.classList.toggle('today', isToday);
                        
                        // Add sample activities (in a real app, these would come from user data)
                        if (day % 3 === 0) {
                            col.innerHTML += `
                                <div class="mt-4">
                                    <span class="activity-dot food-dot"></span> Meal plan
                                    <br>
                                    <span class="activity-dot exercise-dot"></span> Yoga 20min
                                </div>
                            `;
                        } else if (day % 5 === 0) {
                            col.innerHTML += `
                                <div class="mt-4">
                                    <span class="activity-dot wellness-dot"></span> Meditation
                                    <br>
                                    <span class="activity-dot reminder-dot"></span> Doctor visit
                                </div>
                            `;
                        }
                        
                        day++;
                    } 
                    // Next month's days
                    else {
                        col.innerHTML = `<div class="day-number">${nextMonthDay}</div>`;
                        col.style.opacity = '0.5';
                        nextMonthDay++;
                    }
                    
                    row.appendChild(col);
                }
                
                calendarDays.appendChild(row);
            }
        }
        
        // Register new user
        function registerUser(name, email, password, healthInfo, prakritiAnswers) {
            const users = JSON.parse(localStorage.getItem(USER_KEY));
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                alert('User with this email already exists!');
                return false;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password, // Note: In a real app, passwords should be hashed
                healthInfo,
                prakriti: determinePrakriti(prakritiAnswers),
                joined: new Date().toISOString().split('T')[0] // Store join date as YYYY-MM-DD
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem(USER_KEY, JSON.stringify(users));
            
            // Log user in
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
            
            return newUser;
        }
        
        // Simplified prakriti determination
        function determinePrakriti(traits) {
            // This is a simplified example - real implementation would be more complex
            const scores = { vata: 0, pitta: 0, kapha: 0 };
            
            // Analyze traits and assign scores
            if (traits.bodyFrame === 'vata') scores.vata += 3;
            if (traits.bodyFrame === 'pitta') scores.pitta += 3;
            if (traits.bodyFrame === 'kapha') scores.kapha += 3;
            
            if (traits.skinType === 'vata') scores.vata += 2;
            if (traits.skinType === 'pitta') scores.pitta += 2;
            if (traits.skinType === 'kapha') scores.kapha += 2;
            
            if (traits.hairType === 'vata') scores.vata += 2;
            if (traits.hairType === 'pitta') scores.pitta += 2;
            if (traits.hairType === 'kapha') scores.kapha += 2;
            
            if (traits.appetite === 'vata') scores.vata += 3;
            if (traits.appetite === 'pitta') scores.pitta += 3;
            if (traits.appetite === 'kapha') scores.kapha += 3;
            
            // Determine primary and secondary doshas
            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            return {
                primary: sorted[0][0],
                secondary: sorted[1][0],
                scores
            };
        }
        
        // Login user
        function loginUser(email, password) {
            const users = JSON.parse(localStorage.getItem(USER_KEY));
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                return user;
            }
            return null;
        }
        
        // Logout user
   function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(JOURNAL_KEY);
    localStorage.removeItem(WATER_KEY);
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    
    // Clear dashboard data
    clearDashboardData();
    
    // Hide logout button
    logoutItem.style.display = 'none';
    
    // Show welcome page
    showSection('welcome');
}


function clearDashboardData() {
    // Clear user name and prakriti badges
    document.getElementById('userName').textContent = 'Guest';
    document.querySelectorAll('.prakriti-badge').forEach(badge => {
        badge.style.display = 'none';
    });

    // Reset profile tab information
    const profileFields = [
        'profileName', 'profileEmail', 'profileDob', 'profileGender',
        'profileHeight', 'profileWeight', 'profileBMI', 'profileBloodType',
        'profileAllergies', 'profileConditions', 'profileJoinDate'
    ];
    
    profileFields.forEach(field => {
        document.getElementById(field).textContent = '';
    });

    // Reset prakriti analysis section
    document.querySelectorAll('.dosha-result-card').forEach(card => {
        card.querySelector('.dosha-score').textContent = '0%';
    });

    // Clear journal and water tracker
    journalEntry.value = '';
    moodOptions.forEach(opt => opt.classList.remove('selected'));
    waterGlasses.forEach(glass => {
        glass.classList.remove('active');
        glass.querySelector('.water-fill').style.height = '0%';
    });

    // Show login prompt in recommendations
    document.getElementById('recommendations').innerHTML = `
        <div class="alert alert-info">
            <h4>Welcome to AyurHealth!</h4>
            <p>To access your personalized wellness dashboard, please <a href="#" id="promptLogin" style="color: var(--primary); font-weight: bold;">login</a> or <a href="#" id="promptRegister" style="color: var(--primary); font-weight: bold;">register</a>.</p>
            <p>After logging in, you'll get:</p>
            <ul>
                <li>Personalized Prakriti analysis</li>
                <li>Customized diet and exercise plans</li>
                <li>Daily wellness tracking</li>
                <li>Progress monitoring</li>
                <li>And much more!</li>
            </ul>
        </div>
    `;

    // Add event listeners to the prompt links
    document.getElementById('promptLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    document.getElementById('promptRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });
}



        // Load journal for current day
        function loadJournal() {
            const today = new Date().toISOString().split('T')[0];
            const journal = JSON.parse(localStorage.getItem(JOURNAL_KEY)) || {};
            
            if (journal[today]) {
                // Set mood
                document.querySelectorAll('.mood-option').forEach(option => {
                    option.classList.toggle('selected', option.dataset.mood === journal[today].mood);
                });
                
                // Set journal entry
                journalEntry.value = journal[today].entry || '';
            }
        }
        
        // Save journal for current day
        function saveJournal() {
            const today = new Date().toISOString().split('T')[0];
            const selectedMood = document.querySelector('.mood-option.selected')?.dataset.mood;
            const entry = journalEntry.value;
            
            if (!selectedMood) {
                alert('Please select your mood for today');
                return;
            }
            
            const journal = JSON.parse(localStorage.getItem(JOURNAL_KEY)) || {};
            journal[today] = { mood: selectedMood, entry };
            
            localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
            alert('Journal saved successfully!');
        }
        
        // Load water tracker data
        function loadWaterTracker() {
            const today = new Date().toISOString().split('T')[0];
            const waterData = JSON.parse(localStorage.getItem(WATER_KEY)) || {};
            
            if (waterData[today]) {
                waterGlasses.forEach((glass, index) => {
                    if (index < waterData[today]) {
                        glass.classList.add('active');
                        glass.querySelector('.water-fill').style.height = '100%';
                    }
                });
            }
        }
        
        // Save water tracker data
        function saveWaterTracker(glasses) {
            const today = new Date().toISOString().split('T')[0];
            const waterData = JSON.parse(localStorage.getItem(WATER_KEY)) || {};
            waterData[today] = glasses;
            
            localStorage.setItem(WATER_KEY, JSON.stringify(waterData));
        }
        
        // Update profile information
        function updateProfileInfo(user) {
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileDob').textContent = user.healthInfo.dob;
            document.getElementById('profileGender').textContent = user.healthInfo.gender;
            document.getElementById('profileHeight').textContent = user.healthInfo.height;
            document.getElementById('profileWeight').textContent = user.healthInfo.weight;
            document.getElementById('profileBloodType').textContent = user.healthInfo.bloodType;
            document.getElementById('profileAllergies').textContent = user.healthInfo.allergies || 'None';
            document.getElementById('profileConditions').textContent = user.healthInfo.medicalConditions || 'None';
            document.getElementById('profileJoinDate').textContent = user.joined;
            
            // Calculate BMI
            if (user.healthInfo.height && user.healthInfo.weight) {
                const heightInMeters = user.healthInfo.height / 100;
                const bmi = (user.healthInfo.weight / (heightInMeters * heightInMeters)).toFixed(1);
                document.getElementById('profileBMI').textContent = bmi;
            }
        }
        
        // Multi-step form navigation elements
        const nextToStep2 = document.getElementById('nextToStep2');
        const nextToStep3 = document.getElementById('nextToStep3');
        const nextToStep4 = document.getElementById('nextToStep4');
        const prevToStep1 = document.getElementById('prevToStep1');
        const prevToStep2 = document.getElementById('prevToStep2');
        const prevToStep3 = document.getElementById('prevToStep3');
        
        // Multi-step form navigation functions
        function goToStep(stepNumber) {
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.getElementById(`step${stepNumber}`).classList.add('active');
            
            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
                step.classList.remove('completed');
            });
            
            for (let i = 1; i < stepNumber; i++) {
                document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
            }
            
            document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
        }
        
        // Form validation helper
        function validateStep(stepId) {
            let isValid = true;
            const step = document.getElementById(stepId);
            
            // Get all required fields in this step
            const requiredFields = step.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                // Reset validation state
                field.classList.remove('is-invalid');
                
                // Skip validation for radio groups that have one selected
                if (field.type === 'radio') {
                    const radioGroup = document.getElementsByName(field.name);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    
                    if (!isChecked) {
                        isValid = false;
                        // Add invalid class to the first radio in the group
                        radioGroup[0].classList.add('is-invalid');
                    }
                } 
                // Validate other field types
                else if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
                
                // Special validation for password match
                if (field.id === 'confirmPassword') {
                    const password = document.getElementById('password').value;
                    const confirmPassword = field.value;
                    
                    if (password !== confirmPassword) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    }
                }
            });
            
            return isValid;
        }
        
        // Event Listeners
        loginBtn.addEventListener('click', () => showSection('login'));
        registerBtn.addEventListener('click', () => showSection('register'));
        showLogin?.addEventListener('click', () => showSection('login'));
        showRegister?.addEventListener('click', () => showSection('register'));
        startJourneyBtn.addEventListener('click', () => showSection('register'));
        welcomeRegisterBtn.addEventListener('click', () => showSection('register'));


navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (currentUser) {
        showSection('dashboard');
    } else {
        showSection('login');
        alert('Please login to access your dashboard.');
    }
});        
        
        logoutBtn.addEventListener('click', logoutUser);
        
        // Calendar navigation
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
        


navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('welcome');
});

        // Mood selection
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // Save journal
        saveJournalBtn.addEventListener('click', saveJournal);
        
        // Water tracker
        waterGlasses.forEach((glass, index) => {
            glass.addEventListener('click', () => {
                // Toggle this glass and all previous ones
                for (let i = 0; i <= index; i++) {
                    waterGlasses[i].classList.add('active');
                    waterGlasses[i].querySelector('.water-fill').style.height = '100%';
                }
                // Untoggle all next ones
                for (let i = index + 1; i < waterGlasses.length; i++) {
                    waterGlasses[i].classList.remove('active');
                    waterGlasses[i].querySelector('.water-fill').style.height = '0%';
                }
                
                saveWaterTracker(index + 1);
            });
        });
        
        // Reset water tracker
        resetWaterBtn.addEventListener('click', () => {
            waterGlasses.forEach(glass => {
                glass.classList.remove('active');
                glass.querySelector('.water-fill').style.height = '0%';
            });
            saveWaterTracker(0);
        });
        
        // Form Submissions
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const user = loginUser(email, password);
            if (user) {
                checkLogin();
            } else {
                alert('Invalid email or password!');
            }
        });
        
        // Multi-step form navigation
        nextToStep2.addEventListener('click', function() {
            if (validateStep('step1')) {
                goToStep(2);
            }
        });
        
        prevToStep1.addEventListener('click', function() {
            goToStep(1);
        });
        
        nextToStep3.addEventListener('click', function() {
            if (validateStep('step2')) {
                goToStep(3);
            }
        });
        
        prevToStep2.addEventListener('click', function() {
            goToStep(2);
        });
        
        nextToStep4.addEventListener('click', function() {
            if (validateStep('step3')) {
                // Update review information
                document.getElementById('reviewName').textContent = document.getElementById('fullName').value;
                document.getElementById('reviewEmail').textContent = document.getElementById('email').value;
                document.getElementById('reviewDob').textContent = document.getElementById('dob').value;
                document.getElementById('reviewGender').textContent = document.getElementById('gender').value;
                document.getElementById('reviewHeight').textContent = document.getElementById('height').value;
                document.getElementById('reviewWeight').textContent = document.getElementById('weight').value;
                document.getElementById('reviewBloodType').textContent = document.getElementById('bloodType').value;
                document.getElementById('reviewAllergies').textContent = document.getElementById('allergies').value || 'None';
                
                // Generate temporary prakriti results
                const prakritiResults = document.getElementById('prakritiResults');
                prakritiResults.innerHTML = `
                    <div class="alert alert-info">
                        <p>Based on your responses, your Prakriti analysis will be:</p>
                        <div class="progress mb-2" style="height: 20px;">
                            <div class="progress-bar bg-warning" role="progressbar" style="width: 60%">Pitta 60%</div>
                            <div class="progress-bar bg-info" role="progressbar" style="width: 30%">Kapha 30%</div>
                            <div class="progress-bar bg-secondary" role="progressbar" style="width: 10%">Vata 10%</div>
                        </div>
                        <p class="mb-0">Primary: Pitta | Secondary: Kapha</p>
                    </div>
                `;
                
                goToStep(4);
            }
        });
        
        prevToStep3.addEventListener('click', function() {
            goToStep(3);
        });
        
        // Registration form submission
           registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate terms agreement
            if (!document.getElementById('termsAgreement').checked) {
                document.getElementById('termsAgreement').classList.add('is-invalid');
                return;
            }
            
            // Gather form data
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const healthInfo = {
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                height: document.getElementById('height').value,
                weight: document.getElementById('weight').value,
                bloodType: document.getElementById('bloodType').value,
                allergies: document.getElementById('allergies').value,
                medicalConditions: document.getElementById('medicalConditions').value,
                medications: document.getElementById('medications').value
            };
            
            // Get Prakriti answers
            const prakritiAnswers = {
                bodyFrame: document.querySelector('input[name="bodyFrame"]:checked')?.value,
                skinType: document.querySelector('input[name="skinType"]:checked')?.value,
                hairType: document.querySelector('input[name="hairType"]:checked')?.value,
                appetite: document.querySelector('input[name="appetite"]:checked')?.value
            };

            // Register user
            const user = registerUser(name, email, password, healthInfo, prakritiAnswers);
            
            if (user) {
                alert('Registration successful! Welcome to AyurHealth.');
                checkLogin();
            }
        });
        
        // Initialize page
       // In the initialization code, add this:
window.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const triggerTabList = [].slice.call(document.querySelectorAll('#dashboardTabs button'));
    triggerTabList.forEach(function (triggerEl) {
        new bootstrap.Tab(triggerEl);
        
        // Add click handler to show login prompt if not logged in
        triggerEl.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
            if (!currentUser) {
                const tabPane = document.querySelector(this.dataset.bsTarget);
                tabPane.innerHTML = `
                    <div class="alert alert-info text-center">
                        <h4>Please login to access this feature</h4>
                        <p>This section requires you to be logged in to view your personalized data.</p>
                        <div class="d-flex justify-content-center gap-3 mt-3">
                            <a href="#" class="btn btn-primary" id="tabLoginBtn">Login</a>
                            <a href="#" class="btn btn-outline-primary" id="tabRegisterBtn">Register</a>
                        </div>
                    </div>
                `;
                
                document.getElementById('tabLoginBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection('login');
                });
                
                document.getElementById('tabRegisterBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection('register');
                });
            }
        });
    });
    
    checkLogin();
    generateCalendar(currentMonth, currentYear);
});


       // Reset dashboard to show general information
function resetDashboard() {
    // Clear user-specific data
    document.getElementById('userName').textContent = 'Guest';
    document.querySelectorAll('.prakriti-badge').forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Reset journal and water tracker
    journalEntry.value = '';
    moodOptions.forEach(opt => opt.classList.remove('selected'));
    waterGlasses.forEach(glass => {
        glass.classList.remove('active');
        glass.querySelector('.water-fill').style.height = '0%';
    });
    
    // Show generic recommendations instead of personalized ones
    document.getElementById('recommendations').innerHTML = `
        <h3 class="section-title">General Ayurvedic Recommendations</h3>
        <div class="alert alert-info">
            Please login or register to receive personalized recommendations based on your Prakriti analysis.
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card feature-card text-center p-4">
                    <i class="fas fa-utensils dashboard-icon"></i>
                    <h4>Balanced Diet</h4>
                    <p>Eat fresh, seasonal foods and maintain regular meal times for optimal digestion.</p>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card feature-card text-center p-4">
                    <i class="fas fa-running dashboard-icon"></i>
                    <h4>Daily Exercise</h4>
                    <p>Engage in moderate physical activity suitable for your current fitness level.</p>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card feature-card text-center p-4">
                    <i class="fas fa-spa dashboard-icon"></i>
                    <h4>Stress Management</h4>
                    <p>Practice mindfulness, meditation, or yoga to maintain mental balance.</p>
                </div>
            </div>
        </div>
    `;
}