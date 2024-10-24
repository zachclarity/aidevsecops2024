import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers(
                    "/",
                    "/static/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/webjars/**",
                    "/*.html",
                    "/*.css",
                    "/*.js",
                    "/favicon.ico"
                ).permitAll()
                .anyRequest().authenticated()
            .and()
                .csrf().disable(); // Only disable if needed

        return http.build();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Handle static resources from classpath:/static/
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        // Handle static resources from classpath:/public/
        registry.addResourceHandler("/public/**")
                .addResourceLocations("classpath:/public/");
        
        // Handle static resources from classpath:/resources/
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/resources/");
        
        // Handle static resources from classpath:/META-INF/resources/
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
