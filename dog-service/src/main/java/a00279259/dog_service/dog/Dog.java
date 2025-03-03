package a00279259.dog_service.dog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity(name="dogs")
public class Dog {
	
	@Id
	private int dogID;
	@Column(name="name")
	private String name;
	@Column(name="breed")
	private String breed;
	@Column(name="age")
	private int age;
	@Column(name="temperament")
	private String temperament;
	@Column(name="available")
	private boolean available;
		
	public Dog() {
		super();
	}
	
	public Dog(String name, String breed, int age, String temperament, boolean available) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.temperament = temperament;
        this.available = available;
    }

	
	public int getDogID() {
		return dogID;
	}
	
	public void setDogID(int dogID) {
		this.dogID = dogID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getBreed() {
		return breed;
	}
	
	public void setBreed(String breed) {
		this.breed = breed;
	}
	
	public int getAge() {
		return age;
	}
	
	public void setAge(int age) {
		this.age = age;
	}
	
	public String getTemperament() {
		return temperament;
	}
	
	public void setTemperament(String temperament) {
		this.temperament = temperament;
	}
	
	public boolean isAvailable() {
		return available;
	}
	
	public void setAvailable(boolean available) {
		this.available = available;
	}

	@Override
	public String toString() {
		return "Dog [dogID=" + dogID + ", name=" + name + ", breed=" + breed + ", age=" + age + ", temperament="
				+ temperament + ", available=" + available + "]";
	}
}
