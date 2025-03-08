package a00279259.user_service.user.jpa;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import a00279259.user_service.dog.Dog;
import a00279259.user_service.dog.DogClient;
import a00279259.user_service.user.User;
import a00279259.user_service.user.UserResponse;

@RestController
@RequestMapping("/users")
public class UserResource {
	private UserRepository userRepository;
	private DogClient dogClient;
		
	@Autowired
	public UserResource(UserRepository userRepository, DogClient dogClient) {
		this.userRepository = userRepository;
		this.dogClient = dogClient;
	}
	
	@GetMapping
	public List<User> getAllUsers(){
		System.out.println("getAllUsers() sucessful.");
		return userRepository.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUser(@PathVariable int id) {
	    Optional<User> user = userRepository.findById(id);

	    if (user.isEmpty()) {
	        System.out.println("User with ID: " + id + " does not exist.");
	        return ResponseEntity.notFound().build();
	    }

	    Integer dogId = user.get().getDogId();
	    System.out.println("User ID " + id + " has dogId: " + dogId); // Debugging

	    Dog dog = null;
	    if (dogId != null) {
	        try {
	            dog = dogClient.getDogById(dogId);
	            System.out.println("Fetched Dog: " + dog); // Debugging
	        } catch (Exception e) {
	            System.out.println("Dog with ID " + dogId + " not found in dog-service.");
	        }
	    }

	    UserResponse userResponse = new UserResponse(user.get(), dog);
	    System.out.println("Returning UserResponse: " + userResponse);
	    return ResponseEntity.ok(userResponse);
	}

	
	@PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
		if (user.getId() != 0) {
	        return ResponseEntity.badRequest().body(null); // 400 Bad Request
	    }
		
		user.setId(0); 
		
		if (user.getDogId() != null) {  
	        Dog dog = dogClient.getDogById(user.getDogId());
	        if (dog == null) {
	            System.out.println("\naddUser() :: Dog ID " + user.getDogId() + " not found.");
	            return ResponseEntity.badRequest().body(null); // 400 Bad Request
	        }
	    }
		
		User savedUser = userRepository.save(user);
        URI location = URI.create("/users/" + savedUser.getId());
        System.out.println("\npost() :: user was created successfully");
        return ResponseEntity.created(location).body(savedUser); // 201 Created
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> editUser(@PathVariable int id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
        	System.out.println("\nupdate() :: ID: " + id + " does not exist.\n");
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        
        // Check if dog exists before updating 
        Integer dogId = updatedUser.getDogId();
        Dog dog = dogClient.getDogById(dogId);
        if (dog == null) {
        	System.out.println("\neditUser() :: dog ID does not exist.\n");
        	return ResponseEntity.badRequest().body(null); // 400 Bad Request
        }
        
        updatedUser.setId(id); // Ensure ID remains the same
        User savedUser = userRepository.save(updatedUser);
        System.out.println("\neditUser() :: ID: " + id + " was updated successully.\n");
        return ResponseEntity.ok(savedUser); // 200 OK
    }
	
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteStudent(@PathVariable int id) {
//		Optional<User> user = userRepository.findById(id);
//		if (user.isEmpty()) {
//			System.out.println("\ndeleteStudent() :: ID: " + id + " not found.\n");
//			return ResponseEntity.notFound().build();
//		}
//		
//		userRepository.deleteById(id);
//		System.out.println("\ndeleteStudent() :: User deleted successfully.\n");
//		return ResponseEntity.noContent().build(); 
//    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        Optional<User> existingUser = userRepository.findById(userId);
        
        if (existingUser.isEmpty()) {
            System.out.println("User with ID: " + userId + " does not exist.");
            return ResponseEntity.notFound().build(); // 404 Not Found
        }

        User user = existingUser.get();
        if (user.getDogId() != null) {
            try {
                // Call dog-service to mark the dog as available again
                updateDogAvailability(user.getDogId(), true);
                System.out.println("Dog ID " + user.getDogId() + " set as available.");
            } catch (Exception e) {
                System.err.println("Failed to update dog availability: " + e.getMessage());
                return ResponseEntity.status(500).body("Failed to update dog availability.");
            }
        }

        // Delete the user
        userRepository.deleteById(userId);
        System.out.println("User ID: " + userId + " was successfully deleted.");
        return ResponseEntity.noContent().build();
    }
    
    private void updateDogAvailability(Integer dogId, boolean available) {
        Dog updatedDog = dogClient.getDogById(dogId);
        updatedDog.setAvailable(available);
        
        // Send PUT request to update dog availability
        RestTemplate restTemplate = new RestTemplate();
        String updateUrl = "http://localhost:8081/dogs/" + dogId;
        restTemplate.put(updateUrl, updatedDog);
    }


    
}
