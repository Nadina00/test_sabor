const user = document.querySelector("h1");

const proxyUrl = "http://localhost:3000/proxy?url=";
const targetUrl =
  "https://www.sabor.hr/hr/zastupnici/buric-majda-10-saziv-hrvatskoga-sabora-2272020";

async function fetchUser(url) {
  try {
    const text = await fetch(url).then((responce) => responce.text());
    const parcer = new DOMParser();
    const doc = parcer.parseFromString(text, "text/html");

    const title = doc.querySelector('[class*="pre-title-first"]');
    const name = doc.querySelector('[class*="field-content"]').firstChild;
    const img = doc.querySelector("img");
    const biography = doc.querySelector('[class*="zivotopis"]').children[0];
    const data = doc.querySelectorAll('[class*="views-row"] div')[10]
      .children[0];
    const obj = {
      title: title.textContent,
      name: name.textContent,
      img,
      biography: biography.textContent,
      data: data.textContent.slice(2, 12),
    };
    
    user.insertAdjacentHTML("beforeend", createMarkup(obj));

    localStorage.setItem("user", JSON.stringify(obj));

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => console.log("POST", json))
      .catch((error) => console.error("Error:", error));
  } catch (error) {}
}

fetchUser(proxyUrl + encodeURIComponent(targetUrl));

function createMarkup(items) {
  
  return `
        <div>
        <h2>${items.title}</h2>     
         <p> ${items.name}</p>
         <p>${items.biography}</p>
         <img src=${items.img.src} alt=${items.img.alt}/> 
         <p>${items.data}</p>     
     </div>`;
}
