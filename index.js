function createModal() {
    let e = `
    <div class="modal fade" id="registrationModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog mt-0">
            <div class="modal-content bg-none border-0 mx-auto">
                <div class="container form position-relative border-0 mb-0 mt-5">
                    <button type="button" class="btn close_icon rounded-circle position-absolute translate-middle"
                        data-bs-dismiss="modal" aria-label="Close" style="right: 0; top: 6%;">
                        X
                    </button>
                    <div class="d-flex justify-content-center align-items-center flex-column mb-1 border-0">
                        <p class="text-center text-white fs-3 my-1 fw-bold">Enroll now</p>
                    </div>
                    <form id="enrollForm" style="font-size: 10px;" onsubmit="handleEnrollSubmit(event)">
                        <div class="modal-body pb-0 px-0">
                            <div class="mb-3">
                                <input type="text" class="form-control" placeholder="Child Name" id="child_name" required>
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control" placeholder="Guardian Name" id="guardian_name" required>
                            </div>
                            <div class="mb-3">
                                <input type="number" class="form-control" placeholder="Child's Age" id="child_age" required>
                            </div>
                            <div class="mb-3">
                                <input type="email" class="form-control" placeholder="Email" id="email_id" required>
                            </div>
                            <div class="mb-3">
                                <input type="number" class="form-control" placeholder="Phone Number" id="phone_number" maxlength="10" required>
                            </div>
                            <div class="mb-3">
                              <select id="program" name="program" class="form-select p-2" required>
    <option disabled selected>Select a Program</option>
    <option value="playgroup">Play Group</option>
    <option value="nursery">Nursery</option>
    <option value="junior_kg">Junior KG</option>
    <option value="senior_kg">Senior KG</option>
    <option value="daycare">Day Care</option>
</select>

                            </div>
                            <div class="mb-3">
                                <textarea id="message" name="message" class="form-control p-2" rows="2"
                                    placeholder="Additional Message"></textarea>
                            </div>
                            <p id="successMessage" style="display: none; color: white;" class="text-center">Form submitted successfully! <br> You may close this page.</p>
                        </div>
                        <div class="modal-footer border-top-0">
                            <button type="submit" class="close_btn btn submit mx-auto w-50">Join Us</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`; document.body.insertAdjacentHTML("beforeend", e)
} window.onload = function () { setTimeout(() => { createModal(); new bootstrap.Modal(document.getElementById("registrationModal")).show() }, 15e3) }; const testimonialSwiper = new Swiper(".testimonialSwiper", { slidesPerView: 1, spaceBetween: 20, breakpoints: { 0: { slidesPerView: 1 }, 540: { slidesPerView: 2 }, 768: { slidesPerView: 2.8 } }, pagination: { el: ".swiper-pagination", clickable: !0 }, navigation: { nextEl: ".button-next", prevEl: ".button-prev" } }); function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }

// This is the Franchise Enquiry modal's submit handler (form id=
// "contactForm", the one asking for Name/Email/Mobile/City/State). It
// previously read document.getElementById("email_id") -- that ID belongs
// to the *different* Enroll Now popup's email field, not this form's,
// which is id="email". That mismatch meant this form crashed on every
// submit before ever reaching the mailto step, the same class of bug the
// Enroll popup had. Fixed here, plus the CRM submission added.
function sendEmail(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const countryCode = document.getElementById("countryCode").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;

    // Send to CRM so it shows up in the Website Enquirys page there,
    // tagged "Profenaa Kids School". Fire-and-forget: doesn't block the
    // mailto step below, and any CRM-side failure is only logged, never
    // shown to the visitor. There's no course/program field on this form,
    // so "course" is fixed to "Franchise Enquiry" to distinguish these
    // leads from Enroll popup / Contact page leads in the CRM. Country
    // code, city, and state have no dedicated CRM columns, so they're
    // folded into the message text instead of being dropped.
    try {
        fetch("https://www.profenaa.com/admin/receive_kidsschool_enquiry.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phoneNumber,
                course: "Franchise Enquiry",
                message: `Country Code: ${countryCode}, City: ${city}, State: ${state}`,
                enquiry_date: new Date().toISOString().slice(0, 10),
            }),
        }).catch((crmError) => {
            console.error("CRM submission failed:", crmError);
        });
    } catch (crmError) {
        console.error("CRM submission failed:", crmError);
    }
}

// CRM integration: every Enroll Now popup submission is also sent here so
// it shows up in the CRM's "Website Enquirys" table, tagged "Profenaa
// Kids School".
const CRM_ENQUIRY_ENDPOINT = "https://www.profenaa.com/admin/receive_kidsschool_enquiry.php";

// The popup's onsubmit previously called sendEmail(event), which reads
// field IDs (name, countryCode, phoneNumber, city, state) that belong to
// a *different* form (the Franchise Enquiry modal) -- none of those IDs
// exist on this Enroll popup, so submitting it just threw an error before
// ever reaching the mailto step. This is a fresh handler matched to this
// popup's actual fields.
function handleEnrollSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const childName = form.elements["child_name"].value.trim();
    const guardianName = form.elements["guardian_name"].value.trim();
    const childAge = form.elements["child_age"].value.trim();
    const email = form.elements["email_id"].value.trim();
    const phone = form.elements["phone_number"].value.trim();
    const program = form.elements["program"].value;
    const message = form.elements["message"].value.trim();

    const payload = {
        name: guardianName,
        email: email,
        phone: phone,
        course: program,
        message:
            `Child Name: ${childName}\n` +
            `Child's Age: ${childAge}\n` +
            `Guardian Name: ${guardianName}\n` +
            `Additional Message: ${message}`,
        enquiry_date: new Date().toISOString().slice(0, 10)
    };

    fetch(CRM_ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`CRM request failed: ${response.status}`);
            }

            return response.text();
        })
        .then(() => {
            console.log("Home Enroll enquiry submitted to CRM successfully.");

            form.reset();

            const modalEl = document.getElementById("registrationModal");
            const modalInstance =
                bootstrap.Modal.getInstance(modalEl) ||
                new bootstrap.Modal(modalEl);
            modalInstance.hide();
            
            const toast = document.createElement("div");
            toast.textContent = "Successfully Submitted!";
            toast.style.position = "fixed";
            toast.style.top = "20px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = "#28a745";
            toast.style.color = "#fff";
            toast.style.padding = "12px 24px";
            toast.style.borderRadius = "6px";
            toast.style.zIndex = "9999";
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        })
        .catch((error) => {
            console.error(
                "Home Enroll CRM submission failed:",
                error
            );
        });
}
// About page "Registration Form" (id="registration_form") submit handler.
// PRODUCTION FIX (found during inspection, required to wire up the CRM
// at all): this previously read document.getElementById("medical_condition"),
// but the About page form has no such field -- its fields are child_name,
// email, child_age, guardian_name, phone_number, program, and message.
// That call returned null, and .value on null threw immediately, so this
// form crashed on every submit before reaching the mailto step or CRM.
// That line is removed below; every other field read, the mailto
// composition, and the success-message/reset behavior are preserved
// exactly as before.
//
// CRM ADDITION: sends to the same endpoint/format used by the Contact
// page and Enroll popup, so it lands in the same "Website Enquirys"
// table. Guardian Name maps to "name" (per requirement); Child Name and
// Child's Age have no dedicated CRM column, so they're folded into the
// message text instead of being dropped. Fire-and-forget: doesn't block
// or delay the existing mailto step, and any CRM-side failure is only
// logged, never shown to the visitor.
function registration_form(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const childName = form.elements["child_name"].value.trim();
    const email = form.elements["email"].value.trim();
    const childAge = form.elements["child_age"].value.trim();
    const guardianName = form.elements["guardian_name"].value.trim();
    const phoneNumber = form.elements["phone_number"].value.trim();
    const program = form.elements["program"].value;
    const message = form.elements["message"].value.trim();

    const payload = {
        name: guardianName,
        email: email,
        phone: phoneNumber,
        course: program,
        message:
            `Child Name: ${childName}\n` +
            `Child's Age: ${childAge}\n` +
            `Guardian Name: ${guardianName}\n` +
            `Additional Message: ${message}`,
        enquiry_date: new Date().toISOString().slice(0, 10)
    };

    fetch(CRM_ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`CRM request failed: ${response.status}`);
            }

            return response.text();
        })
                .then(() => {
            console.log(
                "Registration enquiry submitted to CRM successfully."
            );

            form.reset();
            form.style.display = "none";

            const successMessage =
                document.getElementById("register_Message");

            if (successMessage) {
                successMessage.textContent = "Successfully Submitted!";
                successMessage.style.display = "block";
            }

            const submitButton =
                form.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Joined Successfully";
            }
        })
        .catch((error) => {
            console.error(
                "Registration CRM submission failed:",
                error
            );
        });
}


function updateNavbarClass() { let e = document.getElementById("navbar"); window.innerWidth > 1200 ? e.classList.add("navbar-expand") : e.classList.remove("navbar-expand") } function filterDivs(e) { let t = document.querySelectorAll(".image_list .d-flex div"), a = document.querySelectorAll(".button-container button"); if (a.forEach(e => e.classList.remove("active")), event.target.classList.add("active"), "all" === e) { t.forEach(e => e.classList.remove("d-none")); return } t.forEach(e => e.classList.add("d-none")), document.querySelectorAll(`.${e}`).forEach(e => e.classList.remove("d-none")) } window.addEventListener("scroll", function () { var e = document.querySelector(".back-to-top"); window.scrollY > 100 ? e.classList.add("show") : e.classList.remove("show") }), updateNavbarClass(), window.addEventListener("resize", updateNavbarClass), document.querySelectorAll(".image_list img").forEach(e => { e.addEventListener("click", function () { document.getElementById("modalImage").src = this.src, new bootstrap.Modal(document.getElementById("imageModal")).show() }) });