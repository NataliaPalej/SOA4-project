package a00279259.user_service.user.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import a00279259.user_service.user.User;

public interface UserRepository extends JpaRepository<User, Integer>{
	
}
