const $ = (id) => document.getElementById(id);

$("send").onclick = async () => {
  const fd = new FormData();
  fd.append("question", $("q").value);
  fd.append("image_hint", $("hint").value);
  fd.append("text_payload", $("q").value);
  fd.append("token", $("tok").value);
  const f = $("f").files[0];
  if (f) fd.append("file", f);
  const r = await fetch("/chat", { method: "POST", body: fd });
  const j = await r.json();
  $("out").hidden = false;
  $("status").innerHTML = `<span class="pill ${j.status}">${j.status}</span> <span class="tool">${j.tool}</span>`;
  $("reply").textContent = j.reply || "(no grounded reply — refused)";
  $("json").textContent = JSON.stringify(j, null, 2);
};
