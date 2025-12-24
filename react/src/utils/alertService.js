import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showValidationErrors = (errors) => {
  Swal.fire({
    icon: "error",
    title: "Validation Failed",
    html: `
      <div style="
        max-height: 250px;
        overflow-y: auto;
        text-align: left;
        padding-right: 6px;
      ">
        ${errors
          .map(
            (err) => `
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-size: 15px;
            ">
              <span style="
                color:#d90429;
                font-size: 18px;
                margin-right: 8px;
              ">⛔</span>
              <span>${err}</span>
            </div>
          `
          )
          .join("")}
      </div>
    `,
    footer: `<b>Please correct the highlighted fields and try again.</b>`,
    width: "550px",
    confirmButtonText: "Fix Form",
    confirmButtonColor: "#d90429",
    showCloseButton: true,
  }).then(() => {
    highlightErrorFields(errors);
  });
};

// MAP YOUR BACKEND ERROR MESSAGES → INPUT IDs
const fieldMap = {
  "Address phone must be 10 digits": "addressPhone",
  "Age is required": "age",
  "District is required": "district",
  "Through cannot be empty": "through",
  "Phone number must be 10 digits": "phoneNo",
  "Mobile must be 10 digits": "mobile",
  "Account number must be 8-20 digits": "accountNo",
  "Qualification is required": "qualification",
  "PIN code must be 6 digits": "pinCode",
  "Post office is required": "po",
};

const highlightErrorFields = (errors) => {
  errors.forEach((err) => {
    const fieldId = fieldMap[err];

    if (fieldId) {
      const input = document.getElementById(fieldId);
      if (input) {
        input.classList.add("field-error-highlight");
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
};
