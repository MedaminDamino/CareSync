package com.hospital.appointment.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String email;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private UserStatus status;

    public UserDetailsImpl(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities, UserStatus status) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.status = status;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getStatus()
        );
    }

    public Long getId() { return id; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() {
        return status == null || status == UserStatus.ACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}

