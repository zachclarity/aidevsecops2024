import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.security.config.web.servlet.invoke
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.security.config.Customizer.withDefaults

@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebMvcConfigurer {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            authorizeHttpRequests {
                listOf(
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
                ).forEach { pattern ->
                    authorize(AntPathRequestMatcher(pattern), permitAll)
                }
                authorize(anyRequest, authenticated)
            }
            csrf { disable() }
        }

        return http.build()
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        with(registry) {
            addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
            
            addResourceHandler("/public/**")
                .addResourceLocations("classpath:/public/")
            
            addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/resources/")
            
            addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/")
        }
    }
}
