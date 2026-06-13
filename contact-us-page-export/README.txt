Contact Us page export

Files in this folder:
- index.html: standalone preview page. Open this file in a browser to view the page.
- contact-us-embed.html: paste-ready HTML block for a webpage HTML container.
- contact-us.css: stylesheet used by index.html.
- assets/home-billiards-storefront.jpg: the hero image used by both HTML files.

How to use on your current website:
1. Upload or copy this whole folder to the website.
2. If your website has an HTML container, paste the contents of contact-us-embed.html into that container.
3. Keep the assets folder beside the page so the hero image path stays valid:
   assets/home-billiards-storefront.jpg
4. If your website stores images somewhere else, update this line in the CSS:
   url("assets/home-billiards-storefront.jpg")

Form note:
The form currently uses a simple mailto action to send to info@homebilliards.ca. If your website platform has a built-in form handler, replace the form action with that platform's endpoint.
