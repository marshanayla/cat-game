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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    populateDays();
    
    const form = document.getElementById('registrationForm');
    const registrationScreen = document.getElementById('registrationScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    form.addEventListener('submit', function(e) {
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
        
        // Success! Show game screen
        registrationScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        const ageText = validation.age.years === 1
            ? `1 year${validation.age.months > 0 ? ` and ${validation.age.months} month${validation.age.months !== 1 ? 's' : ''}` : ''}`
            : `${validation.age.years} year${validation.age.years !== 1 ? 's' : ''}${validation.age.months > 0 ? ` and ${validation.age.months} month${validation.age.months !== 1 ? 's' : ''}` : ''}`;
        
        document.getElementById('playerInfo').textContent = 
            `Birth Date: ${month}/${day}/${year} | Age: ${ageText} 🎉`;
    });
});
