$(document).ready(function () {
    //$("p").text("Hello World!");
    //alert("aaa");
    $('.delete-article').on('click', function (e) {
        e.preventDefault;
        const id = $(this).attr('data-id');
        //console.log(id);

        $.ajax({
            type: 'DELETE',
            url : '/article/'+id,
            success: function(response){
                alert('Delete');
                window.location.href = '/';    
            },
            error: function(err){
                console.log(err);
            }
        })

    })
});