package a00279259.dog_service.dog;

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

import a00279259.dog_service.dog.jpa.DogRepository;

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
	
	@GetMapping("/{dogID}")
	public ResponseEntity<Dog> getDog(@PathVariable int dogID){
		Optional<Dog> dog = dogRepository.findById(dogID);
		
		if(dog.isEmpty()) {
			System.out.println("Dog with ID: " + dogID + " does not exist.");
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(dog.get());
		}
	}
	
	@PostMapping
	public ResponseEntity<Dog> postDog(@RequestBody Dog dog){
		Dog savedDog = dogRepository.save(dog);
		URI location = URI.create("/dogs/" + savedDog.getDogID());
		System.out.println("Dog " + dog + " was successfully saved");
		return ResponseEntity.created(location).body(savedDog);
	}
	
	@PutMapping("/{dogID}")
	public ResponseEntity<Dog> updateDog(@PathVariable int dogID, @RequestBody Dog updatedDog){
		Optional<Dog> existingDog = dogRepository.findById(dogID);
		
		if(existingDog.isEmpty()) {
			System.out.println("Dog with ID: " + dogID + " does not exist.");
			return ResponseEntity.notFound().build();
		}
		// Ensure the ID stays the same
		updatedDog.setDogID(dogID); 
		Dog savedDog = dogRepository.save(updatedDog);
		System.out.println("Dog " + dogID + " was successfully updated");
		return ResponseEntity.ok(savedDog); // 200 OK
	}
	
	@DeleteMapping("/dogs/{dogID}")
	public ResponseEntity<String> deleteDog(@PathVariable int dogID){
		Optional<Dog> existingDog = dogRepository.findById(dogID);
		
		if(existingDog.isEmpty()) {
			System.out.println("Dog with ID: " + dogID + " does not exist.");
			return ResponseEntity.notFound().build();
		}
		
		dogRepository.deleteById(dogID);
		System.out.println("Dog ID: " + dogID + " was successfully deleted.");
		return ResponseEntity.ok("Dog ID " + dogID + " deleted successfully.");
	}
	
}
