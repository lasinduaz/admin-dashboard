function loadWorkers() {
  fetch("api/get_workers.php")
    .then(res => res.json())
    .then(data => {
      const tbody = $("#workersTable tbody");
      tbody.empty();

      data.forEach((worker, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${worker.full_name}</td>
            <td>${worker.username}</td>
            <td>${worker.email}</td>
            <td>${worker.id_number}</td>
            <td>${worker.contact_number}</td>
            <td>${worker.created_at}</td>
            <td>
              <button class="btn btn-sm btn-warning edit-btn" data-id="${worker.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${worker.id}">Delete</button>
            </td>
          </tr>
        `;
        tbody.append(row);
      });
    });
}

$(document).ready(() => {
  loadWorkers();

  const workerModal = new bootstrap.Modal(document.getElementById("workerModal"));

  $("#addWorkerBtn").on("click", function (e) {
    e.preventDefault();
    $("#workerForm")[0].reset();
    $("#workerId").val("");
    workerModal.show();
  });
});

//add workers 
document.getElementById("workerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("api/add_worker.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById("workerModal")).hide();
        loadWorkers();
      } else {
        alert("Failed to save: " + data.error);
      }
    })
    .catch(err => {
      console.error("Submit error:", err);
      alert("Something went wrong!");
    });
});
