export default function Home() {
    return (
        <main className="container">
        <section className="page" id="welcome">
          <div className="welcome-message">
            <h2>Level up your</h2>
            <h3>Game talk</h3>
            <p>Ask for help, share tips and find people to play with.</p>
            <a className="btn btn-primary" href="catalog.html">
              Browse topics
            </a>
          </div>
          <div id="latest">
            <h2>Latest topics</h2>
            <div className="topic-list">
              {/* Display cards for the newest topics (if any) */}
              <a className="topic-card pc" href="details.html">
                <div className="tags">
                  <span className="tag platform">PC</span>
                  <span className="tag">Help & Tips</span>
                </div>
                <h3>How do I beat Malenia without summons?</h3>
                <p className="muted">Elden Ring</p>
                <p>I keep getting wiped in phase two. What build and timing worked for you?</p>
                <div className="meta">
                  <span>by NightOwl</span>
                  <span>12 comments</span>
                  <span>34 likes</span>
                </div>
              </a>
              <a className="topic-card ps" href="details.html">
                <div className="tags">
                  <span className="tag platform">PlayStation</span>
                  <span className="tag">Looking for Group</span>
                </div>
                <h3>Need two more for Friday raid night</h3>
                <p className="muted">Destiny 2</p>
                <p>We run a chill team, no experience needed. Evenings, European time.</p>
                <div className="meta">
                  <span>by RaidQueen</span>
                  <span>5 comments</span>
                  <span>9 likes</span>
                </div>
              </a>
              <a className="topic-card switch" href="details.html">
                <div className="tags">
                  <span className="tag platform">Switch</span>
                  <span className="tag">Reviews</span>
                </div>
                <h3>Is Hollow Knight worth it in 2026?</h3>
                <p className="muted">Hollow Knight</p>
                <p>Thinking of picking it up. Is the map system as confusing as people say?</p>
                <div className="meta">
                  <span>by PixelPanda</span>
                  <span>21 comments</span>
                  <span>58 likes</span>
                </div>
              </a>
            </div>
            {/* Display paragraph: if there are no topics */}
            {/* <div className="state">No topics yet</div> */}
          </div>
        </section>
      </main>
    )
}