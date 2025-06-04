// URL Shortener Application
class URLShortener {
    constructor() {
        this.shortenedUrls = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStoredUrls();
    }

    bindEvents() {
        const form = document.getElementById('shortenForm');
        const urlInput = document.getElementById('urlInput');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Clear error on input focus
        urlInput.addEventListener('focus', () => {
            this.clearError();
        });
    }

    async handleSubmit() {
        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value.trim();

        if (!this.isValidUrl(url)) {
            this.showError('Please add a valid link');
            return;
        }

        try {
            // Show loading state
            this.showLoading();
            
            // Simulate API call (replace with real API)
            const shortenedUrl = await this.shortenUrl(url);
            
            // Add to results
            this.addUrlToResults(url, shortenedUrl);
            
            // Clear form
            urlInput.value = '';
            
            // Hide loading state
            this.hideLoading();
            
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
            this.hideLoading();
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async shortenUrl(originalUrl) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, create a mock shortened URL
        const randomId = Math.random().toString(36).substring(2, 8);
        return `https://rel.ink/${randomId}`;
        
        // In a real application, you would call an API like:
        /*
        const response = await fetch('https://api.short.io/links', {
            method: 'POST',
            headers: {
                'Authorization': 'YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                originalURL: originalUrl,
                domain: 'short.io'
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }
        
        const data = await response.json();
        return data.shortURL;
        */
    }

    addUrlToResults(originalUrl, shortenedUrl) {
        const urlData = {
            original: originalUrl,
            shortened: shortenedUrl,
            id: Date.now().toString()
        };

        this.shortenedUrls.unshift(urlData);
        this.renderResults();
        this.saveToStorage();
    }

    renderResults() {
        const resultsContainer = document.getElementById('results');
        
        if (this.shortenedUrls.length === 0) {
            resultsContainer.innerHTML = '';
            return;
        }

        resultsContainer.innerHTML = this.shortenedUrls
            .map(urlData => this.createResultHTML(urlData))
            .join('');

        // Bind copy events
        this.bindCopyEvents();
    }

    createResultHTML(urlData) {
        return `
            <div class="result-item" data-id="${urlData.id}">
                <div class="result-original">${urlData.original}</div>
                <div class="result-actions">
                    <div class="result-short">${urlData.shortened}</div>
                    <button class="copy-button" data-url="${urlData.shortened}">
                        Copy
                    </button>
                </div>
            </div>
        `;
    }

    bindCopyEvents() {
        const copyButtons = document.querySelectorAll('.copy-button');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = button.dataset.url;
                this.copyToClipboard(url, button);
            });
        });
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Update button state
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(text, button);
        }
    }

    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            
            // Update button state
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
        
        document.body.removeChild(textArea);
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const urlInput = document.getElementById('urlInput');
        
        errorElement.textContent = message;
        urlInput.classList.add('error');
    }

    clearError() {
        const errorElement = document.getElementById('errorMessage');
        const urlInput = document.getElementById('urlInput');
        
        errorElement.textContent = '';
        urlInput.classList.remove('error');
    }

    showLoading() {
        const submitButton = document.querySelector('.btn-shorten');
        submitButton.textContent = 'Shortening...';
        submitButton.disabled = true;
    }

    hideLoading() {
        const submitButton = document.querySelector('.btn-shorten');
        submitButton.textContent = 'Shorten It!';
        submitButton.disabled = false;
    }

    saveToStorage() {
        try {
            localStorage.setItem('shortenedUrls', JSON.stringify(this.shortenedUrls));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadStoredUrls() {
        try {
            const stored = localStorage.getItem('shortenedUrls');
            if (stored) {
                this.shortenedUrls = JSON.parse(stored);
                this.renderResults();
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            this.shortenedUrls = [];
        }
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle (if needed)
function initMobileMenu() {
    // Add mobile menu functionality if needed
    // This would be implemented based on your specific mobile menu design
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize URL shortener
    new URLShortener();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add scroll animations
    initScrollAnimations();
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6