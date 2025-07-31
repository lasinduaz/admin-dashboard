// Redirect if not logged in
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// Load sidebar and navbar on page load
$(function () {
  $("#sidebar-placeholder").load("components/sidebar.html");
  $("#navbar-placeholder").load("components/navbar.html");
});

// Dynamic page loader and logout handler
document.addEventListener("click", function (e) {
  // Handle dynamic content loading
  if (e.target.matches("[data-page]")) {
    e.preventDefault();
    const page = e.target.getAttribute("data-page");

    // Load HTML content into #main-content
    $("#main-content").load(`components/${page}.html`, function () {
      // Load corresponding JS file if it exists
      const script = document.createElement("script");
      script.src = `js/${page}.js`;

      script.onload = () => {
        console.log(`${page}.js loaded`);
      };
      script.onerror = () => {
        console.warn(`JS file not found: ${page}.js`);
      };

      document.body.appendChild(script);
    });
  }

  // Handle logout
  if (e.target.id === "logout" || e.target.id === "logoutBtn") {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
});

$(document).ready(function () {
  // Show modal on button click
  $('#addWorkerBtn').click(function () {
    $('#workerForm')[0].reset();
    $('#workerModal').modal('show');
  });

  // Handle worker form submit
  $('#workerForm').submit(function (e) {
    e.preventDefault();

    let formData = new FormData();

    formData.append("fullName", $("#fullName").val());
    formData.append("username", $("#username").val());
    formData.append("email", $("#email").val());
    formData.append("contactNumber", $("#contactNumber").val());
    formData.append("idNumber", $("#idNumber").val());
    formData.append("password", $("#password").val());

    formData.append("permanentAddress", $("#permanentAddress").val());
    formData.append("currentAddress", $("#currentAddress").val());
    formData.append("workExperience", $("#workExperience").val());
    formData.append("bankAccountNumber", $("#bankAccountNumber").val());
    formData.append("bankName", $("#bankName").val());
    formData.append("bankBranch", $("#bankBranch").val());

    let frontImage = $("#idFrontImage")[0].files[0];
    let backImage = $("#idBackImage")[0].files[0];
    if (frontImage) formData.append("idFrontImage", frontImage);
    if (backImage) formData.append("idBackImage", backImage);

    $.ajax({
      type: "POST",
      url: admin-dashboard/api/get_workers.php,
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.success) {
          alert("Worker added successfully!");
          $('#workerModal').modal('hide');
          loadWorkers(); // Reload table
        } else {
          alert(response.error || "Something went wrong.");
        }
      },
      error: function () {
        alert("Server error.");
      }
    });
  });

  // Load workers into table add workers 
  function loadWorkers() {
    $.get("api/get_workers.php", function (data) {
      let table = $('#workersTable').DataTable();
      table.clear();

      data.forEach((worker, index) => {
        table.row.add([
          index + 1,
          worker.fullName,
          worker.username,
          worker.email,
          worker.idNumber,
          worker.contactNumber,
          worker.created_at,
          `<button class="btn btn-sm btn-warning">Edit</button>`
        ]);
      });

      table.draw();
    });
  }

  // Initialize datatable
  $('#workersTable').DataTable();
  loadWorkers(); // Load on page load
});

