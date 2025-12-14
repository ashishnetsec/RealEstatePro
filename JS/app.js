document.addEventListener("DOMContentLoaded", () => {

    const tabsContainer = document.getElementById("cityTabs");
    const propertyGrid = document.getElementById("propertyGrid");
    const overlay = document.getElementById("detailsOverlay");
    const detailsContent = document.getElementById("detailsContent");
    const closeBtn = document.querySelector(".details-close");

    let allProperties = [];

    // ================= FETCH DATA =================
    fetch("data/properties.json")
        .then(res => res.json())
        .then(data => {
            allProperties = data;
            createCityTabs(data);
            renderCards("All");
        })
        .catch(err => console.error("JSON load failed:", err));

    // ================= CITY TABS =================
    function createCityTabs(data) {
        const cities = [...new Set(data.map(p => p.city))];

        tabsContainer.innerHTML = `
      <li class="nav-item">
        <button class="nav-link active" data-city="All">All Cities</button>
      </li>
    `;

        cities.forEach(city => {
            tabsContainer.innerHTML += `
        <li class="nav-item">
          <button class="nav-link" data-city="${city}">${city}</button>
        </li>
      `;
        });

        tabsContainer.addEventListener("click", e => {
            if (!e.target.classList.contains("nav-link")) return;

            document
                .querySelectorAll("#cityTabs .nav-link")
                .forEach(t => t.classList.remove("active"));

            e.target.classList.add("active");
            renderCards(e.target.dataset.city);
        });
    }

    // ================= RENDER CARDS =================
    function renderCards(city) {
    propertyGrid.innerHTML = "";

    const list =
        city === "All"
            ? allProperties
            : allProperties.filter(p => p.city === city);

    list.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4";

        col.innerHTML = `
            <div class="card property-card">
                <img src="${p.images[0]}" class="card-img-top" alt="${p.title}">

                <div class="card-body">
                    <h6 class="fw-semibold">${p.title}</h6>
                    <p class="text-muted small">${p.location}, ${p.city}</p>
                    <p class="small">${p.shortDescription}</p>
                    <p class="price">₹ ${(p.price / 100000).toFixed(2)} L</p>

                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-primary w-50 view-btn" data-id="${p.id}">
                            View Details
                        </button>
                        <button class="btn btn-outline-primary w-50">
                            Contact Dealer
                        </button>
                    </div>
                </div>
            </div>
        `;

        propertyGrid.appendChild(col);
    });
}


    // ================= EVENT DELEGATION (KEY FIX) =================
    propertyGrid.addEventListener("click", e => {
        const btn = e.target.closest(".view-btn");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        openDetails(id);
    });

    // ================= OPEN POPUP =================
    function openDetails(id) {
        const p = allProperties.find(item => item.id === id);
        if (!p) return;

        detailsContent.innerHTML = `
      <h3 class="popup-title">${p.title}</h3>
      <p class="text-muted">${p.location}, ${p.city}</p>

      <img src="${p.images[0]}" alt="${p.title}">

      <p>${p.description}</p>

      <p><b>Type:</b> ${p.propertyType}</p>
      <p><b>Area:</b> ${p.areaSqFt} sq.ft</p>
      <p><b>BHK:</b> ${p.bhk ?? "N/A"}</p>
      <p><b>Bathrooms:</b> ${p.bathrooms}</p>

      <p class="details-price">
        ₹ ${(p.price / 100000).toFixed(2)} L
      </p>

      <h6 class="mt-3">Amenities</h6>
      <div class="amenities">
        ${p.amenities.map(a => `<span class="amenity">${a}</span>`).join("")}
      </div>
    `;

        overlay.classList.add("active");
    }

    // ================= CLOSE POPUP =================
    closeBtn.addEventListener("click", () => overlay.classList.remove("active"));

    overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.classList.remove("active");
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") overlay.classList.remove("active");
    });

});
