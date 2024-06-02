document.addEventListener('DOMContentLoaded', function() {
  // Current year and animations setup
  const yearSpans = document.querySelectorAll('.current-year');
  yearSpans.forEach(span => {
      span.textContent = new Date().getFullYear();
  });

  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          let target = document.querySelector(this.getAttribute('href'));
          target.scrollIntoView({ behavior: 'smooth' });
      });
  });

  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.5, rootMargin: "0px 0px -100px 0px" };
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('appear');
              observer.unobserve(entry.target);
          }
      });
  }, appearOptions);
  faders.forEach(fader => { appearOnScroll.observe(fader); });

  // AJAX form submission for volunteer and contact forms
  document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(event) {
          event.preventDefault();
          if (!formValidation(this)) return;
          const formData = new FormData(this);
          const messageDiv = this.querySelector('.message');
          fetch(this.action, {
              method: 'POST',
              body: formData
          })
          .then(response => response.text())
          .then(data => {
              messageDiv.innerHTML = data;
          })
          .catch(error => {
              messageDiv.innerHTML = 'Error submitting form!';
              console.error('Error:', error);
          });
      });
  });

  // Form dirty state and donation confirmation
  const donateButton = document.querySelector('.btn-primary');
  if (donateButton) {
      donateButton.addEventListener('click', function(event) {
          if (!confirm('Are you sure you want to proceed to the donation page?')) {
              event.preventDefault();
          }
      });
  }
  window.addEventListener('beforeunload', function(e) {
      if (isFormDirty()) {
          e.preventDefault(); 
          e.returnValue = '';
      }
  });
});

function formValidation(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(input => {
      if (!input.value) {
          alert('Please fill in all required fields.');
          isValid = false;
      }
  });
  const email = form.querySelector('input[type="email"]');
  if (email && !email.value.includes('@')) {
      alert('Please enter a valid email address.');
      isValid = false;
  }
  return isValid;
}

function isFormDirty() {
  return Array.from(document.querySelectorAll('input, textarea')).some(input => input.value !== input.defaultValue);
}
