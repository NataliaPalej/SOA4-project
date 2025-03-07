const USERS_API_URL = "http://localhost:8080/users";
const DOGS_API_URL = "http://localhost:8081/dogs";

console.log("script.js loaded");

/** Get users **/
function fetchUsers() {
    fetch(USERS_API_URL)
        .then(response => {
            updateStatus("usersResponse", "fetchUsers()", response.status);
            return response.json();
        })
        .then(users => {
            if (!users || users.length === 0) {
                console.warn("No users found.");
                return;
            }
            const tableBody = document.querySelector("#personTable tbody");
            tableBody.innerHTML = "";

            users.forEach(user => {
				console.log("User: ", user)
				
                let statusClass = "yellow"; // Default yellow
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
                        <button class="edit-btn" onclick="editUser(${user.id}, '${user.userName}', '${user.email}', '${user.preferredBreed}', '${user.status}', ${user.dogId ? user.dogId : 'null'})">Edit</button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("fetchUsers(): Error fetching users:", error);
            updateStatus("usersResponse", "fetchUsers()", 500);
        });
}

/** Get dogs **/
function fetchDogs() {
    fetch(DOGS_API_URL)
        .then(response => {
            updateStatus("dogsResponse", "fetchDogs()", response.status);
            return response.json();
        })
        .then(dogs => {
            fetch(USERS_API_URL) // Fetch users to check adoption status
                .then(response => response.json())
                .then(users => {
                    console.log("Users Data:", users);

                    // Track which dogs are adopted or reserved
                    let adoptedDogs = new Set();
                    let pendingDogs = new Set();

                    users.forEach(user => {
                        if (user.dogId) {
                            if (user.status === "APPROVED") {
                                adoptedDogs.add(user.dogId);
                            } else if (user.status === "PENDING") {
                                pendingDogs.add(user.dogId);
                            }
                        }
                    });

                    // Render Dog Table
                    const tableBody = document.querySelector("#dogsTable tbody");
                    tableBody.innerHTML = "";

                    dogs.forEach(dog => {
                        let statusClass = "green"; // Default Available
                        let statusText = "Yes";

                        if (adoptedDogs.has(dog.dogId)) {
                            statusClass = "red";  // Taken
                            statusText = "No";
                        } else if (pendingDogs.has(dog.dogId)) {
                            statusClass = "yellow"; 
                        }

                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${dog.dogId}</td>
                            <td>${dog.name}</td>
                            <td>${dog.age}</td>
                            <td>${dog.breed}</td>
                            <td>${dog.temperament}</td>
                            <td class="${statusClass}">${statusText}</td>
                            <td>
                                <button class="edit-btn" onclick="editDog(${dog.dogId}, '${dog.name}', ${dog.age}, '${dog.breed}', '${dog.temperament}', ${dog.available})">Edit</button>
                                <button class="delete-btn" onclick="deleteDog(${dog.dogId})">Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error("fetchDogs(): Error fetching users:", error);
                });
        })
        .catch(error => {
            console.error("fetchDogs(): Error fetching dogs:", error);
            updateStatus("dogsResponse", "fetchDogs()", 500);
        });
}

/** Users edit form **/
function editUser(id, name, email, preferredBreed, status, dogId) {
	console.log("editUser() id:", id);
	
    document.getElementById("editUserFormContainer").style.display = "block";

    document.getElementById("userId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("preferredBreed").value = preferredBreed;
    document.getElementById("status").value = status;
    document.getElementById("dogId").value = dogId || "";
    
    document.getElementById("saveUser").onclick = function() {
		saveUser(id); 
    };
}

/** Dogs edit form **/
function editDog(id, name, age, breed, temperament, available) {
	console.log("editDog() id:", id);
	
    document.getElementById("editDogFormContainer").style.display = "block";

    document.getElementById("dogIdInput").value = id;
    document.getElementById("dogName").value = name;
    document.getElementById("dogAge").value = age;
    document.getElementById("dogBreed").value = breed;
    document.getElementById("dogTemperament").value = temperament;
    document.getElementById("dogAvailable").value = available.toString();
    
    document.getElementById("saveDog").onclick = function() {
		saveDog(id); 
    };
}

/** Save edited user **/
function saveUser(userId) {
    if (!userId) {
        console.error("saveUser(): User ID doesnt exist.");
        return;
    }

    const updatedUser = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        preferredBreed: document.getElementById("preferredBreed").value,
        status: document.getElementById("status").value,
        dogId: document.getElementById("dogId").value ? parseInt(document.getElementById("dogId").value) : null
    };

    fetch(`${USERS_API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        updateStatus("usersResponse", "saveUser()", response.status);
        if (response.ok) {
            console.log(`saveUser(): User ${userId} updated successfully.`);
            fetchUsers();
            fetchDogs();
            cancelEdit(); // Hide form
        } else {
            console.error("saveUser(): Error updating dog", response);
        }
    })
    .catch(error => console.error("saveUser(): Fetch error:", error));
}

/** Save edited dog **/
function saveDog(dogId) {
    if (!dogId) {
        console.error("saveDog(): No dog ID provided.");
        return;
    }

    const updatedDog = {
        name: document.getElementById("dogName").value,
        age: parseInt(document.getElementById("dogAge").value),
        breed: document.getElementById("dogBreed").value,
        temperament: document.getElementById("dogTemperament").value,
        available: document.getElementById("dogAvailable").value === "true"
    };

    fetch(`${DOGS_API_URL}/${dogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDog)
    })
    .then(response => {
        updateStatus("usersResponse", "saveDog()", response.status);
        if (response.ok) {
            console.log(`saveDog(): Dog ${dogId} updated successfully.`);
            fetchDogs();
            fetchUsers();
            cancelEdit(); 
        } else {
            console.error("saveDog(): Error updating dog", response);
        }
    })
    .catch(error => console.error("saveDog(): Fetch error:", error));
}


/** Hide form when "cancel" is clicked **/
function cancelEdit() {
    document.getElementById("editUserFormContainer").style.display = "none";
    document.getElementById("editDogFormContainer").style.display = "none";

    document.getElementById("userForm").reset();
    document.getElementById("dogForm").reset();
}

/** Delete User **/
function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`${USERS_API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            updateStatus("usersResponse", "deleteUser()", response.status);
            if (response.ok) fetchUsers();
        })
        .catch(error => {
            console.error("deleteUser(): Error deleting user:", error);
            updateStatus("usersResponse", "deleteUser()", 500);
        });
}

/** Delete Dog **/
function deleteDog(id) {
    if (!confirm("Are you sure you want to delete this dog?")) return;

    fetch(`${DOGS_API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            updateStatus("dogsStatus", "deleteDog()", response.status);
            if (response.ok) fetchDogs();
        })
        .catch(error => {
            console.error("deleteDog(): Error deleting dog:", error);
            updateStatus("dogsResponse", "deleteDog()", 500);
        });
}

/** Update response **/
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
