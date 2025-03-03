package a00279259.dog_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// http://localhost:8081/dogs
// http://localhost:8081/h2-console insert dogs manually if data.sql wont read
// If the server wont start on 8081, change Run Configuration, Arguments tab, add under VM Arguments "-Dserver.port=8081"
@SpringBootApplication
public class DogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DogServiceApplication.class, args);
	}

}
