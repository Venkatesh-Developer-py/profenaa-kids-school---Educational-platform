function applyNow(){
  alert("🚀 Thank you! Our franchise team will contact you soon.");
}

function learnMore(){
  alert("📘 More details will be available soon.");
}



/* ================= STATE DATA ================= */
const stateDistricts = {
    "Tamil Nadu": [
        "Chennai","Coimbatore","Madurai","Salem","Tirunelveli","Erode","Vellore"
    ],
    "Kerala": ["Kochi","Trivandrum","Kozhikode"],
    "Karnataka": ["Bengaluru","Mysuru"],
    "Andhra Pradesh": ["Visakhapatnam","Vijayawada"],
    "Telangana": ["Hyderabad","Warangal"],
    "Maharashtra": ["Mumbai","Pune"],
    "Delhi": ["New Delhi"]
};

/* ================= DROPDOWN ================= */
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");

Object.keys(stateDistricts).forEach(state=>{
  let opt=document.createElement("option");
  opt.value=state;
  opt.textContent=state;
  stateSelect.appendChild(opt);
});

stateSelect.addEventListener("change",()=>{
  districtSelect.innerHTML="<option>Select District</option>";
  stateDistricts[stateSelect.value]?.forEach(d=>{
    let opt=document.createElement("option");
    opt.value=d;
    opt.textContent=d;
    districtSelect.appendChild(opt);
  });
});

/* ================= FORM SUBMIT ================= */
const form=document.getElementById("opportunityForm");
const success=document.getElementById("success-message");

form.addEventListener("submit",function(e){
  e.preventDefault();

  const data=new FormData(form);

  fetch(form.action,{
    method:"POST",
    body:data
  })
  .then(res=>res.json())
  .then(res=>{
    console.log(res);

    if(res.success){
      success.style.display="block";
      form.reset();
      districtSelect.innerHTML="<option>Select District</option>";
    }else{
      alert("Error: "+res.message);
    }
  })
  .catch(()=>{
    alert("Network error");
  });
});