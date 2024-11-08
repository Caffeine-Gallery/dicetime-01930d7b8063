import { backend } from "declarations/backend";

let timerInterval;
const startBtn = document.getElementById('start-btn');
const completeBtn = document.getElementById('complete-btn');
const timerElement = document.getElementById('timer');
const challengeText = document.querySelector('.challenge-text');
const loading = document.getElementById('loading');

async function startNewChallenge() {
    try {
        showLoading(true);
        startBtn.disabled = true;
        
        const challenge = await backend.startNewChallenge();
        challengeText.textContent = challenge;
        completeBtn.disabled = false;
        
        // Start timer updates
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
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
        }
    } catch (error) {
        console.error('Error completing challenge:', error);
    } finally {
        showLoading(false);
    }
}

async function updateTimer() {
    try {
        const status = await backend.getCurrentChallenge();
        if (!status.active) {
            clearInterval(timerInterval);
            startBtn.disabled = false;
            completeBtn.disabled = true;
            timerElement.textContent = "00:00";
            return;
        }

        const remainingSeconds = Math.max(0, Math.floor(status.timeRemaining / 1000000000));
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            challengeText.textContent = "Time's up! Start a new challenge.";
            startBtn.disabled = false;
            completeBtn.disabled = true;
        }
    } catch (error) {
        console.error('Error updating timer:', error);
    }
}

function showLoading(show) {
    loading.classList.toggle('d-none', !show);
}

// Event listeners
startBtn.addEventListener('click', startNewChallenge);
completeBtn.addEventListener('click', completeChallenge);

// Initial state check
updateTimer();
