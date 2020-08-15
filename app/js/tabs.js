const contents = document.querySelectorAll(".content");
const listItems = document.querySelectorAll("nav ul li");

// Always activate the first tab
listItems[0].classList.add("active");

listItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    hideAllContents();
    hideAllItems();

    // activate list item
    item.classList.add("active");

    // display content
    contents[index].classList.add("show");
    contents[index].classList.remove("hide");
  });
});

function hideAllContents() {
  contents.forEach((content) => {
    content.classList.remove("show");
    content.classList.add("hide");
  });
}

function hideAllItems() {
  listItems.forEach((item) => {
    item.classList.remove("active");
  });
}
