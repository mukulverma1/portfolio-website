// DOM Elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const resumeBtn = document.getElementById("resume-btn")
const contactForm = document.getElementById("contact-form")
const confettiCanvas = document.getElementById("confetti-canvas")

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

// Active navigation link
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".section-title, .about-text, .skill-category, .project-card, .contact-item, .contact-form-container, .stat-item",
  )

  animateElements.forEach((el) => {
    observer.observe(el)
  })
})

// Stats counter animation
function animateStats() {
  const statItems = document.querySelectorAll(".stat-item")

  statItems.forEach((item) => {
    const target = Number.parseInt(item.getAttribute("data-target"))
    const numberElement = item.querySelector(".stat-number")
    const increment = target / 100
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        if (target === 100) {
          numberElement.textContent = Math.ceil(current) + "%"
        } else {
          numberElement.textContent = Math.ceil(current) + "+"
        }
        setTimeout(updateCounter, 20)
      } else {
        if (target === 100) {
          numberElement.textContent = target + "%"
        } else {
          numberElement.textContent = target + "+"
        }
      }
    }

    updateCounter()
  })
}

// Enhanced Skills progress bar animation
function animateSkills() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar, index) => {
    const width = bar.getAttribute("data-width")
    setTimeout(() => {
      bar.style.width = width + "%"
      bar.classList.add("animate")
    }, index * 100) // Stagger the animations
  })
}

// Observe stats and skills sections
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("stats")) {
          animateStats()
        } else if (entry.target.classList.contains("skills")) {
          animateSkills()
        }
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".stats")
  const skillsSection = document.querySelector(".skills")

  if (statsSection) statsObserver.observe(statsSection)
  if (skillsSection) statsObserver.observe(skillsSection)
})

// Confetti animation
class Confetti {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []
    this.colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"]

    this.resize()
    window.addEventListener("resize", () => this.resize())
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticle(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -15 - 5,
      gravity: 0.3,
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
      size: Math.random() * 8 + 4,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }

  burst(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(x, y))
    }
    this.animate()
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // Update particle
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += particle.gravity
      particle.life -= particle.decay
      particle.rotation += particle.rotationSpeed

      // Draw particle
      this.ctx.save()
      this.ctx.globalAlpha = particle.life
      this.ctx.translate(particle.x, particle.y)
      this.ctx.rotate((particle.rotation * Math.PI) / 180)
      this.ctx.fillStyle = particle.color
      this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
      this.ctx.restore()

      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1)
      }
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate())
    }
  }
}

// Initialize confetti
const confetti = new Confetti(confettiCanvas)

// Enhanced Resume download with confetti and animation
resumeBtn.addEventListener("click", (e) => {
  e.preventDefault()

  // Add downloading animation
  resumeBtn.classList.add("downloading")
  resumeBtn.innerHTML = '<span class="btn-text">Downloading...</span><span class="btn-icon">⏳</span>'

  // Get button position for confetti
  const rect = resumeBtn.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  setTimeout(() => {
    // Trigger confetti
    confetti.burst(x, y, 100)

    // Reset button
    resumeBtn.classList.remove("downloading")
    resumeBtn.innerHTML = '<span class="btn-text">Downloaded!</span><span class="btn-icon">✅</span>'

    // Create and trigger download
    const link = document.createElement("a")
    link.href = "resume.pdf"
    link.download = "Mukul_Verma_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Reset button after success
    setTimeout(() => {
      resumeBtn.innerHTML = '<span class="btn-text">Download Resume</span><span class="btn-icon">📄</span>'
    }, 2000)
  }, 1000)
})

// Function to show success message
function showSuccessMessage(message) {
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.textContent = message
  document.body.appendChild(successMessage)

  setTimeout(() => {
    successMessage.remove()
  }, 4000)
}

// Function to show error message
function showErrorMessage(message) {
  const errorMessage = document.createElement("div")
  errorMessage.className = "error-message"
  errorMessage.textContent = message
  document.body.appendChild(errorMessage)

  setTimeout(() => {
    errorMessage.remove()
  }, 4000)
}

// FIXED: Web3Forms Contact Form Handler
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const submitBtn = contactForm.querySelector(".btn-submit")
  const originalText = submitBtn.innerHTML

  // Validate form fields
  const formData = new FormData(contactForm)
  const requiredFields = ['name', 'email', 'project_type', 'budget', 'message']
  
  for (let field of requiredFields) {
    if (!formData.get(field) || formData.get(field).trim() === '') {
      showErrorMessage(`Please fill in the ${field.replace('_', ' ')} field.`)
      return
    }
  }

  // Add sending animation
  submitBtn.classList.add("sending")
  submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>'
  submitBtn.disabled = true

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })

    const data = await response.json()

    if (data.success) {
      // Get button position for confetti
      const rect = submitBtn.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // Remove sending animation and add success
      submitBtn.classList.remove("sending")
      submitBtn.classList.add("sent")
      submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span><span class="btn-icon">🚀</span>'

      // Trigger confetti
      confetti.burst(x, y, 80)

      // Show success message
      showSuccessMessage("Thank you for your message! I'll get back to you soon. 🚀")

      // Reset form
      contactForm.reset()

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.classList.remove("sent")
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 3000)

    } else {
      throw new Error(data.message || "Something went wrong!")
    }

  } catch (error) {
    console.error("Form submission error:", error)

    // Remove sending animation
    submitBtn.classList.remove("sending")
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show error message
    showErrorMessage("Failed to send message. Please try again or contact me directly.")
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Parallax effect for hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroBackground = document.querySelector(".hero-background")
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`
  }
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  }
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  // Scroll-based animations can be added here
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Add cursor trail effect (optional enhancement)
class CursorTrail {
  constructor() {
    this.dots = []
    this.mouse = { x: 0, y: 0 }
    this.init()
  }

  init() {
    // Create trail dots
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("div")
      dot.className = "cursor-dot"
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.3s ease;
      `
      document.body.appendChild(dot)
      this.dots.push({
        element: dot,
        x: 0,
        y: 0,
      })
    }

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    this.animate()
  }

  animate() {
    let x = this.mouse.x
    let y = this.mouse.y

    this.dots.forEach((dot, index) => {
      dot.element.style.left = x + "px"
      dot.element.style.top = y + "px"
      dot.element.style.opacity = (12 - index) / 12

      const nextDot = this.dots[index + 1] || this.dots[0]
      x += (nextDot.x - x) * 0.3
      y += (nextDot.y - y) * 0.3

      nextDot.x = x
      nextDot.y = y
    })

    requestAnimationFrame(() => this.animate())
  }
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
  new CursorTrail()
}

// Console message for developers
console.log(`
🚀 Welcome to Mukul Verma's Portfolio!
📧 Contact: mukulverma12344@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/mukul-verma-b4aab7248
🔧 Built with: HTML5, CSS3, JavaScript
✨ Features: Responsive Design, Smooth Animations, Interactive Elements
`)