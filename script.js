// Floating Hearts Animation
function createHeart() {
  const heartsContainer = document.getElementById("heartsContainer")
  const heart = document.createElement("div")
  heart.classList.add("heart")
  heart.innerHTML = ["❤️", "💕", "💖", "💗", "💓", "💝"][Math.floor(Math.random() * 6)]
  heart.style.left = Math.random() * 100 + "%"
  heart.style.animationDuration = Math.random() * 5 + 5 + "s"
  heart.style.fontSize = Math.random() * 20 + 15 + "px"
  heartsContainer.appendChild(heart)

  setTimeout(() => {
    heart.remove()
  }, 8000)
}

// Create hearts at intervals
setInterval(createHeart, 500)

// Counter Animation - Change this date to your anniversary!
const startDate = new Date("2025-11-17") // CHANGE THIS TO YOUR ANNIVERSARY DATE

function updateCounter() {
  const now = new Date()
  const diff = now - startDate

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  document.getElementById("days").textContent = days
  document.getElementById("hours").textContent = hours
  document.getElementById("minutes").textContent = minutes
}

updateCounter()
setInterval(updateCounter, 60000) // Update every minute

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

// Observe elements with data-animate attribute
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll("[data-animate]")
  animateElements.forEach((el) => observer.observe(el))
})

// Polaroid tilt effect
document.querySelectorAll("[data-tilt]").forEach((polaroid) => {
  polaroid.addEventListener("mousemove", (e) => {
    const rect = polaroid.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    polaroid.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  })

  polaroid.addEventListener("mouseleave", () => {
    polaroid.style.transform = ""
  })
})

// Smooth scroll for arrow
document.querySelector(".arrow-down")?.addEventListener("click", () => {
  document.querySelector(".counter-section").scrollIntoView({
    behavior: "smooth",
  })
})

// Add sparkle effect on click
document.addEventListener("click", (e) => {
  const sparkle = document.createElement("div")
  sparkle.style.position = "fixed"
  sparkle.style.left = e.clientX + "px"
  sparkle.style.top = e.clientY + "px"
  sparkle.style.pointerEvents = "none"
  sparkle.style.fontSize = "20px"
  sparkle.style.animation = "sparkleEffect 1s ease-out forwards"
  sparkle.innerHTML = "✨"
  sparkle.style.zIndex = "9999"
  document.body.appendChild(sparkle)

  setTimeout(() => sparkle.remove(), 1000)
})

// Add sparkle animation
const style = document.createElement("style")
style.textContent = `
    @keyframes sparkleEffect {
        0% {
            opacity: 1;
            transform: scale(0) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) translateY(-50px);
        }
    }
`
document.head.appendChild(style)

console.log("%c❤️ Made with love ❤️", "font-size: 20px; color: #FF8FAB; font-weight: bold;")
