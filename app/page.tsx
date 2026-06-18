import Link from "next/link";

const departments = [
  {
    eyebrow: "Billiards",
    title: "Pool tables for finished rooms.",
    body: "In-stock tables, premium builders, finish samples, cloth colors, lighting, dining tops, and installation planning.",
    href: "/pool-tables",
    image: "/assets/pool-table-room-hero.webp",
    alt: "Finished game room with a pool table",
    primary: true
  },
  {
    eyebrow: "Indoor play",
    title: "Ping Pong",
    body: "Tables, paddles, covers, and fast-moving games for active family rooms.",
    href: "/ping-pong-tables",
    image: "/assets/ping-pong-hero.png",
    alt: "Table tennis table in a bright room"
  },
  {
    eyebrow: "Outdoor cooking",
    title: "Traeger Grills",
    body: "Wood-fired grills, pellets, covers, and backyard cooking essentials.",
    href: "/traeger-smokers",
    image: "/assets/traeger-page-hero.jpg",
    alt: "Traeger grill on an outdoor patio"
  },
  {
    eyebrow: "Game room",
    title: "Darts",
    body: "Dartboards, cabinets, darts, flights, shafts, and casual league-night gear.",
    href: "/dartboards",
    image: "/assets/dartboards-hero-bladex.jpg",
    alt: "Winmau dartboard detail"
  },
  {
    eyebrow: "Billiards",
    title: "Cues",
    body: "House cues, performance shafts, cases, racks, balls, and accessories.",
    href: "/cues",
    image: "/assets/cues-hero-fusion-series.webp",
    alt: "Pool cue detail on a dark surface"
  }
];

const services = [
  {
    eyebrow: "Showroom",
    title: "Design help",
    body: "Bring room dimensions, photos, finish ideas, and a budget range to plan the setup.",
    image: "/assets/service-design-help.jpg",
    alt: "Design consultation for a luxury game room"
  },
  {
    eyebrow: "Moving",
    title: "Table moving service",
    body: "Professional pool table disassembly, transport, reassembly, and leveling.",
    image: "/assets/service-table-moving.jpg",
    alt: "Pool table movers loading a table for transport"
  },
  {
    eyebrow: "Recovering",
    title: "Table recovering service",
    body: "Refresh worn cloth, update color, and get the table playing clean again.",
    image: "/assets/service-table-recovering.jpg",
    alt: "Pool table recovering service in progress"
  },
  {
    eyebrow: "Projects",
    title: "Commercial game rooms",
    body: "Plan durable equipment for shared spaces and hospitality projects.",
    image: "/assets/service-commercial-game-rooms.jpg",
    alt: "Commercial billiards lounge with pool tables"
  }
];

const resources = [
  {
    eyebrow: "Planning",
    title: "Finished basement ideas for luxury game rooms",
    body: "Turn unused square footage into a room that works for family nights, hosting, and everyday play.",
    href: "/contact-us",
    image: "/assets/austin-lifestyle-promo.png",
    alt: "Finished game room with pool table"
  },
  {
    eyebrow: "Buying guide",
    title: "Which pool table style fits your home best?",
    body: "Compare modern, rustic, and furniture-first tables before settling on size, finish, and room layout.",
    href: "/pool-tables",
    image: "/assets/resource-pool-table-style-guide.jpg",
    alt: "Luxury pool table style guide"
  },
  {
    eyebrow: "Design help",
    title: "How to buy a pool table without regrets",
    body: "Start with clearance, installation, finish samples, cloth choice, and the way the room will actually be used.",
    href: "/pool-tables/austin-pool-table",
    image: "/assets/resource-pool-table-buying-guide.jpg",
    alt: "Pool table design planning guide"
  },
  {
    eyebrow: "Care and play",
    title: "Billiards cue vs pool cue: what changes?",
    body: "Know what to look for in cues, accessories, and starter packages before building out the full room.",
    href: "/cues",
    image: "/assets/resource-cue-comparison-guide.jpg",
    alt: "Pool cue and carom billiards cue comparison guide"
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-inner">
          <h1>Canada&apos;s Destination for Luxury Game Rooms and Outdoor Living</h1>
          <p className="lead">Curated for How You Live</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/pool-tables">
              Shop Pool Tables
            </Link>
            <Link className="btn" href="/pool-tables/austin-pool-table">
              Build the Austin
            </Link>
            <Link className="btn" href="/contact-us">
              Visit the Showroom
            </Link>
          </div>
        </div>
        <div aria-label="Home Billiards highlights" className="hero-strip">
          {[
            ["Delivery", "Local install packages", "Planning support from showroom to final setup."],
            ["Selection", "Indoor and outdoor living", "Game room staples, patio cooking, and accessories."],
            ["Custom", "Finish and cloth guidance", "Compare woods, cloth colors, sizing, and add-ons."],
            ["Showroom", "Room planning support", "Bring measurements, photos, or a wish list."]
          ].map(([eyebrow, title, body]) => (
            <div className="hero-stat" key={eyebrow}>
              <p className="eyebrow">{eyebrow}</p>
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop departments</p>
              <h2>Everything for the home, not just the table.</h2>
            </div>
            <Link className="btn" href="/pool-tables">
              Start with billiards
            </Link>
          </div>
          <div className="department-grid">
            {departments.map((department) => (
              <Link
                className={department.primary ? "department-card primary-department" : "department-card"}
                href={department.href}
                key={department.title}
              >
                <span className="department-media">
                  <img alt={department.alt} src={department.image} />
                </span>
                <span className="department-copy">
                  <span className="eyebrow">{department.eyebrow}</span>
                  <h3>{department.title}</h3>
                  <p>{department.body}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="feature-layout">
            <div className="feature-media">
              <img alt="California House Austin pool table in a finished room" src="/assets/austin-lifestyle-promo.png" />
            </div>
            <div className="feature-copy">
              <p className="eyebrow">Featured builder</p>
              <h2>California House Austin Pool Table</h2>
              <p className="lead">
                A guided build path for choosing size, finish, cloth, and add-ons while keeping the
                room-fit details in view.
              </p>
              <div className="feature-facts">
                <div>
                  <span>Starting path</span>
                  <strong>In-stock or custom</strong>
                </div>
                <div>
                  <span>Finishes</span>
                  <strong>Maple and oak</strong>
                </div>
                <div>
                  <span>Cloth</span>
                  <strong>Championship options</strong>
                </div>
                <div>
                  <span>Package</span>
                  <strong>Delivery and install</strong>
                </div>
              </div>
              <Link className="btn primary" href="/pool-tables/austin-pool-table">
                Customize the Austin
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Help for the room, the move, and the table.</h2>
            </div>
            <Link className="btn" href="/contact-us">
              Request service
            </Link>
          </div>
          <div className="product-row">
            {services.map((service) => (
              <Link className="product-tile" href="/contact-us" key={service.title}>
                <div className="product-tile-media">
                  <img alt={service.alt} src={service.image} />
                </div>
                <div className="product-tile-body">
                  <p className="eyebrow">{service.eyebrow}</p>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="resources-head">
            <div>
              <p className="eyebrow">Resources</p>
              <h2>Helpful reads before you choose the room.</h2>
            </div>
            <Link className="btn" href="/contact-us">
              Get planning help
            </Link>
          </div>
          <div className="resource-grid">
            {resources.map((resource) => (
              <Link className="resource-card" href={resource.href} key={resource.title}>
                <img alt={resource.alt} src={resource.image} />
                <div className="resource-card-body">
                  <p className="eyebrow">{resource.eyebrow}</p>
                  <h3>{resource.title}</h3>
                  <p>{resource.body}</p>
                  <span className="read-more">Read more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section studio-band">
        <div className="section-inner">
          <div>
            <p className="eyebrow">Design center</p>
            <h2>Bring the room dimensions, photos, and finish ideas.</h2>
            <p className="lead">
              Get help matching the table, game, finish, cloth, lighting, and install plan to the
              way the room will actually be used.
            </p>
          </div>
          <Link className="btn" href="/contact-us">
            Plan a visit
          </Link>
        </div>
      </section>
    </main>
  );
}
