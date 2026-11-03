package com.hospital;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import java.util.*;
@RestController @RequestMapping("/api")
public class ApiController {
 private final PatientRepository patients; private final DoctorRepository doctors; private final AppointmentRepository appointments;
 public ApiController(PatientRepository p,DoctorRepository d,AppointmentRepository a){patients=p;doctors=d;appointments=a;}
 @GetMapping("/patients") public List<Patient> patients(){return patients.findAll();}
 @PostMapping("/patients") public Patient addPatient(@Valid @RequestBody Patient p){p.id=null;return patients.save(p);}
 @PutMapping("/patients/{id}") public Patient editPatient(@PathVariable Long id,@Valid @RequestBody Patient p){if(!patients.existsById(id))throw missing();p.id=id;return patients.save(p);}
 @DeleteMapping("/patients/{id}") public void deletePatient(@PathVariable Long id){if(appointments.existsByPatientId(id))throw bad("Patient has appointments. Delete those first.");if(!patients.existsById(id))throw missing();patients.deleteById(id);}
 @GetMapping("/doctors") public List<Doctor> doctors(){return doctors.findAll();}
 @PostMapping("/doctors") public Doctor addDoctor(@Valid @RequestBody Doctor d){d.id=null;return doctors.save(d);}
 @PutMapping("/doctors/{id}") public Doctor editDoctor(@PathVariable Long id,@Valid @RequestBody Doctor d){if(!doctors.existsById(id))throw missing();d.id=id;return doctors.save(d);}
 @DeleteMapping("/doctors/{id}") public void deleteDoctor(@PathVariable Long id){if(appointments.existsByDoctorId(id))throw bad("Doctor has appointments. Delete those first.");if(!doctors.existsById(id))throw missing();doctors.deleteById(id);}
 @GetMapping("/appointments") public List<Appointment> appointments(){return appointments.findAll();}
 @PostMapping("/appointments") public Appointment addAppointment(@Valid @RequestBody Appointment a){a.id=null;validate(a,null);a.status="Scheduled";return appointments.save(a);}
 @PutMapping("/appointments/{id}") public Appointment editAppointment(@PathVariable Long id,@Valid @RequestBody Appointment a){if(!appointments.existsById(id))throw missing();a.id=id;validate(a,id);return appointments.save(a);}
 @DeleteMapping("/appointments/{id}") public void deleteAppointment(@PathVariable Long id){if(!appointments.existsById(id))throw missing();appointments.deleteById(id);}
 @GetMapping("/stats") public Map<String,Long> stats(){return Map.of("patients",patients.count(),"doctors",doctors.count(),"appointments",appointments.count(),"scheduled",appointments.findAll().stream().filter(a->"Scheduled".equals(a.status)).count());}
 private void validate(Appointment a,Long id){
  if(!patients.existsById(a.patientId)||!doctors.existsById(a.doctorId))throw bad("Choose an existing patient and doctor.");
  if(!List.of("Scheduled","Completed","Cancelled").contains(a.status))throw bad("Invalid appointment status.");
  if(!"Cancelled".equals(a.status))for(Appointment other:appointments.findByDoctorIdAndDateTime(a.doctorId,a.dateTime))
   if(!other.id.equals(id)&&!"Cancelled".equals(other.status))throw bad("This doctor already has an appointment at that time.");
 }
 private ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
 private ResponseStatusException missing(){return new ResponseStatusException(HttpStatus.NOT_FOUND,"Record not found");}
}