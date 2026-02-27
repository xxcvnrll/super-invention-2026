const API_KEY = '$2a$10$FRIzDfepTnMTEbUid1HsAeCIQMy..g2ClLhFfQSUWuUojwt6n9P1S';
const BIN_ID = '69a1774c43b1c97be9a32ed4';

async function loadData(storageKey) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await res.json();
  return json.record[storageKey] || [];
}

async function saveData(storageKey, data) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await res.json();
  const current = json.record || {};
  current[storageKey] = data;

  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify(current)
  });
}

async function initPage(storageKey) {
  const cardsContainer = document.getElementById("cards");
  const addBtn = document.getElementById("addBtn");

  let data = await loadData(storageKey);
  render();

  addBtn.onclick = async () => {
    data.push({ img: "", name: "", user: "", desc: "" });
    await saveData(storageKey, data);
    render();
  };

  async function save() {
    await saveData(storageKey, data);
  }

  function render() {
    cardsContainer.innerHTML = "";

    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <button class="delete">🗑</button>

        <div class="photo">
          <input type="file" accept="image/*">
          <span ${item.img ? 'style="display:none"' : ''}>+</span>
          <img src="${item.img}" ${item.img ? '' : 'style="display:none"'}>
        </div>

        <div class="info">
          <label>Имя:</label>
          <input class="name" value="${item.name}">

          <label>ЮЗ:</label>
          <input class="user" value="${item.user}">

          <label>Элитные заслуги:</label>
          <textarea class="desc">${item.desc}</textarea>
        </div>
      `;

      card.querySelector(".delete").onclick = async () => {
        data.splice(index, 1);
        await save();
        render();
      };

      card.querySelector(".name").oninput = async e => {
        data[index].name = e.target.value;
        await save();
      };

      card.querySelector(".user").oninput = async e => {
        data[index].user = e.target.value;
        await save();
      };

      card.querySelector(".desc").oninput = async e => {
        data[index].desc = e.target.value;
        await save();
      };

      const fileInput = card.querySelector("input[type=file]");

      fileInput.onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
          data[index].img = reader.result;
          await save();
          render();
        };
        reader.readAsDataURL(file);
      };

      cardsContainer.appendChild(card);
    });
  }
}