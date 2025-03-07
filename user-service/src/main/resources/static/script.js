const USERS_API_URL = "http://localhost:8080/users";
const DOGS_API_URL = "http://localhost:8081/dogs"

console.log("script.js loaded");

/** GET USERS **/
function fetchUsers() {
    fetch(USERS_API_URL)
        .then(response => {
            updateStatus("usersResponse", "fetchUsers()", response.status);
            return response.json();
        })
        .then(users => {
            console.log("Fetched Users:", users);
            if (!users || users.length === 0) {
                console.warn("No users found.");
                return;
            }
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
        .catch(error => {
            console.error("Error fetching users:", error);
            updateStatus("usersResponse", 500);
        });
}

/** GET DOGS **/
function fetchDogs() {
    fetch(DOGS_API_URL)
        .then(response => {
            updateStatus("dogsResponse", "fetchDogs()",  response.status);
            return response.json();
        })
        .then(dogs => {
            console.log("Fetched Dogs:", dogs);
            if (!dogs || dogs.length === 0) {
                console.warn("No dogs found.");
                return;
            }

            fetch(USERS_API_URL) // Fetch users to check adoption status
                .then(response => response.json())
                .then(users => {
                    console.log("Fetched Users for Adoption Check:", users);

                    // Map dog IDs to adoption status
                    const pendingDogs = new Set();
                    const adoptedDogs = new Set();

                    users.forEach(user => {
                        if (user.dogId !== null) {
                            if (user.status === "PENDING") pendingDogs.add(user.dogId);
                            else if (user.status === "APPROVED") adoptedDogs.add(user.dogId);
                        }
                    });

                    // Update table with correct colors
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
                })
                .catch(error => console.error("Error fetching users:", error));
        })
        .catch(error => {
            console.error("Error fetching dogs:", error);
            updateStatus("dogsResponse", 500);
        });
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

/** EDIT/ADD DOG **/
function editDog(id, name, age, breed, temperament, available) {
    document.getElementById("dogIdInput").value = id;
    document.getElementById("dogName").value = name;
    document.getElementById("dogAge").value = age;
    document.getElementById("dogBreed").value = breed;
    document.getElementById("dogTemperament").value = temperament;
    document.getElementById("dogAvailable").value = available.toString();
}

/** DELETE USER **/
function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" })
        .then(response => {
			// Update status
            updateStatus("usersResponse", "deleteUser()", response.status); 
            // Refresh table after delete
            if (response.ok) fetchUsers(); 
        })
        .catch(error => {
            console.error("Error deleting dog:", error);
            updateStatus("dogsStatus", 500);
        });
}

/** DELETE DOG **/
function deleteDog(id) {
    if (!confirm("Are you sure you want to delete this dog?")) return;

    fetch(`${DOGS_API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            updateStatus("dogsStatus", "deleteDog()", response.stauts)
             if (response.ok) fetchDogs(); 
        })
        .catch(error => console.error("Error:", error));
}



/** USERS **/
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


function updateStatus(elementId, functionName, statusCode) {
    const statusElement = document.getElementById(elementId);

    if (!statusElement) {
        console.error(`updateStatus(): Element with id '${elementId}' not found.`);
        return;
    }
    
    let statusMessage = `${functionName}: `;

    switch (statusCode) {
        case 200:
            statusMessage += "200 OK (Success)";
            statusElement.style.color = "green";
            break;
        case 201:
            statusMessage += "201 Created (Success)";
            statusElement.style.color = "green";
            break;
        case 204:
            statusMessage += "204 Deleted (No Content)";
            statusElement.style.color = "gray";
            break;
        case 304:
            statusMessage += "304 Not Modified (Cached)";
            statusElement.style.color = "blue";
            break;
        case 400:
            statusMessage += "400 Bad Request";
            statusElement.style.color = "orange";
            break;
        case 404:
            statusMessage += "404 Not Found";
            statusElement.style.color = "red";
            break;
        case 500:
            statusMessage += "500 Server Error";
            statusElement.style.color = "red";
            break;
        default:
            statusMessage += `Error ${statusCode}`;
            statusElement.style.color = "orange";
    }
    statusElement.innerText = statusMessage;
    console.log(`updateStatus(): Updated status of '${elementId}' to '${statusMessage}'`);
}



window.onload = function() {
    fetchUsers();
    fetchDogs();
};

