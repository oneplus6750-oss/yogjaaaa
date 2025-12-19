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

// --- 1. ANNIVERSARY COUNTER ---
const startDate = new Date("2025-11-17"); // Set to your past anniversary date

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
}
setInterval(updateCounter, 1000);
updateCounter();

// --- 2. SYNCED VIRTUAL HUGS ---
function sendHug() {
    const overlay = document.getElementById("hugOverlay");
    overlay.style.display = "flex";

    // Increment in Firebase
    db.collection("stats").doc("global").set({
        hugs: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });

    setTimeout(() => { overlay.style.display = "none"; }, 1500);
}

// Listen for hug changes
db.collection("stats").doc("global").onSnapshot((doc) => {
    if (doc.exists) {
        document.getElementById("hugCount").textContent = doc.data().hugs || 0;
    }
});

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

// --- 4. QUICK MESSAGES POP-UP ---
function sendQuickMessage(emoji) {
    db.collection("messages").add({
        emoji: emoji,
        time: Date.now()
    });
}

// Show incoming emojis
db.collection("messages").orderBy("time", "desc").limit(1).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
            const data = change.doc.data();
            if (Date.now() - data.time < 5000) {
                showFloatingEmoji(data.emoji);
            }
        }
    });
});

function showFloatingEmoji(emoji) {
    const div = document.createElement("div");
    div.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); font-size:80px; z-index:10000; animation: sparkleEffect 2s forwards;`;
    div.textContent = emoji;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// --- 5. MEETING DATE MODAL ---
function closeCountdownModal() {
    document.getElementById("countdownModal").style.display = "none";
}

// You can call this from a button if you want to set a new date
function setMeetingDate() {
    const dateVal = document.getElementById("meetingDateInput").value;
    if (!dateVal) return;
    db.collection("stats").doc("meeting").set({ date: dateVal });
    closeCountdownModal();
}

// --- 6. LOVE REASONS (Random) ---
const loveReasons = [
    "Your smile lights up my world 🌟",
    "You're my best friend and my greatest love 🥰",
    "Every moment with you feels like magic ✨",
    "You make distance feel like nothing 🌍",
    "You're the most beautiful person inside and out 🌹"
];

function showLoveReason() {
    const el = document.getElementById("loveReason");
    el.style.opacity = "0";
    setTimeout(() => {
        el.textContent = loveReasons[Math.floor(Math.random() * loveReasons.length)];
        el.style.opacity = "1";
    }, 300);
}

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

document.querySelectorAll("[data-tilt]").forEach(p => {
    p.addEventListener("mousemove", (e) => {
        const rect = p.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width/2) / 10;
        const y = (e.clientY - rect.top - rect.height/2) / 10;
        p.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)`;
    });
    p.addEventListener("mouseleave", () => p.style.transform = "");
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("animate"); });
}, { threshold: 0.1 });

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));
});

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