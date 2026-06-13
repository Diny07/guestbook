const supabaseUrl =
"https://bxkvcpgizsiiwlzjohrq.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4a3ZjcGdpenNpaXdsempvaHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzk4MDIsImV4cCI6MjA5NjkxNTgwMn0.wTC_g0528d2ZsuQX8ZdXVMZfozWyk1-L4tuHhBQnQII";

const client =
window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const form =
document.getElementById("guestForm");

let editId = null;

const messageList =
document.getElementById("messageList");

async function loadMessages(){

    const { data, error } =
    await client
    .from("guestbook")
    .select("*")
    .order("id", {
        ascending:false
    });

    if(error){

        console.error(error);

        return;
    }

    messageList.innerHTML = "";

    data.forEach(item => {

    messageList.innerHTML += `
        <div class="message">

            <h3>${item.nama}</h3>

            <p>${item.pesan}</p>

            <button
onclick="editMessage(
    ${item.id},
    '${item.nama}',
    '${item.pesan}'
)">
    Edit
</button>

            <button
            onclick="deleteMessage(${item.id})">
                Hapus
            </button>

            <hr>

        </div>
    `;
});

}

form.addEventListener(
"submit",
async function(e){

    e.preventDefault();

    const nama =
    document.getElementById(
        "nama"
    ).value;

    const pesan =
    document.getElementById(
        "pesan"
    ).value;

    let error;

    if(editId === null){

        ({ error } =
        await client
        .from("guestbook")
        .insert([
            {
                nama,
                pesan
            }
        ]));

    }else{

        ({ error } =
        await client
        .from("guestbook")
        .update({
            nama,
            pesan
        })
        .eq("id", editId));

        editId = null;
    }

    if(error){

        console.error(error);

        alert(
            "Operasi gagal"
        );

        return;
    }

    alert(
        "Data berhasil disimpan"
    );

    form.reset();

    loadMessages();

});

async function deleteMessage(id){

    const { error } =
    await client
    .from("guestbook")
    .delete()
    .eq("id", id);

    if(error){

        console.error(error);

        alert("Gagal menghapus");

        return;
    }

    alert("Data berhasil dihapus");

    loadMessages();
}

function editMessage(
    id,
    nama,
    pesan
){

    document.getElementById(
        "nama"
    ).value = nama;

    document.getElementById(
        "pesan"
    ).value = pesan;

    editId = id;
}

loadMessages();