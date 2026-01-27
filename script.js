











// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAxm5-YRlh-wqZGLy499UXO9l3TKLFW-kA",
  authDomain: "kyog-90ce7.firebaseapp.com",
  projectId: "kyog-90ce7",
  storageBucket: "kyog-90ce7.firebasestorage.app",
  messagingSenderId: "309947424408",
  appId: "1:309947424408:web:7a7df5519baaba593c7aed",
  measurementId: "G-93K3CRWZB1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 3. SYNCED BUCKET LIST ---
function addBucketItem() {
    const input = document.getElementById("bucketInput");
    const text = input.value.trim();
    if (text === "") return;

    db.collection("bucketList").add({
        text: text,
        completed: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = "";
}

function toggleBucketItem(id, currentStatus) {
    db.collection("bucketList").doc(id).update({ completed: !currentStatus });
}

function deleteBucketItem(id) {
    db.collection("bucketList").doc(id).delete();
}

// Display Bucket List in real-time
db.collection("bucketList").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    const container = document.getElementById("bucketItems");
    let html = "";
    if (snapshot.empty) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Start adding your dreams together! ✨</p>';
        return;
    }
    snapshot.forEach((doc) => {
        const item = doc.data();
        html += `
            <div class="bucket-item ${item.completed ? "completed" : ""}">
                <input type="checkbox" class="bucket-checkbox" ${item.completed ? "checked" : ""} 
                    onclick="toggleBucketItem('${doc.id}', ${item.completed})">
                <span class="bucket-text">${item.text}</span>
                <button class="bucket-delete" onclick="deleteBucketItem('${doc.id}')">🗑️</button>
            </div>`;
    });
    container.innerHTML = html;
});







// --- 7. VISUAL EFFECTS (Hearts, Tilt, Sparkles) ---
function createHeart() {
    const container = document.getElementById("heartsContainer");
    if(!container) return;
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = ["❤️", "💕", "💖", "💗", "💓", "💝"][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = Math.random() * 5 + 5 + "s";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
}
setInterval(createHeart, 500);





document.addEventListener("click", (e) => {
    const s = document.createElement("div");
    s.style.cssText = `position:fixed; left:${e.clientX}px; top:${e.clientY}px; pointer-events:none; z-index:9999; animation:sparkleEffect 1s forwards; font-size:20px;`;
    s.innerHTML = "✨";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
});

// Close modal on outside click
window.onclick = (event) => {
    const modal = document.getElementById("countdownModal");
    if (event.target == modal) closeCountdownModal();
};
// --- INTERACTIVE 3D CAROUSEL DRAG ---
const carousel = document.querySelector('.carousel');
let isDragging = false;
let startX;
let currentRotation = 0;

if(carousel) {
    // Mouse events
    const container = document.querySelector('.carousel-container');
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        carousel.style.animation = 'none'; // Stop auto-spin
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        // Optionally restart animation: carousel.style.animation = 'rotateCarousel 20s infinite linear';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX;
        const diff = x - startX;
        // Sensitivity factor
        currentRotation += diff * 0.2;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        startX = x;
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        carousel.style.animation = 'none';
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const diff = x - startX;
        currentRotation += diff * 0.5; // Higher sensitivity for touch
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        startX = x;
    });
}

