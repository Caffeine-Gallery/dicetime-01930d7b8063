import { backend } from "declarations/backend";

let timerInterval;
let localEndTime;
const startBtn = document.getElementById('start-btn');
const completeBtn = document.getElementById('complete-btn');
const timerElement = document.getElementById('timer');
const challengeText = document.querySelector('.challenge-text');
const loading = document.getElementById('loading');
const historyList = document.querySelector('.history-list');

async function startNewChallenge() {
    try {
        showLoading(true);
        startBtn.disabled = true;
        
        const challenge = await backend.startNewChallenge();
        const status = await backend.getCurrentChallenge();
        
        challengeText.textContent = challenge;
        completeBtn.disabled = false;
        
        // Set local end time
        localEndTime = Date.now() + Math.floor(status.timeRemaining / 1000000); // Convert nanoseconds to milliseconds
        
        // Start local timer
        updateTimerDisplay();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
        
        loadCompletedChallenges();
    } catch (error) {
        console.error('Error starting challenge:', error);
    } finally {
        showLoading(false);
    }
}

async function completeChallenge() {
    try {
        showLoading(true);
        const result = await backend.completeChallenge();
        if (result) {
            clearInterval(timerInterval);
            challengeText.textContent = "Challenge completed! Start a new one.";
            timerElement.textContent = "00:00";
            completeBtn.disabled = true;
            startBtn.disabled = false;
            loadCompletedChallenges();
        }
    } catch (error) {
        console.error('Error completing challenge:', error);
    } finally {
        showLoading(false);
    }
}

function updateTimerDisplay() {
    if (!localEndTime) return;
    
    const now = Date.now();
    const remainingMs = localEndTime - now;
    
    if (remainingMs <= 0) {
        clearInterval(timerInterval);
        timerElement.textContent = "00:00";
        challengeText.textContent = "Time's up! Start a new challenge.";
        startBtn.disabled = false;
        completeBtn.disabled = true;
        return;
    }
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function loadCompletedChallenges() {
    try {
        const completed = await backend.getCompletedChallenges();
        historyList.innerHTML = completed.length ? '' : '<p>No completed challenges yet</p>';
        
        completed.reverse().forEach(([challenge, timestamp]) => {
            const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <p class="challenge">${challenge}</p>
                <small class="text-muted">${date.toLocaleString()}</small>
            `;
            historyList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function showLoading(show) {
    loading.classList.toggle('d-none', !show);
}

// Event listeners
startBtn.addEventListener('click', startNewChallenge);
completeBtn.addEventListener('click', completeChallenge);

// Initial load
loadCompletedChallenges();

// Check for active challenge on page load
(async () => {
    try {
        const status = await backend.getCurrentChallenge();
        if (status.active) {
            challengeText.textContent = status.challenge;
            completeBtn.disabled = false;
            startBtn.disabled = true;
            
            localEndTime = Date.now() + Math.floor(status.timeRemaining / 1000000);
            updateTimerDisplay();
            timerInterval = setInterval(updateTimerDisplay, 1000);
        }
    } catch (error) {
        console.error('Error checking active challenge:', error);
    }
})();
