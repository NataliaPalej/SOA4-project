package a00279259.user_service.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

// Renamed table to "person" as "user" is reserved keyword in H2 
@Entity(name="person")
public class User {
	
	@Id
	@GeneratedValue
	private int id;
	@Column(name = "username")
	private String userName;
	@Column(name = "email")
	private String email;
	@Column(name = "preferredbreed")
	private String preferredbreed;
	@Column(name = "status")
	private String status;
	@Column(name = "dogid", nullable = true)
	private Integer dogId;
	
	public User() {
		super();
	}

	public User(int id, String userName, String email, String preferredbreed, String status, Integer dogId) {
		super();
		this.id = id;
		this.userName = userName;
		this.email = email;
		this.preferredbreed = preferredbreed;
		this.status = status;
		this.dogId = dogId;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPreferredBreed() {
		return preferredbreed;
	}

	public void setPreferredBreed(String preferredbreed) {
		this.preferredbreed = preferredbreed;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getDogId() {
		return dogId;
	}

	public void setDogId(Integer dogId) {
		this.dogId = dogId;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", userName=" + userName + ", email=" + email + ", preferredBreed=" + preferredbreed
				+ ", status=" + status + ", dogId=" + dogId + "]";
	}
}
