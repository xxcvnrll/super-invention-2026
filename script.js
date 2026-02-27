function initPage(storageKey){

  const cardsContainer = document.getElementById("cards");
  const addBtn = document.getElementById("addBtn");

  let data = JSON.parse(localStorage.getItem(storageKey)) || [];

  render();

  addBtn.onclick = () => {
    data.push({
      img: "",
      name: "",
      user: "",
      desc: ""
    });
    save();
    render();
  };

  function save(){
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function render(){
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

      card.querySelector(".delete").onclick = () => {
        data.splice(index,1);
        save();
        render();
      };

      card.querySelector(".name").oninput = e => {
        data[index].name = e.target.value;
        save();
      };

      card.querySelector(".user").oninput = e => {
        data[index].user = e.target.value;
        save();
      };

      card.querySelector(".desc").oninput = e => {
        data[index].desc = e.target.value;
        save();
      };

      const fileInput = card.querySelector("input[type=file]");
      const img = card.querySelector("img");
      const plus = card.querySelector("span");

      fileInput.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          data[index].img = reader.result;
          save();
          render();
        };
        reader.readAsDataURL(file);
      };

      cardsContainer.appendChild(card);
    });
  }
}