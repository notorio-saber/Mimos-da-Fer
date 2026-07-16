/**
 * COMPORTAMENTO DINÂMICO & EFEITOS PREMIUM - MIMOS DA FER
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- TELEFONE WHATSAPP ---
  const WHATSAPP_NUMBER = '554699164921';

  // --- ANIMAÇÃO DO HEADER AO ROLAR ---
  const header = document.querySelector('.header-main');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MENU HAMBÚRGUER MOBILE ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item a');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- CARROSSEL VERTICAL AUTOMÁTICO (HERO) ---
  const carouselWrapper = document.querySelector('.hero-carousel-wrapper');
  const carouselSlides = document.querySelectorAll('.hero-carousel-slide');
  const carouselDots = document.querySelectorAll('.hero-carousel-dots .dot');
  
  if (carouselWrapper && carouselSlides.length > 0) {
    let currentSlide = 0;
    const slideCount = carouselSlides.length;
    let carouselInterval;

    const goToSlide = (index) => {
      currentSlide = (index + slideCount) % slideCount;
      carouselWrapper.style.transform = `translateY(-${currentSlide * 100}%)`;
      
      // Atualizar dots ativos
      carouselDots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };

    // Autoplay Timer (4 Segundos)
    const startAutoplay = () => {
      carouselInterval = setInterval(nextSlide, 4000);
    };

    const stopAutoplay = () => {
      clearInterval(carouselInterval);
    };

    startAutoplay();

    // Eventos de clique nos Dots
    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        stopAutoplay();
        goToSlide(slideIndex);
        startAutoplay();
      });
    });

    // Suporte a gestos touch (Swipe vertical) para Celulares!
    let startY = 0;
    let endY = 0;
    const carouselContainer = document.querySelector('.hero-carousel-container');
    
    if (carouselContainer) {
      carouselContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        stopAutoplay();
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        const diffY = startY - endY;
        
        if (Math.abs(diffY) > 40) { // Sensibilidade de swipe
          if (diffY > 0) {
            // Arrastou para cima -> próxima foto
            goToSlide(currentSlide + 1);
          } else {
            // Arrastou para baixo -> foto anterior
            goToSlide(currentSlide - 1);
          }
        }
        startAutoplay();
      }, { passive: true });
    }
  }

  // --- FILTRO DINÂMICO DA VITRINE ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe ativa de todos os botões e adicionar no atual
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Transição suave de escala e opacidade
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 400); // Aguarda o fim da transição CSS (0.4s)
        }
      });
    });
  });

  // --- LIGHTBOX INTEGRADO (VISUALIZADOR PREMIUM) ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  
  // Elementos clicáveis que disparam o Lightbox (fotos de produtos)
  const zoomTriggers = document.querySelectorAll('.zoom-trigger');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    zoomTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        let imgSrc = '';
        let captionText = '';
        
        const internalImg = trigger.querySelector('img');
        if (internalImg) {
          imgSrc = internalImg.getAttribute('src');
          captionText = trigger.getAttribute('data-caption') || internalImg.getAttribute('alt') || 'Mimos da Fer';
        }
        
        if (imgSrc) {
          lightboxImg.setAttribute('src', imgSrc);
          lightboxCaption.textContent = captionText;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
        lightboxCaption.textContent = '';
      }, 400);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- GERADOR DE LINKS DE ENCOMENDA DO WHATSAPP ---
  const orderButtons = document.querySelectorAll('.order-whatsapp-btn');
  
  orderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const productName = button.getAttribute('data-product') || 'um terço personalizado';
      const text = `Olá, Fer! Vi o site da Mimos da Fer e gostaria de fazer uma encomenda personalizada do: *${productName}*. Como podemos combinar os detalhes da minha peça?`;
      
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');
    });
  });

  // --- EFEITO REVEAL AO ROLAR (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // --- SCROLL ATIVO NO MENU DE NAVEGAÇÃO ---
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const menuLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (menuLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
          menuLink.parentElement.classList.add('active');
        }
      }
    });
  });
});
