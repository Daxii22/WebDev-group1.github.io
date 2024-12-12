
// Open the Modal
function openModal(element) {
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');
    
    document.body.classList.add('modal-open');
    modal.style.display = "block";
    modalImage.src = element.src;
    modalImage.alt = element.alt;
    document.getElementById('caption').innerText = element.alt;
    
    // Set focus to modal
    modal.focus();
    
    // Trap focus within modal
    modal.addEventListener('keydown', trapFocus);
}

// Close the Modal
function closeModal() {
    const modal = document.getElementById('myModal');
    document.body.classList.remove('modal-open');
    modal.style.display = "none";
    
    // Remove focus trap
    modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(e) {
    const modal = document.getElementById('myModal');
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Add this in the script section
function searchMenu() {
    const searchInput = document.getElementById('search').value.toLowerCase().trim();
    const menuItems = document.querySelectorAll('.menu-item');
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        let hasVisibleItems = false;
        const items = category.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const itemName = item.querySelector('h4').textContent.toLowerCase();
            const itemDescription = item.querySelector('p').textContent.toLowerCase();
            const isVisible = itemName.includes(searchInput) || itemDescription.includes(searchInput);
            item.style.display = isVisible ? 'block' : 'none';
            if (isVisible) hasVisibleItems = true;
        });
        
        category.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Add this in the script section
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add cart functionality
function addToCart(itemName) {
    try {
        let cart = [];
        const existingCart = localStorage.getItem('cart');
        
        if (existingCart) {
            cart = JSON.parse(existingCart);
        }
        
        cart.push({
            name: itemName,
            timestamp: new Date().toISOString()
        });
        
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${itemName} added to cart!`);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Sorry, there was an error adding the item to cart. Please try again.');
    }
}

// Add this to your existing script section
function handleImageError(img) {
    if (!img.dataset.fallbackAttempted) {
        img.dataset.fallbackAttempted = true;
        img.src = 'placeholder.jpg';
        img.alt = 'Image not available';
        img.onerror = null; // Prevent infinite loop if placeholder also fails
    }
}

// Background image slideshow
function initBackgroundSlideshow() {
    const images = document.querySelectorAll('.background-image');
    let currentImageIndex = 0;

    function switchImage() {
        // Fade out current image
        images[currentImageIndex].style.opacity = '0';
        
        // Switch to next image
        currentImageIndex = (currentImageIndex + 1) % images.length;
        
        // Fade in next image
        images[currentImageIndex].style.opacity = '1';
    }

    // Set initial state
    images.forEach((img, index) => {
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.transition = 'opacity 2s ease-in-out';
    });

    // Switch image every 5 seconds
    setInterval(switchImage, 5000);
}

// Initialize the slideshow when the page loads
window.addEventListener('load', initBackgroundSlideshow);

// Add these updated functions to your script section
function confirmAddOns(button) {
    const menuItem = button.closest('.menu-item');
    const itemName = menuItem.querySelector('h4').textContent;
    const addOns = [];
    
    // Get values from all select elements
    const selects = menuItem.querySelectorAll('.add-on-select');
    selects.forEach(select => {
        if (select.value) {
            const option = select.options[select.selectedIndex];
            const price = option.dataset.price;
            addOns.push(`${select.value} (+$${price})`);
        }
    });
    
    // Get special instructions
    const instructions = menuItem.querySelector('.special-instructions').value;
    if (instructions.trim()) {
        addOns.push(`Special Instructions: ${instructions}`);
    }
    
    // Add to cart with add-ons
    let cart = [];
    const existingCart = localStorage.getItem('cart');
    
    if (existingCart) {
        cart = JSON.parse(existingCart);
    }
    
    cart.push({
        name: itemName,
        addOns: addOns,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation with selected add-ons
    let message = `${itemName} added to cart`;
    if (addOns.length > 0) {
        message += ` with:\n- ${addOns.join('\n- ')}`;
    }
    alert(message);
    
    // Close the modal
    closeAddOns(button);
}

function showAddOns(button) {
    const menuItem = button.closest('.menu-item');
    const modal = menuItem.querySelector('.add-ons-modal');
    modal.style.display = 'block';
    
    // Reset all selections
    const selects = modal.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    const textarea = modal.querySelector('.special-instructions');
    textarea.value = '';
}

function closeAddOns(button) {
    const modal = button.closest('.add-ons-modal');
    modal.style.display = 'none';
}

