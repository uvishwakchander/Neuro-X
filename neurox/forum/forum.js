const categories = ["ADHD", "Autism", "Dyslexia", "General Support"];

const samplePosts = [
  {
    id: 101,
    title: "What helps me reset between tasks",
    body: "Short 2-minute breathing breaks and a water sip made my day much smoother.",
    category: "General Support",
    likes: 4,
    comments: ["Love this!", "I use a timer for this too."],
  },
  {
    id: 102,
    title: "Focus tip for ADHD study sessions",
    body: "I do 20 mins deep work + 5 mins stretch. It helps me avoid mental overload.",
    category: "ADHD",
    likes: 7,
    comments: ["Pomodoro works for me as well."],
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
