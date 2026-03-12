const categories = ["ADHD", "Autism", "Dyslexia", "General Support"];

const samplePosts = [
  {
    id: 101,
    title: "ADHD: 25-minute focus sprint routine",
    body: "I use 25 mins focus + 5 mins stretch/water. It reduced task switching fatigue for me.",
    category: "ADHD",
    likes: 9,
    comments: ["Same here, the breaks matter a lot.", "I pair this with noise-cancelling headphones."],
  },
  {
    id: 102,
    title: "Autism-friendly meeting prep",
    body: "Asking for agenda notes early helps me process discussions and lowers meeting stress.",
    category: "Autism",
    likes: 6,
    comments: ["Pre-reads changed everything for me."],
  },
  {
    id: 103,
    title: "Dyslexia support tools that worked",
    body: "OpenDyslexic font + text-to-speech helped me review long docs without burnout.",
    category: "Dyslexia",
    likes: 5,
    comments: ["Text-to-speech is a lifesaver for me too."],
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPosts(listNode, posts, onLike, onComment) {
  listNode.innerHTML = "";
  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const safeTitle = escapeHtml(post.title);
      const safeCategory = escapeHtml(post.category);
      const safeBody = escapeHtml(post.body);
      const commentsMarkup = (post.comments || [])
        .map((comment) => `<p>💬 ${escapeHtml(comment)}</p>`)
        .join("");

      const wrap = document.createElement("article");
      wrap.className = "post";
      wrap.innerHTML = `
        <h4>${safeTitle}</h4>
        <small>${safeCategory}</small>
        <p>${safeBody}</p>
        <p>❤️ ${post.likes || 0}</p>
        <button class="btn like-btn" data-id="${post.id}">Like</button>
        <div class="input-row">
          <input placeholder="Add comment" data-cid="${post.id}" />
          <button class="btn comment-btn" data-id="${post.id}">Comment</button>
        </div>
        <div>${commentsMarkup}</div>
      `;
      listNode.appendChild(wrap);
    });

  listNode.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => onLike(btn.dataset.id));
  });
  listNode.querySelectorAll(".comment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = listNode.querySelector(`input[data-cid='${btn.dataset.id}']`);
      const comment = input.value.trim();
      if (!comment) return;
      onComment(btn.dataset.id, comment);
      input.value = "";
    });
  });
}

export function renderForum(container, store) {
  container.innerHTML = `
    <h2>Community Discussion Board</h2>
    <p class="subtle">Discuss practical strategies for ADHD, Autism, Dyslexia, and general wellbeing support.</p>
    <div class="post">
      <input id="forum-title" placeholder="Post title" />
      <textarea id="forum-body" placeholder="Share your experience or support tips"></textarea>
      <select id="forum-category">
        ${categories.map((cat) => `<option>${cat}</option>`).join("")}
      </select>
      <button id="forum-submit" class="btn primary">Create Post</button>
    </div>
    <section id="forum-posts"></section>
  `;

  const listNode = container.querySelector("#forum-posts");

  const getPosts = () => store.get("forumPosts", []);
  const setPosts = (posts) => store.set("forumPosts", posts);

  if (!getPosts().length) {
    setPosts(samplePosts);
  }

  const rerender = () => {
    renderPosts(
      listNode,
      getPosts(),
      (id) => {
        const updated = getPosts().map((post) =>
          String(post.id) === String(id) ? { ...post, likes: (post.likes || 0) + 1 } : post,
        );
        setPosts(updated);
        rerender();
      },
      (id, comment) => {
        const updated = getPosts().map((post) =>
          String(post.id) === String(id)
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post,
        );
        setPosts(updated);
        rerender();
      },
    );
  };

  container.querySelector("#forum-submit").addEventListener("click", () => {
    const title = container.querySelector("#forum-title").value.trim();
    const body = container.querySelector("#forum-body").value.trim();
    const category = container.querySelector("#forum-category").value;
    if (!title || !body) return;
    const post = { id: Date.now(), title, body, category, likes: 0, comments: [] };
    setPosts([...getPosts(), post]);
    container.querySelector("#forum-title").value = "";
    container.querySelector("#forum-body").value = "";
    rerender();
  });

  rerender();
}
