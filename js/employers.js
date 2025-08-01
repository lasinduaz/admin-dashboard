$(document).ready(function () {
  loadEmployers();

  // Initialize DataTable
  $('#employersTable').DataTable();

  // ADD EMPLOYER
  $('#addEmployerForm').submit(function (e) {
    e.preventDefault();

    const formData = {
      name: $('#addName').val().trim(),
      email: $('#addEmail').val().trim(),
      contact: $('#addContact').val().trim(),
      company_name: $('#addCompany').val().trim(),
      address: $('#addAddress').val().trim()
    };

    $.post('api/add_employer.php', formData, function (res) {
      if (res.status === 'success') {
        $('#addEmployerModal').modal('hide');
        $('#addEmployerForm')[0].reset();
        loadEmployers();
      } else {
        alert('Add failed: ' + res.message);
      }
    }, 'json').fail(() => alert("Error adding employer."));
  });

  // VIEW EMPLOYER - Open modal
  $(document).on('click', '.view-btn', function () {
    const id = $(this).data('id');

    $.get('api/get_employer_by_id.php', { id }, function (res) {
      if (res.status === 'success') {
        const employer = res.data;
        $('#viewId').text(employer.id);
        $('#viewName').text(employer.name);
        $('#viewEmail').text(employer.email);
        $('#viewContact').text(employer.contact || '-');
        $('#viewCompany').text(employer.company_name || '-');
        $('#viewAddress').text(employer.address || '-');
        $('#viewEmployerModal').modal('show');
      } else {
        alert('Failed to load employer data.');
      }
    }, 'json');
  });

  // EDIT EMPLOYER - Open modal
  $(document).on('click', '.edit-btn', function () {
    const id = $(this).data('id');

    $.get('api/get_employer_by_id.php', { id }, function (res) {
      if (res.status === 'success') {
        const employer = res.data;
        $('#editId').val(employer.id);
        $('#editName').val(employer.name);
        $('#editEmail').val(employer.email);
        $('#editContact').val(employer.contact);
        $('#editCompany').val(employer.company_name);
        $('#editAddress').val(employer.address);
        $('#editEmployerModal').modal('show');
      } else {
        alert('Failed to load employer data.');
      }
    }, 'json');
  });

  // UPDATE EMPLOYER
  $('#editEmployerForm').submit(function (e) {
    e.preventDefault();

    const formData = {
      id: $('#editId').val(),
      name: $('#editName').val().trim(),
      email: $('#editEmail').val().trim(),
      contact: $('#editContact').val().trim(),
      company_name: $('#editCompany').val().trim(),
      address: $('#editAddress').val().trim()
    };

    $.post('api/update_employer.php', formData, function (res) {
      if (res.status === 'success') {
        $('#editEmployerModal').modal('hide');
        loadEmployers();
      } else {
        alert('Update failed: ' + res.message);
      }
    }, 'json').fail(() => alert("Error updating employer."));
  });

  // DELETE EMPLOYER
  $(document).on('click', '.delete-btn', function () {
    if (!confirm('Are you sure you want to delete this employer?')) return;

    const id = $(this).data('id');
    $.post('api/delete_employer.php', { id }, function (res) {
      if (res.status === 'success') {
        loadEmployers();
      } else {
        alert('Delete failed: ' + res.message);
      }
    }, 'json').fail(() => alert("Error deleting employer."));
  });
});

function loadEmployers() {
  $.ajax({
    url: 'api/get_employers.php',
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      if (res.status === 'success') {
        populateEmployerTable(res.data);
      } else {
        alert('Failed to load employers: ' + res.message);
      }
    },
    error: function () {
      alert('AJAX failed while loading employers.');
    }
  });
}

function populateEmployerTable(data) {
  const table = $('#employersTable').DataTable();
  table.clear().draw();

  data.forEach(employer => {
    table.row.add([
      employer.id,
      employer.name,
      employer.email,
      employer.contact,
      employer.company_name || '-',
      employer.address || '-',
      `
      <button class="btn btn-info btn-sm view-btn" data-id="${employer.id}">View</button>
      <button class="btn btn-warning btn-sm edit-btn" data-id="${employer.id}">Edit</button>
      <button class="btn btn-danger btn-sm delete-btn" data-id="${employer.id}">Delete</button>
      `
    ]).draw(false);
  });
}