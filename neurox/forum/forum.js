const categories = ["ADHD", "Autism", "Dyslexia", "General Support"];

function renderPosts(listNode, posts, onLike, onComment) {
  listNode.innerHTML = "";
  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const wrap = document.createElement("article");
      wrap.className = "post";
      wrap.innerHTML = `
        <h4>${post.title}</h4>
        <small>${post.category}</small>
        <p>${post.body}</p>
        <p>❤️ ${post.likes || 0}</p>
        <button class="btn like-btn" data-id="${post.id}">Like</button>
        <div class="input-row">
          <input placeholder="Add comment" data-cid="${post.id}" />
          <button class="btn comment-btn" data-id="${post.id}">Comment</button>
        </div>
        <div>${(post.comments || []).map((c) => `<p>💬 ${c}</p>`).join("")}</div>
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
