const socket = io.connect("http://localhost:3000");

const sender = document.querySelector("#Name");
const text = document.querySelector("#textmessage");
const sendBtn = document.querySelector("#send");
const contents = document.querySelector("#message");
const shareBtn = document.getElementById('share');
const fileInput = document.getElementById('fileInput');

shareBtn.addEventListener('click', () => {
    fileInput.click();
});

document.getElementById('share').addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          socket.emit('share-image', {
              image: e.target.result,
              name: file.name
          });
      };
      reader.readAsDataURL(file);
  }
});

document.getElementById('openAlbum').addEventListener('click', () => {
  document.getElementById('imageAlbum').style.display = 'block';
});

socket.on('update-album', data => {
  const albumContents = document.getElementById('albumContents');
  const img = document.createElement('img');
  img.src = data.image;
  img.alt = data.name;
  img.style.width = '100px';
  albumContents.appendChild(img);
});


sendBtn.addEventListener("click", () => {
    if (text.value.trim()) {
        socket.emit("chat", {
            sender: sender.innerText,
            message: text.value,
            type: 'text'
        });
        text.value = '';
    }
});

socket.on("chat", (data) => {
    if (data.type === 'text') {
        contents.innerHTML += `<div><b>${data.sender}:</b> ${data.message}</div>`;
    } else if (data.type === 'image') {
        contents.innerHTML += `<div><b>${data.sender}:</b> <img src="${data.image}" alt="${data.name}" style="width: 100px;"></div>`;
    }
});
