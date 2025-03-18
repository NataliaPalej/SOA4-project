package a00279259.user_service.user;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

@Configuration
public class CacheConfig {
	
    @Bean
    public FilterRegistrationBean<ShallowEtagHeaderFilter> shallowEtagFilter() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> frb = new FilterRegistrationBean<>();
        frb.setFilter(new ShallowEtagHeaderFilter());
        frb.addUrlPatterns("/users");
        return frb;
    }

}

