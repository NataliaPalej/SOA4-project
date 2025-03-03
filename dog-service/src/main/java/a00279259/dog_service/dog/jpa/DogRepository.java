package a00279259.dog_service.dog.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import a00279259.dog_service.dog.Dog;

public interface DogRepository extends JpaRepository<Dog, Integer> {

}
