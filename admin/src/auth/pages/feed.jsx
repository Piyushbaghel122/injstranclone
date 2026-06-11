import "../style/feed.scss";

const Feed = () => {
  return (
    <main className="feed-page">
      <section className="feed">
        <article className="post">
          <header className="user">
            <div className="img-wrapper">
              <img
                src="https://images.pexels.com/photos/31419914/pexels-photo-31419914.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31419914.jpg&fm=jpg"
                alt="user profile"
              />
            </div>
            <p className="username">Username</p>
            <button className="icon-button" type="button" aria-label="Post options">
              ...
            </button>
          </header>

          <img
            className="post-image"
            src="https://images.pexels.com/photos/31419914/pexels-photo-31419914.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31419914.jpg&fm=jpg"
            alt="feed post"
          />

          <div className="actions">
            <button type="button" aria-label="Like post">♡</button>
            <button type="button" aria-label="Comment on post">💬</button>
            <button type="button" aria-label="Share post">↗</button>
          </div>

          <p className="caption">
            <span>Username</span> Building my Instagram layout.
          </p>
        </article>
      </section>
    </main>
  );
};

export default Feed;
