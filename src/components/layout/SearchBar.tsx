export function SearchBar() {
  return (
    <form action="/search" className="search-bar" role="search">
      <label className="sr-only" htmlFor="site-search">
        Search products
      </label>
      <input id="site-search" name="q" placeholder="Search tables, cues, grills..." type="search" />
      <button type="submit">Search</button>
    </form>
  );
}
