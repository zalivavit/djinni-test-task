'use strict';

// Import all bootstrap plugins
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  // Navbar toggle 
  const navLinks = document.querySelectorAll('.navbar-nav-toggle .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      this.classList.add('active');
    });
  });

  // Theme switcher
  const colorThemeSwitch = document.getElementById('colorThemeSwitch');
  const themeImage = document.querySelector('#colorThemeSwitch + label img');
  
  localStorage.getItem('theme') === 'theme-dark' ? setDarkTheme() : setLightTheme();
  
  colorThemeSwitch.addEventListener('change', () => colorThemeSwitch.checked ? setDarkTheme() : setLightTheme());
  
  function setDarkTheme() {
    document.body.classList.add('theme-dark');
    themeImage.src = 'https://i.ibb.co/FxzBYR9/night.png';
    localStorage.setItem('theme', 'theme-dark');
  }
  
  function setLightTheme() {
    document.body.classList.remove('theme-dark');
    themeImage.src = 'https://i.ibb.co/7JfqXxB/sunny.png';
    localStorage.setItem('theme', 'theme-light');
  }
  
  localStorage.getItem('theme') === 'theme-dark' && (colorThemeSwitch.checked = true);
  
  // Cards tabs 
  const select = document.querySelector('.form-select');
  select.addEventListener('change', selectTab);

  function selectTab() {
    const selectedValue = select.value;

    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach(tabPane => {
      tabPane.classList.remove('active', 'show');
    });

    const selectedTabPane = document.querySelector(`#${selectedValue}`);
    if (selectedTabPane) {
      selectedTabPane.classList.add('active', 'show');
    }
  }

  // Cards expandable text
  const addExpandButton = (expandableText) => {
    if (expandableText.clientHeight < expandableText.scrollHeight) {
      expandableText.classList.add('card-text-expandable-toggle');

      const expandButton = document.createElement('button');
      expandButton.classList.add('card-text', 'card-text-expandable-btn', 'btn', 'btn-link', 'p-0', 'text-decoration-none');
      expandButton.textContent = 'Show more...';

      expandButton.addEventListener('click', () => {
        expandableText.classList.toggle('card-text-expandable-toggle');
        expandButton.textContent = expandableText.classList.contains('card-text-expandable-toggle') ? 'Show more...' : 'Show less';
        expandableText.classList.toggle('card-text-clipped');
      });

      expandableText.parentNode.appendChild(expandButton);
    }
  };

  const expandableTexts = document.querySelectorAll('.card-text-expandable');
  expandableTexts.forEach(addExpandButton);

  // Cards parsing
  const cardContainer = document.querySelector('#card-list');

  async function fetchData(page, limit) {
    const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  function renderCards(data) {
    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('col');
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-image">
            <img src="${item.download_url}" class="card-img-top" alt="${item.author}">
          </div>
          <div class="card-body">
            <h4 class="card-title fw-bold">${item.author}</h4>
            <p class="card-text card-text-expandable text-muted">${item.width}x${item.height} pixels</p>
          </div>
          <div class="card-footer d-flex align-items-center gap-3 flex-wrap">
            <button type="button" class="btn btn-primary text-white fw-bold">Save to collection</button>
            <button type="button" class="btn btn-outline-secondary fw-bold">Share</button>
          </div>
        </div>
      `;
      cardContainer.appendChild(card);
    });
  }
  
  function isAtBottom() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    return scrollPosition >= pageHeight;
  }

  async function infiniteScroll(page, limit) {
    const data = await fetchData(page, limit);
    renderCards(data);
    page++;
  
    window.addEventListener('scroll', async function() {
      if (isAtBottom()) {
        const newData = await fetchData(page, limit);
        renderCards(newData);
        page++;
      }
    });
  }

  cardContainer ? infiniteScroll(1, 9) : null;
});



