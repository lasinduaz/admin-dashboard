$(document).ready(function () {
  const table = $('#employersTable').DataTable({
    columns: [
      { data: 'id' },
      { data: 'name' },
      { data: 'email' },
      { data: 'contact' },
      { data: 'company_name' },
      { data: 'address' },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <button class="edit-btn" data-id="${row.id}">Edit</button>
            <button class="delete-btn" data-id="${row.id}">Delete</button>
          `;
        }
      }
    ],
    data: [],
    destroy: true
  });

  function loadEmployers() {
    $.ajax({
      url: 'api/get_employers.php',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        table.clear().rows.add(data).draw();
      },
      error: function (xhr) {
        alert('Failed to load employers: ' + xhr.statusText);
      }
    });
  }

  loadEmployers();

  /// Add Employer
$('#addEmployerForm').on('submit', function (e) {
  e.preventDefault();

  const data = {
    name: $('#employerName').val(),
    email: $('#employerEmail').val(),
    contact: $('#employerContact').val(),
    company_name: $('#employerCompany').val(),
    address: $('#employerAddress').val(),
  };

  fetch('api/add_employer.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        $('#addEmployerModal').modal('hide');
        $('#addEmployerForm')[0].reset();
        $('#employersTable').DataTable().ajax.reload();
      } else {
        alert('Failed to add employer: ' + res.message);
      }
    });
});

  // === Edit Employer ===
  $(document).on('click', '.edit-btn', function () {
    const id = $(this).data('id');

    fetch(`api/get_employer_by_id.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.status === 'error') {
          alert('Failed to fetch employer.');
          return;
        }

        $('#editEmployerId').val(data.id);
        $('#editEmployerName').val(data.name);
        $('#editEmployerEmail').val(data.email);
        $('#editEmployerPhone').val(data.contact);
        $('#editEmployerCompany').val(data.company_name);
        $('#editEmployerAddress').val(data.address);

        $('#editEmployerModal').show();
        $('#overlay').show();
      })
      .catch(err => alert('Fetch error: ' + err.message));
  });

  $('#cancelEditModalBtn').on('click', function () {
    $('#editEmployerModal').hide();
    $('#overlay').hide();
  });

  $('#editEmployerForm').submit(function (e) {
    e.preventDefault();

    const formData = new FormData(this); // includes hidden ID

    fetch('api/edit_employer.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Employer updated.');
        $('#editEmployerModal').hide();
        $('#overlay').hide();
        loadEmployers();
      } else {
        alert('Update error: ' + data.message);
      }
    })
    .catch(err => alert('Update failed: ' + err.message));
  });

  // === Delete Employer ===
  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    if (!confirm('Are you sure you want to delete this employer?')) return;

    fetch('api/delete_employer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Employer deleted.');
        loadEmployers();
      } else {
        alert('Delete error: ' + data.message);
      }
    })
    .catch(err => alert('Delete failed: ' + err.message));
  });
});
