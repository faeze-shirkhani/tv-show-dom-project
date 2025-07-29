// ___________varibels____________
let containerSearch = document.querySelector(".container-Search-button");
let divImages = document.querySelector(".container-All-images");
let input = document.getElementById("SearchInput");
let containerMain = document.querySelector(".container-main");
let containerInput = document.querySelector(".container-input");
let searchIcon = document.querySelector(".search-icon");
let selectEl = document.createElement("select");
selectEl.id = "searchEpisodes";
Object.assign(selectEl.style, {
  "background-color": "#333",
  color: "white",
});
let homeIcon = document.querySelector(".bi-house-door-fill");

async function searchShowByName(name) {
  const res = await axios(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`
  );
  const show = res.data[0].show;

  let bigImage = document.createElement("img");
  bigImage.setAttribute("id", "bigImage");
  bigImage.src = show.image.original;
  bigImage.alt = show.name;
  containerMain.insertAdjacentElement("afterbegin", bigImage);

  let pEl = document.createElement("p");
  pEl.textContent = "Movies";
  pEl.className = "moive";
  bigImage.insertAdjacentElement("afterend", pEl);
}
searchShowByName("game of thorones");

async function getAllShows() {
  const res = await axios("https://api.tvmaze.com/shows");
  const shows = res.data;

  shows.forEach((show, i) => {
    if (i < 12) {
      renderShowCard(show);
    }
  });
}

getAllShows();

async function searchInput(name) {
  const res = await axios(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`
  );
  const movies = res.data;
  divImages.textContent = "";

  movies.map((movie) => {
    if (movie.show.image?.medium) {
      renderShowCard(movie.show);
    }
  });
}

input.addEventListener("input", (e) => {
  if (input.value.length === 0) {
    divImages.textContent = "";
    getAllShows();
  } else {
    searchInput(input.value);
  }
});

function renderShowCard(show) {
  let containerImage = document.createElement("div");
  containerImage.classList.add("containerImage");

  let image = document.createElement("img");
  image.setAttribute("src", `${show.image.medium}`);
  image.setAttribute("alt", `${show.name}`);
  image.classList.add("images");

  let containerText = document.createElement("div");
  containerText.classList.add("containerText");

  let h2 = document.createElement("h2");
  h2.textContent = show.name;
  h2.classList.add("showName");

  let genre = document.createElement("p");
  genre.textContent = show.genres;
  genre.classList.add("genre");

  let rating = document.createElement("p");
  rating.textContent = show.rating.average;
  rating.classList.add("rating");

  containerText.append(h2, genre, rating);
  containerImage.append(image, containerText);
  divImages.append(containerImage);

  image.addEventListener("mouseenter", () => {
    image.style.transform = "scale(0.93)";
  });

  image.addEventListener("mouseleave", () => {
    image.style.transform = "";
  });

  image.addEventListener("click", () => {
    getAllEpisode(show.id);
  });
}

async function getAllEpisode(id) {
  const res = await axios(`https://api.tvmaze.com/shows/${id}/episodes`);
  const shows = res.data;

  containerMain.textContent = "";
  divImages.textContent = "";
  containerInput.textContent = "";
  searchIcon.textContent = "";

  let option = document.createElement("option");
  option.textContent = "All episodes";
  option.value = "AllEpisodes";
  selectEl.append(option);

  shows.forEach((show, i) => {
    renderEpisodesCards(show);

    let optionEl = document.createElement("option");
    optionEl.textContent = `${
      show.season < 9 ? `S0${show.season}-` : `S${show.season}-`
    }${show.number < 9 ? `E0${show.number}` : `E${show.number}`} ${show.name}`;
    optionEl.value = `${show.name}-S${show.season}E${show.number}`;

    selectEl.append(optionEl);
    containerInput.append(selectEl);
  });

  selectEl.addEventListener("change", (e) => {
    selectedValue = e.target.value;
    if (selectedValue === "AllEpisodes") {
      divImages.textContent = "";
      shows.forEach((show) => {
        renderEpisodesCards(show);
      });
    } else {
      shows.find((show) => {
        if (`${show.name}-S${show.season}E${show.number}` === selectedValue) {
          containerMain.textContent = "";
          divImages.textContent = "";
          renderEpisodesCards(show);
        }
      });
    }
  });
}

function renderEpisodesCards(show) {
  let containerImage = document.createElement("div");
  containerImage.classList.add("containerImage");
  Object.assign(containerImage.style, {
    height: "280px",
  });

  let image = document.createElement("img");
  image.setAttribute("src", `${show.image.medium}`);
  image.setAttribute("alt", `${show.name}`);
  image.classList.add("images");
  image.style.width = "200px";
  Object.assign(image.style, {
    height: "200px",
    "object-fit": "cover",
  });

  let containerText = document.createElement("div");
  containerText.classList.add("containerText");
  Object.assign(containerText.style, {
    "margin-bottom": "30px",
  });

  let h2 = document.createElement("h2");
  h2.textContent = show.name;
  h2.classList.add("episodeName");

  let episode = document.createElement("p");
  episode.textContent =
    show.number < 9 ? `E0${show.number}` : `E${show.number}`;
  episode.classList.add("episodeNumber");

  let season = document.createElement("p");
  season.textContent =
    show.season < 9 ? `S0${show.season}-` : `S${show.season}-`;
  season.classList.add("seasonNumber");

  let containerSummary = document.createElement("div");
  containerSummary.className = "container-Summary";

  let summary = document.createElement("p");
  summary.textContent = getSummary(show);
  summary.classList.add("summary");
  containerSummary.append(summary);
  containerSummary.style.display = "none";

  let logoWrapper = document.createElement("div");
  logoWrapper.className = "logo-episode-card";
  let linkIcon = document.createElement("a");
  linkIcon.href = show.url;
  let icon = document.createElement("i");
  icon.classList.add("bi");
  icon.classList.add("bi-play");

  containerText.append(season, episode, h2, containerSummary);
  linkIcon.append(icon);
  logoWrapper.append(linkIcon);
  containerImage.append(image, containerText, logoWrapper);
  divImages.append(containerImage);
  containerMain.append(divImages);

  containerText.addEventListener("mouseenter", () => {
    containerSummary.style.display = "block";
  });

  containerText.addEventListener("mouseleave", () => {
    containerSummary.style.display = "none";
  });
}

function getSummary(show) {
  const summaries = show.summary;
  const arrsummary = summaries.split(" ");
  arrsummary.shift();
  arrsummary.pop();
  return (newArray =
    arrsummary.length > 40
      ? arrsummary.slice(0, 40).concat("...").join(" ")
      : arrsummary.join(" "));
}

homeIcon.addEventListener("click", () => {
  searchShowByName("game of thorones");
  divImages.textContent = "";
  getAllShows();
  containerSearch.textContent = "";
  containerSearch.innerHTML = ` 
  <form id="SearchForm">
            <div class="container-search">
              <div class="container-input">
                <input
                  type="text"
                  name="query"
                  id="SearchInput"
                  placeholder="Search moive"
                />
              </div>
              <div class="search-icon"><i class="bi bi-search"></i></div>
              <div class="logo"><i class="bi bi-play-fill"></i></div>
            </div>
          </form>
          `;
  input.addEventListener("input", (e) => {
    if (input.value.length === 0) {
      divImages.textContent = "";
      getAllShows();
    } else {
      searchInput(input.value);
    }
  });
});
