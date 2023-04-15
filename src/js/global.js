'use strict';

// Import all bootstrap plugins
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {

  // Cards tabs 
  const select = document.querySelector('.form-select');
  select.addEventListener('change', selectTab);

  function selectTab() {
    const selectedValue = select.value;

    const tabPanes = document.querySelectorAll('.tab-pane');

    // remove active and show classes from all tab panes
    tabPanes.forEach(tabPane => {
      tabPane.classList.remove('active', 'show');
    });

    // add active and show classes to selected tab pane
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
      expandButton.classList.add('card-text-expandable-btn', 'btn', 'btn-link', 'p-0', 'text-black', 'text-decoration-none');
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
            <img src="${item.download_url}" class="card-img-top" alt="...">
          </div>
          <div class="card-body">
            <h4 class="card-title fw-bold">${item.author}</h4>
            <p class="card-text card-text-expandable">${item.width}x${item.height} pixels</p>
          </div>
          <div class="card-footer bg-white d-flex align-items-center gap-3 flex-wrap">
            <button type="button" class="btn btn-primary text-white fw-bold">Save to collection</button>
            <button type="button" class="btn btn-outline-secondary text-black fw-bold">Share</button>
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



