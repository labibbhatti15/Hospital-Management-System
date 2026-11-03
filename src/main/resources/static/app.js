const state={patients:[],doctors:[],appointments:[]};let editing=null,entity=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,options={}){const r=await fetch('/api/'+path,{headers:{'Content-Type':'application/json'},...options});if(!r.ok){let e=await r.json().catch(()=>({}));throw Error(e.message||e.detail||'Request failed ('+r.status+')')}return r.status===204?null:r.json()}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),3500)}
async function load(){try{const [p,d,a]=await Promise.all(['patients','doctors','appointments'].map(x=>api(x)));Object.assign(state,{patients:p,doctors:d,appointments:a});render()}catch(e){toast('Server error: '+e.message)}}
function navigate(page){document.querySelectorAll('.page').forEach(e=>e.classList.toggle('active',e.id===page));document.querySelectorAll('.nav').forEach(e=>e.classList.toggle('active',e.dataset.page===page));$('pageTitle').textContent=page[0].toUpperCase()+page.slice(1)}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
['patients','doctors','appointments'].forEach(x=>$(x+'Search').oninput=render);
const patientName=id=>state.patients.find(x=>x.id===id)?.name||'Deleted patient';
const doctorName=id=>state.doctors.find(x=>x.id===id)?.name||'Deleted doctor';
const dateStr=s=>s?new Date(s).toLocaleString([], {dateStyle:'medium',timeStyle:'short'}):'—';
const status=s=>'<span class="status '+esc(s)+'">'+esc(s)+'</span>';
const buttons=(type,id)=>'<button class="action" onclick="openForm(\''+type+'\','+id+')">Edit</button><button class="action delete" onclick="removeRecord(\''+type+'\','+id+')">Delete</button>';
function rows(id,arr,fn){$(id).innerHTML=arr.length?arr.map(fn).join(''):'<tr><td class="empty" colspan="7">No records found. Add a new record to get started.</td></tr>'}
function render(){
 $('statPatients').textContent=state.patients.length;$('statDoctors').textContent=state.doctors.length;$('statAppointments').textContent=state.appointments.length;$('statScheduled').textContent=state.appointments.filter(a=>a.status==='Scheduled').length;
 const appointments=[...state.appointments].sort((a,b)=>b.id-a.id);
 rows('recentRows',appointments.slice(0,5),a=>'<tr><td>'+esc(patientName(a.patientId))+'</td><td>'+esc(doctorName(a.doctorId))+'</td><td>'+esc(dateStr(a.dateTime))+'</td><td>'+status(a.status)+'</td></tr>');
 let q=$('patientsSearch').value.toLowerCase();rows('patientsRows',state.patients.filter(p=>(p.name+' '+p.phone).toLowerCase().includes(q)),p=>'<tr><td><b>'+esc(p.name)+'</b></td><td>'+esc(p.age)+'</td><td>'+esc(p.gender)+'</td><td>'+esc(p.phone)+'</td><td>'+esc(p.email)+'</td><td>'+buttons('patients',p.id)+'</td></tr>');
 q=$('doctorsSearch').value.toLowerCase();rows('doctorsRows',state.doctors.filter(d=>(d.name+' '+d.specialty).toLowerCase().includes(q)),d=>'<tr><td><b>'+esc(d.name)+'</b></td><td>'+esc(d.specialty)+'</td><td>'+esc(d.phone)+'</td><td>'+esc(d.availability)+'</td><td>'+buttons('doctors',d.id)+'</td></tr>');
 q=$('appointmentsSearch').value.toLowerCase();rows('appointmentsRows',appointments.filter(a=>(patientName(a.patientId)+' '+doctorName(a.doctorId)+' '+a.status).toLowerCase().includes(q)),a=>'<tr><td>'+esc(patientName(a.patientId))+'</td><td>'+esc(doctorName(a.doctorId))+'</td><td>'+esc(dateStr(a.dateTime))+'</td><td>'+esc(a.reason)+'</td><td>'+status(a.status)+'</td><td>'+buttons('appointments',a.id)+'</td></tr>');
}
const field=(name,label,type='text',required=false,extra='')=>'<div class="field"><label for="f_'+name+'">'+label+'</label><input id="f_'+name+'" name="'+name+'" type="'+type+'" '+(required?'required ':'')+extra+'></div>';
const select=(name,label,options)=>'<div class="field"><label for="f_'+name+'">'+label+'</label><select id="f_'+name+'" name="'+name+'" required>'+options.map(([v,t])=>'<option value="'+esc(v)+'">'+esc(t)+'</option>').join('')+'</select></div>';
function openForm(type,id=null){
 entity=type;editing=id;const data=id?state[type].find(x=>x.id===id):null;
 $('modalTitle').textContent=(id?'Edit ':'Add ')+({patients:'Patient',doctors:'Doctor',appointments:'Appointment'}[type]);
 let html='';
 if(type==='patients')html=field('name','Full Name','text',true)+field('age','Age','number',false,'min="0" max="130"')+select('gender','Gender',[['Male','Male'],['Female','Female'],['Other','Other']])+field('phone','Phone','tel',true)+field('email','Email','email');
 if(type==='doctors')html=field('name','Doctor Name','text',true)+field('specialty','Specialty','text',true)+field('phone','Phone','tel')+field('availability','Availability (e.g. Mon-Fri, 9 AM-5 PM)');
 if(type==='appointments')html=select('patientId','Patient',[['','Choose patient'],...state.patients.map(x=>[x.id,x.name])])+select('doctorId','Doctor',[['','Choose doctor'],...state.doctors.map(x=>[x.id,x.name+' — '+x.specialty])])+field('dateTime','Date & Time','datetime-local',true)+field('reason','Reason for Visit')+(id?select('status','Status',[['Scheduled','Scheduled'],['Completed','Completed'],['Cancelled','Cancelled']]):'');
 $('formFields').innerHTML=html;
 if(data)Object.entries(data).forEach(([k,v])=>{let el=$('f_'+k);if(el)el.value=k==='dateTime'?String(v).slice(0,16):v??''});
 $('modal').classList.remove('hidden');
}
function closeForm(){$('modal').classList.add('hidden');editing=null}
$('recordForm').onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());if(entity==='patients')data.age=data.age?Number(data.age):null;if(entity==='appointments'){data.patientId=Number(data.patientId);data.doctorId=Number(data.doctorId);data.status=data.status||'Scheduled';data.dateTime=data.dateTime+':00'}try{await api(entity+(editing?'/'+editing:''),{method:editing?'PUT':'POST',body:JSON.stringify(data)});closeForm();toast('Record saved successfully');await load()}catch(err){toast(err.message)}};
async function removeRecord(type,id){if(!confirm('Delete this record? This cannot be undone.'))return;try{await api(type+'/'+id,{method:'DELETE'});toast('Record deleted');await load()}catch(err){toast(err.message)}}
load();