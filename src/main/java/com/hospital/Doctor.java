package com.hospital;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity public class Doctor {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @NotBlank public String name;
 @NotBlank public String specialty;
 public String phone;
 public String availability;
 public Doctor(){}
}