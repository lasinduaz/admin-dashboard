let workersDataTable;

function initializeDataTable() {
  if (!$.fn.DataTable.isDataTable('#workersTable')) {
    workersDataTable = $('#workersTable').DataTable({
      autoWidth: false,
      responsive: true,
      destroy: true
    });
  } else {
    workersDataTable = $('#workersTable').DataTable();
  }
}

function loadWorkers() {
  // Initialize DataTable if not already initialized
  if (!workersDataTable) {
    initializeDataTable();
  }

  $.get("api/get_workers.php", function (data) {
    workersDataTable.clear();

    if (data && Array.isArray(data)) {
      data.forEach((worker, index) => {
        // Add row with data-worker-id attribute on the <tr>
        const rowNode = workersDataTable.row.add([
          index + 1,
          worker.fullName || 'N/A',
          worker.username || 'N/A',
          worker.email || 'N/A',
          worker.idNumber || 'N/A',
          worker.contactNumber || 'N/A',
          worker.created_at || 'N/A',
          `<button class="btn btn-sm btn-warning edit-btn" data-id="${worker.id}">Edit</button>
           <button class="btn btn-sm btn-danger delete-btn" data-id="${worker.id}">Delete</button>`
        ]).draw(false).node();

        $(rowNode).attr('data-worker-id', worker.id);
      });
    }
  }).fail(function(xhr, status, error) {
    console.error('Failed to load workers:', error);
    alert('Failed to load workers data');
  });
}

// 🛠️ When Edit Button is Clicked (delegated handler)
$(document).on('click', '.edit-btn', function (e) {
  e.preventDefault();
  const workerId = $(this).data('id');

  if (!workerId) {
    alert('Worker ID not found');
    return;
  }

  fetch(`api/get_worker_by_id.php?id=${workerId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(worker => {
      if (worker.error) {
        alert('Error: ' + worker.error);
        return;
      }

      // Populate edit form
      document.getElementById('editWorkerId').value = worker.id;
      document.getElementById('editFullName').value = worker.fullName || '';
      document.getElementById('editContactNumber').value = worker.contactNumber || '';
      document.getElementById('editEmail').value = worker.email || '';

      // Show modal using Bootstrap 5 API
      const editModalEl = document.getElementById('editWorkerModal');
      const editModal = new bootstrap.Modal(editModalEl);
      editModal.show();
    })
    .catch(err => {
      console.error('Fetch error:', err);
      alert('Failed to load worker data: ' + err.message);
    });
});

// 🗑️ When Delete Button is Clicked (delegated handler)
$(document).on('click', '.delete-btn', function (e) {
  e.preventDefault();
  const workerId = $(this).data('id');

  if (!workerId) {
    alert('Worker ID not found');
    return;
  }

  if (confirm('Are you sure you want to delete this worker?')) {
    fetch('api/delete_worker.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `id=${workerId}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Worker deleted successfully!');
          loadWorkers();
        } else {
          alert('Error: ' + (data.error || 'Delete failed'));
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        alert('Failed to delete worker.');
      });
  }
});

// Handle Edit Worker Form submit
document.getElementById('editWorkerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('api/edit_worker.php', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        alert('Worker updated successfully!');
        
        // Hide modal using Bootstrap 5 API
        const editModalEl = document.getElementById('editWorkerModal');
        const modal = bootstrap.Modal.getInstance(editModalEl);
        if (modal) {
          modal.hide();
        }

        // Reload workers data
        loadWorkers();
      } else {
        alert('Error: ' + (data.error || 'Update failed'));
      }
    })
    .catch(err => {
      console.error('Update error:', err);
      alert('Failed to update worker: ' + err.message);
    });
});

// 🧾 Handle Add Worker Form submit
document.getElementById('addWorkerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = document.getElementById('addWorkerForm');
  const formData = new FormData(form);

  // File uploads are automatically handled by FormData when form has enctype="multipart/form-data"

  fetch('api/add_worker.php', {  // Fixed: Changed from get_workers.php to add_worker.php
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        alert('Worker added successfully!');
        form.reset();
        
        // Hide the modal using Bootstrap 5 API
        const addModalEl = document.getElementById('addWorkerModal');
        const modal = bootstrap.Modal.getInstance(addModalEl);
        if (modal) {
          modal.hide();
        }
        
        // Reload workers data
        loadWorkers();
      } else {
        alert('Error: ' + (data.error || 'Failed to add worker'));
        console.error('Add worker error:', data);
      }
    })
    .catch(err => {
      console.error("Add worker AJAX Error:", err);
      alert("Failed to add worker: " + err.message);
    });
});

// Initialize everything when document is ready
$(document).ready(function () {
  // Initialize DataTable and load workers
  initializeDataTable();
  loadWorkers();
});

// Clean up DataTable on page unload
$(window).on('beforeunload', function() {
  if (workersDataTable) {
    workersDataTable.destroy();
  }
});