const searchInput = document.getElementById("searchInput");
const suggestionContainer = document.getElementById("suggestionContainer");

function debounce(func, delay = 400) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

function shuffle(arr) {
    for (i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function showSuggestions() {
    try {
        suggestionContainer.innerHTML = "";
        if (searchInput.value === "") {
            console.error("searchInput", searchInput.value);
            suggestionContainer.classList.remove("show");
            return
        }

        let response = await fetch(`/autocomplete?text=${searchInput.value}`);
        let { suggestions } = await response.json();

        // let suggestions = ["mth", "mee", "foo", "bar"];
        // suggestions = shuffle(suggestions);

        suggestions.map(suggestion => {
            let newItem = document.createElement("li");
            newItem.classList.add(
                "dropdown-item",
                "text-truncate",
                "d-flex",
                "gap-2",
                "justify-content-between"
            );
            newItem.innerHTML = `
                  <a
                      class="col-10 text-truncate"
                      href="/search?searchTerm=${suggestion.searchTerm}"
                  >
                      ${suggestion.searchTerm} 
                  </a>
                  <span class="inputSuggestion col-2 text-end"  data-value="${suggestion.searchTerm}">
                      <i class="fa-solid fa-arrow-up-left"> </i>
                  </span>`;

            newItem.addEventListener("click", () => {
                searchInput.value = suggestion.searchTerm;
            });

            suggestionContainer.appendChild(newItem);
        });
        if (suggestions.length !== 0) {
            suggestionContainer.classList.add("show");
        }
    } catch (err) {
        console.error(err);
    }
}

searchInput.addEventListener("input", debounce(showSuggestions, 500));
