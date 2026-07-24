// Intersection-observer based reveal-on-scroll
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');

  // Fail-safe: IntersectionObserver未サポート時は即時表示
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  // threshold低め + rootMargin控えめ: SPで縦長写真が発火しない問題への対策
  }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
  els.forEach((el) => io.observe(el));

  // Fail-safe: 2.5秒後、その時点でビューポート内にあるのに未表示の要素だけ強制表示
  // (全要素を表示すると下部セクションのスクロールアニメが消えるため限定する)
  setTimeout(() => {
    els.forEach((el) => {
      if (
        !el.classList.contains('is-visible') &&
        el.getBoundingClientRect().top < window.innerHeight
      ) {
        el.classList.add('is-visible');
      }
    });
  }, 2500);
});
