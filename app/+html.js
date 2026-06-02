// Expo Router web HTML shell — customises the page-level HTML that wraps the app.
// Colors are hardcoded to the cream theme bg so the page never flashes white.
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#ECE8DF" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html {
            background-color: #ECE8DF;
            height: 100%;
          }
          body {
            background-color: #ECE8DF;
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          #root {
            height: 100%;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
