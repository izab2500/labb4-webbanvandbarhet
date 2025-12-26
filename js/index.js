"use strict"

// Dom references
const menue = document.querySelector("#nav")
const overlay = document.querySelector("#overlay")
const openMenue = document.querySelector("#open-menue")
const close = document.querySelector("#close")
const openDropDownIcon = document.querySelector("#open-dropdown")
const dropdown = document.querySelector("#dropdown")
const webAppNav = document.querySelector("#web-app-nav")
const navUl = document.querySelector("#web-app-nav ul")
const navBtns = document.querySelectorAll("#web-app-nav a")
const openWebAppNavBtn = document.querySelector("#open-web-app-nav")
const closeWebAppNavBtn = document.querySelector("#close-web-app-nav")
const formWebApp = document.querySelector("#form-web-app")
const bookingEls = document.querySelectorAll("[data-trip]")
const btnsShowTripFields = document.querySelector("#book-h-btns")
const favouriteTripEl = document.querySelector("#favourite")
const dateEls = document.querySelectorAll(".date")
const timeEls = document.querySelectorAll(".time")
const changeSectionBookings = document.querySelector("#change-section>div")
const favouriteSectionBookings = document.querySelector("#favourite-section>div")


//open menue and overlay (main menue)
function openNav(evt) {
    const clickedEl = evt.target

    if (clickedEl.tagName === "DIV") return

    menue.classList.remove("close-nav")
    overlay.classList.add("overlay")

}

openMenue?.addEventListener("click", openNav)


//close menue and overlay (main menue)
function closeNav(evt) {
    console.log("clicked")
    evt.stopPropagation()
    const clickedId = evt.target.id
    if (clickedId !== "overlay" && clickedId !== "close-p" && clickedId !== "close-i") return

    menue.classList.add("close-nav")
    overlay.classList.remove("overlay")
}

document.addEventListener("click", closeNav)


//toggle dropdown in main meny (secondary of main menue)
function openDropdown(evt) {
    console.log("clicked")
    evt.stopPropagation()

    const clickedEl = evt.target
    if (clickedEl.classList.contains("fa-plus")) {
        dropdown.classList.add("dropdown")
        clickedEl.classList.replace("fa-plus", "fa-minus")
    } else {
        dropdown.classList.remove("dropdown")
        clickedEl.classList.replace("fa-minus", "fa-plus")
    }
}

openDropDownIcon?.addEventListener("click", openDropdown)

// Handles click event to change styles and display the corret section.
function changeAElementStyle(evt) {
    console.log("clicked")
    evt.stopPropagation()

    const clickedALink = evt.target.closest("li").firstElementChild
    if (clickedALink.classList.contains("active-nav-link")) return
    //remove current a-style
    navBtns.forEach(li => li.classList.remove("active-nav-link"))
    //add style to clickedALink
    clickedALink.classList.add("active-nav-link")

    //show correct section
    const sectId = clickedALink.dataset.section
    //hides current active element and shows element
    showClickedSection(sectId)

    // bookings
    if (sectId === "book-section") return
    const bookingsLocalstorage = getBookingLocalstorage()
    sectId === "change-section" ? displayBookingChangeSection(bookingsLocalstorage) : displayBookingFavouriteSection(bookingsLocalstorage)
}

navUl?.addEventListener("click", changeAElementStyle)

// Shows the section corresponding to the clicked navigation link.
function showClickedSection(sectId) {
    const currentEl = document.querySelector(".active-section")
    if (currentEl) {
        currentEl.classList.remove("active-section")
        currentEl.classList.add("hidden")
    }

    const toShow = document.getElementById(sectId)
    if (toShow) {
        toShow.classList.add("active-section")
        toShow.classList.remove("hidden")
    }
}

// Returns booking data from local storage or returns an empty array.
function getBookingLocalstorage() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

// Displays the booking change section with editable fields based on existing bookings.
function displayBookingChangeSection(bookings) {
    const hasBookings = bookings.length > 0
    console.log(bookings)
    if (!hasBookings) {
        changeSectionBookings.innerHTML = `<p>Du har inga bokade resor 😕</p>`
        return
    }
    // label text should be same as "boka"-section
    const labelObj = {
        from: "Från",
        to: "Till",
        date: "Datum",
        time: "Tid",
        children: "Barn (åker gratis)",
        adults: "Vuxna (avgift tillkommer)",
        escort: "Ledsagare (åker gratis)",
        pet: "Sällskapsdjur (avgift tillkommer)",
        "service-dog": "Service-/ledarhund (åker gratis)",
        message: "Meddelande (valfritt)"
    }
    // empty previous data
    changeSectionBookings.innerHTML = ""

    bookings.forEach(booking => {
        const { bookingId, tripType, data } = booking
        const parent = document.createElement("div")
        parent.id = bookingId
        parent.classList.add("parent-change-cancel")

        const h2 = document.createElement("h2")
        h2.textContent = tripType === "tur" ? "Enkel resa" : "Tur/retur resa"
        parent.appendChild(h2)

        // Add the booking date below the h2 section
        const bookingDateP = document.createElement("p")
        const bookingDate = new Date(data.date)
        bookingDateP.textContent = `Bokad: ${bookingDate.toLocaleDateString("sv-SE")}`        
        parent.appendChild(bookingDateP);

        Object.entries(data).forEach(([key, value]) => {
            const idUnique = `${bookingId}-${key}`
            const wrapper = document.createElement("div")
            const label = document.createElement("label")
            // remove suffix value from key
            const repKey = key.replace("-retur", "")
            label.textContent = labelObj[repKey]
            label.htmlFor = idUnique

            let field
            if (key.includes("date")) {
                field = document.createElement("input")
                field.type = "date"
                field.id = idUnique
                field.name = key
                field.value = value
            } if (key.includes("time")) {
                field = document.createElement("input")
                field.type = "time"
                field.id = idUnique
                field.name = key
                field.value = value
            } if (value === "on") {
                field = document.createElement("input")
                field.type = "checkbox"
                field.id = idUnique
                field.name = key
                field.checked = true
                wrapper.classList.add("has-checkbox")
            } if (key === "from" || key === "to") {
                field = document.createElement("input")
                field.type = "text"
                field.id = idUnique
                field.name = key
                field.value = value
            } if (key.includes("children")) {
                field = document.createElement("select")
                field.id = idUnique
                field.name = key
                for (let i = 0; i <= 3; i++) {
                    const optionEl = document.createElement("option")
                    optionEl.value = i
                    optionEl.textContent = i
                    if (String(i) === String(value)) optionEl.selected = true
                    field.appendChild(optionEl)
                }
            }

            if (key.includes("adults")) {
                field = document.createElement("select")
                field.id = idUnique
                field.name = key
                for (let i = 0; i <= 2; i++) {
                    const optionEl = document.createElement("option")
                    optionEl.value = i
                    optionEl.textContent = i
                    if (String(i) === String(value)) optionEl.selected = true
                    field.appendChild(optionEl)
                }
            }

            if (key === "message") {
                field = document.createElement("textarea")
                field.id = idUnique
                field.name = key
                field.value = value
            }

            wrapper.append(label, field)
            parent.appendChild(wrapper)
        })

        const btnDiv = document.createElement("div")
        const cancelBtn = document.createElement("button")
        cancelBtn.type = "button"
        cancelBtn.textContent = "Avboka"

        const changeBtn = document.createElement("button")
        changeBtn.type = "button"
        changeBtn.textContent = "Ändra"

        btnDiv.append(cancelBtn, changeBtn)
        parent.appendChild(btnDiv)

        changeSectionBookings.appendChild(parent)
    })

}

// Updates a booking  in local storage based on form inputs.
function updateTripLocalStorage(evt) {
    evt.stopPropagation()
    const clickedEl = evt.target
    if (clickedEl.textContent !== "Ändra") return

    const card = clickedEl.closest(".parent-change-cancel")
    const bookingId = card.id

    const fields = card.querySelectorAll("input, select, textarea")

    const bookingsArray = JSON.parse(localStorage.getItem("bookings")) || []
    const booking = bookingsArray.find(b => b.bookingId === bookingId)
    if (!booking) return

    // validate fields
    for (const field of fields) {
        const key = field.name
        if (["from", "to", "date", "time"].includes(key) && !field.value) {
            alert("Från, till, datum och tid är obligatoriska fält")
            return
        }
    }

    // clean data or update if input values is different from data in local storage
    fields.forEach(field => {
        const key = field.name
        let newValue

        if (
            (field.type === "checkbox" && !field.checked) ||
            (field.tagName === "SELECT" && field.value === "0") ||
            (field.tagName === "TEXTAREA" && !field.value)
        ) {
            delete booking.data[key]
            return
        }
        newValue = field.value
        if (booking.data[key] !== newValue) {
            booking.data[key] = newValue
        }
    })

    localStorage.setItem("bookings", JSON.stringify(bookingsArray))
    displayBookingChangeSection(bookingsArray)
    alert("Din resa är ändrad")
}

changeSectionBookings?.addEventListener("click", updateTripLocalStorage)

//delete trip from local storage and update the UI.
function cancelTripLocalStorage(evt) {
    evt.stopPropagation()
    const clickedEl = evt.target
    if (clickedEl.textContent !== "Avboka") return

    const card = clickedEl.closest(".parent-change-cancel")
    const bookingId = card.id

    const bookingsArray = JSON.parse(localStorage.getItem("bookings")) || []
    const booking = bookingsArray.find(b => b.bookingId === bookingId)
    if (!booking) return

    const updatedBookings = bookingsArray.filter(b => b.bookingId !== bookingId);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    displayBookingChangeSection(updatedBookings);
    alert("Din resa är avbokad");
}

changeSectionBookings?.addEventListener("click", cancelTripLocalStorage)

//show favourite trip from local storage if they exist.
function displayBookingFavouriteSection(bookings) {
    if (!bookings.length) {
        favouriteSectionBookings.innerHTML = `<p>Du har inga bokade favoritresor 😕</p>`;
        return;
    }

    favouriteSectionBookings.innerHTML = "";

    const labelObj = {
        from: "Från",
        to: "Till",
        date: "Datum",
        time: "Tid",
    }

    bookings.forEach(booking => {
        const { bookingId, favourite, tripType, data } = booking;
        if (!favourite) return;

        const { from, to, date, time, "date-retur": dateRetur, "time-retur": timeRetur } = data;

        const wrapper = document.createElement("div");
        wrapper.classList.add("favourite-trip");
        wrapper.id = `wrapper-${bookingId}`;

        const h2 = document.createElement("h2");
        h2.textContent = tripType === "tur" ? "Enkelresa" : "Tur/Retur";
        wrapper.appendChild(h2);

        // from holds keys value in local storage (obj)
        if (from) {
            const div = document.createElement("div");
            const label = document.createElement("label");
            label.id = `label-${bookingId}-from`;
            label.htmlFor = `field-${bookingId}-from`;
            label.textContent = labelObj.from;

            const field = document.createElement("input");
            field.id = `field-${bookingId}-from`;
            field.type = "text";
            field.value = from;

            div.append(label, field);
            wrapper.append(div);
        }

        // to holds keys value in local storage (obj)
        if (to) {
            const div = document.createElement("div");
            const label = document.createElement("label");
            label.id = `label-${bookingId}-to`;
            label.htmlFor = `field-${bookingId}-to`;
            label.textContent = labelObj.to;

            const field = document.createElement("input");
            field.id = `field-${bookingId}-to`;
            field.type = "text";
            field.value = to;

            div.append(label, field);
            wrapper.append(div);
        }

        // date holds keys value in local storage (obj)
        if (date) {
            const div = document.createElement("div");
            const label = document.createElement("label");
            label.id = `label-${bookingId}-date`;
            label.htmlFor = `field-${bookingId}-date`;
            label.textContent = labelObj.date;

            const field = document.createElement("input");
            field.id = `field-${bookingId}-date`;
            field.type = "date";
            field.value = date;

            div.append(label, field);
            wrapper.append(div);
        }

        // time holds keys value in local storage (obj)
        if (time) {
            const div = document.createElement("div");
            const label = document.createElement("label");
            label.id = `label-${bookingId}-time`;
            label.htmlFor = `field-${bookingId}-time`;
            label.textContent = labelObj.time;

            const field = document.createElement("input");
            field.id = `field-${bookingId}-time`;
            field.type = "time";
            field.value = time;

            div.append(label, field);
            wrapper.append(div);
        }

        // dateRetur and timeRetur holds corresponding keys value in local storage (obj)
        if (tripType === "retur" && dateRetur && timeRetur) {
            const hr = document.createElement("hr");
            hr.classList.add("favourite-hr");
            wrapper.append(hr);

            const divDateRetur = document.createElement("div");
            const labelDateRetur = document.createElement("label");
            labelDateRetur.id = `label-${bookingId}-date-retur`;
            labelDateRetur.htmlFor = `field-${bookingId}-date-retur`;
            labelDateRetur.textContent = labelObj.date;

            const fieldDateRetur = document.createElement("input");
            fieldDateRetur.id = `field-${bookingId}-date-retur`;
            fieldDateRetur.type = "date";
            fieldDateRetur.value = dateRetur;

            divDateRetur.append(labelDateRetur, fieldDateRetur);
            wrapper.append(divDateRetur);

            const divTimeRetur = document.createElement("div");
            const labelTimeRetur = document.createElement("label");
            labelTimeRetur.id = `label-${bookingId}-time-retur`;
            labelTimeRetur.htmlFor = `field-${bookingId}-time-retur`;
            labelTimeRetur.textContent = labelObj.time;

            const fieldTimeRetur = document.createElement("input");
            fieldTimeRetur.id = `field-${bookingId}-time-retur`;
            fieldTimeRetur.type = "time";
            fieldTimeRetur.value = timeRetur;

            divTimeRetur.append(labelTimeRetur, fieldTimeRetur);
            wrapper.append(divTimeRetur);
        }

        // create and disable buttons
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("favourite-buttons");

        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Boka";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Ta bort";
        cancelBtn.id = `taBort-${bookingId}`;

        bookBtn.disabled = true;
        cancelBtn.disabled = true;

        buttonDiv.append(bookBtn, cancelBtn);
        wrapper.append(buttonDiv);

        favouriteSectionBookings.appendChild(wrapper);
    });
}


/***************** ********************/

// open web app nav
function openAppNav(evt) {
    console.log("clicked")
    evt.stopPropagation()


    const btnId = evt.target.closest("button").id
    if (btnId) {
        webAppNav.classList.add("show-nav-web-app")
        webAppNav.classList.remove("hide-nav-web-app")
    }
}

openWebAppNavBtn?.addEventListener("click", openAppNav)

// close web app nav
function closeAppNav(evt) {
    console.log("clicked")
    evt.stopPropagation()
    const btnId = evt.target.closest("button").id
    if (btnId) {
        webAppNav.classList.add("hide-nav-web-app")
        webAppNav.classList.remove("show-nav-web-app")
    }
}

closeWebAppNavBtn?.addEventListener("click", closeAppNav)


//only current- and future date(s) 
function setAcceptableDateRange() {
    const dateObj = new Date()
    const year = dateObj.getFullYear()
    const month = String((dateObj.getMonth() + 1)).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")
    const date = `${year}-${month}-${day}`

    dateEls.forEach(el => el.setAttribute("min", date))
}

setAcceptableDateRange()

/*html timepicker - start 3h ahead of current time and adjust dates accordingly...
Create custom solution, if before deadline 24th of Dec*/


let type // set to know if tur or retur

//show or hides trip sections (Boka)
function showBookingTripEls(evt) {
    console.log("clicked")
    evt.stopPropagation()

    const btn = evt.target.closest("button[data-fields]")
    if (!btn) return

    type = evt.target.dataset.fields
    console.log(type)

    bookingEls.forEach(el => {
        const tripType = el.dataset.trip; ////one-ticket, return, always & always
        //one-way trip
        if (type === "tur") {
            if (tripType === "return") {
                el.classList.add("hidden");
            } else {
                el.classList.remove("hidden");
            }
        }
        //round-trip
        if (type === "retur") {
            el.classList.remove("hidden");
        }
    });
}

btnsShowTripFields?.addEventListener("click", showBookingTripEls)

//is favourite trip
let isFavouriteTrip = false
//toggles favourite trip
function setFavouriteTrip(evt) {
    console.log("clicked")
    evt.stopPropagation()

    const clickedEl = evt.target.closest("div")
    clickedEl.classList.toggle("favourite")
    isFavouriteTrip = !isFavouriteTrip
}

favouriteTripEl?.addEventListener("click", setFavouriteTrip)

// VALIDATE FORMDATA (check how date- and timepicker icons can be styled) if before dealine 24th dec

//register booking localstorage
function regBookingLocalStorage(evt) {
    console.log("clicked")
    evt.stopPropagation()

    evt.preventDefault()
    console.log("clicked submit web app form")

    // form key/value (name/value) pairs (remember checkboxes will not be includes if not checked)
    const formData = new FormData(formWebApp)

    const dataObj = Object.fromEntries(formData.entries())

    console.log(dataObj, type)

    // Check if required fields are invalid for trip type
    if (type === "tur") {
        // required fields for one-way trip
        if (!dataObj.from || !dataObj.to || !dataObj.date || !dataObj.time) {
            alert("Vänligen fyll i alla obligatoriska fälten för enkel resa.")
            return
        }
    } else if (type === "retur") {
        // required fields for round trip
        if (!dataObj.from || !dataObj.to || !dataObj.date || !dataObj.time || !dataObj["date-retur"] || !dataObj["time-retur"]) {
            alert("Vänligen fyll i alla obligatoriska fälten för tur/retur resa.")
            return
        }
    }

    const bookingObj = {
        bookingId: crypto.randomUUID(),
        favourite: isFavouriteTrip,
        tripType: type,
        data: Object.fromEntries(
            Object.entries(dataObj)
                .filter(([key, value]) => {
                    // remove all "-retur"-fields, fields with falsy values ("" and "0")
                    if (type === "tur") {
                        return !key.includes("-retur") && value.trim() !== "" && value !== "0"
                    }
                    // include only truthy values for roundtrip (tur/retur)
                    return value.trim() !== "" && value !== "0"
                })
        )
    }

    // localstorage
    const bookingsArr = JSON.parse(localStorage.getItem("bookings")) || [];

    //check if booking exist
    const doesBookingExist = bookingsArr.some(booking => {
        return (
            booking.tripType === bookingObj.tripType &&
            // remember - the reference says must be exact the same (primitive "obj")
            JSON.stringify(booking.data) === JSON.stringify(bookingObj.data)
        )
    })

    if (doesBookingExist) {
        alert("Den här resan är redan bokad.")
        return
    }

    bookingsArr.push(bookingObj)

    localStorage.setItem("bookings", JSON.stringify(bookingsArr))

    alert("Din resa är bokad!")

}

formWebApp?.addEventListener("submit", regBookingLocalStorage)

