package a00279259.user_service.user;

import a00279259.user_service.dog.Dog;

public class UserResponse {
	
	private int id;
	private String userName, email, preferredBreed, status;
	private Dog dog;
	
	public UserResponse(User user, Dog dog) {
		this.id = user.getId();
		this.userName = user.getUserName();
		this.email = user.getEmail();
		this.preferredBreed = user.getPreferredBreed();
		this.status = user.getStatus();
		this.dog = dog;
	}
	
	public UserResponse() {
		super();
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

	public Dog getDog() {
		return dog;
	}

	public void setDog(Dog dog) {
		this.dog = dog;
	}

	@Override
	public String toString() {
		return "UserResponse [id=" + id + ", userName=" + userName + ", email=" + email + ", preferredBreed="
				+ preferredBreed + ", status=" + status + ", dog=" + dog + "]";
	}
}
