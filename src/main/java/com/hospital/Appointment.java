package com.hospital;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
@Entity public class Appointment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @NotNull public Long patientId;
 @NotNull public Long doctorId;
 @NotNull public LocalDateTime dateTime;
 public String reason;
 public String status="Scheduled";
 public Appointment(){}
}