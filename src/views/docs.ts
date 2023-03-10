export default `
  <body>
    <h1>Mercado Libre test API</h1>
    <ul>
      <li>
        <h3>List items</h3>
        <p>
          Get items list. This route need the query param <code>search</code>.
        </p>
        <p>
          For example:
          <a href="/api/items?search=product">
            <code>%API_URL/api/items?search=product</code>
          </a>
        </p>
      </li>
      <li>
        <h3>List items</h3>
        <p>Get product details by <code>id</code></p>
        <p>
          For example:
          <a href="/api/items/MLA883988930">
            <code>%API_URL/api/items/:id</code>
          </a>
        </p>
      </li>
    </ul>
  </body>
`;
