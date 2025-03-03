package a00279259.user_service.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {
	
	@Id
	@GeneratedValue
	private int id;
	private String userName;
	private String email;
	private String preferredBreed;
	private String status;
	private int dogId;
	
	public User() {
		super();
	}

	public User(int id, String userName, String email, String preferredBreed, String status, int dogId) {
		super();
		this.id = id;
		this.userName = userName;
		this.email = email;
		this.preferredBreed = preferredBreed;
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
		return preferredBreed;
	}

	public void setPreferredBreed(String preferredBreed) {
		this.preferredBreed = preferredBreed;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getDogId() {
		return dogId;
	}

	public void setDogId(int dogId) {
		this.dogId = dogId;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", userName=" + userName + ", email=" + email + ", preferredBreed=" + preferredBreed
				+ ", status=" + status + ", dogId=" + dogId + "]";
	}
}
