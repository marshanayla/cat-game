// Populate day dropdown
function populateDays() {
    const daySelect = document.getElementById('birthDay');
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
}

// Calculate age from birth date
function calculateAge(day, month, year) {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // Calculate years and months
    let years = age;
    let months = monthDiff;
    
    if (months < 0) {
        months += 12;
    }
    
    // Adjust months if day hasn't occurred this month
    if (today.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
            months += 12;
            years--;
        }
    }
    
    return { years, months };
}

// Validate age (must be more than 3 years old)
function validateAge(day, month, year) {
    const { years, months } = calculateAge(day, month, year);
    
    // Check if age is more than 3 years
    if (years > 3) {
        return { valid: true, age: { years, months } };
    } else if (years === 3) {
        // If exactly 3 years, check if they've had their birthday this year
        // Actually, we want strictly more than 3, so 3 years old (even with months) is not allowed
        return { valid: false, age: { years, months } };
    } else {
        return { valid: false, age: { years, months } };
    }
}

// Validate date is valid
function isValidDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return date.getDate() === parseInt(day) &&
           date.getMonth() === month - 1 &&
           date.getFullYear() === parseInt(year);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Hide error message
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Show name error message
function showNameError(message) {
    const errorDiv = document.getElementById('nameErrorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Hide name error message
function hideNameError() {
    document.getElementById('nameErrorMessage').style.display = 'none';
}

// Store player data
let playerData = {
    birthDay: null,
    birthMonth: null,
    birthYear: null,
    age: null,
    gender: null,
    name: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    populateDays();
    
    const registrationForm = document.getElementById('registrationForm');
    const registrationScreen = document.getElementById('registrationScreen');
    const characterSelectionScreen = document.getElementById('characterSelectionScreen');
    const nameSelectionScreen = document.getElementById('nameSelectionScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    // Registration form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideError();
        
        const day = parseInt(document.getElementById('birthDay').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const year = parseInt(document.getElementById('birthYear').value);
        
        // Validate all fields are filled
        if (!day || !month || !year) {
            showError('Please fill in all fields! 🐱');
            return;
        }
        
        // Validate date is valid
        if (!isValidDate(day, month, year)) {
            showError('Please enter a valid date! 🐱');
            return;
        }
        
        // Validate date is not in the future
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        if (birthDate > today) {
            showError('Birth date cannot be in the future! 🐱');
            return;
        }
        
        // Validate age
        const validation = validateAge(day, month, year);
        
        if (!validation.valid) {
            const ageText = validation.age.years === 0 
                ? `${validation.age.months} month${validation.age.months !== 1 ? 's' : ''}`
                : validation.age.years === 1
                ? `1 year${validation.age.months > 0 ? ` and ${validation.age.months} month${validation.age.months !== 1 ? 's' : ''}` : ''}`
                : `${validation.age.years} year${validation.age.years !== 1 ? 's' : ''}${validation.age.months > 0 ? ` and ${validation.age.months} month${validation.age.months !== 1 ? 's' : ''}` : ''}`;
            
            showError(`Sorry! You must be more than 3 years old to play. You are currently ${ageText} old. 🐱`);
            return;
        }
        
        // Store player data
        playerData.birthDay = day;
        playerData.birthMonth = month;
        playerData.birthYear = year;
        playerData.age = validation.age;
        
        // Show character selection screen
        registrationScreen.style.display = 'none';
        characterSelectionScreen.style.display = 'flex';
    });
    
    // Character selection buttons
    const characterButtons = document.querySelectorAll('.character-btn');
    characterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            playerData.gender = gender;
            
            // Update subtitle based on gender
            const subtitle = document.getElementById('characterSubtitle');
            const genderEmoji = gender === 'boy' ? '👦' : '👧';
            subtitle.textContent = `What should we call you, ${gender}? ${genderEmoji}`;
            
            // Show name selection screen
            characterSelectionScreen.style.display = 'none';
            nameSelectionScreen.style.display = 'flex';
        });
    });
    
    // Name form submission
    const nameForm = document.getElementById('nameForm');
    nameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideNameError();
        
        const name = document.getElementById('characterName').value.trim();
        
        // Validate name
        if (!name) {
            showNameError('Please enter a name! 🐱');
            return;
        }
        
        if (name.length < 2) {
            showNameError('Name must be at least 2 characters long! 🐱');
            return;
        }
        
        if (name.length > 20) {
            showNameError('Name must be 20 characters or less! 🐱');
            return;
        }
        
        // Store player name
        playerData.name = name;
        
        // Show game screen
        nameSelectionScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        // Initialize game screen
        initializeGameScreen();
    });
    
    // Initialize game screen with character and cat companion
    function initializeGameScreen() {
        const genderEmoji = playerData.gender === 'boy' ? '👦' : '👧';
        const catCompanion = playerData.gender === 'boy' ? '🐱' : '😸'; // Different cats for boy/girl
        
        // Display character
        document.getElementById('characterDisplay').textContent = genderEmoji;
        document.getElementById('playerNameDisplay').textContent = playerData.name;
        
        // Display cat companion
        document.getElementById('catCompanion').textContent = catCompanion;
        
        // Display player info
        const ageText = playerData.age.years === 1
            ? `1 year${playerData.age.months > 0 ? ` and ${playerData.age.months} month${playerData.age.months !== 1 ? 's' : ''}` : ''}`
            : `${playerData.age.years} year${playerData.age.years !== 1 ? 's' : ''}${playerData.age.months > 0 ? ` and ${playerData.age.months} month${playerData.age.months !== 1 ? 's' : ''}` : ''}`;
        
        document.getElementById('playerInfo').innerHTML = 
            `<strong>Name:</strong> ${playerData.name} ${genderEmoji}<br>
             <strong>Birth Date:</strong> ${playerData.birthMonth}/${playerData.birthDay}/${playerData.birthYear}<br>
             <strong>Age:</strong> ${ageText} 🎉`;
        
        // Setup interaction buttons
        setupInteractionButtons();
    }
    
    // Setup interaction buttons
    function setupInteractionButtons() {
        const feedBtn = document.getElementById('feedBtn');
        const cleanLitterBtn = document.getElementById('cleanLitterBtn');
        const batheBtn = document.getElementById('batheBtn');
        
        feedBtn.addEventListener('click', () => performAction('feed'));
        cleanLitterBtn.addEventListener('click', () => performAction('clean'));
        batheBtn.addEventListener('click', () => performAction('bathe'));
    }
    
    // Perform action with animations
    function performAction(actionType) {
        const characterDisplay = document.getElementById('characterDisplay');
        const actionIndicator = document.getElementById('actionIndicator');
        const catCompanion = document.getElementById('catCompanion');
        const catReaction = document.getElementById('catReaction');
        
        // Disable buttons during animation
        const buttons = document.querySelectorAll('.interaction-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Define action details
        const actions = {
            feed: {
                characterAction: '🍽️',
                characterAnimation: 'feed-animation',
                catReaction: '😋',
                message: 'Feeding the cat...'
            },
            clean: {
                characterAction: '🧹',
                characterAnimation: 'clean-animation',
                catReaction: '😌',
                message: 'Cleaning the litter box...'
            },
            bathe: {
                characterAction: '🛁',
                characterAnimation: 'bathe-animation',
                catReaction: '😊',
                message: 'Bathing the cat...'
            }
        };
        
        const action = actions[actionType];
        
        // Show action indicator
        actionIndicator.textContent = action.characterAction;
        actionIndicator.style.display = 'block';
        actionIndicator.classList.add('active');
        
        // Add character animation class
        characterDisplay.classList.add(action.characterAnimation);
        
        // Show cat reaction after a delay
        setTimeout(() => {
            catReaction.textContent = action.catReaction;
            catReaction.style.display = 'block';
            catReaction.classList.add('show');
        }, 500);
        
        // Reset after animation completes
        setTimeout(() => {
            // Remove animations
            characterDisplay.classList.remove(action.characterAnimation);
            actionIndicator.classList.remove('active');
            actionIndicator.style.display = 'none';
            catReaction.classList.remove('show');
            catReaction.style.display = 'none';
            
            // Re-enable buttons
            buttons.forEach(btn => btn.disabled = false);
        }, 2000);
    }
});
