// script/faq.js
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // safety
    if (!question || !answer) return;

    // accessible toggles
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');

    const answerId = 'faq-' + Math.random().toString(36).slice(2, 9);
    answer.setAttribute('id', answerId);
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const nowActive = item.classList.toggle('active');
      question.setAttribute('aria-expanded', nowActive ? 'true' : 'false');

      // close siblings for accordion behavior
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const q = other.querySelector('.faq-question');
          q && q.setAttribute('aria-expanded', 'false');
        }
      });
    };

    question.addEventListener('click', toggle);
    question.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggle();
      }
    });
  });
});
