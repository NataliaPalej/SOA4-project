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
import org.springframework.web.bind.annotation.RestController;

import a00279259.user_service.dog.Dog;
import a00279259.user_service.dog.DogClient;
import a00279259.user_service.user.User;
import a00279259.user_service.user.UserResponse;

@RestController
public class UserResource {
	private UserRepository userRepository;
	private DogClient dogClient;
		
	@Autowired
	public UserResource(UserRepository userRepository, DogClient dogClient) {
		this.userRepository = userRepository;
		this.dogClient = dogClient;
	}
	
	@GetMapping("/users")
	public List<User> getAllUsers(){
		System.out.println("getAllUsers() sucessful.");
		return userRepository.findAll();
	}
	
	@GetMapping("/users/{id}")
	public ResponseEntity<UserResponse> getUser(@PathVariable int id){
		Optional<User> user = userRepository.findById(id);
		
		if(user.isEmpty()) {
			System.out.println("User with ID: " + id + " does not exist.");
			return ResponseEntity.notFound().build();
		} else {
			Dog dog = dogClient.getDogById(user.get().getDogId());
			UserResponse userResponse = new UserResponse(user.get(), dog);
			System.out.println("getUser() ID: " + id + " sucessfully retrieved.");
			return ResponseEntity.ok(userResponse);
		}
	}
	
	@PostMapping
    public ResponseEntity<User> addUser(@RequestBody User user) {
		User savedUser = userRepository.save(user);
        URI location = URI.create("/users/" + savedUser.getId());
        System.out.println("\npost() :: user was created successfully");
        return ResponseEntity.created(location).body(savedUser); // 201 Created
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> editUser(@PathVariable int id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
        	System.out.println("\nupdate() :: ID: " + id + " does not exist.\n");
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        
        // Check if dog exists before updating 
        Dog dog = dogClient.getDogById(updatedUser.getDogId());
        if (dog == null) {
        	System.out.println("\neditUser() :: dog ID does not exist.\n");
        	return ResponseEntity.badRequest().body(null); // 400 Bad Request
        }
        
        updatedUser.setId(id); // Ensure ID remains the same
        User savedUser = userRepository.save(updatedUser);
        System.out.println("\neditUser() :: ID: " + id + " was updated successully.\n");
        return ResponseEntity.ok(savedUser); // 200 OK
    }
	
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable int id) {
		Optional<User> user = userRepository.findById(id);
		if (user.isEmpty()) {
			System.out.println("\ndeleteStudent() :: ID: " + id + " not found.\n");
			return ResponseEntity.notFound().build();
		}
		
		userRepository.deleteById(id);
		System.out.println("\ndeleteStudent() :: User deleted successfully.\n");
		return ResponseEntity.noContent().build(); 
    }
}
