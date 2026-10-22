
const placeData = {
    temple: {
        name: "Ramanathaswamy Temple",
        category: "heritage",
        description: "Rameswaram's famous Shiva temple is known for its long corridors, sacred significance and Dravidian architecture.",
        tamil: "ராமேஸ்வரத்தில் அமைந்துள்ள புகழ்பெற்ற சிவன் கோவில். நீண்ட நடைபாதைகளுக்கும் திராவிடக் கட்டிடக்கலைக்கும் பெயர் பெற்றது."
    },
    dhanushkodi: {
        name: "Dhanushkodi",
        category: "nature",
        description: "A coastal destination known for sea views and the remains of the old settlement. Check local access and weather conditions before travelling.",
        tamil: "கடல் காட்சிகளுக்கும் பழைய நகரத்தின் வரலாற்றுச் சிதைவுகளுக்கும் பெயர் பெற்ற கடற்கரைப் பகுதி. பயணத்திற்கு முன் உள்ளூர் நிலவரத்தைச் சரிபார்க்கவும்."
    },
    pamban: {
        name: "Pamban Bridge",
        category: "bridge",
        description: "The historic railway bridge connects Rameswaram island with mainland India. Check current access and viewing rules before visiting.",
        tamil: "ராமேஸ்வரம் தீவையும் இந்திய நிலப்பகுதியையும் இணைக்கும் புகழ்பெற்ற ரயில் பாலம். பார்வையிடுவதற்கான தற்போதைய விதிகளைச் சரிபார்க்கவும்."
    },
    ariyaman: {
        name: "Ariyaman Beach",
        category: "nature",
        description: "A coastal beach near the Ramanathapuram region, suitable for enjoying sea views when local conditions permit.",
        tamil: "ராமநாதபுரம் பகுதியருகே உள்ள கடற்கரை. உள்ளூர் நிலைமைகள் அனுமதிக்கும் போது கடல் காட்சிகளை ரசிக்கலாம்."
    },
    memorial: {
        name: "Dr. APJ Abdul Kalam Memorial",
        category: "heritage",
        description: "A memorial in Pei Karumbu, near Rameswaram, commemorating former Indian President and scientist Dr. APJ Abdul Kalam.",
        tamil: "முன்னாள் இந்திய குடியரசுத் தலைவரும் விஞ்ஞானியுமான டாக்டர் ஏ.பி.ஜே. அப்துல் கலாமின் நினைவிடம்."
    },
    ramapatham: {
        name: "Ramar Patham",
        category: "heritage",
        description: "A religious landmark on Gandhamadhana Parvatham associated with local Ramayana traditions.",
        tamil: "கந்தமாதன பர்வதத்தில் அமைந்துள்ள, ராமாயண மரபுகளுடன் தொடர்புடைய ஆன்மிகத் தலம்."
    }
};

const savedFavorites = new Set();
let currentLanguage = "en";

function searchPlaces() {
    const query = document.getElementById("search").value.trim().toLowerCase();
    const cards = document.querySelectorAll(".place-card");
    let count = 0;

    cards.forEach(card => {
        const match = card.innerText.toLowerCase().includes(query) ||
            card.dataset.name.toLowerCase().includes(query);
        card.style.display = match ? "" : "none";
        if (match) count++;
    });

    if (count === 0) {
        document.getElementById("placeInfo").style.display = "block";
        document.getElementById("placeInfo").innerText =
            "No matching places found. Try temple, beach, Dhanushkodi or Pamban.";
    } else {
        document.getElementById("placeInfo").style.display = "none";
    }

    document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
}

function showAllPlaces() {
    document.querySelectorAll(".place-card").forEach(card => {
        card.style.display = "";
    });
    document.getElementById("search").value = "";
    document.querySelectorAll(".filter").forEach(button => button.classList.remove("active"));
    document.querySelector(".filter").classList.add("active");
}

function filterPlaces(category, button) {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".place-card").forEach(card => {
        card.style.display =
            category === "all" || card.dataset.category === category ? "" : "none";
    });
}

function showInfo(id) {
    const place = placeData[id];
    if (!place) return;

    const description = currentLanguage === "ta" ? place.tamil : place.description;
    const panel = document.getElementById("placeInfo");

    panel.innerHTML = "";
    const heading = document.createElement("h3");
    heading.textContent = place.name;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    const link = document.createElement("a");
    link.href = "https://www.google.com/maps/search/" + encodeURIComponent(place.name + " Ramanathapuram");
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "outline-btn link-button";
    link.textContent = "Find on Google Maps ↗";

    panel.append(heading, paragraph, link);
    panel.style.display = "block";
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleFavorite(id, button) {
    if (savedFavorites.has(id)) {
        savedFavorites.delete(id);
        button.classList.remove("saved");
        button.textContent = "♡";
    } else {
        savedFavorites.add(id);
        button.classList.add("saved");
        button.textContent = "♥";
    }

    renderFavorites();
}

function renderFavorites() {
    const list = document.getElementById("favoriteList");
    list.innerHTML = "";

    if (savedFavorites.size === 0) {
        list.textContent = "No favourites yet. Tap the heart on any destination card to save it.";
        return;
    }

    savedFavorites.forEach(id => {
        const place = placeData[id];
        const item = document.createElement("p");
        item.textContent = "❤️ " + place.name + " ";

        const button = document.createElement("button");
        button.className = "text-btn";
        button.textContent = "View details";
        button.onclick = () => showInfo(id);

        item.appendChild(button);
        list.appendChild(item);
    });
}

function generatePlan() {
    const days = Number(document.getElementById("days").value);
    const interest = document.getElementById("interest").value;
    const budget = Number(document.getElementById("budget").value);
    const panel = document.getElementById("itinerary");

    if (!Number.isFinite(budget) || budget < 0) {
        panel.textContent = "Please enter a valid non-negative budget.";
        return;
    }

    let selected;

    if (interest === "heritage") {
        selected = ["temple", "memorial", "ramapatham", "pamban"];
    } else if (interest === "nature") {
        selected = ["dhanushkodi", "ariyaman", "pamban"];
    } else if (interest === "family") {
        selected = ["temple", "pamban", "ariyaman", "memorial"];
    } else {
        selected = ["temple", "pamban", "dhanushkodi", "memorial", "ariyaman", "ramapatham"];
    }

    const heading = document.createElement("h3");
    heading.textContent = days + "-Day Suggested Itinerary";

    const budgetInfo = document.createElement("p");
    budgetInfo.textContent =
        "Your budget: ₹" + budget.toLocaleString("en-IN") +
        " per person. This is your spending limit, not an estimated trip cost.";

    const list = document.createElement("div");
    const slots = [
        "Morning",
        "Afternoon",
        "Evening",
        "Next morning",
        "Next afternoon",
        "Final stop"
    ];

    selected.slice(0, days * 2).forEach((id, index) => {
        const item = document.createElement("p");
        item.textContent = slots[index] + ": " + placeData[id].name;
        list.appendChild(item);
    });

    const note = document.createElement("p");
    note.className = "small-note";
    note.textContent =
        "Planning suggestion only. Travel times, transport, entry fees, opening hours and weather are not live-verified. Check before departure.";

    panel.innerHTML = "";
    panel.append(heading, budgetInfo, list, note);
    panel.style.display = "block";
}

function askGuide() {
    const input = document.getElementById("question");
    const question = input.value.trim().toLowerCase();
    const output = document.getElementById("chatResult");

    if (!question) {
        output.textContent = "Please type a question first.";
        return;
    }

    let answer;

    if (question.includes("budget") || question.includes("cost") || question.includes("செலவு")) {
        answer = "Use the Trip Planner to set your spending limit. Check current transport, food and accommodation prices separately.";
    } else if (question.includes("temple") || question.includes("கோவில்")) {
        answer = currentLanguage === "ta"
            ? placeData.temple.tamil
            : placeData.temple.description;
    } else if (question.includes("dhanushkodi") || question.includes("தனுஷ்கோடி")) {
        answer = currentLanguage === "ta"
            ? placeData.dhanushkodi.tamil
            : placeData.dhanushkodi.description;
    } else if (question.includes("pamban") || question.includes("பாம்பன்")) {
        answer = currentLanguage === "ta"
            ? placeData.pamban.tamil
            : placeData.pamban.description;
    } else if (question.includes("memorial") || question.includes("kalam")) {
        answer = placeData.memorial.description;
    } else if (question.includes("plan") || question.includes("itinerary") || question.includes("trip")) {
        answer = "Go to Build Your Perfect Trip, choose duration and interest, enter your budget, and select Generate My Itinerary.";
    } else if (question.includes("beach") || question.includes("கடற்கரை")) {
        answer = placeData.ariyaman.description + " You can also explore Dhanushkodi.";
    } else if (question.includes("food") || question.includes("சாப்பாடு")) {
        answer = "Explore local South Indian meals and regional specialities. Check restaurant menus, opening times and dietary options locally.";
    } else if (question.includes("hello") || question.includes("hi") || question.includes("vanakkam")) {
        answer = "Vanakkam! I can help with tourist places, itinerary ideas, beaches and heritage information.";
    } else {
        answer = "I am a sample tourism chatbot. Try asking about Ramanathaswamy Temple, Dhanushkodi, Pamban Bridge, beaches, food or trip planning.";
    }

    output.textContent = answer;
    input.value = "";
}

function quickAsk(question) {
    document.getElementById("question").value = question;
    askGuide();
    document.getElementById("chat").scrollIntoView({ behavior: "smooth" });
}

function getLocation() {
    const result = document.getElementById("locationResult");

    if (!navigator.geolocation) {
        result.textContent = "Your browser does not support location services.";
        return;
    }

    result.textContent = "Requesting location permission...";

    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            result.innerHTML = "";
            const message = document.createElement("p");
            message.textContent =
                "Latitude: " + latitude.toFixed(5) +
                " | Longitude: " + longitude.toFixed(5);

            const link = document.createElement("a");
            link.href = "https://www.google.com/maps?q=" + latitude + "," + longitude;
            link.target = "_blank";
            link.rel = "noopener";
            link.className = "outline-btn link-button";
            link.textContent = "Open my location on Maps ↗";

            result.append(message, link);
        },
        error => {
            const messages = {
                1: "Location permission was denied. Allow location access in browser settings.",
                2: "Your current location could not be determined.",
                3: "Location request timed out. Please try again."
            };
            result.textContent = messages[error.code] || "Unable to get your location.";
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    const button = document.querySelector(".theme-btn");
    button.textContent = dark ? "☀️" : "🌙";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

function voiceSearch() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const output = document.getElementById("chatResult");

    if (!Recognition) {
        output.textContent = "Voice recognition is not supported in this browser. Try a recent version of Chrome.";
        return;
    }

    const recognition = new Recognition();
    recognition.lang = currentLanguage === "ta" ? "ta-IN" :
        currentLanguage === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    output.textContent = "Listening... Please speak now.";

    recognition.onresult = event => {
        document.getElementById("question").value =
            event.results[0][0].transcript;
        askGuide();
    };

    recognition.onerror = () => {
        output.textContent = "Voice search could not start. Check microphone permission and try again.";
    };

    recognition.start();
}

function checkQuiz(answer) {
    const result = document.getElementById("quizResult");

    if (answer === "b") {
        result.textContent = "🎉 Correct! Ramanathaswamy Temple is in Rameswaram.";
    } else {
        result.textContent = "Not quite! Try again. The correct answer is Ramanathaswamy Temple.";
    }
}

function changeLanguage() {
    currentLanguage = document.getElementById("language").value;

    const titles = {
        en: "Discover the Soul of",
        ta: "ராமநாதபுரத்தின் சிறப்பைக் கண்டறியுங்கள்",
        hi: "रामनाथपुरम की खूबसूरती जानें"
    };

    const descriptions = {
        en: "Explore ancient temples, beautiful coastlines and unforgettable cultural experiences with your personal travel guide.",
        ta: "பழமையான கோவில்கள், அழகிய கடற்கரைகள் மற்றும் உள்ளூர் கலாச்சாரத்தை உங்கள் சுற்றுலா வழிகாட்டியுடன் கண்டறியுங்கள்.",
        hi: "अपने यात्रा गाइड के साथ प्राचीन मंदिरों, खूबसूरत समुद्र तटों और स्थानीय संस्कृति का अनुभव करें।"
    };

    document.getElementById("heroTitle").textContent = titles[currentLanguage];
    document.getElementById("heroDescription").textContent = descriptions[currentLanguage];
}

document.getElementById("language").addEventListener("change", changeLanguage);

document.getElementById("search").addEventListener("keydown", event => {
    if (event.key === "Enter") searchPlaces();
});

document.getElementById("topButton").style.display = "block";

renderFavorites();
