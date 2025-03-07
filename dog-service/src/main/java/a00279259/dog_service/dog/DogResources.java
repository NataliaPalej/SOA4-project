package a00279259.dog_service.dog;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import a00279259.dog_service.dog.jpa.DogRepository;

@CrossOrigin(origins = "http://localhost:8080") 
@RestController
@RequestMapping("/dogs") // set base URL
public class DogResources {
	
	private DogRepository dogRepository;
	
	@Autowired
	public DogResources(DogRepository dogRepository) {
		this.dogRepository = dogRepository;
	}
	
	@GetMapping
	public List<Dog> getAllDogs(){
		return dogRepository.findAll();
	}
	
	@GetMapping("/{dogId}")
	public ResponseEntity<Dog> getDog(@PathVariable Integer dogId){
		Optional<Dog> dog = dogRepository.findById(dogId);
		
		if (dogId == null) {
	        return ResponseEntity.badRequest().body(null);
	    }
		
		if(dog.isEmpty()) {
			System.out.println("Dog with ID: " + dogId + " does not exist.");
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(dog.get());
		}
	}
	
	@PostMapping
	public ResponseEntity<Dog> postDog(@RequestBody Dog dog){
		Dog savedDog = dogRepository.save(dog);
		URI location = URI.create("/dogs/" + savedDog.getdogId());
		System.out.println("Dog " + dog + " was successfully saved");
		return ResponseEntity.created(location).body(savedDog);
	}
	
	@PutMapping("/{dogId}")
	public ResponseEntity<Dog> updateDog(@PathVariable Integer dogId, @RequestBody Dog updatedDog){
		Optional<Dog> existingDog = dogRepository.findById(dogId);
		
		if(existingDog.isEmpty()) {
			System.out.println("Dog with ID: " + dogId + " does not exist.");
			return ResponseEntity.notFound().build();
		}
		// Ensure the ID stays the same
		updatedDog.setdogId(dogId); 
		Dog savedDog = dogRepository.save(updatedDog);
		System.out.println("Dog " + dogId + " was successfully updated");
		return ResponseEntity.ok(savedDog); // 200 OK
	}
	
	@DeleteMapping("/{dogId}")
	public ResponseEntity<String> deleteDog(@PathVariable Integer dogId){
		Optional<Dog> existingDog = dogRepository.findById(dogId);
		
		if(existingDog.isEmpty()) {
			System.out.println("Dog with ID: " + dogId + " does not exist.");
			return ResponseEntity.notFound().build();
		}
		
		dogRepository.deleteById(dogId);
		System.out.println("Dog ID: " + dogId + " was successfully deleted.");
		return ResponseEntity.ok("Dog ID " + dogId + " deleted successfully.");
	}
	
}
