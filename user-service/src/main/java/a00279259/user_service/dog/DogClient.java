package a00279259.user_service.dog;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="dog-service", url="http://localhost:8080")
public interface DogClient {
	@GetMapping("/{dogID}")
	Dog getDogById(@PathVariable int dogID);
}
