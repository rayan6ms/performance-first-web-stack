// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>RateCraft — hourly rate calculator</title>
          <meta
            name="description"
            content="Estimate your freelance hourly rate from your target monthly income and billable hours. A simple, private calculation in your browser."
          />
          <meta property="og:title" content="RateCraft — hourly rate calculator" />
          <meta
            property="og:description"
            content="Turn your monthly income goal into an hourly rate."
          />
          <meta property="og:type" content="website" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
