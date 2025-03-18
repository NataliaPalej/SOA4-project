package a00279259.dog_service.dog;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

@Configuration
public class CacheConfig {
	@Bean
    public FilterRegistrationBean<ShallowEtagHeaderFilter> shallowEtagFilter() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new ShallowEtagHeaderFilter());
        filterRegistrationBean.addUrlPatterns("/dogs");
        return filterRegistrationBean;
    }
}
