"use strict";

$(()=>{

  $('#messageModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var name = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message from ' + name)
    modal.find('.modal-body input').val(name)
  });

  $('.sendMsg').on('click',addInfos);
  $('table').on('click','.delete', deleteInfo);
  $('table').on('click','.edit', openEditModal);
  $('.sendEditMsg').on('click', updateInfo);
});


function addInfos(event){
  event.preventDefault();
  let newInfos ={
    name: $('#messageModal').find('.name').val(),
    message:$('#messageModal').find('.message-text').val()
  };
  $('#messageModal').find('.name').val('');
  $('#messageModal').find('.message-text').val('');
   $.post(`/infos`,newInfos)
    .done(()=>{
      renderList();
      $('#newClose').click();
    })
}

function deleteInfo(){
  let infoId = $(this).closest('tr').data('id');
  $.ajax(`/infos/${infoId}`,{
      method: 'DELETE'
  })
   .done(()=>{
      renderList();
   })
   .fail(err=>{
      console.log('err:',err);
   })
}

function openEditModal(){
  let $row = $(this).closest('tr');
  let $editModal = $('#editMsgModal');

  let infoId = $row.data('id');
  $editModal.data('infoId', infoId);   //give id to modal
  
  let name = $row.find('.name').text();
  $editModal.find('.name').val(name);
   
  let message = $row.find('.message').text();
  $editModal.find('.message-text').val(message);
}

function updateInfo(event){
  let $editModal = $('#editMsgModal');
  let id = $('#editMsgModal').data('infoId');
  
  $.ajax({
    url:`/infos/${id}`,
    type: 'PUT',
    data:{
      name: $editModal.find('.name').val(),
      message: $editModal.find('.message-text').val()
    },
    success:function(data){ 
      renderList();
      $('#editClose').click();
    } 
  });
}

function renderList(){
  $.get('/infos')
   .done(infos=>{
      let $trs = infos.map(info=>{
        let $tr = $('#template').clone();
        $tr.removeAttr('id');
        $tr.find('.name').text(info.name);
        $tr.find('.message').text(info.message);
        $tr.find('.time').text(info.time);
        $tr.data('id', info.id); 
        return $tr;
      });
      $('#messageList').empty().append($trs);
   })
}

