/*****************************************************/
/********* RETRIEVE ALL ELEMENTS OF THE DOM *********/
/*****************************************************/

// Inputs
const searchInput = document.querySelector(".search-input input");
const sortInput = document.querySelectorAll(".sort-date input");
const filterRangeValue = document.querySelector(".filter-item #count-result");
const filterInput = document.querySelector(".filter-item .filter-date input");
const filterInputDate = document.querySelector(".filter-item #filter-date");
const countSpan = document.getElementById("count-span");

// Buttons
const searchButton = document.querySelector(".search-input button");

// Card container
const cardContainer = document.querySelector(".book-section__grid");
const card = document.querySelector(".book-card");

// Init array of books
let books = [];

// Init value
let sortValue = "sort-date-recent";
let filterRange = 9;
let searchValue = "the lord of the rings";
let filterValue = 2012;

// Fetching data
const fetchBooks = async () => {
  try {
    const response = await fetch(
      "https://openlibrary.org/search.json?q=" + searchValue
    );
    const data = await response.json();
    books = data.docs;

    if (books.length > 0) {
      updateView(books);
    }
  } catch (error) {
    console.log(error);
  }
};
fetchBooks();

const updateView = () => {
  cardContainer.innerHTML = "";
  const copy = [...books];

  // Sorting
  copy
    .filter((book) => book.cover_i)
    .filter((book) => book.first_publish_year === filterValue)
    .sort((a, b) => {
      if (sortValue === "sort-date-recent") {
        return new Date(b.first_publish_year) - new Date(a.first_publish_year);
      } else if (sortValue === "sort-date-oldest") {
        return new Date(a.first_publish_year) - new Date(b.first_publish_year);
      }
    })
    .slice(0, filterRange)
    .map((book) => {
      cardContainer.innerHTML += `
     <div class="book-card">
        <div class="book-card__image">
          <img src="https://covers.openlibrary.org/b/id/${
            book.cover_i
          }-M.jpg" alt="${book.title}">
        </div>
        <div class="book-card__info">
          <h2>${
            book.title.length > 20
              ? book.title.slice(0, 20) + "..."
              : book.title
          }</h2>
          <p>${book.author_name ? book.author_name[0] : "Unknown"}</p>
          <div class="book-card__rating">
            <span>${book.first_publish_year}</span>
          </div>
          <button class="button-read">Read</button>
          <a href="#" class="button-add">Add to wishlist</a>
          <a href="#" class="button-buy">Buy</a>
        </div>
      </div>
    `;
    });
};

// Search
searchButton.addEventListener("click", () => {
  searchValue = searchInput.value;
  fetchBooks();
});

// Sort
sortInput.forEach((item) => {
  item.addEventListener("click", () => {
    sortValue = item.id;
    console.log(sortValue);
    updateView();
  });
});

// Filter
filterRangeValue.addEventListener("input", () => {
  filterRange = filterRangeValue.value;
  countSpan.innerHTML = filterRange;
  updateView();
});

filterInputDate.addEventListener("input", () => {
  filterValue = filterInputDate.value;
  updateView();
});
