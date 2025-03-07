const USERS_API_URL = "http://localhost:8080/users";
const DOGS_API_URL = "http://localhost:8081/dogs"

console.log("script.js loaded");

/** USERS **/
function fetchUsers() {
    fetch("http://localhost:8080/users")
        .then(response => response.json())
        .then(users => {
            console.log("Fetched Users:", users); 
            const tableBody = document.querySelector("#personTable tbody");
            tableBody.innerHTML = "";
            users.forEach(user => {
                console.log("User Object:", user); 

                // Status colours
                let statusClass = "yellow"; // Default PENDING (Yellow)
                if (user.status === "APPROVED") statusClass = "green"; 
                if (user.status === "REJECTED") statusClass = "red"; 

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>${user.preferredBreed}</td>
                    <td class="${statusClass}">${user.status}</td>
                    <td>${user.dogId ? `${user.dogId}` : "N/A"}</td>
                    <td>
                        <button onclick="editUser(${user.id}, '${user.userName}', '${user.email}', '${user.preferredBreed}', '${user.status}', ${user.dogId ? user.dogId : 'null'})">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}



/** ADD/EDIT USERS **/
function editUser(id, name, email, preferredBreed, status, dogId) {
    document.getElementById("userId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("preferredBreed").value = preferredBreed;
    document.getElementById("status").value = status;
    document.getElementById("dogId").value = dogId || "";
}

function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
				console.log("User ", id, " deleted.")
                fetchUsers(); // Refresh Users table after deletion
            } else {
                console.error("Error deleting user:", response);
            }
        })
        .catch(error => console.error("Error:", error));
}






document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("userId").value;
    const userData = {
        userName: document.getElementById("name").value,
        email: document.getElementById("email").value,
        preferredBreed: document.getElementById("preferredBreed").value,
        status: document.getElementById("status").value,
        dogId: document.getElementById("dogId").value ? parseInt(document.getElementById("dogId").value) : null
    };

    const requestMethod = id ? "PUT" : "POST";
    const requestUrl = id ? `${USERS_API_URL}/${id}` : USERS_API_URL;

    fetch(requestUrl, {
        method: requestMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            fetchUsers();
            document.getElementById("userForm").reset();
            document.getElementById("userId").value = "";
        } else {
            console.error("Error saving user:", response);
        }
    })
    .catch(error => console.error("Error:", error));
});


/** DOGS **/
function fetchDogs() {
    fetch("http://localhost:8081/dogs")
        .then(response => response.json())
        .then(dogs => {
            console.log("Fetched Dogs:", dogs);

            fetch("http://localhost:8080/users") // Fetch all users to check if they have any dog
                .then(response => response.json())
                .then(users => {
                    console.log("Fetched Users:", users); 

                    // Map dog IDs to user adoption statuses
                    const pendingDogs = new Set();
                    const adoptedDogs = new Set();

                    users.forEach(user => {
                        if (user.dogId !== null) {
                            if (user.status === "PENDING") {
                                pendingDogs.add(user.dogId); // Dog is reserved
                            } else if (user.status === "APPROVED") {
                                adoptedDogs.add(user.dogId); // Dog is adopted
                            }
                        }
                    });

                    // Update table with colors
                    const tableBody = document.querySelector("#dogsTable tbody");
                    tableBody.innerHTML = "";
                    dogs.forEach(dog => {
                        let statusClass = "green"; // Default Available
                        let availabilityText = "Yes";

                        if (adoptedDogs.has(dog.dogId)) {
                            statusClass = "red"; // Adopted
                            availabilityText = "No";
                        } else if (pendingDogs.has(dog.dogId)) {
                            statusClass = "yellow"; // Pending Adoption
                        }

                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${dog.dogId}</td>
                            <td>${dog.name}</td>
                            <td>${dog.age}</td>
                            <td>${dog.breed}</td>
                            <td>${dog.temperament}</td>
                            <td id="dog-${dog.dogId}" class="${statusClass}">${availabilityText}</td>
                            <td>
                                <button onclick="editDog(${dog.dogId}, '${dog.name}', ${dog.age}, '${dog.breed}', '${dog.temperament}', ${dog.available})">Edit</button>
                                <button onclick="deleteDog(${dog.dogId})">Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                });
        })
        .catch(error => console.error("Error fetching dogs:", error));
}


/** EDIT/ADD DOG **/
function editDog(id, name, age, breed, temperament, available) {
    document.getElementById("dogIdInput").value = id;
    document.getElementById("dogName").value = name;
    document.getElementById("dogAge").value = age;
    document.getElementById("dogBreed").value = breed;
    document.getElementById("dogTemperament").value = temperament;
    document.getElementById("dogAvailable").value = available.toString();
}

/** DELETE DOG **/
function deleteDog(id) {
    if (!confirm("Are you sure you want to delete this dog?")) return;

    fetch(`${DOGS_API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
				console.log("Dog ", id, " deleted.")
                fetchDogs();  // Refresh dogs table after deletion
            } else {
                console.error("Error deleting dog:", response);
            }
        })
        .catch(error => console.error("Error:", error));
}


document.getElementById("dogsForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("dogIdInput").value;
    const dogData = {
        name: document.getElementById("dogName").value,
        age: parseInt(document.getElementById("dogAge").value),
        breed: document.getElementById("dogBreed").value,
        temperament: document.getElementById("dogTemperament").value,
        available: document.getElementById("dogAvailable").value === "true"
    };

    const requestMethod = id ? "PUT" : "POST";
    const requestUrl = id ? `${DOGS_API_URL}/${id}` : DOGS_API_URL;

    fetch(requestUrl, {
        method: requestMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dogData)
    })
    .then(response => {
        if (response.ok) {
            fetchDogs();
            document.getElementById("dogsForm").reset();
            document.getElementById("dogIdInput").value = "";
        } else {
            console.error("Error saving dog:", response);
        }
    })
    .catch(error => console.error("Error:", error));
});




window.onload = function() {
    fetchUsers();
    fetchDogs();
};

