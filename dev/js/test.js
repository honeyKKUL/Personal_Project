const dot = document.createElement("div");
dot.style.position = "absolute";
dot.style.width = "10px";
dot.style.height = "10px";
dot.style.background = "red";
dot.style.borderRadius = "50%";
document.body.appendChild(dot);

document.addEventListener("touchstart", (e) => {
  const { x, y } = getPosition(e);
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
});
